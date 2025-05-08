import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import walletReducer from './walletSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
