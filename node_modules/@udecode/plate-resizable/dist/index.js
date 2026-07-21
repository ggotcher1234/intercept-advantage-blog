"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Resizable: () => Resizable,
  ResizableProvider: () => ResizableProvider,
  ResizeHandle: () => ResizeHandle,
  ResizeHandleProvider: () => ResizeHandleProvider,
  isTouchEvent: () => isTouchEvent,
  resizableStore: () => resizableStore,
  resizeLengthClamp: () => resizeLengthClamp,
  resizeLengthClampStatic: () => resizeLengthClampStatic,
  resizeLengthToRelative: () => resizeLengthToRelative,
  resizeLengthToStatic: () => resizeLengthToStatic,
  useResizable: () => useResizable,
  useResizableSet: () => useResizableSet,
  useResizableState: () => useResizableState,
  useResizableStore: () => useResizableStore,
  useResizableValue: () => useResizableValue,
  useResizeHandle: () => useResizeHandle,
  useResizeHandleSet: () => useResizeHandleSet,
  useResizeHandleState: () => useResizeHandleState,
  useResizeHandleStore: () => useResizeHandleStore,
  useResizeHandleValue: () => useResizeHandleValue
});
module.exports = __toCommonJS(index_exports);

// src/components/Resizable.tsx
var import_react4 = __toESM(require("react"));
var import_react5 = require("@udecode/plate/react");

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
var import_react = __toESM(require("react"));
var import_react2 = require("@udecode/plate/react");
var initialState = {
  onResize: null
};
var {
  ResizeHandleProvider,
  useResizeHandleSet,
  useResizeHandleStore,
  useResizeHandleValue
} = (0, import_react2.createAtomStore)(initialState, {
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
  const readOnly = (0, import_react2.useReadOnly)();
  const onResizeStore = useResizeHandleValue("onResize");
  const onResize = onResizeProp ?? onResizeStore;
  const [isResizing, setIsResizing] = import_react.default.useState(false);
  const [initialPosition, setInitialPosition] = import_react.default.useState(0);
  const [initialSizeState, setInitialSize] = import_react.default.useState(0);
  const initialSize = _initialSize ?? initialSizeState;
  const isHorizontal = direction === "left" || direction === "right";
  import_react.default.useEffect(() => {
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
var ResizeHandle = (0, import_react2.createPrimitiveComponent)("div")({
  propsHook: useResizeHandle,
  stateHook: useResizeHandleState
});

// src/components/useResizableStore.ts
var import_react3 = require("@udecode/plate/react");
var {
  ResizableProvider,
  resizableStore,
  useResizableSet,
  useResizableStore,
  useResizableValue
} = (0, import_react3.createAtomStore)(
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
  const editor = (0, import_react5.useEditorRef)();
  const element = (0, import_react5.useElement)();
  const path = (0, import_react5.usePath)();
  const nodeWidth = element?.width ?? "100%";
  const width = useResizableValue("width");
  const setWidth = useResizableSet("width");
  const setNodeWidth = import_react4.default.useCallback(
    (w) => {
      if (w === nodeWidth) {
        editor.tf.select(path);
      } else {
        editor.tf.setNodes({ width: w }, { at: path });
      }
    },
    [editor, nodeWidth, path]
  );
  import_react4.default.useEffect(() => {
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
  const wrapperRef = import_react4.default.useRef(null);
  return {
    context: {
      onResize: import_react4.default.useCallback(
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
var Resizable = import_react4.default.forwardRef(({ children, options, ...rest }, ref) => {
  const state = useResizableState(options);
  const { context, props, wrapperProps, wrapperRef } = useResizable(state);
  return /* @__PURE__ */ import_react4.default.createElement("div", { ref: wrapperRef, ...wrapperProps }, /* @__PURE__ */ import_react4.default.createElement("div", { ref, ...props, ...rest }, /* @__PURE__ */ import_react4.default.createElement(ResizeHandleProvider, { onResize: context.onResize }, children)));
});
Resizable.displayName = "Resizable";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.js.map