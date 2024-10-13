export interface State {
  isLogged: boolean;
  username: string;
  currentPage: PageType;
  channelId: string;
  channelName: string;
}

export enum PageType {
  CHANNEL_GALLERY = "channelGallery",
  CONVERSATIONS = "conversations",
  SETTINGS = "settings",
}