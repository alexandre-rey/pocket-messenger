import { useReducer, useState } from "react";

import Login from "./pages/Login";
import Home from "./pages/Home";
import { CurrentStateContext, DispatchContext } from "./state/state.context";
import { stateReducer } from "./state/reducer";
import pb from "./pocketbase";
import { ActionType } from "./state/action";
import { PageType } from "./state/state";
import Register from "./pages/Register";

function App() {
  const [currentState, dispatch] = useReducer(stateReducer, {
    currentPage: PageType.CHANNEL_GALLERY,
    channel: {
      id: "",
      name: "",
      isActive: false,
      isPublic: false,
      users: [],
    },
    isLogged: false,
    username: "",
  });

  const [isRegistering, setIsRegistering] = useState(false);

  if (
    pb.authStore.model &&
    pb.authStore.isValid &&
    currentState.isLogged === false
  ) {
    dispatch({
      type: ActionType.SET_LOGGED,
      payload: {
        isLogged: true,
        username: pb.authStore.model.username,
      },
    });
  }

  return (
    <CurrentStateContext.Provider value={currentState}>
      <DispatchContext.Provider value={dispatch}>
        {currentState.isLogged && <Home />}
        {!currentState.isLogged && !isRegistering && (
          <Login setIsRegistering={setIsRegistering} />
        )}
        {!currentState.isLogged && isRegistering && (
          <Register setIsRegistering={setIsRegistering} />
        )}
      </DispatchContext.Provider>
    </CurrentStateContext.Provider>
  );
}

export default App;
