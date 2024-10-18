import { Action, ActionType } from "./action";
import { State } from "./state";

export function stateReducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.SET_CURRENT_PAGE:
      if (action.payload.currentPage !== undefined) {
        return {
          ...state,
          currentPage: action.payload.currentPage,
        };
      } else return state;

    case ActionType.SET_CURRENT_CHANNEL:
      if (action.payload.channel !== undefined) {
        const page = action.payload.currentPage || state.currentPage;

        return {
          ...state,
          currentPage: page,
          channel: { ...action.payload.channel },
        };
      } else return state;

    case ActionType.SET_LOGGED:
      if (action.payload.isLogged !== undefined) {
        return {
          ...state,
          isLogged: action.payload.isLogged,
          username: action.payload.username || "",
        };
      } else return state;
  }

  return state;
}
