import { useMatomo } from "@datapunt/matomo-tracker-react";
import { useEffect, useState } from "react";

import ChannelsList from "@/components/ChannelsList";
import ChatRoom from "@/components/ChatRoom";
import SideMenu from "@/components/SideMenu";

export interface HomeState {
  currentPage: "channelGallery" | "conversations";
  channelId: string;
  channelName: string;
}

const Home = () => {
  const [currentState, setCurrentState] = useState<HomeState>({
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

  if (currentState.currentPage === "channelGallery") {
    return (
      <div className="flex columns-2 w-full h-screen">
        <SideMenu
          currentState={currentState}
          setCurrentState={setCurrentState}
        />
        <div className="w-full">
          <ChannelsList
            currentState={currentState}
            setCurrentState={setCurrentState}
          />
        </div>
      </div>
    );
  } else {
    console.log("conversations");

    return (
      <div className="flex columns-3 w-full h-screen">
        <SideMenu
          currentState={currentState}
          setCurrentState={setCurrentState}
        />
        <div className="w-full">
          <ChatRoom
            channelId={currentState.channelId}
            channelName={currentState.channelName}
          />
        </div>
      </div>
    );
  }
};

export default Home;
