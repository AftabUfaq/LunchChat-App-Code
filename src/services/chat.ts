// Importing from the new Firebase modular SDK
import {
  collection,
  doc,
  getFirestore,
  query,
  orderBy,
  getDocs,
  addDoc,
  onSnapshot,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore';
import { app } from './Firebase'; // Adjust based on your Firebase config file's location and export
import { Chat, Message } from '../store/types/chatTypes';
import { convertTimestamp } from '../utils/date';
import { getUserAvatarUrl } from './images';

// Initialize Firestore
const firestore = getFirestore(app);

const convertMessage = (
  messageDoc: QueryDocumentSnapshot<DocumentData>
): Message | undefined => {
  const messageData = messageDoc.data({ serverTimestamps: 'estimate' });
  if (!messageData || !messageData.createdAt) {
    return;
  }

  const messageObj: Message = {
    _id: messageDoc.id,
    createdAt: convertTimestamp(messageData.createdAt.toDate()),
    text: messageData.text,
    user: {
      _id: messageData.user.id,
      name: messageData.user.name,
    },
  };

  return messageObj;
};

export const getChat = async (chatId: string): Promise<Chat> => {
  const messagesRef = collection(firestore, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const messages: Message[] = [];

  querySnapshot.forEach((doc) => {
    const message = convertMessage(doc);
    if (message) {
      messages.push(message);
    }
  });

  return { id: chatId, messages };
};

export const listenChat = (
  chatId: string,
  cb: (messages: Message[]) => void
): (() => void) => {
  const messagesRef = collection(firestore, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'desc'));

  return onSnapshot(q, async (querySnapshot) => {
    const messages: Message[] = [];

    querySnapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const message = convertMessage(change.doc);
        if (message) {
          messages.push(message);
        }
      }
    });

    // Add avatar url to messages

    const userIds = messages.map((msg) => msg.user._id as string);
    const userIdSets = [...new Set(userIds)];

    const userAvatars = new Map<string, string>();

    await Promise.all(
      userIdSets.map(async (uid: string) => {
        const avatarUrl = await getUserAvatarUrl(uid);
        avatarUrl && userAvatars.set(uid, avatarUrl);
      })
    );

    messages.map(
      (msg) => (msg.user.avatar = userAvatars.get(msg.user._id as string))
    );

    cb(messages);
  });
};

export const createMessage = async (
  chatId: string,
  userId: string,
  userName: string,
  text: string
): Promise<void> => {
  await addDoc(collection(firestore, 'chats', chatId, 'messages'), {
    createdAt: serverTimestamp(),
    user: { id: userId, name: userName },
    text,
  });
};

export const getNewChatMessages = async (
  chatId: string
): Promise<Message[]> => {
  const messagesRef = collection(firestore, 'chats', chatId, 'messages');
  // Assuming there's a 'new' field in messages to indicate new messages
  const q = query(
    messagesRef,
    where('new', '==', true),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const messages: Message[] = [];
  querySnapshot.forEach((doc) => {
    const message = convertMessage(doc);
    if (message) {
      messages.push(message);
    }
  });
  return messages;
};
