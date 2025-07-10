import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./index.min.css";
import { useNavigate } from "react-router-dom";
import boardContext from "../../store/board-context";

const Sidebar = () => {
  const [canvases, setCanvases] = useState([]);
  const token = localStorage.getItem("whiteboard_user_token");
  const { isUserLoggedIn } = useContext(boardContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserLoggedIn) {
      fetchCanvases();
    }
  }, [isUserLoggedIn]);

  const fetchCanvases = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/canvas/list",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCanvases(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching canvases:", error);
    }
  };

  const handleCreateCanvas = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/canvas/create",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error creating canvas:", error);
      return null;
    }
  };

  return (
    <div className="sidebar">
      <button
        className="create-button"
        onClick={handleCreateCanvas}
        disabled={!isUserLoggedIn}
      >
        + Create New Canvas
      </button>
    </div>
  );
};

export default Sidebar;
