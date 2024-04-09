import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMessage, listenChat } from '../services/chat';
import { showError } from '../store/actions';
import { fetchChatAsync, fetchNewMessages } from '../store/actions/chatActions';
import { ApplicationState } from '../store/reducers';
import { Chat, Message } from '../store/types/chatTypes';
import { getArrayItemById } from '../utils/arrays';
import useUser from './useUser';

type ChatHook = {
  isLoading: boolean;
  chat?: Chat;
  sendMessage: (text: string) => Promise<void>;
};

export const useChat = (chatId?: string): ChatHook => {
  const dispatch = useDispatch();
  const chatState = useSelector((state: ApplicationState) => state.chatReducer);
  const { myInfo } = useUser();

  const isLoading = chatState.chatLoading;
  const chat = chatId ? getArrayItemById(chatId, chatState.chats) : undefined;

  const sendMessage = async (text: string) => {
    try {
      if (chatId && myInfo?.id) {
        await createMessage(chatId, myInfo.id, myInfo.name, text);
      }
    } catch (error) {
      // Here, we handle the error based on its type
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      dispatch(showError(errorMessage));
    }
  };

  const handleReceiveMessages = (messages: Message[]) => {
    if (chatId) {
      dispatch(fetchNewMessages(chatId, messages));
    }
  };

  useEffect(() => {
    if (chatId) {
      const unsubscribeChat = listenChat(chatId, handleReceiveMessages);
      return () => {
        dispatch(fetchChatAsync(chatId));
        unsubscribeChat();
      };
    }
  }, [chatId, dispatch]);

  return { isLoading, chat, sendMessage };
};
