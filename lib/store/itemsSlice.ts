import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { uuidv7 } from 'uuidv7';
import { ItemType } from '../types/item';

export interface Item {
  id: string;
  type: ItemType;
  link?: string;
  note?: string;
  categoryId?: string;
  createdAt: string;
}

interface ItemsState {
  items: Item[];
}

const initialState: ItemsState = {
  items: [],
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<Item, 'id' | 'createdAt'>>) => {
      const newItem: Item = {
        ...action.payload,
        id: uuidv7(),
        createdAt: new Date().toISOString(),
      };
      state.items.push(newItem);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearItems: (state) => {
      state.items = [];
    },
    reorderItems: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      const { oldIndex, newIndex } = action.payload;
      const [removed] = state.items.splice(oldIndex, 1);
      state.items.splice(newIndex, 0, removed);
    },
    clearCategoryFromItems: (state, action: PayloadAction<string>) => {
      state.items = state.items.map(item =>
        item.categoryId === action.payload
          ? { ...item, categoryId: undefined }
          : item
      );
    },
    setState: (_state, action: PayloadAction<ItemsState>) => {
      return action.payload;
    },
  },
});

export const { addItem, removeItem, clearItems, reorderItems, clearCategoryFromItems } = itemsSlice.actions;
export default itemsSlice.reducer;
