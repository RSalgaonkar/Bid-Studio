import { createSlice } from "@reduxjs/toolkit";
import { clients } from "../../data/mockData";

const initialState = {
  list: clients
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    addClient: (state, action) => {
      state.list.push(action.payload);
    },
    updateClient: (state, action) => {
      const index = state.list.findIndex(client => client.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteClient: (state, action) => {
      state.list = state.list.filter(client => client.id !== action.payload);
    }
  }
});

export const { addClient, updateClient, deleteClient } = clientsSlice.actions;
export default clientsSlice.reducer;