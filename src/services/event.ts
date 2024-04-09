import { getAuth } from 'firebase/auth';
import {
  DocumentSnapshot,
  GeoPoint,
  QueryDocumentSnapshot,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import {
  EventModel,
  EventParticipantModel,
  EventPrivacy,
  Location,
  UserEventModel,
  UserEventStates,
} from '../store/types';
import { getLocationDistance } from '../utils/location';
import { app } from './Firebase'; // Adjust according to your Firebase config initialization

// Firestore and Functions initialization
const auth = getAuth(app);
const firestore = getFirestore(app);
const functions = getFunctions(app);

// Function to convert an event document snapshot to an EventModel object
export const convertEvent = (
  eventDocSnapshot: DocumentSnapshot<EventModel>,
  currentLocation?: Location,
  isFeed?: boolean
): EventModel | UserEventModel | undefined => {
  const eventData = eventDocSnapshot.data();
  if (!eventData) return undefined;

  // Convert Firestore Timestamps to Date objects
  const startDate =
    eventData.startDate instanceof Timestamp
      ? eventData.startDate.toDate()
      : eventData.startDate;
  const endDate =
    eventData.endDate instanceof Timestamp
      ? eventData.endDate.toDate()
      : eventData.endDate;

  // Convert Firestore GeoPoint to custom Location type
  let location =
    eventData.location instanceof GeoPoint
      ? {
          latitude: eventData.location.latitude,
          longitude: eventData.location.longitude,
        }
      : undefined;

  // Calculate distance if applicable
  let distance: number | null = null;
  if (currentLocation && location) {
    distance = getLocationDistance(currentLocation, location);
  }

  return {
    id: eventDocSnapshot.id,
    title: eventData.title,
    description: eventData.description,
    privacy: eventData.privacy,
    startDate,
    endDate,
    host: eventData.host,
    location,
    ...(distance !== null && { distance }),
  };
};

// Assuming event.location is your custom Location type with latitude and longitude
export const createEvent = async (event: EventModel): Promise<void> => {
  // Ensure startDate and endDate are Date objects and location is a GeoPoint
  const locationGeoPoint = event.location
    ? new GeoPoint(event.location.latitude, event.location.longitude)
    : undefined;

  await addDoc(collection(firestore, 'events'), {
    ...event,
    location: locationGeoPoint, // Ensure this is a GeoPoint when saving to Firestore
    startDate:
      event.startDate instanceof Date
        ? Timestamp.fromDate(event.startDate)
        : event.startDate,
    endDate:
      event.endDate instanceof Date
        ? Timestamp.fromDate(event.endDate)
        : event.endDate,
  });
};

export const getFeed = async (
  blockedUserIds: string[],
  currentLocation?: Location
): Promise<EventModel[]> => {
  const q = query(
    collection(firestore, 'events'),
    where('startDate', '>=', Timestamp.fromDate(new Date())),
    orderBy('startDate')
  );
  const querySnapshot = await getDocs(q);
  const events: EventModel[] = [];
  querySnapshot.forEach((doc) => {
    const event = convertEvent(doc, currentLocation, true);
    // Check if event is not undefined and if event.host.userId exists and is not in the list of blockedUserIds
    if (
      event &&
      event.host?.userId &&
      !blockedUserIds.includes(event.host.userId)
    ) {
      events.push(event);
    }
  });
  return events;
};

export const getEvent = async (
  eventId: string,
  currentLocation?: Location
): Promise<EventModel> => {
  const docRef = doc(firestore, 'events', eventId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) throw new Error('Document does not exist');
  const event = convertEvent(docSnap, currentLocation, false);
  if (!event) throw new Error('Failed to convert event');
  return event;
};

/* --------------------------- Get Upcoming Events -------------------------- */

export const getUserUpcomingEvents = async (
  userId: string,
  blockedUserIds: string[],
  currentLocation?: Location
): Promise<UserEventModel[]> => {
  const eventsQuery = query(
    collection(getFirestore(app), 'events'),
    where('participants', 'array-contains', userId),
    where('endDate', '>=', Timestamp.now()),
    orderBy('endDate')
  );

  const querySnapshot = await getDocs(eventsQuery);
  const events: UserEventModel[] = [];

  querySnapshot.forEach((doc) => {
    // Assume you have a way to determine or fetch the event's status here, or omit if not needed
    const event = convertEvent(doc, currentLocation, false) as UserEventModel;
    if (
      event &&
      event.host &&
      !blockedUserIds.includes(event.host.userId ?? '')
    ) {
      events.push(event);
    }
  });

  return events;
};

export const convertUserEvent = (
  doc: DocumentSnapshot, // The Firebase document snapshot
  currentLocation?: Location // The optional current location parameter
): UserEventModel | null => {
  const data = doc.data();

  if (!data) return null;

  const event: UserEventModel = {
    id: doc.id,
    title: data.title,
    description: data.description,
    privacy: data.privacy as EventPrivacy, // Assuming privacy is stored as 'open' or 'closed'
    host: {
      userId: data.host?.userId,
      name: data.host?.name,
    },
    startDate: data.startDate?.toDate(), // Convert Firestore Timestamp to JavaScript Date object
    endDate: data.endDate?.toDate(), // Same conversion
    location: data.location, // Assuming this is compatible with your Location type
    status: data.status as UserEventStates, // Assuming status is 'accepted' or 'pending'
    participants: [], // You might need additional logic to populate this, depending on your data structure
    // Add any other fields that UserEventModel requires
  };

  return event;
};

/* --------------------------- Get Pending Events --------------------------- */

export const getMyPendingEvents = async (
  blockedUserIds: string[],
  currentLocation?: Location
): Promise<UserEventModel[]> => {
  const auth = getAuth(app); // Ensure 'auth' is correctly initialized
  const userId = auth.currentUser?.uid;
  if (!userId) return []; // Exit early if no user is logged in

  const userEventsQuery = query(
    collection(firestore, 'users', userId, 'events'),
    where('startDate', '>=', Timestamp.now()),
    where('status', '==', 'pending')
  );

  const querySnapshot = await getDocs(userEventsQuery);
  const eventList: UserEventModel[] = [];

  for (const docSnapshot of querySnapshot.docs) {
    // Assuming convertUserEvent now correctly accepts 'currentLocation'
    const event = convertUserEvent(docSnapshot, currentLocation);
    if (
      event &&
      event.host?.userId &&
      !blockedUserIds.includes(event.host.userId ?? '')
    ) {
      eventList.push(event);
    }
  }

  return eventList;
};

/* ----------------------------- Get Past Events ---------------------------- */

export const getMyPastEvents = async (
  blockedUserIds: string[]
): Promise<UserEventModel[]> => {
  const userId = auth.currentUser?.uid; // Use the initialized auth to get the current user's ID
  if (!userId) {
    return []; // Return an empty array if no user is logged in
  }

  // Proceed with fetching past events
  return await getUserPastEvents(userId, blockedUserIds);
};

export const getUserPastEvents = async (
  userId: string,
  blockedUserIds: string[]
): Promise<UserEventModel[]> => {
  // Ensure you have initialized Firestore earlier in your code
  const firestore = getFirestore(app);

  // Use the correct query with Firestore modular SDK
  const eventsQuery = query(
    collection(firestore, 'users', userId, 'events'),
    where('startDate', '<', Timestamp.now()),
    orderBy('startDate', 'desc')
  );

  const querySnapshot = await getDocs(eventsQuery);
  const eventList: UserEventModel[] = [];

  querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
    // Use QueryDocumentSnapshot for typing
    const eventObj = convertUserEvent(doc); // Ensure this function is adjusted for SDK v9

    // Don't add event if user is blocked
    if (
      eventObj &&
      eventObj.host?.userId &&
      !blockedUserIds.includes(eventObj.host.userId)
    ) {
      eventList.push(eventObj);
    }
  });

  return eventList;
};

// Upcoming events
/**
 * Upcoming - future date & accepted
 * Pending - future date & pending
 * Past - past date & accepted
 */

export const joinEvent = async (eventId: string): Promise<void> => {
  const callable = httpsCallable(functions, 'joinEvent');
  await callable({ eventId });
};

export const acceptEventParticipant = async (
  eventId: string,
  userId: string
): Promise<void> => {
  const callable = httpsCallable(functions, 'acceptParticipant');
  await callable({ eventId, userId });
};

export const removeEventParticipant = async (
  eventId: string,
  userId: string
): Promise<void> => {
  const callable = httpsCallable(functions, 'removeParticipant');
  await callable({ eventId, userId });
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  const callable = httpsCallable(functions, 'deleteEvent');
  await callable({ eventId });
};

export const getEventParticipants = async (
  eventId: string,
  blockerIds: string[]
): Promise<EventParticipantModel[]> => {
  const participantsRef = collection(
    firestore,
    'events',
    eventId,
    'participants'
  );
  const snapshot = await getDocs(query(participantsRef));
  const participants: EventParticipantModel[] = [];

  snapshot.forEach((doc) => {
    const { name, userId, status } = doc.data() as {
      name: string;
      userId: string;
      status: UserEventStates;
    };

    // Assuming 'status' directly from data matches 'UserEventStates' enum or type.
    // Otherwise, you'll need to ensure that 'status' is one of the acceptable values or cast it as shown below.
    if (!blockerIds.includes(userId)) {
      participants.push({ id: doc.id, name, userId, status });
    }
  });

  return participants;
};

export const getMyUpcomingEvents = async (
  userId: string,
  blockerIds: string[],
  currentLocation?: Location
): Promise<UserEventModel[]> => {
  const now = Timestamp.fromDate(new Date());
  const eventsRef = collection(firestore, 'events');
  // Assuming 'host.userId' is a field in your event documents
  const q = query(
    eventsRef,
    where('host.userId', '==', userId),
    where('startDate', '>=', now),
    orderBy('startDate')
  );

  const snapshot = await getDocs(q);
  const events: UserEventModel[] = [];

  snapshot.forEach((doc) => {
    const event = convertEvent(doc, currentLocation) as UserEventModel; // Adjust convertEvent as needed
    // Assuming convertEvent correctly populates the host and participants
    // Exclude events hosted or participated in by blocked users
    if (
      event &&
      event.host?.userId &&
      !blockerIds.includes(event.host.userId)
    ) {
      events.push(event);
    }
  });

  return events;
};
