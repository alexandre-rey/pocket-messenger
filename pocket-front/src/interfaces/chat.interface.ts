export interface ChannelOverview {
  id: string;
  name: string;
  isActive: boolean;
  isPublic: boolean;
  userCount: number;
}

export interface Channel {
  id: string;
  name: string;
  isActive: boolean;
  isPublic: boolean;
  lastMessage: string;
  users: string[];
}

export interface Message {
  id: string;
  content: string;
  created: string;
  expand: {
    sentBy: {
      id: string;
      username: string;
      avatar: string;
    };
  };
}
