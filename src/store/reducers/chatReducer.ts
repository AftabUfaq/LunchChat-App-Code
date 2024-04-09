import { getArrayItemById, upsertArrayItemById } from '../../utils/arrays';
import {
  ChatState,
  ChatAction,
  FETCH_CHAT,
  START_LOADING_CHAT,
  FETCH_NEW_MESSAGES,
  Chat,
  STOP_LOADING_CHAT,
} from '../types/chatTypes';

const initialState: ChatState = {
  chats: [],
  chatLoading: false,
};

const ChatReducer = (state = initialState, action: ChatAction): ChatState => {
  let chat: Chat | undefined;
  switch (action.type) {
    case FETCH_CHAT:
      return {
        ...state,
        chats: upsertArrayItemById(
          action.payload.id,
          state.chats,
          action.payload
        ),
      };
    case START_LOADING_CHAT:
      return { ...state, chatLoading: true };
    case STOP_LOADING_CHAT:
      return { ...state, chatLoading: false };
    case FETCH_NEW_MESSAGES:
      chat = getArrayItemById(action.payload.id, state.chats);

      if (chat) {
        chat = {
          ...chat,
          messages: [...action.payload.messages, ...chat.messages],
        };

        return {
          ...state,
          chats: upsertArrayItemById(action.payload.id, state.chats, chat),
        };
      }

      return {
        ...state,
        chats: upsertArrayItemById(action.payload.id, state.chats, {
          id: action.payload.id,
          messages: [...action.payload.messages],
        }),
      };
      return state;
    default:
      return state;
  }
};

export { ChatReducer };
