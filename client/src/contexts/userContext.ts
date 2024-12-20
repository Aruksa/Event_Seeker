import { createContext, Dispatch, useContext } from "react";
import { userAction, userState } from "../types/userState";

interface UserContextType {
  userState: userState;
  userDispatch: Dispatch<userAction>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used with a UserContext");
  }

  return context;
}
