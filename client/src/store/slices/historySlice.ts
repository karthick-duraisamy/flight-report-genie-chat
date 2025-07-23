
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HistoryItem {
  id: string;
  title: string;
  date: Date;
  messageCount: number;
  lastMessage?: string;
}

interface HistoryState {
  items: HistoryItem[];
  isExpanded: boolean;
}

const initialState: HistoryState = {
  items: [
    {
      id: '1',
      title: 'Flight Delay Analysis Report',
      date: new Date('2024-01-20'),
      messageCount: 8,
      lastMessage: 'Generated comprehensive delay analysis for Q4 2023...'
    },
    {
      id: '2',
      title: 'Passenger Satisfaction Survey',
      date: new Date('2024-01-19'),
      messageCount: 12,
      lastMessage: 'Customer feedback analysis shows 85% satisfaction rate...'
    },
    {
      id: '3',
      title: 'Route Performance Metrics',
      date: new Date('2024-01-18'),
      messageCount: 6,
      lastMessage: 'Top performing routes identified for optimization...'
    },
    {
      id: '4',
      title: 'Aircraft Utilization Report',
      date: new Date('2024-01-17'),
      messageCount: 15,
      lastMessage: 'Fleet efficiency metrics and recommendations...'
    },
    {
      id: '5',
      title: 'Seasonal Demand Forecast',
      date: new Date('2024-01-16'),
      messageCount: 9,
      lastMessage: 'Summer 2024 travel demand predictions and capacity planning...'
    },
    {
      id: '6',
      title: 'Baggage Handling Analytics',
      date: new Date('2024-01-15'),
      messageCount: 7,
      lastMessage: 'Baggage processing time analysis and improvement suggestions...'
    },
    {
      id: '7',
      title: 'Crew Scheduling Optimization',
      date: new Date('2024-01-14'),
      messageCount: 11,
      lastMessage: 'AI-powered crew scheduling reduces operational costs by 12%...'
    },
    {
      id: '8',
      title: 'Fuel Consumption Analysis',
      date: new Date('2024-01-13'),
      messageCount: 8,
      lastMessage: 'Fuel efficiency improvements identified across fleet operations...'
    },
    {
      id: '9',
      title: 'Customer Loyalty Program Analytics',
      date: new Date('2024-01-12'),
      messageCount: 14,
      lastMessage: 'Premium tier engagement increased by 18% this quarter...'
    },
    {
      id: '10',
      title: 'Maintenance Schedule Report',
      date: new Date('2024-01-11'),
      messageCount: 6,
      lastMessage: 'Predictive maintenance reduces unexpected downtime...'
    },
    {
      id: '11',
      title: 'Revenue Management Dashboard',
      date: new Date('2024-01-10'),
      messageCount: 10,
      lastMessage: 'Dynamic pricing optimization increased revenue by 8%...'
    },
    {
      id: '12',
      title: 'Airport Operations Report',
      date: new Date('2024-01-09'),
      messageCount: 13,
      lastMessage: 'Ground handling efficiency metrics and improvement areas...'
    }
  ],
  isExpanded: true, // Default to expanded as requested
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistoryItem: (state, action: PayloadAction<HistoryItem>) => {
      state.items.unshift(action.payload);
      // Keep only last 50 conversations
      if (state.items.length > 50) {
        state.items = state.items.slice(0, 50);
      }
    },
    updateHistoryTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.title = action.payload.title;
      }
    },
    removeHistoryItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    toggleExpanded: (state) => {
      state.isExpanded = !state.isExpanded;
    },
    clearHistory: (state) => {
      state.items = [];
    },
  },
});

export const {
  addHistoryItem,
  updateHistoryTitle,
  removeHistoryItem,
  toggleExpanded,
  clearHistory,
} = historySlice.actions;

export default historySlice.reducer;
