import { eventsAction, eventsState } from "../types/eventsState";

export const eventsReducer = (state: eventsState, action: eventsAction) => {
  const { type, payload } = action;

  switch (type) {
    case "getEvents":
      return { ...state, events: payload };
    case "updateEvent":
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === payload.id ? payload : event
        ),
      };
    case "deleteEvent": // New case for deleting an event
      return {
        ...state,
        events: state.events.filter((event) => event.id !== parseInt(payload)), // Filter out the deleted event
      };
    default:
      return state;
  }
};
