import { IMessage } from 'react-native-gifted-chat';

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

export type Message = IMessage;

export type Chat = {
  id: string;
  eventId?: string;
  messages: Message[];
};

export type ChatState = {
  chats: Chat[];
  chatLoading: boolean;
};

/* -------------------------------------------------------------------------- */
/*                                   ACTIONS                                  */
/* -------------------------------------------------------------------------- */

export const FETCH_CHAT = 'FETCH_CHAT';
export const START_LOADING_CHAT = 'START_LOADING_CHAT';
export const STOP_LOADING_CHAT = 'STOP_LOADING_CHAT';

export const FETCH_NEW_MESSAGES = 'FETCH_NEW_MESSAGES';

export type FetchChatAction = {
  readonly type: typeof FETCH_CHAT;
  payload: Chat;
};
export type StartLoadingChatAction = {
  readonly type: typeof START_LOADING_CHAT;
};
export type StopLoadingChatAction = {
  readonly type: typeof STOP_LOADING_CHAT;
};

export type FetchNewMessagesAction = {
  readonly type: typeof FETCH_NEW_MESSAGES;
  payload: { id: string; messages: Message[] };
};

export type ChatAction =
  | FetchChatAction
  | StartLoadingChatAction
  | StopLoadingChatAction
  | FetchNewMessagesAction;
