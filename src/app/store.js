import { configureStore } from "@reduxjs/toolkit";
import clientsReducer from "../features/clients/clientsSlice";
import bidsReducer from "../features/bids/bidsSlice";

export const store = configureStore({
  reducer: {
    clients: clientsReducer,
    bids: bidsReducer
  }
});