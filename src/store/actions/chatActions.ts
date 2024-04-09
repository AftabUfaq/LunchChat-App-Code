import { getNewChatMessages } from '../../services/chat';
import { AppDispatch } from '../store';
import {
  Chat,
  FetchChatAction,
  FetchNewMessagesAction,
  FETCH_CHAT,
  FETCH_NEW_MESSAGES,
  Message,
  StartLoadingChatAction,
  START_LOADING_CHAT,
  StopLoadingChatAction,
  STOP_LOADING_CHAT,
} from '../types/chatTypes';

export const fetchChat = (chat: Chat): FetchChatAction => ({
  type: FETCH_CHAT,
  payload: chat,
});

/**
 * Get the instance of chat
 * @param chatId
 */
export const fetchChatAsync =
  (chatId: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(startLoadingChat());
    // const chat = await getChat(chatId);

    dispatch(fetchChat({ id: chatId, messages: [] }));
    dispatch(stopLoadingChat());
  };

export const startLoadingChat = (): StartLoadingChatAction => ({
  type: START_LOADING_CHAT,
});

export const stopLoadingChat = (): StopLoadingChatAction => ({
  type: STOP_LOADING_CHAT,
});

export const fetchNewMessages = (
  id: string,
  messages: Message[]
): FetchNewMessagesAction => ({
  type: FETCH_NEW_MESSAGES,
  payload: { id, messages },
});

/**
 * Add new messages to chat
 * @param chatId
 */
export const fetchNewMessagesAsync =
  (chatId: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    dispatch(startLoadingChat());
    const messages = await getNewChatMessages(chatId);
    dispatch(fetchNewMessages(chatId, messages));
    dispatch(stopLoadingChat());
  };
