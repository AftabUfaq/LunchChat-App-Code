import { initializeApp } from 'firebase/app';
import { getFirestore, GeoPoint } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firestore = getFirestore(); // Assuming Firebase is initialized elsewhere
const auth = getAuth(); // Assuming Firebase is initialized elsewhere

import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationProp } from '@react-navigation/native';
import {
  Button,
  Card,
  Datepicker,
  Divider,
  Icon,
  IndexPath,
  Input,
  Modal,
  Select,
  SelectItem,
  Text,
} from '@ui-kitten/components';
import { MomentDateService } from '@ui-kitten/moment';
import { LocationObject } from 'expo-location';
import moment, { Moment } from 'moment';
import React, { FC, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import PickLocationModal from '../../components/PickLocationModal';
import ScreenContainer from '../../components/ScreenContainer';
import Spacer from '../../components/Spacer';
import { MainNavParamList } from '../../navigation/MainNavigator';
import {
  createEventAsync,
  fetchMyUpcomingEventsAsync,
} from '../../store/actions';
import { EventPrivacy } from '../../store/types';
import { getLocationAddress } from '../../utils/location';

type Props = {
  navigation: NavigationProp<MainNavParamList>;
};

const dateService = new MomentDateService();

const AddEventScreen: FC<Props> = ({ navigation }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(moment());
  const [time, setTime] = useState(new Date());
  const [show, setShow] = useState(false);
  const [showPickLocation, setShowPickLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationObject>();
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [timePickerTitle, setTimePickerTitle] = useState('');
  const [selectedPrivacyIndex, setSelectedPrivacyIndex] = useState(
    new IndexPath(0)
  );
  const [locationName, setLocationName] = useState('');
  const dispatch = useDispatch();

  const handleSaveDate = (nextDate: Moment) => {
    setDate(nextDate);

    // Update the dates on the times
    setStartTime((date) => {
      date.setFullYear(nextDate.year(), nextDate.month(), nextDate.date());
      return date;
    });
    setEndTime((date) => {
      date.setFullYear(nextDate.year(), nextDate.month(), nextDate.date());
      return date;
    });
  };

  const handleEditStartTime = () => {
    Keyboard.dismiss();
    setTimePickerTitle('Start Time');
    setTime(startTime);
    setShow(true);
  };

  const handleEditEndTime = () => {
    Keyboard.dismiss();
    setTimePickerTitle('End time');
    setTime(endTime);
    setShow(true);
  };

  const handleSaveTimeEdit = () => {
    if (timePickerTitle === 'Start Time') {
      setStartTime(time);
      moment(time).isAfter(moment(endTime)) && setEndTime(time);
    } else {
      setEndTime(time);
      moment(time).isBefore(moment(startTime)) && setStartTime(time);
    }

    setShow(false);
    setTimePickerTitle('');
  };

  const handleDismissTimeEdit = () => {
    setShow(false);
    setTimePickerTitle('');
  };

  const handleLocationChange = async (location: LocationObject) => {
    setSelectedLocation(location);
    const address = await getLocationAddress(
      location.coords.latitude,
      location.coords.longitude
    );
    if (address[0]?.name) {
      setLocationName(address[0].name);
    }
  };

  const handleDismissLocation = () => setShowPickLocation(false);

  const handleCreateEvent = async () => {
    let newLocation;
    if (selectedLocation) {
      newLocation = new GeoPoint(
        selectedLocation.coords.latitude,
        selectedLocation.coords.longitude
      );
    } else {
      newLocation = undefined; // Adjusted to set undefined instead of null
    }

    await dispatch(
      createEventAsync({
        title: title,
        startDate: startTime,
        endDate: endTime,
        description: description,
        privacy:
          selectedPrivacyIndex.row === 0
            ? EventPrivacy.Open
            : EventPrivacy.Closed,
        location: newLocation, // This will now correctly be either a GeoPoint or undefined
      })
    );
    dispatch(fetchMyUpcomingEventsAsync());
    navigation.goBack();
    Toast.show({
      type: 'success',
      text1: 'Event created',
      text2: 'You have created an event successfully',
      topOffset: 40,
    });
  };

  return (
    <ScreenContainer headerTitle="Host Lunch Chat">
      <ScrollView
        style={styles.bodyContainer}
        showsVerticalScrollIndicator={false}
      >
        <Input label="Title" value={title} onChangeText={setTitle} />
        <Spacer />
        <Input
          label="Description"
          multiline={true}
          textStyle={{ minHeight: 64 }}
          value={description}
          onChangeText={setDescription}
        />
        <Spacer />
        <Datepicker
          label="Date"
          date={date}
          onFocus={() => Keyboard.dismiss()}
          onSelect={handleSaveDate}
          dateService={dateService}
          filter={(date) => date.isAfter(moment())}
          accessoryLeft={(props) => <Icon name="calendar-outline" {...props} />}
        />
        <Spacer />
        <TouchableOpacity onPress={handleEditStartTime}>
          <View pointerEvents="none">
            <Input
              label="Start Time"
              value={moment(startTime).format('hh:mm')}
              textStyle={{ textAlign: 'right' }}
              accessoryLeft={(props) => (
                <Icon name="clock-outline" {...props} />
              )}
            />
          </View>
        </TouchableOpacity>
        <Spacer />
        <TouchableOpacity onPress={handleEditEndTime}>
          <View pointerEvents="none">
            <Input
              label="End Time"
              value={moment(endTime).format('hh:mm')}
              textStyle={{ textAlign: 'right' }}
              accessoryLeft={(props) => <Icon name="clock" {...props} />}
            />
          </View>
        </TouchableOpacity>
        <Spacer />
        <TouchableOpacity onPress={() => setShowPickLocation(true)}>
          <View pointerEvents="none">
            <Input
              label="Location"
              value={locationName}
              textStyle={{ textAlign: 'right' }}
              accessoryLeft={(props) => <Icon name="map" {...props} />}
              accessoryRight={() =>
                !locationName ? (
                  <ActivityIndicator style={{ marginRight: 5 }} />
                ) : (
                  <></>
                )
              }
            />
          </View>
        </TouchableOpacity>
        <Spacer />
        <Select
          selectedIndex={selectedPrivacyIndex}
          onSelect={(index) =>
            index instanceof IndexPath && setSelectedPrivacyIndex(index)
          }
          value={selectedPrivacyIndex.row === 0 ? 'Open' : 'Closed'}
          accessoryLeft={(props) => (
            <Icon
              name={selectedPrivacyIndex.row === 0 ? 'globe' : 'lock-outline'}
              {...props}
            />
          )}
          caption={`Open - anyone can join \nClosed - only accepted participants can join`}
          label="Privacy"
        >
          <SelectItem
            title="Open"
            accessoryLeft={(props) => <Icon name="unlock-outline" {...props} />}
          />
          <SelectItem
            title="Closed"
            accessoryLeft={(props) => <Icon name="globe-outline" {...props} />}
          />
        </Select>

        <Spacer margin={10} />
        <Divider />
        <Button size="large" onPress={handleCreateEvent}>
          Create
        </Button>
        <Spacer margin={30} />
      </ScrollView>

      {Platform.OS === 'ios' ? (
        <Modal
          backdropStyle={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          visible={show}
          onBackdropPress={handleDismissTimeEdit}
        >
          <Card
            style={{
              width: 250,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            disabled={true}
          >
            <Text category="h4">{timePickerTitle}</Text>
            <Spacer />
            {show && (
              <DateTimePicker
                value={time}
                onChange={(event, newTime) => {
                  newTime && setTime(newTime);
                }}
                mode="time"
                minimumDate={new Date()}
                style={{ width: 150 }}
                is24Hour
              />
            )}
            <Spacer />
            <Button onPress={handleSaveTimeEdit}>Confirm</Button>
          </Card>
        </Modal>
      ) : (
        show && (
          <DateTimePicker
            value={time}
            onChange={(event, newTime) => {
              setShow(false);
              newTime && setTime(newTime);
              handleSaveTimeEdit();
            }}
            mode="time"
            minimumDate={new Date()}
            style={{ width: 150 }}
            is24Hour
          />
        )
      )}

      <PickLocationModal
        visible={showPickLocation}
        onDismiss={handleDismissLocation}
        onPickLocation={handleLocationChange}
      />
    </ScreenContainer>
  );
};

export default AddEventScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
});
