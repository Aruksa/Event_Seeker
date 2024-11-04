import { event } from "./event";

export interface eventsState {
  events: event[];
}

export type eventsAction =
  | { type: "getEvents"; payload: event[] }
  | { type: "updateEvent"; payload: event }
  | { type: "deleteEvent"; payload: string }
  | { type: "appendEvents"; payload: event[] };
