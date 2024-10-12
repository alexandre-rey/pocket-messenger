import Login from "./pages/Login";
import Home from "./pages/Home";

import { CurrentStateContext, DispatchContext } from "./state/state.context";
import { useReducer } from "react";
import { stateReducer } from "./state/reducer";
import pb from "./pocketbase";
import { ActionType } from "./state/action";

function App() {

  const [currentState, dispatch] = useReducer(stateReducer, {
    currentPage: "channelGallery",
    channelId: "",
    channelName: "",
    isLogged: false,
  });

  if (pb.authStore.model && pb.authStore.isValid && currentState.isLogged === false) {
    dispatch({
      type: ActionType.SET_LOGGED,
      payload: {
        isLogged: true,
      },
    });
  }

  return (
    <CurrentStateContext.Provider value={currentState}>
      <DispatchContext.Provider value={dispatch}>
        {currentState.isLogged ? <Home /> : <Login />}
        </DispatchContext.Provider>
      </CurrentStateContext.Provider>
  )
}

export default App;
