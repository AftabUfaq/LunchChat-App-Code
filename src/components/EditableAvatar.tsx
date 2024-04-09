import { Button, Icon } from '@ui-kitten/components';
import React, { FC, ReactElement, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import UserAvatar, { UserAvatarProps } from './UserAvatar';

type Props = {
  onPressEdit: () => void;
} & UserAvatarProps;

const EditableAvatar: FC<Props> = ({
  onPressEdit,
  onLoadEnd,
  style,
  ...props
}: Props) => {
  const [showEdit, setShowEdit] = useState(false);

  const EditButton = (): ReactElement => (
    <Button
      style={styles.editAvatarButton}
      accessoryLeft={(style) => <Icon {...style} name="plus" />}
      onPress={onPressEdit}
    />
  );

  const handleLoadEnd = () => {
    setShowEdit(true);
    onLoadEnd && onLoadEnd();
  };

  return (
    <View style={styles.profileAvatar}>
      {
        <UserAvatar
          {...props}
          style={[style, styles.avatar]}
          onLoadEnd={handleLoadEnd}
        />
      }
      {showEdit && <EditButton />}
    </View>
  );
};

export default EditableAvatar;

const styles = StyleSheet.create({
  profileAvatar: {
    margin: 10,
    borderRadius: 46,
    alignSelf: 'center',
  },
  editAvatarButton: {
    width: 32,
    height: 32,
    borderRadius: 32,
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: -10,
    right: -10,
  },
  avatar: {
    alignSelf: 'center',
  },
});
