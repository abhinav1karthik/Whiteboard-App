import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import Toolbox from "./components/Toolbox";
import BoardProvider from "./store/BoardProvider";
import ToolboxProvider from "./store/ToolboxProvider";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/data")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <BoardProvider>
      <ToolboxProvider>
        <Toolbar />

        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            padding: "8px",
            background: "#f0f0f0",
            borderRadius: "4px",
            fontSize: "0.9rem",
          }}
        >
          {data ? data.message : "Loading…"}
        </div>

        <Board />
        <Toolbox />
      </ToolboxProvider>
    </BoardProvider>
  );
}

export default App;
