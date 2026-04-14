import { configureStore } from "@reduxjs/toolkit";
import clientsReducer from "../features/clients/clientsSlice";
import bidsReducer from "../features/bids/bidsSlice";
import { loadAppState, saveAppState } from "../utils/localStorage";

const persistedState = loadAppState();

export const store = configureStore({
  reducer: {
    clients: clientsReducer,
    bids: bidsReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveAppState(store.getState());
});