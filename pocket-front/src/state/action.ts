import { PageType } from "./state";

export type Action = {
  type: ActionType;
  payload: {
    currentPage?: PageType
    channelId?: string;
    channelName?: string;
    isLogged?: boolean;
    username?: string;
  }
}

export enum ActionType {
  SET_CURRENT_PAGE = "SET_CURRENT_PAGE",
  SET_CURRENT_CHANNEL = "SET_CURRENT_CHANNEL",
  SET_LOGGED = "SET_LOGGED",
}
