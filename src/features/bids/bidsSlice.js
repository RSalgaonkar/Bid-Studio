import { createSlice } from "@reduxjs/toolkit";
import { bids } from "../../data/mockData";

const initialState = {
  list: bids
};

const bidsSlice = createSlice({
  name: "bids",
  initialState,
  reducers: {
    addBid: (state, action) => {
      state.list.push(action.payload);
    },
    updateBid: (state, action) => {
      const index = state.list.findIndex(bid => bid.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteBid: (state, action) => {
      state.list = state.list.filter(bid => bid.id !== action.payload);
    }
  }
});

export const { addBid, updateBid, deleteBid } = bidsSlice.actions;
export default bidsSlice.reducer;