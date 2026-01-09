import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import itemsReducer from './itemsSlice';
import categoriesReducer from './categoriesSlice';
import listPageReducer from './listPageSlice';

// Redux Persist action types
const PERSIST_ACTION = 'persist/PERSIST';
const REHYDRATE_ACTION = 'persist/REHYDRATE';

const persistConfig = {
  key: 'ua',
  storage,
  whitelist: ['items', 'categories', 'listPage'],
};

const rootReducer = combineReducers({
  items: itemsReducer,
  categories: categoriesReducer,
  listPage: listPageReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST_ACTION, REHYDRATE_ACTION],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
