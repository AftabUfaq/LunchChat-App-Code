import { Entypo } from '@expo/vector-icons';
import {
  Button,
  Card,
  Layout,
  Modal,
  Text,
  useTheme,
} from '@ui-kitten/components';
import { LocationObject } from 'expo-location';
import React, { FC, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Region } from 'react-native-maps';
import useLocation from '../hooks/useLocation';
import Map from './Map';
import Spacer from './Spacer';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onPickLocation: (location: LocationObject) => void;
};

const PickLocationModal: FC<Props> = ({
  visible,
  onDismiss,
  onPickLocation,
}: Props) => {
  const [currentLocation, setCurrentLocation] = useState<LocationObject>();
  const [selectedLocation, setSelectionLocation] = useState<LocationObject>();
  const { getCurrentLocation } = useLocation();
  const theme = useTheme();

  const initialRegion = currentLocation && {
    latitude: currentLocation.coords.latitude,
    longitude: currentLocation.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const handleLoadLocation = async () => {
    const locationObject = await getCurrentLocation();
    if (locationObject) {
      setCurrentLocation(locationObject);
      setSelectionLocation(locationObject);
      onPickLocation(locationObject);
    }
  };

  const createLocationObject = (
    latitude: number,
    longitude: number
  ): LocationObject => {
    return {
      coords: {
        latitude,
        longitude,
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: new Date().getTime(),
    };
  };

  const handleSelectedRegionUpdate = (region: Region) => {
    setSelectionLocation(
      createLocationObject(region.latitude, region.longitude)
    );
  };

  const handlePickLocation = () => {
    if (selectedLocation) {
      onPickLocation(selectedLocation);
      onDismiss();
    }
  };

  useEffect(() => {
    handleLoadLocation();
  }, []);

  return (
    <Modal
      visible={visible}
      backdropStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      style={{ width: '95%' }}
      onBackdropPress={onDismiss}
    >
      <Card
        disabled
        header={(props) => (
          <View {...props}>
            <Text category="h4">Pick Location</Text>
          </View>
        )}
        style={styles.cardContainer}
        footer={(props) => (
          <View {...props}>
            <View style={{ flexDirection: 'row' }}>
              <Button onPress={onDismiss} style={{ flex: 1 }}>
                Cancel
              </Button>
              <Spacer />
              <Button
                onPress={handlePickLocation}
                status="success"
                style={{ flex: 1 }}
              >
                Confirm
              </Button>
            </View>
          </View>
        )}
      >
        <Layout
          style={{
            height: Dimensions.get('screen').height * 0.7,
          }}
        >
          <View style={StyleSheet.absoluteFillObject}>
            <Map
              showsUserLocation
              showsMyLocationButton
              initialRegion={initialRegion}
              onRegionChangeComplete={handleSelectedRegionUpdate}
            ></Map>
            <View
              pointerEvents="box-none"
              style={[
                StyleSheet.absoluteFillObject,
                { justifyContent: 'center', alignItems: 'center' },
              ]}
            >
              <Entypo
                name="location-pin"
                size={25}
                color={theme['color-primary-500']}
              />
            </View>
          </View>
        </Layout>
      </Card>
    </Modal>
  );
};

export default PickLocationModal;

const styles = StyleSheet.create({
  cardContainer: {},
  icon: {
    height: 35,
    width: 35,
    borderWidth: 1,
  },
});
