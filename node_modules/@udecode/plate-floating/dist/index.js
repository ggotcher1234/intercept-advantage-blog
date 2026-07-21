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
  FloatingArrow: () => import_react3.FloatingArrow,
  FloatingDelayGroup: () => import_react3.FloatingDelayGroup,
  FloatingFocusManager: () => import_react3.FloatingFocusManager,
  FloatingNode: () => import_react3.FloatingNode,
  FloatingOverlay: () => import_react3.FloatingOverlay,
  FloatingPortal: () => import_react3.FloatingPortal,
  FloatingTree: () => import_react3.FloatingTree,
  arrow: () => import_react3.arrow,
  autoPlacement: () => import_react3.autoPlacement,
  autoUpdate: () => import_react3.autoUpdate,
  computePosition: () => import_react3.computePosition,
  createVirtualElement: () => createVirtualElement,
  createVirtualRef: () => createVirtualRef,
  detectOverflow: () => import_react3.detectOverflow,
  flip: () => import_react3.flip,
  getBoundingClientRect: () => getBoundingClientRect,
  getDOMSelectionBoundingClientRect: () => getDOMSelectionBoundingClientRect,
  getDefaultBoundingClientRect: () => getDefaultBoundingClientRect,
  getOverflowAncestors: () => import_react3.getOverflowAncestors,
  getRangeBoundingClientRect: () => getRangeBoundingClientRect,
  getSelectionBoundingClientRect: () => getSelectionBoundingClientRect,
  hide: () => import_react3.hide,
  inline: () => import_react3.inline,
  limitShift: () => import_react3.limitShift,
  makeClientRect: () => makeClientRect,
  mergeClientRects: () => mergeClientRects,
  offset: () => import_react3.offset,
  safePolygon: () => import_react3.safePolygon,
  shift: () => import_react3.shift,
  size: () => import_react3.size,
  useClick: () => import_react3.useClick,
  useDelayGroup: () => import_react3.useDelayGroup,
  useDelayGroupContext: () => import_react3.useDelayGroupContext,
  useDismiss: () => import_react3.useDismiss,
  useFloating: () => import_react3.useFloating,
  useFloatingNodeId: () => import_react3.useFloatingNodeId,
  useFloatingParentNodeId: () => import_react3.useFloatingParentNodeId,
  useFloatingPortalNode: () => import_react3.useFloatingPortalNode,
  useFloatingToolbar: () => useFloatingToolbar,
  useFloatingToolbarState: () => useFloatingToolbarState,
  useFloatingTree: () => import_react3.useFloatingTree,
  useFocus: () => import_react3.useFocus,
  useHover: () => import_react3.useHover,
  useId: () => import_react3.useId,
  useInteractions: () => import_react3.useInteractions,
  useListNavigation: () => import_react3.useListNavigation,
  useRole: () => import_react3.useRole,
  useTypeahead: () => import_react3.useTypeahead,
  useVirtualFloating: () => useVirtualFloating
});
module.exports = __toCommonJS(index_exports);

// src/createVirtualElement.ts
var getDefaultBoundingClientRect = () => ({
  bottom: 9999,
  height: 0,
  left: -9999,
  right: 9999,
  top: -9999,
  width: 0,
  x: 0,
  y: 0
});
var createVirtualElement = () => ({
  getBoundingClientRect: getDefaultBoundingClientRect
});

// src/hooks/useFloatingToolbar.ts
var import_react = __toESM(require("react"));
var import_plate = require("@udecode/plate");
var import_react2 = require("@udecode/plate/react");
var useFloatingToolbarState = ({
  editorId,
  floatingOptions,
  focusedEditorId,
  hideToolbar,
  showWhenReadOnly
}) => {
  const editor = (0, import_react2.useEditorRef)();
  const selectionExpanded = (0, import_react2.useEditorSelector)(
    () => editor.api.isExpanded(),
    []
  );
  const selectionText = (0, import_react2.useEditorSelector)(() => editor.api.string(), []);
  const readOnly = (0, import_react2.useEditorReadOnly)();
  const focused = (0, import_react2.useFocused)();
  const [open, setOpen] = import_react.default.useState(false);
  const [waitForCollapsedSelection, setWaitForCollapsedSelection] = import_react.default.useState(false);
  const [mousedown, setMousedown] = import_react.default.useState(false);
  const floating = useVirtualFloating(
    (0, import_plate.mergeProps)(
      {
        open,
        getBoundingClientRect: () => getSelectionBoundingClientRect(editor),
        onOpenChange: setOpen
      },
      floatingOptions
    )
  );
  return {
    editorId,
    floating,
    focused,
    focusedEditorId,
    hideToolbar,
    mousedown,
    open,
    readOnly,
    selectionExpanded,
    selectionText,
    setMousedown,
    setOpen,
    setWaitForCollapsedSelection,
    showWhenReadOnly,
    waitForCollapsedSelection
  };
};
var useFloatingToolbar = ({
  editorId,
  floating,
  focusedEditorId,
  hideToolbar,
  mousedown,
  open,
  readOnly,
  selectionExpanded,
  selectionText,
  setMousedown,
  setOpen,
  setWaitForCollapsedSelection,
  showWhenReadOnly,
  waitForCollapsedSelection
}) => {
  import_react.default.useEffect(() => {
    if (!(editorId === focusedEditorId)) {
      setWaitForCollapsedSelection(true);
    }
    if (!selectionExpanded) {
      setWaitForCollapsedSelection(false);
    }
  }, [
    editorId,
    focusedEditorId,
    selectionExpanded,
    setWaitForCollapsedSelection
  ]);
  import_react.default.useEffect(() => {
    const mouseup = () => setMousedown(false);
    const mousedown2 = () => setMousedown(true);
    document.addEventListener("mouseup", mouseup);
    document.addEventListener("mousedown", mousedown2);
    return () => {
      document.removeEventListener("mouseup", mouseup);
      document.removeEventListener("mousedown", mousedown2);
    };
  }, []);
  import_react.default.useEffect(() => {
    if (!selectionExpanded || !selectionText || mousedown && !open || hideToolbar || readOnly && !showWhenReadOnly) {
      setOpen(false);
    } else if (selectionText && selectionExpanded && (!waitForCollapsedSelection || readOnly)) {
      setOpen(true);
    }
  }, [
    setOpen,
    editorId,
    focusedEditorId,
    hideToolbar,
    showWhenReadOnly,
    selectionExpanded,
    selectionText,
    mousedown,
    waitForCollapsedSelection,
    open,
    readOnly
  ]);
  const { update } = floating;
  (0, import_react2.useEditorSelector)(() => {
    update?.();
  }, [update]);
  const clickOutsideRef = (0, import_react2.useOnClickOutside)(
    () => {
      setOpen(false);
    },
    {
      ignoreClass: "ignore-click-outside/toolbar"
    }
  );
  return {
    clickOutsideRef,
    hidden: !open,
    props: {
      style: floating.style
    },
    ref: floating.refs.setFloating
  };
};

// src/hooks/useVirtualFloating.ts
var import_react4 = __toESM(require("react"));
var import_react5 = require("@udecode/plate/react");

// src/libs/floating-ui.ts
var import_react3 = require("@floating-ui/react");

// src/hooks/useVirtualFloating.ts
var useVirtualFloating = ({
  getBoundingClientRect: getBoundingClientRect2 = getDefaultBoundingClientRect,
  ...floatingOptions
}) => {
  const virtualElementRef = import_react4.default.useRef(createVirtualElement());
  const [visible, setVisible] = import_react4.default.useState(true);
  const floatingResult = (0, import_react3.useFloating)({
    // update on scroll and resize
    whileElementsMounted: import_react3.autoUpdate,
    ...floatingOptions
  });
  const { middlewareData, refs, strategy, update, x, y } = floatingResult;
  (0, import_react5.useIsomorphicLayoutEffect)(() => {
    virtualElementRef.current.getBoundingClientRect = getBoundingClientRect2;
  }, [getBoundingClientRect2, update]);
  (0, import_react5.useIsomorphicLayoutEffect)(() => {
    refs.setReference(virtualElementRef.current);
  }, [refs]);
  (0, import_react5.useIsomorphicLayoutEffect)(() => {
    if (!middlewareData?.hide) return;
    const { referenceHidden } = middlewareData.hide;
    setVisible(!referenceHidden);
  }, [middlewareData.hide]);
  return {
    ...floatingResult,
    style: {
      display: floatingOptions.open === false ? "none" : void 0,
      left: x ?? 0,
      position: strategy,
      top: y ?? 0,
      visibility: visible ? void 0 : "hidden"
    },
    virtualElementRef
  };
};

// src/utils/getBoundingClientRect.ts
var import_plate2 = require("@udecode/plate");

// src/utils/makeClientRect.ts
var makeClientRect = ({
  bottom,
  left,
  right,
  top
}) => {
  const width = right - left;
  const height = bottom - top;
  const props = {
    bottom,
    height,
    left,
    right,
    top,
    width,
    x: left,
    y: top
  };
  return {
    ...props,
    toJSON: () => props
  };
};

// src/utils/mergeClientRects.ts
var mergeClientRects = (clientRects) => {
  if (clientRects.length === 0) {
    throw new Error("clientRects should not be empty");
  }
  return makeClientRect({
    bottom: Math.max(...clientRects.map((rect) => rect.bottom)),
    left: Math.min(...clientRects.map((rect) => rect.left)),
    right: Math.max(...clientRects.map((rect) => rect.right)),
    top: Math.min(...clientRects.map((rect) => rect.top))
  });
};

// src/utils/getBoundingClientRect.ts
var getBoundingClientRect = (editor, at) => {
  const atRanges = (() => {
    if (!at) return [editor.selection].filter(Boolean);
    const atArray = Array.isArray(at) && !import_plate2.PathApi.isPath(at) ? at : [at];
    return atArray.map((location) => editor.api.range(location));
  })();
  const clientRects = atRanges.map((range) => editor.api.toDOMRange(range)?.getBoundingClientRect()).filter(Boolean);
  if (clientRects.length === 0) return void 0;
  return mergeClientRects(clientRects);
};

// src/utils/createVirtualRef.ts
var createVirtualRef = (editor, at, {
  fallbackRect
} = {}) => ({
  current: {
    getBoundingClientRect: () => {
      const rect = getBoundingClientRect(editor, at) || fallbackRect;
      if (!rect) {
        throw new Error(
          "Could not get the bounding client rect of the location. Please provide a fallbackRect."
        );
      }
      return rect;
    }
  }
});

// src/utils/getDOMSelectionBoundingClientRect.ts
var getDOMSelectionBoundingClientRect = () => {
  const domSelection = window.getSelection();
  if (!domSelection || domSelection.rangeCount < 1) {
    return getDefaultBoundingClientRect();
  }
  const domRange = domSelection.getRangeAt(0);
  return domRange.getBoundingClientRect();
};

// src/utils/getRangeBoundingClientRect.ts
var getRangeBoundingClientRect = (editor, at) => {
  if (!at) return getDefaultBoundingClientRect();
  const domRange = editor.api.toDOMRange(at);
  if (!domRange) return getDefaultBoundingClientRect();
  return domRange.getBoundingClientRect();
};

// src/utils/getSelectionBoundingClientRect.ts
var getSelectionBoundingClientRect = (editor) => {
  if (editor.api.isExpanded()) {
    return getRangeBoundingClientRect(editor, editor.selection);
  }
  return getDefaultBoundingClientRect();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FloatingArrow,
  FloatingDelayGroup,
  FloatingFocusManager,
  FloatingNode,
  FloatingOverlay,
  FloatingPortal,
  FloatingTree,
  arrow,
  autoPlacement,
  autoUpdate,
  computePosition,
  createVirtualElement,
  createVirtualRef,
  detectOverflow,
  flip,
  getBoundingClientRect,
  getDOMSelectionBoundingClientRect,
  getDefaultBoundingClientRect,
  getOverflowAncestors,
  getRangeBoundingClientRect,
  getSelectionBoundingClientRect,
  hide,
  inline,
  limitShift,
  makeClientRect,
  mergeClientRects,
  offset,
  safePolygon,
  shift,
  size,
  useClick,
  useDelayGroup,
  useDelayGroupContext,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingPortalNode,
  useFloatingToolbar,
  useFloatingToolbarState,
  useFloatingTree,
  useFocus,
  useHover,
  useId,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
  useVirtualFloating
});
//# sourceMappingURL=index.js.map