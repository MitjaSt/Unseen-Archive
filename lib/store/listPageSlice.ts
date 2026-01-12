import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ListPageState {
  selectedFilter: string | null;
}

const initialState: ListPageState = {
  selectedFilter: null,
};

const listPageSlice = createSlice({
  name: 'listPage',
  initialState,
  reducers: {
    setSelectedFilter: (state, action: PayloadAction<string | null>) => {
      state.selectedFilter = action.payload;
    },
    clearSelectedFilter: (state) => {
      state.selectedFilter = null;
    },
    setState: (_state, action: PayloadAction<ListPageState>) => {
      return action.payload;
    },
  },
});

export const { setSelectedFilter, clearSelectedFilter } = listPageSlice.actions;
export default listPageSlice.reducer;
