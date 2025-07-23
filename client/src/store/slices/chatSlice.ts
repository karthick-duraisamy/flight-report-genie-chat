import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string; // Keep as string for Redux serialization
  isHTML?: boolean;
  tableData?: any[];
  tableColumns?: any[];
  data?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    fileUrl?: string;
    isImage?: boolean;
    isPdf?: boolean;
    data?: any; // For bot responses with table data
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string; // Changed to string
  lastActivity: string; // Changed to string
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
        timestamp: new Date('2024-01-20T09:15:00').toISOString(), // Converted to string
      },
      {
        id: '1-2',
        type: 'bot',
        content: 'I\'ll generate a comprehensive flight delay analysis report for Q4 2023. This will include delay patterns, root causes, and recommendations.',
        timestamp: new Date('2024-01-20T09:15:30').toISOString(), // Converted to string
      },
      {
        id: '1-3',
        type: 'user',
        content: 'Please include weather-related delays separately',
        timestamp: new Date('2024-01-20T09:16:00').toISOString(), // Converted to string
      },
      {
        id: '1-4',
        type: 'bot',
        content: 'Generated comprehensive delay analysis for Q4 2023 with weather-related delays categorized separately. The report shows 15% of delays were weather-related.',
        timestamp: new Date('2024-01-20T09:16:45').toISOString(), // Converted to string
      }
    ],
    '2': [
      {
        id: '2-1',
        type: 'user',
        content: 'I need a passenger satisfaction survey analysis',
        timestamp: new Date('2024-01-19T14:30:00').toISOString(), // Converted to string
      },
      {
        id: '2-2',
        type: 'bot',
        content: 'I\'ll analyze the passenger satisfaction survey data for you. What specific time period would you like me to focus on?',
        timestamp: new Date('2024-01-19T14:30:15').toISOString(), // Converted to string
      },
      {
        id: '2-3',
        type: 'user',
        content: 'Last 6 months would be perfect',
        timestamp: new Date('2024-01-19T14:30:45').toISOString(), // Converted to string
      },
      {
        id: '2-4',
        type: 'bot',
        content: 'Customer feedback analysis shows 85% satisfaction rate over the last 6 months. Key improvement areas identified in baggage handling and on-time performance.',
        timestamp: new Date('2024-01-19T14:31:30').toISOString(), // Converted to string
      }
    ],
    '3': [
      {
        id: '3-1',
        type: 'user',
        content: 'Show me route performance metrics',
        timestamp: new Date('2024-01-18T11:20:00').toISOString(), // Converted to string
      },
      {
        id: '3-2',
        type: 'bot',
        content: 'Top performing routes identified for optimization. Routes NYC-LAX and CHI-MIA showing highest profitability and on-time performance.',
        timestamp: new Date('2024-01-18T11:20:30').toISOString(), // Converted to string
      }
    ],
    '4': [
      {
        id: '4-1',
        type: 'user',
        content: 'Generate aircraft utilization report for our fleet',
        timestamp: new Date('2024-01-17T10:00:00').toISOString(), // Converted to string
      },
      {
        id: '4-2',
        type: 'bot',
        content: 'Fleet efficiency metrics and recommendations generated. Average aircraft utilization is 78% with opportunities for improvement on regional routes.',
        timestamp: new Date('2024-01-17T10:00:45').toISOString(), // Converted to string
      }
    ],
    '5': [
      {
        id: '5-1',
        type: 'user',
        content: 'I need seasonal demand forecasting for summer 2024',
        timestamp: new Date('2024-01-16T13:15:00').toISOString(), // Converted to string
      },
      {
        id: '5-2',
        type: 'bot',
        content: 'Summer 2024 travel demand predictions and capacity planning completed. Expecting 25% increase in leisure travel bookings.',
        timestamp: new Date('2024-01-16T13:16:00').toISOString(), // Converted to string
      }
    ],
    '6': [
      {
        id: '6-1',
        type: 'user',
        content: 'Analyze baggage handling performance',
        timestamp: new Date('2024-01-15T16:30:00').toISOString(), // Converted to string
      },
      {
        id: '6-2',
        type: 'bot',
        content: 'Baggage processing time analysis and improvement suggestions provided. Average handling time reduced by 15% with new procedures.',
        timestamp: new Date('2024-01-15T16:31:00').toISOString(), // Converted to string
      }
    ],
    '7': [
      {
        id: '7-1',
        type: 'user',
        content: 'Optimize crew scheduling for next month',
        timestamp: new Date('2024-01-14T08:45:00').toISOString(), // Converted to string
      },
      {
        id: '7-2',
        type: 'bot',
        content: 'AI-powered crew scheduling reduces operational costs by 12% while ensuring compliance with regulations.',
        timestamp: new Date('2024-01-14T08:46:00').toISOString(), // Converted to string
      }
    ],
    '8': [
      {
        id: '8-1',
        type: 'user',
        content: 'Show fuel consumption analysis',
        timestamp: new Date('2024-01-13T12:20:00').toISOString(), // Converted to string
      },
      {
        id: '8-2',
        type: 'bot',
        content: 'Fuel efficiency improvements identified across fleet operations. Potential savings of 8% through route optimization.',
        timestamp: new Date('2024-01-13T12:21:00').toISOString(), // Converted to string
      }
    ],
    '9': [
      {
        id: '9-1',
        type: 'user',
        content: 'Analyze customer loyalty program performance',
        timestamp: new Date('2024-01-12T15:00:00').toISOString(), // Converted to string
      },
      {
        id: '9-2',
        type: 'bot',
        content: 'Premium tier engagement increased by 18% this quarter. Recommendations for enhancing member benefits provided.',
        timestamp: new Date('2024-01-12T15:01:00').toISOString(), // Converted to string
      }
    ],
    '10': [
      {
        id: '10-1',
        type: 'user',
        content: 'Generate maintenance schedule report',
        timestamp: new Date('2024-01-11T09:30:00').toISOString(), // Converted to string
      },
      {
        id: '10-2',
        type: 'bot',
        content: 'Predictive maintenance reduces unexpected downtime by 30%. Optimized schedule for next quarter prepared.',
        timestamp: new Date('2024-01-11T09:31:00').toISOString(), // Converted to string
      }
    ],
    '11': [
      {
        id: '11-1',
        type: 'user',
        content: 'Show revenue management dashboard',
        timestamp: new Date('2024-01-10T14:15:00').toISOString(), // Converted to string
      },
      {
        id: '11-2',
        type: 'bot',
        content: 'Dynamic pricing optimization increased revenue by 8%. Market analysis and competitor pricing insights included.',
        timestamp: new Date('2024-01-10T14:16:00').toISOString(), // Converted to string
      }
    ],
    '12': [
      {
        id: '12-1',
        type: 'user',
        content: 'Airport operations efficiency report needed',
        timestamp: new Date('2024-01-09T11:00:00').toISOString(), // Converted to string
      },
      {
        id: '12-2',
        type: 'bot',
        content: 'Ground handling efficiency metrics and improvement areas identified. Turnaround time reduced by 12 minutes on average.',
        timestamp: new Date('2024-01-09T11:01:00').toISOString(), // Converted to string
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
      // Convert dates to strings when creating a conversation
      const newConversation = {
        ...action.payload,
        createdAt: action.payload.createdAt.toISOString(),
        lastActivity: action.payload.lastActivity.toISOString(),
      };
      state.conversations.unshift(newConversation);
      state.currentConversationId = action.payload.id;
    },
    setCurrentConversation: (state, action: PayloadAction<string>) => {
      state.currentConversationId = action.payload;
    },
    setCurrentSession: (state, action: PayloadAction<string>) => {
      state.currentSession = action.payload;
    },
    addMessage: (state, action: PayloadAction<any>) => {
      // Convert timestamp to string if it's a Date object
      const message = {
        ...action.payload,
        timestamp: action.payload.timestamp instanceof Date 
          ? action.payload.timestamp.toISOString() 
          : action.payload.timestamp
      };
      state.messages.push(message);
      // Also add to conversation-specific messages if there's a current session
      if (state.currentSession) {
        if (!state.conversationMessages[state.currentSession]) {
          state.conversationMessages[state.currentSession] = [];
        }
        state.conversationMessages[state.currentSession].push(message);
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