import { Action } from "./action";
import { State } from "./state";

export function stateReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_CURRENT_PAGE":
      return {
        ...state,
        currentPage: action.payload,
      };
    case "SET_CHANNEL_ID":
      return {
        ...state,
        channelId: action.payload,
      };
    case "SET_CHANNEL_NAME":
      return {
        ...state,
        channelName: action.payload,
      };
    case "SET_CURRENT_STATE":
      return {
        ...state,
        ...action.payload,
      };
  }

  return state;
}
