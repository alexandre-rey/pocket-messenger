import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useMatomo } from "@datapunt/matomo-tracker-react";
import { Card, CardBody, CardHeader } from "@nextui-org/card";

import pb from "../pocketbase";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { trackPageView, trackEvent } = useMatomo();

  React.useEffect(() => {
    trackPageView({
      documentTitle: "Login",
      href: "/",
    });
  }, []);

  if (pb.authStore.isValid) {
    navigate("/home");
  }

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
      navigate("/home");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="container mx-auto">
      <Card className="mt-20">
        <CardHeader>
          <h2>Login</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleLogin}>
            <Input
              className="mb-5"
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              className="mb-5"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">Login</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
