import ChannelsList from "@/components/ChannelsList";
import ChatRoom from "@/components/ChatRoom";
import SideMenu from "@/components/SideMenu";
import { useState } from "react";

export interface HomeState {
  currentPage: 'channelGallery' | 'conversations';
  channelId: string;
  channelName: string;
}

const Home = () => {

  const [currentState, setCurrentState] = useState<HomeState>({currentPage: 'channelGallery', channelId: '', channelName: ''});

  if (currentState.currentPage === 'channelGallery') {

    return (
      <div className="flex columns-2 w-full h-screen">
        <SideMenu setCurrentState={setCurrentState} currentState={currentState}/>
        <div className="w-full">
          <ChannelsList setCurrentState={setCurrentState} currentState={currentState}/>
        </div>
      </div>
    );
  } else {
    console.log("conversations");
    return (
      <div className="flex columns-3 w-full h-screen">
        <SideMenu setCurrentState={setCurrentState} currentState={currentState} />
        <div className="w-full">
          <ChatRoom channelId={currentState.channelId} channelName={currentState.channelName} />
        </div>
      </div>
    );
  }
};

export default Home;
