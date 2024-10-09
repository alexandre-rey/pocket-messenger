import { useMatomo } from "@datapunt/matomo-tracker-react";
import { useEffect, useReducer } from "react";

import { stateReducer } from "../state/reducer";
import { CurrentStateContext, DispatchContext } from "../state/state.context";

import ChannelsList from "@/components/ChannelsList";
import ChatRoom from "@/components/ChatRoom";
import SideMenu from "@/components/SideMenu";

const Home = () => {
  const [currentState, dispatch] = useReducer(stateReducer, {
    currentPage: "channelGallery",
    channelId: "",
    channelName: "",
  });

  const { trackPageView } = useMatomo();

  useEffect(() => {
    trackPageView({
      documentTitle: "Home",
      href: "/home",
    });
  }, []);

  return (
    <CurrentStateContext.Provider value={currentState}>
      <DispatchContext.Provider value={dispatch}>
        <div className="flex columns-2 w-full h-screen">
          <SideMenu />
          <div className="w-full">
            {currentState.currentPage === "channelGallery" ? (
              <ChannelsList />
            ) : (
              <ChatRoom />
            )}
          </div>
        </div>
      </DispatchContext.Provider>
    </CurrentStateContext.Provider>
  );
};

export default Home;
