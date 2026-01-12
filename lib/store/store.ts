import { configureStore, combineReducers } from '@reduxjs/toolkit';
import itemsReducer from './itemsSlice';
import categoriesReducer from './categoriesSlice';
import listPageReducer from './listPageSlice';

const rootReducer = combineReducers({
  items: itemsReducer,
  categories: categoriesReducer,
  listPage: listPageReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

// Auto-save to storage on state changes
if (typeof window !== 'undefined') {
  // Load initial state from storage
  const loadState = async () => {
    try {
      const isExtension = typeof chrome !== 'undefined' && chrome.storage?.local;

      if (isExtension) {
        const result = await chrome.storage.local.get('persist:ua');
        const persistedData = result['persist:ua'];
        if (persistedData && typeof persistedData === 'string') {
          const state = JSON.parse(persistedData);
          // Dispatch actions to restore state
          if (state.items) store.dispatch({ type: 'items/setState', payload: JSON.parse(state.items) });
          if (state.categories) store.dispatch({ type: 'categories/setState', payload: JSON.parse(state.categories) });
          if (state.listPage) store.dispatch({ type: 'listPage/setState', payload: JSON.parse(state.listPage) });
        }
      } else {
        const serialized = localStorage.getItem('persist:ua');
        if (serialized) {
          const state = JSON.parse(serialized);
          if (state.items) store.dispatch({ type: 'items/setState', payload: JSON.parse(state.items) });
          if (state.categories) store.dispatch({ type: 'categories/setState', payload: JSON.parse(state.categories) });
          if (state.listPage) store.dispatch({ type: 'listPage/setState', payload: JSON.parse(state.listPage) });
        }
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
  };

  loadState();

  // Save state on changes
  store.subscribe(() => {
    try {
      const state = store.getState();
      const serialized = JSON.stringify({
        items: JSON.stringify(state.items),
        categories: JSON.stringify(state.categories),
        listPage: JSON.stringify(state.listPage),
      });

      const isExtension = typeof chrome !== 'undefined' && chrome.storage?.local;

      if (isExtension) {
        chrome.storage.local.set({ 'persist:ua': serialized });
      } else {
        localStorage.setItem('persist:ua', serialized);
      }
    } catch (error) {
      console.error('Error saving state:', error);
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
