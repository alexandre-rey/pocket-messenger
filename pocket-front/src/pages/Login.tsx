import React, { useContext, useState } from "react";
import { useMatomo } from "@datapunt/matomo-tracker-react";

import pb from "../pocketbase";
import { DispatchContext } from "@/state/state.context";
import { Action, ActionType } from "@/state/action";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { trackPageView, trackEvent } = useMatomo();
  const dispatch = useContext(DispatchContext);

  React.useEffect(() => {
    trackPageView({
      documentTitle: "Login",
      href: "/",
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await pb.collection("users").authWithPassword(username, password);
      console.log("User logged in:", pb.authStore.model);
      trackEvent({
        category: "User",
        action: "login",
        name: username,
      });
      
      const loginAction: Action = {
        type: ActionType.SET_LOGGED,
        payload: {
          isLogged: true,
        },
      };

      dispatch && dispatch(loginAction);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mt-20">
        <div>
          <h2>Login</h2>
        </div>
        <div>
          <form onSubmit={handleLogin}>
            <input
              className="mb-5"
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="mb-5"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
