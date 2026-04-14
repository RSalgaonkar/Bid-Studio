import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [
    {
      id: 1,
      title: "Website Redesign Proposal",
      client: "Acme Pvt Ltd",
      amount: 45000,
      status: "pending",
      deadline: "2026-04-25",
    },
    {
      id: 2,
      title: "Mobile App UI Bid",
      client: "Nova Tech",
      amount: 68000,
      status: "approved",
      deadline: "2026-04-28",
    },
    {
      id: 3,
      title: "SEO Optimization Package",
      client: "Bright Media",
      amount: 22000,
      status: "rejected",
      deadline: "2026-05-02",
    },
    {
      id: 4,
      title: "CRM Dashboard Proposal",
      client: "Orbit Solutions",
      amount: 72000,
      status: "pending",
      deadline: "2026-05-05",
    },
    {
      id: 5,
      title: "Branding Package",
      client: "Pixel House",
      amount: 39000,
      status: "approved",
      deadline: "2026-05-10",
    },
    {
      id: 6,
      title: "Landing Page Development",
      client: "BluePeak",
      amount: 18000,
      status: "pending",
      deadline: "2026-05-13",
    },
    {
      id: 7,
      title: "E-commerce Store Setup",
      client: "ShopNest",
      amount: 85000,
      status: "approved",
      deadline: "2026-05-15",
    },
    {
      id: 8,
      title: "Social Media Campaign Bid",
      client: "TrendSpark",
      amount: 27000,
      status: "rejected",
      deadline: "2026-05-18",
    },
  ],
};

const bidsSlice = createSlice({
  name: "bids",
  initialState,
  reducers: {
    addBid: (state, action) => {
      state.list.unshift(action.payload);
    },
    updateBid: (state, action) => {
      const index = state.list.findIndex((bid) => bid.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteBid: (state, action) => {
      state.list = state.list.filter((bid) => bid.id !== action.payload);
    },
  },
});

export const { addBid, updateBid, deleteBid } = bidsSlice.actions;
export default bidsSlice.reducer;