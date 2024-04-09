/* eslint-disable @typescript-eslint/no-var-requires */
import { Avatar, AvatarProps, Spinner } from '@ui-kitten/components';
import React, { FC, useEffect, useState } from 'react';
import { ImageURISource, View } from 'react-native';
import { getUserAvatarUrl } from '../services/images';

export type UserAvatarProps = {
  userId?: string;
  url?: string;
  version?: number;
  onLoadEnd?: () => void;
} & Partial<AvatarProps>;

const UserAvatar: FC<UserAvatarProps> = ({
  userId,
  url,
  version,
  onLoadEnd,
  ...props
}: UserAvatarProps) => {
  const [imageSource, setImageSource] = useState<ImageURISource>();
  const [loading, setLoading] = useState(true);

  const loadImage = async () => {
    let avatarUri: string | undefined = '';

    if (url) {
      avatarUri = url;
    } else if (userId) {
      avatarUri = await getUserAvatarUrl(userId);
    } else if (!userId) {
      setImageSource(require('./../assets/images/empty_user.jpeg'));
      return;
    }

    setImageSource({
      uri: avatarUri || `https://picsum.photos/seed/${userId}/300/300`,
    });
  };

  const handleLoadEnd = () => {
    if (imageSource) {
      setLoading(false);
      onLoadEnd && onLoadEnd();
    }
  };

  useEffect(() => {
    loadImage();
  }, [userId, url, version]);

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Avatar source={imageSource} onLoadEnd={handleLoadEnd} {...props} />
      {loading && (
        <View style={{ position: 'absolute' }}>
          <Spinner />
        </View>
      )}
    </View>
  );
};

export default UserAvatar;
