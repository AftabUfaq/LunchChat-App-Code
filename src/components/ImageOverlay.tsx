import {
  ImageBackground,
  ImageBackgroundProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  SafeAreaView,
} from 'react-native';
import React, { FC } from 'react';

interface OverlayImageStyle extends ViewStyle {
  overlayColor?: string;
}

export interface ImageOverlayProps extends ImageBackgroundProps {
  style?: StyleProp<OverlayImageStyle>;
  children?: React.ReactNode;
}

const DEFAULT_OVERLAY_COLOR = 'rgba(0, 0, 0, 0.45)';

const ImageOverlay: FC<ImageOverlayProps> = ({
  children,
  ...imageBackgroundProps
}: ImageOverlayProps) => {
  return (
    <ImageBackground {...imageBackgroundProps}>
      <SafeAreaView style={{ opacity: 0 }} />
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: DEFAULT_OVERLAY_COLOR },
        ]}
      />
      {children}
      <SafeAreaView style={{ opacity: 0 }} />
    </ImageBackground>
  );
};

export default ImageOverlay;
