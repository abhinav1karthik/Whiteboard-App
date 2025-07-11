import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import boardContext from "../store/board-context";
import ToolboxProvider from "../store/ToolboxProvider";
import Board from "../components/Board";
import Toolbar from "../components/Toolbar";
import Toolbox from "../components/Toolbox";
import Sidebar from "../components/Sidebar";

const CanvasPage = () => {
  const { canvasId } = useParams();
  const [canvas, setCanvas] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const token = localStorage.getItem("whiteboard_user_token");

  const boardCtx = useContext(boardContext);
  const { setCanvasId, setElements, setHistory, setUserLoginStatus } = boardCtx;

  useEffect(() => {
    const fetchCanvas = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/canvas/${canvasId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCanvas(response.data);
        setCanvasId(response.data._id);
        setElements(response.data.elements);
        setHistory(response.data.elements);
      } catch (error) {
        console.error("Failed to load canvas:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserEmail(response.data.email);
        setUserLoginStatus(true);
      } catch (error) {
        console.error("Failed to load user info:", error);
        setUserLoginStatus(false);
      }
    };

    if (token) {
      fetchCanvas();
      fetchUser();
    }
  }, [canvasId, token]);

  if (!canvas) return <p>Loading canvas...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <div
        style={{
          marginBottom: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
        }}
      >
        <h2>Canvas Metadata</h2>
        <p>
          <strong>Canvas ID:</strong> {canvas._id}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(canvas.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>User Email:</strong> {userEmail || "Loading..."}
        </p>
      </div>

      {/* Main Canvas */}
      <div>
        <ToolboxProvider>
          <div className="app-container">
            <Toolbar />
            <Board />
            <Toolbox />
            <Sidebar />
          </div>
        </ToolboxProvider>
      </div>
    </div>
  );
};

export default CanvasPage;
