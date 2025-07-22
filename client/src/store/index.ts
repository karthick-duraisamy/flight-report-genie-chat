
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { chatApi } from './api/chatApi';
import chatReducer from './slices/chatSlice';
import themeReducer from './slices/themeSlice';
import historyReducer from './slices/historySlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    theme: themeReducer,
    history: historyReducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(chatApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
