import { Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route element={<Login />} path="/" />
      <Route element={<Home />} path="/home" />
    </Routes>
  );
}

export default App;
