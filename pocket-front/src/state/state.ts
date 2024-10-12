export interface State {
  isLogged: boolean;
  username: string;
  currentPage: "channelGallery" | "conversations";
  channelId: string;
  channelName: string;
}
