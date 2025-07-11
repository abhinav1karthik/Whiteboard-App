import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import Toolbox from "./components/Toolbox";
import Sidebar from "./components/Sidebar";
import BoardProvider from "./store/BoardProvider";
import ToolboxProvider from "./store/ToolboxProvider";
import Login from "./components/Login";
import Register from "./components/Register";
import CanvasPage from "./pages/canvasPage";

function HomePage() {
  return (
    <ToolboxProvider>
      <div className="app-container">
        <Toolbar />
        <Board />
        <Toolbox />
        <Sidebar />
      </div>
    </ToolboxProvider>
  );
}

function App() {
  return (
    <BoardProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/load/:canvasId" element={<CanvasPage />} />{" "}
          {/* updated */}
        </Routes>
      </Router>
    </BoardProvider>
  );
}

export default App;
