import { createContext } from 'react';

import { PageType, State } from './state';

export const CurrentStateContext = createContext<State>({
  currentPage: PageType.CHANNEL_GALLERY,
  channelId: '',
  channelName: '',
  isLogged: false,
  username: '',
});
export const DispatchContext = createContext<React.Dispatch<any> | null>(null);
