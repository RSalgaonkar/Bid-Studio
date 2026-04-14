import { createSlice } from "@reduxjs/toolkit";
import { bids } from "../../data/mockData";

const initialState = {
  list: bids,
  filters: {
    search: "",
    status: "all",
    priority: "all",
    clientId: "all",
  },
  selectedBidId: null,
};

const bidsSlice = createSlice({
  name: "bids",
  initialState,
  reducers: {
    addBid: (state, action) => {
      state.list.push(action.payload);
    },

    updateBid: (state, action) => {
      const index = state.list.findIndex((bid) => bid.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },

    deleteBid: (state, action) => {
      state.list = state.list.filter((bid) => bid.id !== action.payload);

      if (state.selectedBidId === action.payload) {
        state.selectedBidId = null;
      }
    },

    setBidFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    resetBidFilters: (state) => {
      state.filters = {
        search: "",
        status: "all",
        priority: "all",
        clientId: "all",
      };
    },

    setSelectedBidId: (state, action) => {
      state.selectedBidId = action.payload;
    },
  },
});

export const {
  addBid,
  updateBid,
  deleteBid,
  setBidFilters,
  resetBidFilters,
  setSelectedBidId,
} = bidsSlice.actions;

export default bidsSlice.reducer;