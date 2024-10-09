import { Button } from "@nextui-org/button";
import { useNavigate } from "react-router-dom";
import { useMatomo } from "@datapunt/matomo-tracker-react";

import { HomeState } from "@/pages/Home";
import pb from "@/pocketbase";

interface Props {
  setCurrentState: (newState: HomeState) => void;
  currentState: HomeState;
}

const SideMenu = ({ setCurrentState, currentState }: Props) => {
  const navigate = useNavigate();
  const { trackEvent } = useMatomo();

  const logout = () => {
    trackEvent({
      category: "User",
      action: "logout",
      name: pb.authStore.model?.username,
    });
    pb.authStore.clear();
    navigate("/");
  };

  const handleMenuClick = (page: "channelGallery" | "conversations") => {
    setCurrentState({
      ...currentState,
      currentPage: page,
    });
  };

  return (
    <div className="relative flex h-full w-full max-w-[10rem] flex-col rounded-xl bg-white bg-clip-border p-4 text-gray-700 shadow-xl shadow-blue-gray-900/5">
      <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
        <div
          className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
          role="button"
        >
          <Button
            aria-label="Home"
            className="grid mr-4 place-items-center"
            onClick={() => {
              handleMenuClick("channelGallery");
            }}
          >
            <img alt="Home" className="w-5 h-5" src="/homeIcon.png" />
          </Button>
        </div>
        <div
          className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
          role="button"
        >
          <Button
            aria-label="Conversations"
            className="grid mr-4 place-items-center"
            onClick={() => {
              handleMenuClick("conversations");
            }}
          >
            <img alt="Messages" className="w-5 h-5" src="/messageIcon.png" />
          </Button>
        </div>
        <div
          className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
          role="button"
        >
          <Button
            className="grid mr-4 place-items-center"
            onClick={() => logout()}
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.166 5.106a.75.75 0 010 1.06 8.25 8.25 0 1011.668 0 .75.75 0 111.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 011.06 0z"
                fillRule="evenodd"
              />
            </svg>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default SideMenu;
