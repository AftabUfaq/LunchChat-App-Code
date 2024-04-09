import React, { FC } from 'react';
import { View, ViewProps } from 'react-native';

type Props = {
  margin?: number;
} & ViewProps;

const Spacer: FC<Props> = ({ margin = 5, ...props }: Props) => {
  return <View style={{ margin }} {...props} />;
};

export default Spacer;
