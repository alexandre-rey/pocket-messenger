import { createContext } from "react";

import { PageType, State } from "./state";

export const CurrentStateContext = createContext<State>({
  currentPage: PageType.CHANNEL_GALLERY,
  channel: {
    id: "",
    name: "",
    isActive: false,
    isPublic: false,
    users: [],
    lastMessage: ""
  },
  isLogged: false,
  username: "",
});
export const DispatchContext = createContext<React.Dispatch<any> | null>(null);
