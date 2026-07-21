// src/components/Resizable.tsx
import React2 from "react";
import { useEditorRef, useElement, usePath } from "@udecode/plate/react";

// src/utils/isTouchEvent.ts
var isTouchEvent = (event) => "touches" in event;

// src/utils/resizeLengthToRelative.ts
var resizeLengthToRelative = (length, parentLength) => {
  if (typeof length === "number") {
    return `${length / parentLength * 100}%`;
  }
  return length;
};

// src/utils/resizeLengthToStatic.ts
var resizeLengthToStatic = (length, parentLength) => {
  if (typeof length === "string") {
    return parentLength * Number.parseFloat(length) / 100;
  }
  return length;
};

// src/utils/resizeLengthClamp.ts
var resizeLengthClampStatic = (length, { max, min }) => {
  if (min !== void 0) {
    length = Math.max(length, min);
  }
  if (max !== void 0) {
    length = Math.min(length, max);
  }
  return length;
};
var resizeLengthClamp = (length, parentLength, { max, min }) => {
  const staticLength = resizeLengthToStatic(length, parentLength);
  const clampedStaticLength = resizeLengthClampStatic(staticLength, {
    max: max === void 0 ? void 0 : resizeLengthToStatic(max, parentLength),
    min: min === void 0 ? void 0 : resizeLengthToStatic(min, parentLength)
  });
  switch (typeof length) {
    case "number": {
      return clampedStaticLength;
    }
    case "string": {
      return resizeLengthToRelative(clampedStaticLength, parentLength);
    }
    default: {
      throw new Error("Invalid length type");
    }
  }
};

// src/components/ResizeHandle.tsx
import React from "react";
import {
  createAtomStore,
  createPrimitiveComponent,
  useReadOnly
} from "@udecode/plate/react";
var initialState = {
  onResize: null
};
var {
  ResizeHandleProvider,
  useResizeHandleSet,
  useResizeHandleStore,
  useResizeHandleValue
} = createAtomStore(initialState, {
  name: "resizeHandle",
  suppressWarnings: true
});
var useResizeHandleState = ({
  direction = "left",
  initialSize: _initialSize,
  onHover,
  onHoverEnd,
  onMouseDown,
  onResize: onResizeProp,
  onTouchStart
}) => {
  const readOnly = useReadOnly();
  const onResizeStore = useResizeHandleValue("onResize");
  const onResize = onResizeProp ?? onResizeStore;
  const [isResizing, setIsResizing] = React.useState(false);
  const [initialPosition, setInitialPosition] = React.useState(0);
  const [initialSizeState, setInitialSize] = React.useState(0);
  const initialSize = _initialSize ?? initialSizeState;
  const isHorizontal = direction === "left" || direction === "right";
  React.useEffect(() => {
    if (!isResizing) return;
    const sendResizeEvent = (event, finished) => {
      const { clientX, clientY } = isTouchEvent(event) ? event.touches[0] || event.changedTouches[0] : event;
      const currentPosition = isHorizontal ? clientX : clientY;
      const delta = currentPosition - initialPosition;
      onResize({
        delta,
        direction,
        finished,
        initialSize
      });
    };
    const handleMouseMove = (event) => sendResizeEvent(event, false);
    const handleMouseUp = (event) => {
      setIsResizing(false);
      onHoverEnd?.();
      sendResizeEvent(event, true);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [
    isResizing,
    initialPosition,
    initialSize,
    onResize,
    isHorizontal,
    onHoverEnd,
    direction
  ]);
  return {
    direction,
    initialPosition,
    initialSize,
    isHorizontal,
    isResizing,
    readOnly,
    setInitialPosition,
    setInitialSize,
    setIsResizing,
    onHover,
    onHoverEnd,
    onMouseDown,
    onResize,
    onTouchStart
  };
};
var useResizeHandle = ({
  isHorizontal,
  isResizing,
  readOnly,
  setInitialPosition,
  setInitialSize,
  setIsResizing,
  onHover,
  onHoverEnd,
  onMouseDown,
  onTouchStart
}) => {
  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;
    setInitialPosition(isHorizontal ? clientX : clientY);
    const element = event.target.parentElement;
    setInitialSize(isHorizontal ? element.offsetWidth : element.offsetHeight);
    setIsResizing(true);
    onMouseDown?.(event);
  };
  const handleTouchStart = (event) => {
    const { touches } = event;
    const touch = touches[0];
    const { clientX, clientY } = touch;
    setInitialPosition(isHorizontal ? clientX : clientY);
    const element = event.target.parentElement;
    setInitialSize(isHorizontal ? element.offsetWidth : element.offsetHeight);
    setIsResizing(true);
    onTouchStart?.(event);
  };
  const handleMouseOver = () => {
    onHover?.();
  };
  const handleMouseOut = () => {
    if (!isResizing) {
      onHoverEnd?.();
    }
  };
  return {
    hidden: readOnly,
    props: {
      onMouseDown: handleMouseDown,
      onMouseOut: handleMouseOut,
      onMouseOver: handleMouseOver,
      onTouchEnd: handleMouseOut,
      onTouchMove: handleMouseOver,
      onTouchStart: handleTouchStart
    }
  };
};
var ResizeHandle = createPrimitiveComponent("div")({
  propsHook: useResizeHandle,
  stateHook: useResizeHandleState
});

// src/components/useResizableStore.ts
import { createAtomStore as createAtomStore2 } from "@udecode/plate/react";
var {
  ResizableProvider,
  resizableStore,
  useResizableSet,
  useResizableStore,
  useResizableValue
} = createAtomStore2(
  {
    width: 0
  },
  { name: "resizable" }
);

// src/components/Resizable.tsx
var useResizableState = ({
  align = "center",
  maxWidth = "100%",
  minWidth = 92
} = {}) => {
  const editor = useEditorRef();
  const element = useElement();
  const path = usePath();
  const nodeWidth = element?.width ?? "100%";
  const width = useResizableValue("width");
  const setWidth = useResizableSet("width");
  const setNodeWidth = React2.useCallback(
    (w) => {
      if (w === nodeWidth) {
        editor.tf.select(path);
      } else {
        editor.tf.setNodes({ width: w }, { at: path });
      }
    },
    [editor, nodeWidth, path]
  );
  React2.useEffect(() => {
    setWidth(nodeWidth);
  }, [nodeWidth, setWidth]);
  return {
    align,
    maxWidth,
    minWidth,
    setNodeWidth,
    setWidth,
    width
  };
};
var useResizable = ({
  align,
  maxWidth,
  minWidth,
  setNodeWidth,
  setWidth,
  width
}) => {
  const wrapperRef = React2.useRef(null);
  return {
    context: {
      onResize: React2.useCallback(
        ({ delta, direction, finished, initialSize }) => {
          const wrapperStaticWidth = wrapperRef.current.offsetWidth;
          const deltaFactor = (align === "center" ? 2 : 1) * (direction === "left" ? -1 : 1);
          const newWidth = resizeLengthClamp(
            initialSize + delta * deltaFactor,
            wrapperStaticWidth,
            {
              max: maxWidth,
              min: minWidth
            }
          );
          if (finished) {
            setNodeWidth(newWidth);
          } else {
            setWidth(newWidth);
          }
        },
        [align, maxWidth, minWidth, setNodeWidth, setWidth]
      )
    },
    props: {
      style: {
        maxWidth,
        minWidth,
        position: "relative",
        width
      }
    },
    wrapperProps: {
      style: {
        position: "relative"
      }
    },
    wrapperRef
  };
};
var Resizable = React2.forwardRef(({ children, options, ...rest }, ref) => {
  const state = useResizableState(options);
  const { context, props, wrapperProps, wrapperRef } = useResizable(state);
  return /* @__PURE__ */ React2.createElement("div", { ref: wrapperRef, ...wrapperProps }, /* @__PURE__ */ React2.createElement("div", { ref, ...props, ...rest }, /* @__PURE__ */ React2.createElement(ResizeHandleProvider, { onResize: context.onResize }, children)));
});
Resizable.displayName = "Resizable";
export {
  Resizable,
  ResizableProvider,
  ResizeHandle,
  ResizeHandleProvider,
  isTouchEvent,
  resizableStore,
  resizeLengthClamp,
  resizeLengthClampStatic,
  resizeLengthToRelative,
  resizeLengthToStatic,
  useResizable,
  useResizableSet,
  useResizableState,
  useResizableStore,
  useResizableValue,
  useResizeHandle,
  useResizeHandleSet,
  useResizeHandleState,
  useResizeHandleStore,
  useResizeHandleValue
};
//# sourceMappingURL=index.mjs.map