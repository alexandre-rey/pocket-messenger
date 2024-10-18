import { Channel } from "../interfaces/chat.interface";

import { PageType } from "./state";

export type Action = {
  type: ActionType;
  payload: {
    currentPage?: PageType;
    channel?: Channel;
    isLogged?: boolean;
    username?: string;
  };
};

export enum ActionType {
  SET_CURRENT_PAGE = "SET_CURRENT_PAGE",
  SET_CURRENT_CHANNEL = "SET_CURRENT_CHANNEL",
  SET_LOGGED = "SET_LOGGED",
}
