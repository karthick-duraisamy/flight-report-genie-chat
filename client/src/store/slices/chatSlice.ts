
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isHTML?: boolean;
  tableData?: any[];
  tableColumns?: any[];
  data?: any;
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
  currentSession: string | null;
  messages: Message[];
  conversationMessages: { [conversationId: string]: Message[] };
  isLoading: boolean;
  inputValue: string;
}

const initialState: ChatState = {
  conversations: [],
  currentConversationId: null,
  currentSession: null,
  messages: [],
  conversationMessages: {
    '1': [
      {
        id: '1-1',
        type: 'user',
        content: 'Can you generate a flight delay analysis report for Q4 2023?',
        timestamp: new Date('2024-01-20T09:15:00'),
      },
      {
        id: '1-2',
        type: 'bot',
        content: 'I\'ll generate a comprehensive flight delay analysis report for Q4 2023. This will include delay patterns, root causes, and recommendations.',
        timestamp: new Date('2024-01-20T09:15:30'),
      },
      {
        id: '1-3',
        type: 'user',
        content: 'Please include weather-related delays separately',
        timestamp: new Date('2024-01-20T09:16:00'),
      },
      {
        id: '1-4',
        type: 'bot',
        content: 'Generated comprehensive delay analysis for Q4 2023 with weather-related delays categorized separately. The report shows 15% of delays were weather-related.',
        timestamp: new Date('2024-01-20T09:16:45'),
      }
    ],
    '2': [
      {
        id: '2-1',
        type: 'user',
        content: 'I need a passenger satisfaction survey analysis',
        timestamp: new Date('2024-01-19T14:30:00'),
      },
      {
        id: '2-2',
        type: 'bot',
        content: 'I\'ll analyze the passenger satisfaction survey data for you. What specific time period would you like me to focus on?',
        timestamp: new Date('2024-01-19T14:30:15'),
      },
      {
        id: '2-3',
        type: 'user',
        content: 'Last 6 months would be perfect',
        timestamp: new Date('2024-01-19T14:30:45'),
      },
      {
        id: '2-4',
        type: 'bot',
        content: 'Customer feedback analysis shows 85% satisfaction rate over the last 6 months. Key improvement areas identified in baggage handling and on-time performance.',
        timestamp: new Date('2024-01-19T14:31:30'),
      }
    ],
    '3': [
      {
        id: '3-1',
        type: 'user',
        content: 'Show me route performance metrics',
        timestamp: new Date('2024-01-18T11:20:00'),
      },
      {
        id: '3-2',
        type: 'bot',
        content: 'Top performing routes identified for optimization. Routes NYC-LAX and CHI-MIA showing highest profitability and on-time performance.',
        timestamp: new Date('2024-01-18T11:20:30'),
      }
    ]
  },
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
    setCurrentSession: (state, action: PayloadAction<string>) => {
      state.currentSession = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      // Also add to conversation-specific messages if there's a current session
      if (state.currentSession) {
        if (!state.conversationMessages[state.currentSession]) {
          state.conversationMessages[state.currentSession] = [];
        }
        state.conversationMessages[state.currentSession].push(action.payload);
      }
    },
    loadConversationMessages: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      state.messages = state.conversationMessages[conversationId] || [];
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
  setCurrentSession,
  addMessage,
  loadConversationMessages,
  updateConversationTitle,
  setLoading,
  setInputValue,
  clearOldConversations,
} = chatSlice.actions;

export default chatSlice.reducer;
