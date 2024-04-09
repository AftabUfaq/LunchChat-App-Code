/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '@ui-kitten/components';
import React, { FC, useCallback } from 'react';
import { Bubble, GiftedChat, IMessage, Send } from 'react-native-gifted-chat';
import ScreenContainer from '../../components/ScreenContainer';
import { useChat } from '../../hooks/useChat';
import useUser from '../../hooks/useUser';
import { MainNavParamList } from '../../navigation/MainNavigator';

type Props = {
  navigation: StackNavigationProp<MainNavParamList>;
  route: RouteProp<MainNavParamList, 'Chat'>;
};

const ChatScreen: FC<Props> = ({ route }: Props) => {
  const { eventId } = route.params;
  const { isLoading, chat, sendMessage } = useChat(eventId); // eventId === chatId
  const { myInfo } = useUser();
  const messages = chat?.messages;
  const theme = useTheme();

  const onSend = useCallback(async (sendMessages: IMessage[]) => {
    return Promise.all(
      sendMessages?.map(async (message) => sendMessage(message.text))
    );
  }, []);

  return (
    <ScreenContainer headerTitle="Chat">
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: myInfo!.id!,
        }}
        renderSend={(props) => (
          <Send
            label="Send"
            textStyle={{ color: theme['color-primary-500'] }}
            {...props}
          />
        )}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: { backgroundColor: theme['color-primary-500'] },
              left: {},
            }}
          />
        )}
        isLoadingEarlier={isLoading}
      />
    </ScreenContainer>
  );
};

export default ChatScreen;
