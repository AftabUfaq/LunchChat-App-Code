import { Icon, Text } from '@ui-kitten/components';
import React, { FC } from 'react';
import { View } from 'react-native';
import { formatEventDateString } from '../../../utils/date';
import Spacer from '../../Spacer';

type Props = {
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  isPrivate: boolean;
  distance?: number;
};

const CardBody: FC<Props> = ({
  title,
  description,
  startDate,
  endDate,
  isPrivate,
  distance,
}: Props) => {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          {startDate && endDate && (
            <Text category="s2" status="danger">
              {formatEventDateString(startDate, endDate)}
            </Text>
          )}
          <Text category="h5">{title}</Text>
          {distance != undefined ? (
            <Text category="p2" appearance="hint">
              {distance}m away
            </Text>
          ) : null}
        </View>
        <Icon
          name={isPrivate ? 'lock-outline' : 'globe'}
          style={{ height: 25, width: 25 }}
          fill="grey"
        />
      </View>

      <Spacer />
      <Text category="p2">{description}</Text>
    </View>
  );
};

export default CardBody;
