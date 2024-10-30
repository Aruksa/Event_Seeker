import { eventsAction, eventsState } from "../types/eventsState";

export const eventsReducer = (state: eventsState, action: eventsAction) => {
  const { type, payload } = action;

  switch (type) {
    case "getEvents":
      return { ...state, events: payload };
    default:
      return state;
  }
};
