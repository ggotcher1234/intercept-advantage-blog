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
import React from "react";
import { mergeProps } from "@udecode/plate";
import {
  useEditorReadOnly,
  useEditorRef,
  useEditorSelector,
  useFocused,
  useOnClickOutside
} from "@udecode/plate/react";
var useFloatingToolbarState = ({
  editorId,
  floatingOptions,
  focusedEditorId,
  hideToolbar,
  showWhenReadOnly
}) => {
  const editor = useEditorRef();
  const selectionExpanded = useEditorSelector(
    () => editor.api.isExpanded(),
    []
  );
  const selectionText = useEditorSelector(() => editor.api.string(), []);
  const readOnly = useEditorReadOnly();
  const focused = useFocused();
  const [open, setOpen] = React.useState(false);
  const [waitForCollapsedSelection, setWaitForCollapsedSelection] = React.useState(false);
  const [mousedown, setMousedown] = React.useState(false);
  const floating = useVirtualFloating(
    mergeProps(
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
  React.useEffect(() => {
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
  React.useEffect(() => {
    const mouseup = () => setMousedown(false);
    const mousedown2 = () => setMousedown(true);
    document.addEventListener("mouseup", mouseup);
    document.addEventListener("mousedown", mousedown2);
    return () => {
      document.removeEventListener("mouseup", mouseup);
      document.removeEventListener("mousedown", mousedown2);
    };
  }, []);
  React.useEffect(() => {
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
  useEditorSelector(() => {
    update?.();
  }, [update]);
  const clickOutsideRef = useOnClickOutside(
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
import React2 from "react";
import { useIsomorphicLayoutEffect } from "@udecode/plate/react";

// src/libs/floating-ui.ts
import {
  arrow,
  autoPlacement,
  autoUpdate,
  computePosition,
  detectOverflow,
  flip,
  FloatingArrow,
  FloatingDelayGroup,
  FloatingFocusManager,
  FloatingNode,
  FloatingOverlay,
  FloatingPortal,
  FloatingTree,
  getOverflowAncestors,
  hide,
  inline,
  limitShift,
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
  useFloatingTree,
  useFocus,
  useHover,
  useId,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead
} from "@floating-ui/react";

// src/hooks/useVirtualFloating.ts
var useVirtualFloating = ({
  getBoundingClientRect: getBoundingClientRect2 = getDefaultBoundingClientRect,
  ...floatingOptions
}) => {
  const virtualElementRef = React2.useRef(createVirtualElement());
  const [visible, setVisible] = React2.useState(true);
  const floatingResult = useFloating({
    // update on scroll and resize
    whileElementsMounted: autoUpdate,
    ...floatingOptions
  });
  const { middlewareData, refs, strategy, update, x, y } = floatingResult;
  useIsomorphicLayoutEffect(() => {
    virtualElementRef.current.getBoundingClientRect = getBoundingClientRect2;
  }, [getBoundingClientRect2, update]);
  useIsomorphicLayoutEffect(() => {
    refs.setReference(virtualElementRef.current);
  }, [refs]);
  useIsomorphicLayoutEffect(() => {
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
import {
  PathApi
} from "@udecode/plate";

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
    const atArray = Array.isArray(at) && !PathApi.isPath(at) ? at : [at];
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
export {
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
};
//# sourceMappingURL=index.mjs.map