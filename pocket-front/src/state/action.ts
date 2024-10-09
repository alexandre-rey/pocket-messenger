export interface Action {
  type: ActionType;
  payload: any;
}

export enum ActionType {
  SET_CURRENT_PAGE = "SET_CURRENT_PAGE",
  SET_CHANNEL_ID = "SET_CHANNEL_ID",
  SET_CHANNEL_NAME = "SET_CHANNEL_NAME",
  SET_CURRENT_STATE = "SET_CURRENT_STATE",
}
