import { createContext, Dispatch, useContext } from "react";
import { eventsAction, eventsState } from "../types/eventsState";

interface EventsContextType {
  eventsState: eventsState;
  eventsDispatch: Dispatch<eventsAction>;
  loading: boolean;
}

export const EventsContext = createContext<EventsContextType | undefined>(
  undefined
);

export function useEventsContext() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEventsContext must be used with a EventsContext");
  }

  return context;
}
