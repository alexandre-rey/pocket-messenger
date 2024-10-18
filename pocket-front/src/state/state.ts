import { Channel } from "../interfaces/chat.interface";

export interface State {
  isLogged: boolean;
  username: string;
  currentPage: PageType;
  channel: Channel;
}

export enum PageType {
  CHANNEL_GALLERY = "channelGallery",
  CONVERSATIONS = "conversations",
  SETTINGS = "settings",
}
