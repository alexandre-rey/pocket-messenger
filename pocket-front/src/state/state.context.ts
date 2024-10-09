import { createContext } from "react";

import { State } from "./state";

export const CurrentStateContext = createContext<State>({
  currentPage: "channelGallery",
  channelId: "",
  channelName: "",
});
export const DispatchContext = createContext<React.Dispatch<any> | null>(null);
