import { useMatomo } from "@datapunt/matomo-tracker-react";
import { useContext } from "react";

import { Action, ActionType } from "../state/action";
import { DispatchContext } from "../state/state.context";

import pb from "@/pocketbase";
import "../styles/menu.css";

const SideMenu = () => {
  const { trackEvent } = useMatomo();
  const dispatch = useContext(DispatchContext);

  const logout = () => {
    trackEvent({
      category: "User",
      action: "logout",
      name: pb.authStore.model?.username,
    });
    pb.authStore.clear();
    const action: Action = {
      type: ActionType.SET_LOGGED,
      payload: {
        isLogged: false,
      },
    };

    dispatch && dispatch(action);
  };

  const handleMenuClick = (page: "channelGallery" | "conversations") => {
    const action: Action = {
      type: ActionType.SET_CURRENT_PAGE,
      payload: {
        currentPage: page,
      },
    };

    dispatch && dispatch(action);
  };

  return (
    <div className="menu_container">
      <nav>
        <div className="menu_button" role="button" >
          <button
            aria-label="Home"
            onClick={() => {
              handleMenuClick("channelGallery");
            }}
          >
            <img alt="Home" src="/homeIcon.png" />
          </button>
        </div>
        <div className="menu_button" role="button">
          <button
            aria-label="Conversations"
            onClick={() => {
              handleMenuClick("conversations");
            }}
          >
            <img alt="Messages" src="/messageIcon.png" />
          </button>
        </div>
        <div className="menu_button" role="button">
          <button onClick={() => logout()}>
            <svg
            width={24}
              aria-hidden="true"
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
          </button>
        </div>
      </nav>
    </div>
  );
};

export default SideMenu;
