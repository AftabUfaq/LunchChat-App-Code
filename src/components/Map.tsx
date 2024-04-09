import React, { FC } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import MapView, { MapViewProps } from 'react-native-maps';
import { mapDarkStyle, mapStandardStyle } from '../styles/mapStyle';

type MapProps = {
  children?: React.ReactNode;
} & MapViewProps;

const Map: FC<MapProps> = ({ children, ...props }) => {
  const colorScheme = useColorScheme();

  return (
    <MapView
      style={styles.container}
      customMapStyle={colorScheme === 'dark' ? mapDarkStyle : mapStandardStyle}
      {...props}
    >
      {children}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
