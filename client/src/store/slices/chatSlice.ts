
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isHTML?: boolean;
  tableData?: any[];
  tableColumns?: any[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
}

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  inputValue: string;
}

const initialState: ChatState = {
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  inputValue: '',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations.unshift(action.payload);
      state.currentConversationId = action.payload.id;
    },
    setCurrentConversation: (state, action: PayloadAction<string>) => {
      state.currentConversationId = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: Message }>) => {
      const conversation = state.conversations.find(c => c.id === action.payload.conversationId);
      if (conversation) {
        conversation.messages.push(action.payload.message);
        conversation.lastActivity = new Date();
      }
    },
    updateConversationTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const conversation = state.conversations.find(c => c.id === action.payload.id);
      if (conversation) {
        conversation.title = action.payload.title;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setInputValue: (state, action: PayloadAction<string>) => {
      state.inputValue = action.payload;
    },
    clearOldConversations: (state) => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      state.conversations = state.conversations.filter(
        conv => new Date(conv.lastActivity) > sevenDaysAgo
      );
    },
  },
});

export const {
  createConversation,
  setCurrentConversation,
  addMessage,
  updateConversationTitle,
  setLoading,
  setInputValue,
  clearOldConversations,
} = chatSlice.actions;

export default chatSlice.reducer;
