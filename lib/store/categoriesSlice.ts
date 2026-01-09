import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { uuidv7 } from 'uuidv7';

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

interface CategoriesState {
  categories: Category[];
}

const initialState: CategoriesState = {
  categories: [],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Omit<Category, 'id' | 'createdAt'>>) => {
      const newCategory: Category = {
        ...action.payload,
        id: uuidv7(),
        createdAt: new Date().toISOString(),
      };
      state.categories.push(newCategory);
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(category => category.id !== action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
  },
});

export const { addCategory, removeCategory, updateCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
