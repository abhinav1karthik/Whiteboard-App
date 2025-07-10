import React, { useState, useEffect } from "react";
import axios from "axios";

const Sidebar = () => {
  const token = localStorage.getItem("whiteboard_user_token");
  const [canvases, setCanvases] = useState([]);

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

  useEffect(() => {
    fetchCanvases();
  }, []);

  return null;
};

export default Sidebar;
