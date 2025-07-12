import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";
import toolboxContext from "../../store/toolbox-context";
import socket from "../../utils/socket";
import classes from "./index.module.css";
import { getSvgPathFromStroke } from "../../utils/element";
import getStroke from "perfect-freehand";

function Board({ id }) {
  const canvasRef = useRef();
  const textAreaRef = useRef();
  const isMounted = useRef(true);
  const [isAuthorized, setIsAuthorized] = useState(true);

  const {
    elements,
    toolActionType,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
    setSyncedElements,
  } = useContext(boardContext);

  const { toolboxState } = useContext(toolboxContext);

  // Setup socket handlers
  useEffect(() => {
    if (!id) return;

    isMounted.current = true;

    const handleLoadCanvas = (initialElements) => {
      if (isMounted.current) {
        setSyncedElements(initialElements);
      }
    };

    const handleUpdate = (updatedElements) => {
      if (isMounted.current) {
        setSyncedElements(updatedElements);
      }
    };

    const handleUnauthorized = (data) => {
      if (isMounted.current) {
        console.log("Unauthorized access:", data.message);
        alert(data.message || "Access Denied: You cannot edit this canvas.");
        setIsAuthorized(false);
      }
    };

    // Register socket listeners
    socket.on("loadCanvas", handleLoadCanvas);
    socket.on("receiveDrawingUpdate", handleUpdate);
    socket.on("unauthorized", handleUnauthorized);

    // Join canvas room
    socket.emit("joinCanvas", { canvasId: id });
    console.log("Joining canvas:", id);

    return () => {
      // Cleanup on unmount or id change
      isMounted.current = false;
      socket.emit("leaveCanvas", { canvasId: id });
      console.log("Leaving canvas:", id);

      // Remove listeners
      socket.off("loadCanvas", handleLoadCanvas);
      socket.off("receiveDrawingUpdate", handleUpdate);
      socket.off("unauthorized", handleUnauthorized);
    };
  }, [id, setSyncedElements]);

  // Canvas rendering
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");

    // Set initial size
    if (
      canvas.width !== window.innerWidth ||
      canvas.height !== window.innerHeight
    ) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      if (!element) return;

      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          if (element.roughEle) {
            roughCanvas.draw(element.roughEle);
          }
          break;

        case TOOL_ITEMS.BRUSH:
          if (element.points?.length > 0) {
            context.fillStyle = element.stroke || "#000000";
            const path = new Path2D(
              getSvgPathFromStroke(getStroke(element.points))
            );
            context.fill(path);
          }
          break;

        case TOOL_ITEMS.TEXT:
          if (element.text) {
            context.textBaseline = "top";
            context.font = `${element.size || 16}px Caveat`;
            context.fillStyle = element.stroke || "#000000";
            context.fillText(element.text, element.x1, element.y1);
          }
          break;

        default:
          console.warn("Unhandled element type:", element.type);
      }
    });
  }, [elements]);

  // Text input focus
  useEffect(() => {
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.focus();
        }
      }, 10);
    }
  }, [toolActionType]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (event) => {
      if (!isAuthorized) return;
      boardMouseDownHandler(event, toolboxState);
    },
    [isAuthorized, boardMouseDownHandler, toolboxState]
  );

  const handleMouseMove = useCallback(
    (event) => {
      if (!isAuthorized || toolActionType !== TOOL_ACTION_TYPES.DRAWING) return;
      boardMouseMoveHandler(event);
    },
    [isAuthorized, toolActionType, boardMouseMoveHandler]
  );

  const handleMouseUp = useCallback(() => {
    if (!isAuthorized) return;
    boardMouseUpHandler();

    // Only send update if we have elements
    if (elements.length > 0) {
      socket.emit("drawingUpdate", { canvasId: id, elements });
    }
  }, [isAuthorized, boardMouseUpHandler, elements, id]);

  return (
    <>
      {toolActionType === TOOL_ACTION_TYPES.WRITING && (
        <textarea
          ref={textAreaRef}
          className={classes.textElementBox}
          style={{
            top: elements[elements.length - 1]?.y1 || 0,
            left: elements[elements.length - 1]?.x1 || 0,
            fontSize: `${elements[elements.length - 1]?.size || 16}px`,
            color: elements[elements.length - 1]?.stroke || "#000000",
          }}
          onBlur={(event) => textAreaBlurHandler(event.target.value)}
        />
      )}
      <canvas
        ref={canvasRef}
        id="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
}

export default Board;
