import React, { useContext, useState } from "react";
import { useMatomo } from "@datapunt/matomo-tracker-react";

import { DispatchContext } from "@/state/state.context";
import { Action, ActionType } from "@/state/action";

import "../styles/login.css";
import { PbUtils } from "@/pb.utils";

interface Props {
  setIsRegistering: (isRegistering: boolean) => void;
}

const Login = ({ setIsRegistering }: Props) => {
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
      await PbUtils.login(username, password);
      console.log("User logged in:", username);
      trackEvent({
        category: "User",
        action: "login",
        name: username,
      });

      const loginAction: Action = {
        type: ActionType.SET_LOGGED,
        payload: {
          isLogged: true,
          username: PbUtils.getUsername(),
        },
      };

      dispatch && dispatch(loginAction);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRegistering(true);
  };

  return (
    <div className="container center">
      <div className="login_modal">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account? <a href="/" onClick={handleRegister}>Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
