import { Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import ChannelsList from "./components/ChannelsList";
import ChatRoom from "./components/ChatRoom";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route element={<Login />} path="/" />
      <Route element={<Home />} path="/home" />
      <Route element={<ChannelsList />} path="/channels" />
      <Route element={<ChatRoom />} path="/channels/:id" />
    </Routes>
  );
}

export default App;
