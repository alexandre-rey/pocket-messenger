import { Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import ChannelsList from "./components/ChannelsList";
import ChatRoom from "./components/ChatRoom";

function App() {
  return (
    <Routes>
      <Route element={<Login />} path="/" />
      <Route element={<ChannelsList />} path="/channels" />
      <Route element={<ChatRoom />} path="/channels/:id" />
    </Routes>
  );
}

export default App;
