import { useMatomo } from "@datapunt/matomo-tracker-react";
import { useContext, useEffect } from "react";

import ChannelsList from "@/components/ChannelsList";
import ChatRoom from "@/components/ChatRoom";
import SideMenu from "@/components/SideMenu";
import { CurrentStateContext } from "@/state/state.context";

const Home = () => {
  const currentState = useContext(CurrentStateContext);
  const { trackPageView } = useMatomo();

  useEffect(() => {
    trackPageView({
      documentTitle: "Home",
      href: "/home",
    });
  }, []);

  return (

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
  );
};

export default Home;
