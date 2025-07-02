import React, { useContext, useState } from "react";
import classes from "./index.module.css";
import cx from "classnames";
import boardContext from "../../store/board-context";

const Toolbar = () => {
  const { activeToolItem, handleToolItemClick } = useContext(boardContext);

  return (
    <div className={classes.container}>
      <div className={classes.toolItem}>A</div>
      <div className={classes.toolItem}>B</div>
    </div>
  );
};

export default Toolbar;
