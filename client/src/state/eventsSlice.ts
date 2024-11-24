import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { event } from "../types/event";

const initialState: event[] = [];

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<event[]>) => {
      return action.payload;
    },
    appendEvents: (state, action: PayloadAction<event[]>) => {
      state.push(...action.payload);
    },
    updateEvent: (state, action: PayloadAction<event>) => {
      const index = state.findIndex((event) => event.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<number>) => {
      return state.filter((event) => event.id !== action.payload);
    },
  },
});

export const { setEvents, appendEvents, updateEvent, deleteEvent } =
  eventsSlice.actions;

export default eventsSlice.reducer;
