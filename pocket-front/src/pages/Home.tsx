import { useMatomo } from "@datapunt/matomo-tracker-react";
import { useContext, useEffect } from "react";

import ChannelsList from "@/components/ChannelsList";
import ChatRoom from "@/components/ChatRoom";
import SideMenu from "@/components/SideMenu";
import { CurrentStateContext } from "@/state/state.context";
import { PageType } from "@/state/state";
import Settings from "@/components/Settings";

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
    <div className="container">
      <SideMenu />
      {currentState.currentPage === PageType.CHANNEL_GALLERY && (
        <ChannelsList />
      )}
      {currentState.currentPage === PageType.CONVERSATIONS && <ChatRoom />}
      {currentState.currentPage === PageType.SETTINGS && <Settings />}
    </div>
  );
};

export default Home;
