import React from "react";
import boardContext from "./board-context";
import { useState } from "react";
const BoardProvider = ({ children }) => {
  const [activeToolItem, setActiveToolItem] = useState("A");
  const handleToolItemClick = (tool) => {
    setActiveToolItem(tool);
  };
  const boardContextValue = {
    activeToolItem,
    handleToolItemClick,
  };
  return (
    <boardContext.Provider value={boardContextValue}>
      {children}
    </boardContext.Provider>
  );
};

export default BoardProvider;
