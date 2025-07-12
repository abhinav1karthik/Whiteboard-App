import React, { useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import axios from "axios";

import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import Toolbox from "./components/Toolbox";
import Sidebar from "./components/Sidebar";

import BoardProvider from "./store/BoardProvider";
import ToolboxProvider from "./store/ToolboxProvider";
import boardContext from "./store/board-context";

import Login from "./components/Login";
import Register from "./components/Register";

// HomePage component handles both "/" and "/canvas/:id"
function HomePage() {
  const { id } = useParams();
  const token = localStorage.getItem("whiteboard_user_token");

  const { setCanvasId, setElements, setHistory, setUserLoginStatus } =
    useContext(boardContext);

  // Set login status on initial mount
  useEffect(() => {
    setUserLoginStatus(!!token);
  }, [token]); // not including setter functions here prevents infinite loop

  // Load canvas only when `id` changes
  useEffect(() => {
    if (!token || !id) return;

    setCanvasId(id);
    axios
      .get(`http://localhost:5000/api/canvas/load/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setElements(res.data.elements || []);
        setHistory(res.data.elements || []);
      })
      .catch((err) => {
        console.error("Failed to load canvas", err);
        // Optional: Redirect to "/" or show error
      });
  }, [id, token]); // DO NOT include setters here

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

// App wraps everything inside BoardProvider and defines routes
export default function App() {
  return (
    <BoardProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/canvas/:id" element={<HomePage />} />
        </Routes>
      </Router>
    </BoardProvider>
  );
}
