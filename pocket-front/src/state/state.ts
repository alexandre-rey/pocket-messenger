export interface State {
  isLogged: boolean;
  currentPage: "channelGallery" | "conversations";
  channelId: string;
  channelName: string;
}
