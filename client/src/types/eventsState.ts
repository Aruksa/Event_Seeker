import { event } from "./event";

export interface eventsState {
  events: event[];
}

export interface eventsAction {
  type: "getEvents";
  payload: event[];
}
