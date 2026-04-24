// Member 01 - UI/UX Layout: React context that exposes the logged-in user (incl. role)
import { createContext, useContext } from "react";

export const UserContext = createContext(null);

export function useUser() {
  return useContext(UserContext);
}
