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

// src/react/index.ts
var react_exports = {};
__export(react_exports, {
  BLOCK_CONTEXT_MENU_ID: () => BLOCK_CONTEXT_MENU_ID,
  BlockMenuPlugin: () => BlockMenuPlugin,
  BlockSelectionAfterEditable: () => BlockSelectionAfterEditable,
  BlockSelectionPlugin: () => BlockSelectionPlugin,
  CursorOverlayPlugin: () => CursorOverlayPlugin,
  FROZEN_EMPTY_ARRAY: () => FROZEN_EMPTY_ARRAY,
  copySelectedBlocks: () => copySelectedBlocks,
  duplicateBlockSelectionNodes: () => duplicateBlockSelectionNodes,
  getCaretPosition: () => getCaretPosition,
  getCursorOverlayState: () => getCursorOverlayState,
  getSelectionRects: () => getSelectionRects,
  insertBlocksAndSelect: () => insertBlocksAndSelect,
  isSelectingOrFocused: () => isSelectingOrFocused,
  onKeyDownSelection: () => onKeyDownSelection,
  pasteSelectedBlocks: () => pasteSelectedBlocks,
  removeBlockSelectionNodes: () => removeBlockSelectionNodes,
  selectBlockSelectionNodes: () => selectBlockSelectionNodes,
  selectInsertedBlocks: () => selectInsertedBlocks,
  setBlockSelectionIndent: () => setBlockSelectionIndent,
  setBlockSelectionNodes: () => setBlockSelectionNodes,
  setBlockSelectionTexts: () => setBlockSelectionTexts,
  useBlockSelectable: () => useBlockSelectable,
  useBlockSelected: () => useBlockSelected,
  useBlockSelectionFragment: () => useBlockSelectionFragment,
  useBlockSelectionFragmentProp: () => useBlockSelectionFragmentProp,
  useBlockSelectionNodes: () => useBlockSelectionNodes,
  useCursorOverlay: () => useCursorOverlay,
  useIsSelecting: () => useIsSelecting,
  useRefreshOnResize: () => useRefreshOnResize,
  useRequestReRender: () => useRequestReRender,
  useSelectionArea: () => useSelectionArea
});
module.exports = __toCommonJS(react_exports);

// src/react/BlockMenuPlugin.tsx
var import_react = require("@udecode/plate/react");
var BLOCK_CONTEXT_MENU_ID = "context";
var BlockMenuPlugin = (0, import_react.createTPlatePlugin)({
  key: "blockMenu",
  options: {
    openId: null,
    position: {
      x: -1e4,
      y: -1e4
    }
  }
}).extendApi(
  ({ setOption, setOptions }) => ({
    hide: () => {
      setOptions({
        openId: null,
        position: {
          x: -1e4,
          y: -1e4
        }
      });
    },
    show: (id, position) => {
      if (position) {
        setOptions({
          openId: id,
          position
        });
      } else {
        setOption("openId", id);
      }
    }
  })
).extendApi(
  ({ api, editor }) => ({
    showContextMenu: (blockId, position) => {
      editor.getApi({ key: "blockSelection" }).blockSelection?.set(blockId);
      api.blockMenu.show(BLOCK_CONTEXT_MENU_ID, position);
    }
  })
).extend(({ api }) => ({
  handlers: {
    onMouseDown: ({ event, getOptions }) => {
      if (event.button === 0 && getOptions().openId) {
        event.preventDefault();
        api.blockMenu.hide();
      }
      if (event.button === 2) event.preventDefault();
    }
  }
}));

// src/react/BlockSelectionPlugin.tsx
var import_plate12 = require("@udecode/plate");
var import_react21 = require("@udecode/plate/react");

// src/internal/transforms/selectBlocks.ts
var selectBlocks = (editor, at) => {
  const blockSelection = editor.getApi(BlockSelectionPlugin).blockSelection.getNodes();
  const entry = editor.api.node(at);
  if (!entry) return;
  const [element, path] = entry;
  const selectedBlocks = blockSelection.length > 0 ? blockSelection : editor.api.blocks({
    mode: "lowest",
    match: (_, p) => p.length === path.length
  });
  const ids = selectedBlocks.map((block) => block[0].id);
  editor.getApi(BlockSelectionPlugin).blockSelection.set(ids.includes(element.id) ? ids : [element.id]);
};

// src/react/components/BlockSelectionAfterEditable.tsx
var import_react17 = __toESM(require("react"));
var import_react_dom = __toESM(require("react-dom"));
var import_plate6 = require("@udecode/plate");
var import_react18 = require("@udecode/plate/react");

// src/react/hooks/useBlockSelectable.ts
var import_plate = require("@udecode/plate");
var import_react3 = require("@udecode/plate/react");
var useBlockSelectable = () => {
  const element = (0, import_react3.useElement)();
  const path = (0, import_react3.usePath)();
  const { api, editor, getOption, getOptions, setOption } = (0, import_react3.useEditorPlugin)({
    key: "blockSelection"
  });
  const id = element?.id;
  return {
    props: api.blockSelection.isSelectable(element, path) ? {
      className: "slate-selectable",
      onContextMenu: (event) => {
        if (!element) return;
        const { enableContextMenu } = getOptions();
        if (!enableContextMenu) return;
        if (editor.selection?.focus) {
          const nodeEntry = editor.api.above();
          if (nodeEntry && import_plate.PathApi.isCommon(path, nodeEntry[1])) {
            const id2 = nodeEntry[0].id;
            const isSelected = getOption("isSelected", id2);
            const isOpenAlways = event.target.dataset?.plateOpenContextMenu === "true";
            if (!isSelected && !editor.api.isVoid(nodeEntry[0]) && !isOpenAlways) {
              return event.stopPropagation();
            }
          }
        }
        if (id) {
          if (event?.shiftKey) {
            api.blockSelection.add(id);
          } else {
            const selectedIds = getOption("selectedIds");
            const clickAlreadySelected = selectedIds?.has(id);
            if (!clickAlreadySelected) {
              setOption("selectedIds", /* @__PURE__ */ new Set([id]));
            }
          }
        }
      }
    } : {}
  };
};

// src/react/hooks/useBlockSelected.ts
var import_react4 = require("@udecode/plate/react");
var useBlockSelected = (_id) => {
  const { id } = (0, import_react4.useElement)();
  const isBlockSelected = (0, import_react4.usePluginOption)(
    BlockSelectionPlugin,
    "isSelected",
    _id ?? id
  );
  return isBlockSelected;
};

// src/react/hooks/useBlockSelectionNodes.ts
var import_react5 = require("react");
var import_react6 = require("@udecode/plate/react");
function useBlockSelectionNodes() {
  const editor = (0, import_react6.useEditorRef)();
  const selectedIds = (0, import_react6.usePluginOption)(BlockSelectionPlugin, "selectedIds");
  return (0, import_react5.useMemo)(() => {
    return editor.api.blocks({
      at: [],
      match: (n) => !!n.id && selectedIds?.has(n.id)
    });
  }, [editor, selectedIds]);
}
function useBlockSelectionFragment() {
  const nodes = useBlockSelectionNodes();
  return (0, import_react5.useMemo)(() => nodes.map(([node]) => node), [nodes]);
}
function useBlockSelectionFragmentProp(options) {
  const editor = (0, import_react6.useEditorRef)();
  const fragment = useBlockSelectionFragment();
  return (0, import_react5.useMemo)(
    () => editor.api.prop({ nodes: fragment, ...options }),
    [editor.api, fragment, options]
  );
}

// src/react/hooks/useCursorOverlay.ts
var import_react11 = __toESM(require("react"));
var import_react12 = require("@udecode/plate/react");

// src/react/CursorOverlayPlugin.tsx
var import_react7 = require("react");
var import_react8 = require("@udecode/plate/react");
var getRemoveCursorHandler = (id) => ({ api }) => {
  api.cursorOverlay.removeCursor(id);
};
var CursorOverlayPlugin = (0, import_react8.createTPlatePlugin)({
  key: "cursorOverlay",
  options: { cursors: {} }
}).extendApi(
  ({ editor, plugin }) => ({
    addCursor: (id, cursor) => {
      const newCursors = { ...editor.getOptions(plugin).cursors };
      newCursors[id] = {
        id,
        ...cursor
      };
      editor.setOption(plugin, "cursors", newCursors);
    },
    removeCursor: (id) => {
      const newCursors = { ...editor.getOptions(plugin).cursors };
      if (!newCursors[id]) return;
      delete newCursors[id];
      editor.setOption(plugin, "cursors", newCursors);
    }
  })
).overrideEditor(({ api, editor, getOptions, tf: { setSelection } }) => ({
  transforms: {
    setSelection(props) {
      if (getOptions().cursors?.selection) {
        setTimeout(() => {
          api.cursorOverlay.addCursor("selection", {
            selection: editor.selection
          });
        }, 0);
      }
      setSelection(props);
    }
  }
})).extend(() => ({
  handlers: {
    onBlur: ({ api, editor, event }) => {
      if (!editor.selection) return;
      const relatedTarget = event.relatedTarget;
      const enabled = relatedTarget?.dataset?.plateFocus === "true";
      if (!enabled) return;
      api.cursorOverlay.addCursor("selection", {
        selection: editor.selection
      });
    },
    onDragEnd: getRemoveCursorHandler("drag"),
    onDragLeave: getRemoveCursorHandler("drag"),
    onDragOver: ({ api, editor, event }) => {
      if (!editor.plugins.dnd || editor.getOptions({ key: "dnd" }).isDragging) {
        return;
      }
      const types = event.dataTransfer?.types || [];
      if (types.some((type) => type.startsWith("Files"))) return;
      const range = editor.api.findEventRange(event);
      if (!range) return;
      api.cursorOverlay.addCursor("drag", {
        selection: range
      });
    },
    onDrop: getRemoveCursorHandler("drag"),
    onFocus: getRemoveCursorHandler("selection")
  },
  useHooks: ({ api, setOption }) => {
    const isSelecting2 = (0, import_react8.usePluginOption)(BlockSelectionPlugin, "isSelecting");
    (0, import_react7.useEffect)(() => {
      if (isSelecting2) {
        setTimeout(() => {
          api.cursorOverlay.removeCursor("selection");
        }, 0);
      }
    }, [isSelecting2, setOption, api.cursorOverlay]);
  }
}));

// src/react/queries/getCaretPosition.ts
var import_plate2 = require("@udecode/plate");
var getCaretPosition = (selectionRects, range) => {
  const isCollapsed = range && import_plate2.RangeApi.isCollapsed(range);
  const isBackward = range && import_plate2.RangeApi.isBackward(range);
  const anchorRect = selectionRects[isBackward ? 0 : selectionRects.length - 1];
  if (!anchorRect) {
    return null;
  }
  return {
    height: anchorRect.height,
    left: anchorRect.left + (isBackward || isCollapsed ? 0 : anchorRect.width),
    top: anchorRect.top
  };
};

// src/react/queries/getCursorOverlayState.ts
var getCursorOverlayState = ({
  cursors: cursorStates,
  selectionRects
}) => {
  if (!cursorStates) return [];
  return Object.entries(cursorStates).map(([key, cursorState]) => {
    const selection = cursorState?.selection ?? null;
    const rects = selectionRects[key] ?? FROZEN_EMPTY_ARRAY;
    const caretPosition = selection ? getCaretPosition(rects, selection) : null;
    return {
      ...cursorState,
      caretPosition,
      selection,
      selectionRects: rects
    };
  });
};

// src/react/queries/getSelectionRects.ts
var import_plate3 = require("@udecode/plate");
var getSelectionRects = (editor, {
  range,
  xOffset,
  yOffset
}) => {
  const [start, end] = import_plate3.RangeApi.edges(range);
  const domRange = editor.api.toDOMRange(range);
  if (!domRange) {
    return [];
  }
  const selectionRects = [];
  const textEntries = editor.api.nodes({
    at: range,
    match: import_plate3.TextApi.isText
  });
  for (const [textNode, textPath] of textEntries) {
    const domNode = editor.api.toDOMNode(textNode);
    if (!domNode?.parentElement) {
      return [];
    }
    const isStartNode = import_plate3.PathApi.equals(textPath, start.path);
    const isEndNode = import_plate3.PathApi.equals(textPath, end.path);
    let clientRects = null;
    if (isStartNode || isEndNode) {
      const nodeRange = document.createRange();
      nodeRange.selectNode(domNode);
      if (isStartNode) {
        nodeRange.setStart(domRange.startContainer, domRange.startOffset);
      }
      if (isEndNode) {
        nodeRange.setEnd(domRange.endContainer, domRange.endOffset);
      }
      clientRects = nodeRange.getClientRects();
    } else {
      clientRects = domNode.getClientRects();
    }
    for (let i = 0; i < clientRects.length; i++) {
      const clientRect = clientRects.item(i);
      if (!clientRect) {
        continue;
      }
      selectionRects.push({
        height: clientRect.height,
        left: clientRect.left - xOffset,
        top: clientRect.top - yOffset,
        width: clientRect.width
      });
    }
  }
  return selectionRects;
};

// src/react/hooks/useRefreshOnResize.ts
var import_react10 = __toESM(require("react"));

// src/react/hooks/useRequestReRender.ts
var import_react9 = __toESM(require("react"));
var useRequestReRender = () => {
  const [, setUpdateCounter] = import_react9.default.useState(0);
  const animationFrameRef = import_react9.default.useRef(null);
  const requestReRender = import_react9.default.useCallback((immediate = false) => {
    if (animationFrameRef.current && !immediate) {
      return;
    }
    if (!immediate) {
      animationFrameRef.current = requestAnimationFrame(() => {
        setUpdateCounter((state) => state + 1);
        animationFrameRef.current = null;
      });
      return;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setUpdateCounter((state) => state + 1);
  }, []);
  import_react9.default.useEffect(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  });
  import_react9.default.useEffect(
    () => () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    },
    []
  );
  return requestReRender;
};

// src/react/hooks/useRefreshOnResize.ts
var useRefreshOnResize = ({
  containerRef,
  refreshOnResize,
  selectionRectCache
}) => {
  const requestReRender = useRequestReRender();
  const refresh = import_react10.default.useCallback(
    (sync = false) => {
      selectionRectCache.current = /* @__PURE__ */ new WeakMap();
      requestReRender(sync);
    },
    [requestReRender, selectionRectCache]
  );
  import_react10.default.useEffect(() => {
    if (!refreshOnResize || !containerRef?.current) {
      return;
    }
    const resizeObserver = new ResizeObserver(() => refresh());
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [containerRef, refresh, refreshOnResize]);
  return {
    refresh
  };
};

// src/react/hooks/useCursorOverlay.ts
var FROZEN_EMPTY_ARRAY = Object.freeze(
  []
);
var useCursorOverlay = ({
  minSelectionWidth = 1,
  refreshOnResize = true
} = {}) => {
  const editor = (0, import_react12.useEditorRef)();
  const containerRef = (0, import_react12.useEditorContainerRef)();
  const cursorStates = (0, import_react12.usePluginOption)(
    CursorOverlayPlugin,
    "cursors"
  );
  const selectionRectCache = import_react11.default.useRef(
    /* @__PURE__ */ new WeakMap()
  );
  const [selectionRects, setSelectionRects] = import_react11.default.useState({});
  const updateSelectionRects = import_react11.default.useCallback(() => {
    if (!containerRef?.current) return;
    if (!cursorStates) return;
    let xOffset = 0;
    let yOffset = 0;
    if (containerRef) {
      const contentRect = containerRef.current.getBoundingClientRect();
      xOffset = contentRect.x;
      yOffset = contentRect.y;
      yOffset -= containerRef.current.scrollTop;
    }
    let selectionRectsChanged = Object.keys(selectionRects).length !== Object.keys(cursorStates).length;
    const getCachedSelectionRects = ({
      cursor
    }) => {
      const range = cursor.selection;
      if (!range) {
        return FROZEN_EMPTY_ARRAY;
      }
      const cached = selectionRectCache.current.get(range);
      if (cached) {
        return cached;
      }
      const rects = getSelectionRects(editor, { range, xOffset, yOffset }).map(
        (rect) => {
          if (rect.width < minSelectionWidth) {
            return {
              ...rect,
              // Adjust left position to account for minimum width
              left: rect.left - (minSelectionWidth - rect.width) / 2,
              width: minSelectionWidth
            };
          }
          return rect;
        }
      );
      selectionRectsChanged = true;
      selectionRectCache.current.set(range, rects);
      return rects;
    };
    const updated = Object.fromEntries(
      Object.entries(cursorStates).map(([key, cursor]) => [
        key,
        getCachedSelectionRects({
          cursor
        })
      ])
    );
    if (selectionRectsChanged) {
      setSelectionRects(updated);
    }
  }, [containerRef, cursorStates, editor, selectionRects, minSelectionWidth]);
  (0, import_react12.useIsomorphicLayoutEffect)(() => {
    updateSelectionRects();
  });
  const cursors = import_react11.default.useMemo(
    () => getCursorOverlayState({
      cursors: cursorStates,
      selectionRects
    }),
    [cursorStates, selectionRects]
  );
  const { refresh } = useRefreshOnResize({
    containerRef,
    refreshOnResize,
    selectionRectCache
  });
  return { cursors, refresh };
};

// src/react/hooks/useIsSelecting.ts
var import_react14 = require("@udecode/plate/react");

// src/lib/extractSelectableIds.ts
var extractSelectableIds = (els) => {
  return els.map((v) => v.dataset.blockId).filter(Boolean);
};

// src/lib/getAboveDomNode.ts
var querySelectorSelectable = (id) => {
  return document.querySelector(`.slate-selectable[data-block-id="${id}"]`);
};

// src/lib/isSelecting.ts
var isSelecting = (editor) => {
  const isSelectingSome = editor.getOption(
    BlockSelectionPlugin,
    "isSelectingSome"
  );
  const selectionExpanded = editor.api.isExpanded();
  return selectionExpanded || isSelectingSome;
};

// src/react/hooks/useIsSelecting.ts
var isSelectingOrFocused = (editor) => {
  return isSelecting(editor) || editor.api.isFocused();
};
var useIsSelecting = () => {
  const isSelectingSome = (0, import_react14.usePluginOption)(
    BlockSelectionPlugin,
    "isSelectingSome"
  );
  const selectionExpanded = (0, import_react14.useEditorSelector)((editor) => {
    return editor.api.isExpanded();
  }, []);
  return selectionExpanded || isSelectingSome;
};

// src/react/hooks/useSelectionArea.ts
var import_react15 = __toESM(require("react"));
var import_react16 = require("@udecode/plate/react");

// src/internal/EventEmitter.ts
var EventTarget = class {
  _listeners = /* @__PURE__ */ new Map();
  emit = this.dispatchEvent;
  off = this.removeEventListener;
  on = this.addEventListener;
  addEventListener(event, cb) {
    const set = this._listeners.get(event) ?? /* @__PURE__ */ new Set();
    this._listeners.set(event, set);
    set.add(cb);
    return this;
  }
  // Let's also support on, off and emit like node
  dispatchEvent(event, ...data) {
    let ok = true;
    for (const cb of this._listeners.get(event) ?? []) {
      ok = cb(...data) !== false && ok;
    }
    return ok;
  }
  removeEventListener(event, cb) {
    this._listeners.get(event)?.delete(cb);
    return this;
  }
  unbindAllListeners() {
    this._listeners.clear();
  }
};

// src/internal/utils/css.ts
var unitify = (val, unit = "px") => {
  return typeof val === "number" ? val + unit : val;
};
function css({ style }, attr, val) {
  if (typeof attr === "object") {
    for (const [key, value] of Object.entries(attr)) {
      value !== void 0 && (style[key] = unitify(value));
    }
  } else if (val !== void 0) {
    style[attr] = unitify(val);
  }
}

// src/internal/utils/events.ts
var eventListener = (method) => (items, events, fn, options = {}) => {
  if (items instanceof HTMLCollection || items instanceof NodeList) {
    items = Array.from(items);
  } else if (!Array.isArray(items)) {
    items = [items];
  }
  if (!Array.isArray(events)) {
    events = [events];
  }
  for (const el of items) {
    if (el) {
      for (const ev of events) {
        el[method](ev, fn, { capture: false, ...options });
      }
    }
  }
  return [items, events, fn, options];
};
var on = eventListener("addEventListener");
var off = eventListener("removeEventListener");
var simplifyEvent = (evt) => {
  const { clientX, clientY, target } = evt.touches?.[0] ?? evt;
  return { target, x: clientX, y: clientY };
};

// src/internal/utils/intersects.ts
function intersectsScroll(a, b, _ = "touch", container) {
  const containerRect = container.getBoundingClientRect();
  const scrollLeft = container.scrollLeft;
  const scrollTop = container.scrollTop;
  return a.right >= b.left - containerRect.left && a.left + containerRect.left <= b.right + scrollLeft && // 94 is container to top
  a.bottom - scrollTop >= b.top - containerRect.top && a.top <= b.bottom - containerRect.top + scrollTop;
}

// src/internal/utils/selectAll.ts
function selectAll(selector, doc = document) {
  const list = Array.isArray(selector) ? selector : [selector];
  let nodes = [];
  for (let i = 0, l = list.length; i < l; i++) {
    const item = list[i];
    if (typeof item === "string") {
      nodes = nodes.concat(Array.from(doc.querySelectorAll(item)));
    } else if (item instanceof Element) {
      nodes.push(item);
    }
  }
  return nodes;
}

// src/internal/utils/constants.ts
var isTouchDevice = () => matchMedia("(hover: none), (pointer: coarse)").matches;
var isSafariBrowser = () => "safari" in window;

// src/internal/utils/frames.ts
var frames = (fn) => {
  let previousArgs;
  let frameId = -1;
  let lock = false;
  return {
    cancel() {
      cancelAnimationFrame(frameId);
      lock = false;
    },
    next(...args) {
      previousArgs = args;
      if (!lock) {
        lock = true;
        frameId = requestAnimationFrame(() => {
          fn(...previousArgs);
          lock = false;
        });
      }
    }
  };
};

// src/internal/utils/shouldTrigger.ts
function shouldTrigger(event, triggers) {
  for (const trigger of triggers) {
    if (typeof trigger === "number") {
      return event.button === trigger;
    }
    if (typeof trigger === "object") {
      const reqButtonIsPressed = trigger.button === event.button;
      const allReqModifiersArePressed = trigger.modifiers.every((modifier) => {
        switch (modifier) {
          case "alt": {
            return event.altKey;
          }
          case "ctrl": {
            return event.ctrlKey || event.metaKey;
          }
          case "shift": {
            return event.shiftKey;
          }
        }
      });
      return reqButtonIsPressed && allReqModifiersArePressed;
    }
  }
  return false;
}

// src/internal/SelectionArea.ts
var { abs, ceil, max, min } = Math;
var SelectionArea = class extends EventTarget {
  // Area element and clipping element
  _area;
  _areaClientLocation = { x1: 0, x2: 0, y1: 0, y2: 0 };
  // Dynamically constructed area rect
  _areaLocation = { x1: 0, x2: 0, y1: 0, y2: 0 };
  // Caches the position of the selection-area
  _areaRect = new DOMRect();
  _container;
  _containerRect;
  _frame;
  _initScrollDelta = { x: 0, y: 0 };
  _latestElement;
  // Options
  _options;
  // Is getting set on movement.
  _scrollAvailable = true;
  // The scroll distance of scrollElement (body or html) relative to the initial scroll position
  _scrollDelta = { x: 0, y: 0 };
  // If a single click is being performed.
  _scrollingActive = false;
  _scrollSpeed = { x: 0, y: 0 };
  _selectables = [];
  // Selection store
  _selection = {
    changed: {
      added: [],
      // Added elements since last selection
      removed: []
      // Removed elements since last selection
    },
    selected: [],
    stored: [],
    touched: []
  };
  // It's a single-click until the user dragged the mouse.
  _singleClick = true;
  wheelTimer = null;
  disable = this._bindStartEvents.bind(this, false);
  enable = this._bindStartEvents;
  constructor(opt) {
    super();
    this._options = {
      boundaries: ["html"],
      container: "body",
      document: window.document,
      selectables: [],
      selectionAreaClass: "selection-area",
      startAreas: ["html"],
      ...opt,
      behaviour: {
        // TODO: not implemented
        intersect: "touch",
        overlap: "invert",
        triggers: [0],
        ...opt.behaviour,
        scrolling: {
          manualSpeed: 750,
          speedDivider: 0.7,
          ...opt.behaviour?.scrolling,
          startScrollMargins: {
            x: 20,
            y: 40,
            ...opt.behaviour?.scrolling?.startScrollMargins
          }
        },
        startThreshold: opt.behaviour?.startThreshold ? typeof opt.behaviour.startThreshold === "number" ? opt.behaviour.startThreshold : { x: 4, y: 4, ...opt.behaviour.startThreshold } : { x: 4, y: 4 }
      },
      features: {
        range: true,
        touch: true,
        ...opt.features,
        singleTap: {
          allow: true,
          intersect: "native",
          ...opt.features?.singleTap
        }
      }
    };
    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      if (typeof this[key] === "function") {
        this[key] = this[key].bind(this);
      }
    }
    const { document: document2, selectionAreaClass } = this._options;
    this._area = document2.createElement("div");
    this._area.classList.add(selectionAreaClass);
    css(this._area, {
      left: 0,
      position: "absolute",
      top: 0,
      willChange: "top, left, bottom, right, width, height"
    });
    this._frame = frames((evt) => {
      this._recalculateSelectionAreaRect();
      this._updateElementSelection();
      this._emitEvent("move", evt);
      this._redrawSelectionArea();
    });
    this.enable();
  }
  _bindStartEvents(activate = true) {
    const { document: document2, features } = this._options;
    const fn = activate ? on : off;
    fn(document2, "mousedown", this._onTapStart);
    features.touch && fn(document2, "touchstart", this._onTapStart, {
      passive: false
    });
  }
  _delayedTapMove(evt) {
    const {
      behaviour: { startThreshold },
      document: document2
    } = this._options;
    const { x1, y1 } = this._areaLocation;
    const { x1: clientX, y1: clientY } = this._areaClientLocation;
    const { x, y } = simplifyEvent(evt);
    if (
      // Single number for both coordinates
      typeof startThreshold === "number" && abs(x + y - (clientX + clientY)) >= startThreshold || // Different x and y threshold
      typeof startThreshold === "object" && abs(x - x1) >= startThreshold.x || abs(y - y1) >= startThreshold.y
    ) {
      off(document2, ["mousemove", "touchmove"], this._delayedTapMove, {
        passive: false
      });
      if (this._emitEvent("beforedrag", evt) === false) {
        off(document2, ["mouseup", "touchcancel", "touchend"], this._onTapStop);
        return;
      }
      on(document2, ["mousemove", "touchmove"], this._onTapMove, {
        passive: false
      });
      css(this._area, "display", "block");
      this._container.append(this._area);
      this.resolveSelectables();
      this._singleClick = false;
      on(this._container, "wheel", this._manualScroll, { passive: true });
      this._setupSelectionArea();
      this._emitEvent("start", evt);
      this._onTapMove(evt);
    }
    this._handleMoveEvent(evt);
  }
  _emitEvent(name, evt) {
    return this.emit(name, {
      event: evt,
      selection: this,
      store: this._selection
    });
  }
  _handleMoveEvent(evt) {
    const { features } = this._options;
    if (features.touch && isTouchDevice() || this._scrollAvailable && isSafariBrowser()) {
      evt.preventDefault();
    }
  }
  _keepSelection() {
    const { _options, _selection } = this;
    const { changed, selected, stored, touched } = _selection;
    const addedElements = selected.filter((el) => !stored.includes(el));
    switch (_options.behaviour.overlap) {
      case "drop": {
        _selection.stored = [
          ...addedElements,
          ...stored.filter((el) => !touched.includes(el))
          // Elements not touched
        ];
        break;
      }
      case "invert": {
        _selection.stored = [
          ...addedElements,
          ...stored.filter((el) => !changed.removed.includes(el))
          // Elements not removed from selection
        ];
        break;
      }
      case "keep": {
        _selection.stored = [
          ...stored,
          ...selected.filter((el) => !stored.includes(el))
          // Newly added
        ];
        break;
      }
    }
  }
  _manualScroll(evt) {
    this.wheelTimer && clearTimeout(this.wheelTimer);
    const { x, y } = simplifyEvent(evt);
    this.wheelTimer = setTimeout(() => {
      this._areaClientLocation.x2 = x;
      this._areaClientLocation.y2 = y;
      const Ry = y - this._containerRect.top;
      const Rx = x - this._containerRect.left;
      this._areaLocation.x2 = Rx + this._container.scrollLeft;
      this._areaLocation.y2 = Ry + this._container.scrollTop;
      this._frame.next(null);
    }, 100);
  }
  _onScroll(evt) {
    const { document: document2 } = this._options;
    this.wheelTimer && clearTimeout(this.wheelTimer);
    const { x, y } = simplifyEvent(evt);
    this.wheelTimer = setTimeout(() => {
      this._areaClientLocation.x2 = x;
      this._areaClientLocation.y2 = y;
      const deltaY = y - this._containerRect.top + this._container.scrollTop + document2.scrollingElement.scrollTop - this._initScrollDelta.y;
      const deltaX = x - this._containerRect.left + this._container.scrollLeft + document2.scrollingElement.scrollLeft;
      this._scrollDelta.y = document2.scrollingElement.scrollTop - this._initScrollDelta.y;
      this._scrollDelta.x = document2.scrollingElement.scrollLeft - this._initScrollDelta.x;
      this._areaLocation.y2 = deltaY;
      this._areaLocation.x2 = deltaX;
      this._frame.next(null);
    }, 100);
  }
  _onSingleTap(evt) {
    const {
      range,
      singleTap: { intersect }
    } = this._options.features;
    const e = simplifyEvent(evt);
    let target;
    if (intersect === "native") {
      target = e.target;
    } else if (intersect === "touch") {
      this.resolveSelectables();
      const { x, y } = e;
      target = this._selectables.find((v) => {
        const { bottom, left, right, top } = v.getBoundingClientRect();
        return x < right && x > left && y < bottom && y > top;
      });
    }
    if (!target) {
      return;
    }
    this.resolveSelectables();
    while (!this._selectables.includes(target)) {
      if (!target.parentElement) {
        return;
      }
      target = target.parentElement;
    }
    const { stored } = this._selection;
    this._emitEvent("start", evt);
    if (evt.shiftKey && range && this._latestElement) {
      const reference = this._latestElement;
      const [preceding, following] = reference.compareDocumentPosition(target) & 4 ? [target, reference] : [reference, target];
      const rangeItems = [
        ...this._selectables.filter(
          (el) => el.compareDocumentPosition(preceding) & 4 && el.compareDocumentPosition(following) & 2
        ),
        preceding,
        following
      ];
      this.select(rangeItems);
      this._latestElement = reference;
    } else if (stored.includes(target) && (stored.length === 1 || evt.ctrlKey || stored.every((v) => this._selection.stored.includes(v)))) {
      this.deselect(target);
    } else {
      this.select(target);
      this._latestElement = target;
    }
  }
  _onTapMove(evt) {
    const { x, y } = simplifyEvent(evt);
    const {
      _areaClientLocation,
      _areaLocation,
      _frame,
      _options,
      _scrollSpeed
    } = this;
    const { speedDivider } = _options.behaviour.scrolling;
    const Ry = y - this._containerRect.top;
    const Rx = x - this._containerRect.left;
    if (this._scrollAvailable && !this._scrollingActive && (_scrollSpeed.y || _scrollSpeed.x)) {
      this._scrollingActive = true;
      const scroll = () => {
        if (!_scrollSpeed.x && !_scrollSpeed.y) {
          this._scrollingActive = false;
          return;
        }
        if (_scrollSpeed.y) {
          this._container.scrollTop += ceil(_scrollSpeed.y / speedDivider);
          _areaLocation.y2 = Ry;
        }
        if (_scrollSpeed.x) {
          this._container.scrollLeft += ceil(_scrollSpeed.x / speedDivider);
          _areaLocation.x2 = Rx;
        }
        _frame.next(evt);
        requestAnimationFrame(scroll);
      };
      requestAnimationFrame(scroll);
    } else {
      _areaLocation.x2 = Rx + this._container.scrollLeft + this._scrollDelta.x;
      _areaLocation.y2 = Ry + this._container.scrollTop + this._scrollDelta.y;
      _areaClientLocation.x2 = x;
      _areaClientLocation.y2 = y;
      _frame.next(evt);
    }
    this._handleMoveEvent(evt);
  }
  _onTapStart(evt, silent = false) {
    const { container, document: document2 } = this._options;
    const { target, x, y } = simplifyEvent(evt);
    this._container = selectAll(container, document2)[0];
    if (!this._container) return;
    if (this._container.contains(target) && target.dataset.slateEditor !== "true" && target.dataset.plateSelectable !== "true")
      return;
    this._containerRect = this._container.getBoundingClientRect();
    const Rx = x - this._containerRect.left + this._container.scrollLeft;
    const Ry = y - this._containerRect.top + this._container.scrollTop;
    const { _options } = this;
    if (evt instanceof MouseEvent && !shouldTrigger(evt, _options.behaviour.triggers)) {
      return;
    }
    const startAreas = selectAll(_options.startAreas, _options.document);
    const resolvedBoundaries = selectAll(
      _options.boundaries,
      _options.document
    );
    const evtPath = evt.composedPath();
    if (!this._container || // eslint-disable-next-line unicorn/prefer-array-some
    !startAreas.find((el) => evtPath.includes(el)) || // eslint-disable-next-line unicorn/prefer-array-some
    !resolvedBoundaries.find((el) => evtPath.includes(el))) {
      return;
    }
    if (!silent && this._emitEvent("beforestart", evt) === false) {
      return;
    }
    this._areaLocation = { x1: Rx, x2: 0, y1: Ry, y2: 0 };
    this._areaClientLocation = { x1: x, x2: 0, y1: y, y2: 0 };
    const scrollElement = document2.scrollingElement ?? document2.body;
    this._initScrollDelta = {
      x: scrollElement.scrollLeft,
      y: scrollElement.scrollTop
    };
    this._singleClick = true;
    this.clearSelection(false, true);
    on(document2, ["touchmove", "mousemove"], this._delayedTapMove, {
      passive: false
    });
    on(document2, ["mouseup", "touchcancel", "touchend"], this._onTapStop);
    on(document2, "wheel", this._onScroll, { passive: false });
  }
  _onTapStop(evt, silent) {
    const { document: document2, features } = this._options;
    const { _singleClick } = this;
    off(document2, ["mousemove", "touchmove"], this._delayedTapMove);
    off(document2, ["touchmove", "mousemove"], this._onTapMove);
    off(document2, ["mouseup", "touchcancel", "touchend"], this._onTapStop);
    off(document2, "wheel", this._onScroll);
    this._keepSelection();
    if (evt && _singleClick && features.singleTap.allow) {
      this._onSingleTap(evt);
    } else if (!_singleClick && !silent) {
      this._updateElementSelection();
      this._emitEvent("stop", evt);
    }
    this._scrollSpeed.x = 0;
    this._scrollSpeed.y = 0;
    this._scrollDelta.x = 0;
    this._scrollDelta.y = 0;
    off(this._container, "wheel", this._manualScroll, { passive: true });
    this._area.remove();
    this._frame?.cancel();
    css(this._area, "display", "none");
  }
  _recalculateSelectionAreaRect() {
    const {
      _areaClientLocation,
      _areaLocation,
      _areaRect,
      _container,
      _containerRect,
      _scrollSpeed
    } = this;
    const {
      clientHeight,
      clientWidth,
      scrollHeight,
      scrollLeft,
      scrollTop,
      scrollWidth
    } = _container;
    const { x1, y1 } = _areaLocation;
    let { x2, y2 } = _areaLocation;
    const {
      behaviour: {
        scrolling: { startScrollMargins }
      }
    } = this._options;
    if (_areaClientLocation.x2 + this._scrollDelta.x < _containerRect.left + startScrollMargins.x) {
      _scrollSpeed.x = scrollLeft ? -abs(
        _containerRect.left - _areaClientLocation.x2 - this._scrollDelta.x
      ) : 0;
      x2 = max(x2, this._container.scrollLeft);
    } else if (_areaClientLocation.x2 + this._scrollDelta.x > _containerRect.right - startScrollMargins.x) {
      _scrollSpeed.x = scrollWidth - scrollLeft - clientWidth ? abs(
        _containerRect.left + this._container.clientWidth - _areaClientLocation.x2 - this._scrollDelta.x
      ) : 0;
      x2 = clientWidth + scrollLeft;
    } else {
      _scrollSpeed.x = 0;
    }
    if (_areaClientLocation.y2 + this._scrollDelta.y < _containerRect.top + startScrollMargins.y) {
      _scrollSpeed.y = scrollTop ? -abs(
        _containerRect.top - _areaClientLocation.y2 - this._scrollDelta.y + startScrollMargins.y
      ) : 0;
      y2 = max(y2, this._container.scrollTop);
    } else if (_areaClientLocation.y2 + this._scrollDelta.y > _containerRect.bottom - startScrollMargins.y) {
      _scrollSpeed.y = scrollHeight - scrollTop - clientHeight ? abs(
        _areaClientLocation.y2 + this._scrollDelta.y - (_containerRect.top + this._container.clientHeight - startScrollMargins.y)
      ) : 0;
      y2 = clientHeight + scrollTop;
    } else {
      _scrollSpeed.y = 0;
    }
    const x3 = min(x1, x2);
    const y3 = min(y1, y2);
    const x4 = max(x1, x2);
    const y4 = max(y1, y2);
    _areaRect.x = x3;
    _areaRect.y = y3;
    _areaRect.width = x4 - x3;
    _areaRect.height = y4 - y3;
  }
  _redrawSelectionArea() {
    const { height, width, x, y } = this._areaRect;
    const { style } = this._area;
    style.left = `${x}px`;
    style.top = `${y}px`;
    style.width = `${width}px`;
    style.height = `${height}px`;
  }
  _setupSelectionArea() {
  }
  _updateElementSelection() {
    const { _areaRect, _options, _selectables, _selection } = this;
    const { selected, stored, touched } = _selection;
    const { intersect, overlap } = _options.behaviour;
    const invert = overlap === "invert";
    const newlyTouched = [];
    const added = [];
    const removed = [];
    for (let i = 0; i < _selectables.length; i++) {
      const node = _selectables[i];
      if (intersectsScroll(
        _areaRect,
        node.getBoundingClientRect(),
        intersect,
        this._container
      )) {
        if (!selected.includes(node)) {
          if (invert && stored.includes(node)) {
            removed.push(node);
            continue;
          } else {
            added.push(node);
          }
        } else if (stored.includes(node) && !touched.includes(node)) {
          touched.push(node);
        }
        newlyTouched.push(node);
      }
    }
    if (invert) {
      added.push(...stored.filter((v) => !selected.includes(v)));
    }
    const keep = overlap === "keep";
    for (let i = 0; i < selected.length; i++) {
      const node = selected[i];
      if (!newlyTouched.includes(node) && !// Check if user wants to keep previously selected elements, e.g.
      // not make them part of the current selection as soon as they're touched.
      (keep && stored.includes(node))) {
        removed.push(node);
      }
    }
    _selection.selected = newlyTouched;
    _selection.changed = { added, removed };
    this._latestElement = void 0;
  }
  /**
   * Cancel the current selection process.
   *
   * @param keepEvent {boolean} true to fire a stop event after cancel.
   */
  cancel(keepEvent = false) {
    this._onTapStop(null, !keepEvent);
  }
  /**
   * Same as deselect, but for all elements currently selected.
   *
   * @param includeStored If the store should also get cleared
   * @param quiet If move / stop events should be fired
   */
  clearSelection(includeStored = true, quiet = false) {
    const { changed, selected, stored } = this._selection;
    changed.added = [];
    changed.removed.push(...selected, ...includeStored ? stored : []);
    if (!quiet) {
      this._emitEvent("move", null);
      this._emitEvent("stop", null);
    }
    this._selection = {
      changed: { added: [], removed: [] },
      selected: [],
      stored: includeStored ? [] : stored,
      touched: []
    };
  }
  /**
   * Removes a particular element from the selection.
   *
   * @param query - CSS Query, can be an array of queries
   * @param quiet - If this should not trigger the move event
   */
  deselect(query, quiet = false) {
    const { changed, selected, stored } = this._selection;
    const elements = selectAll(query, this._options.document).filter(
      (el) => selected.includes(el) || stored.includes(el)
    );
    if (elements.length === 0) {
      return;
    }
    this._selection.stored = stored.filter((el) => !elements.includes(el));
    this._selection.selected = selected.filter((el) => !elements.includes(el));
    this._selection.changed.added = [];
    this._selection.changed.removed.push(
      ...elements.filter((el) => !changed.removed.includes(el))
    );
    this._latestElement = void 0;
    if (!quiet) {
      this._emitEvent("move", null);
      this._emitEvent("stop", null);
    }
  }
  /** Unbinds all events and removes the area-element. */
  destroy() {
    this.cancel();
    this.disable();
    super.unbindAllListeners();
  }
  /** @returns {Array} Selected elements */
  getSelection() {
    return this._selection.stored;
  }
  /** @returns {HTMLElement} The selection area element */
  getSelectionArea() {
    return this._area;
  }
  /**
   * Can be used if during a selection elements have been added. Will update
   * everything which can be selected.
   */
  resolveSelectables() {
    this._selectables = selectAll(
      this._options.selectables,
      this._options.document
    );
  }
  /**
   * Adds elements to the selection
   *
   * @param query - CSS Query, can be an array of queries
   * @param quiet - If this should not trigger the move event
   */
  select(query, quiet = false) {
    const { changed, selected, stored } = this._selection;
    const elements = selectAll(query, this._options.document).filter(
      (el) => !selected.includes(el) && !stored.includes(el)
    );
    stored.push(...elements);
    selected.push(...elements);
    changed.added.push(...elements);
    changed.removed = [];
    this._latestElement = void 0;
    if (!quiet) {
      this._emitEvent("move", null);
      this._emitEvent("stop", null);
    }
    return elements;
  }
  /**
   * Manually triggers the start of a selection
   *
   * @param evt A MouseEvent / TouchEvent -like object
   * @param silent If beforestart should be fired,
   */
  trigger(evt, silent = true) {
    this._onTapStart(evt, silent);
  }
};

// src/react/hooks/useSelectionArea.ts
var useSelectionArea = () => {
  const { api, editor, getOptions, setOption } = (0, import_react16.useEditorPlugin)(BlockSelectionPlugin);
  const { areaOptions } = getOptions();
  const areaRef = import_react15.default.useRef({
    ids: /* @__PURE__ */ new Set()
  });
  const onStart = () => {
    if (editor.api.isFocused()) {
      editor.tf.blur();
    }
    if (editor.selection) {
      editor.tf.deselect();
    }
    setOption("isSelectionAreaVisible", true);
  };
  import_react15.default.useEffect(() => {
    const selection = new SelectionArea({
      boundaries: `#${editor.uid}`,
      container: `#${editor.uid}`,
      document: window.document,
      selectables: `#${editor.uid} .slate-selectable`,
      selectionAreaClass: "slate-selection-area",
      ...areaOptions
    }).on("beforestart", () => {
      setOption("isSelecting", false);
    }).on("start", ({ event }) => {
      onStart();
      if (!event?.shiftKey) {
        selection.clearSelection();
        api.blockSelection.clear();
      }
    }).on("move", ({ store: { changed } }) => {
      if (!getOptions().isSelectionAreaVisible) {
        onStart();
      }
      if (changed.added.length === 0 && changed.removed.length === 0) return;
      const next = new Set(getOptions().selectedIds);
      extractSelectableIds(changed.removed).forEach((id) => {
        next.delete(id);
        areaRef.current.ids.delete(id);
      });
      const added = new Set(extractSelectableIds(changed.added));
      added.forEach((id) => {
        const block = editor.api.block({
          at: [],
          match: (n) => !!n.id && n.id === id
        });
        if (!block) return;
        if (block[1].length === 1) {
          next.add(id);
          areaRef.current.ids.add(id);
          return;
        }
        const hasAncestor = editor.api.block({
          above: true,
          at: block[1],
          match: (n) => !!n.id && areaRef.current.ids.has(n.id)
        });
        if (!hasAncestor) {
          next.add(id);
          areaRef.current.ids.add(id);
        }
      });
      setOption("selectedIds", next);
    }).on("stop", () => {
      areaRef.current = {
        ids: /* @__PURE__ */ new Set()
      };
      setOption("isSelectionAreaVisible", false);
    });
    return () => selection.destroy();
  }, []);
};

// src/react/utils/copySelectedBlocks.ts
var import_copy_to_clipboard = __toESM(require("copy-to-clipboard"));
var copySelectedBlocks = (editor) => {
  const { selectedIds } = editor.getOptions(BlockSelectionPlugin);
  const selectedEntries = editor.getApi(BlockSelectionPlugin).blockSelection.getNodes();
  const selectedFragment = selectedEntries.map(([node]) => node);
  (0, import_copy_to_clipboard.default)(" ", {
    onCopy: (dataTransfer) => {
      const data = dataTransfer;
      if (!data) return;
      let textPlain = "";
      const div = document.createElement("div");
      editor.tf.withoutNormalizing(() => {
        selectedEntries.forEach(([, path]) => {
          editor.tf.select({
            anchor: editor.api.start(path),
            focus: editor.api.end(path)
          });
          editor.tf.setFragmentData(data);
          textPlain += `${data.getData("text/plain")}
`;
          const divChild = document.createElement("div");
          divChild.innerHTML = data.getData("text/html");
          div.append(divChild);
        });
        editor.tf.deselect();
        editor.setOption(BlockSelectionPlugin, "selectedIds", selectedIds);
      });
      data.setData("text/plain", textPlain);
      data.setData("text/html", div.innerHTML);
      const selectedFragmentStr = JSON.stringify(selectedFragment);
      const encodedFragment = window.btoa(
        encodeURIComponent(selectedFragmentStr)
      );
      data.setData("application/x-slate-fragment", encodedFragment);
    }
  });
};

// src/react/utils/pasteSelectedBlocks.ts
var import_plate5 = require("@udecode/plate");

// src/react/utils/selectInsertedBlocks.ts
var import_plate4 = require("@udecode/plate");
var selectInsertedBlocks = (editor) => {
  const { setOption } = (0, import_plate4.getEditorPlugin)(editor, BlockSelectionPlugin);
  const ids = /* @__PURE__ */ new Set();
  editor.operations.forEach((op) => {
    if (op.type === "insert_node" && op.node.id && editor.api.isBlock(op.node)) {
      ids.add(op.node.id);
    }
  });
  setOption("selectedIds", ids);
};

// src/react/utils/pasteSelectedBlocks.ts
var pasteSelectedBlocks = (editor, e) => {
  const { api } = (0, import_plate5.getEditorPlugin)(editor, BlockSelectionPlugin);
  const entries = api.blockSelection.getNodes();
  if (entries.length > 0) {
    const entry = entries.at(-1);
    const [node, path] = entry;
    if (!editor.api.isEmpty(node)) {
      const at = import_plate5.PathApi.next(path);
      editor.tf.insertNodes(editor.api.create.block({}, at), {
        at,
        select: true
      });
    }
    editor.tf.insertData(e.clipboardData);
    selectInsertedBlocks(editor);
  }
};

// src/react/components/BlockSelectionAfterEditable.tsx
var BlockSelectionAfterEditable = () => {
  const editor = (0, import_react18.useEditorRef)();
  const { api, getOption, getOptions, setOption } = (0, import_react18.useEditorPlugin)({ key: "blockSelection" });
  const isSelectingSome = (0, import_react18.usePluginOption)(
    BlockSelectionPlugin,
    "isSelectingSome"
  );
  const selectedIds = (0, import_react18.usePluginOption)(BlockSelectionPlugin, "selectedIds");
  useSelectionArea();
  const inputRef = import_react17.default.useRef(null);
  const [isMounted, setIsMounted] = import_react17.default.useState(false);
  import_react17.default.useEffect(() => {
    setIsMounted(true);
    setOption("shadowInputRef", inputRef);
    return () => {
      setIsMounted(false);
    };
  }, [setOption]);
  import_react17.default.useEffect(() => {
    if (!isSelectingSome) {
      setOption("anchorId", null);
    }
  }, [isSelectingSome, setOption]);
  import_react17.default.useEffect(() => {
    if (isSelectingSome && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    } else if (inputRef.current) {
      inputRef.current.blur();
    }
  }, [isSelectingSome]);
  const handleKeyDown = import_react17.default.useCallback(
    (e) => {
      const isReadonly = editor.api.isReadOnly();
      getOptions().onKeyDownSelecting?.(e.nativeEvent);
      if (!getOption("isSelectingSome")) return;
      if ((0, import_plate6.isHotkey)("shift+up")(e)) {
        e.preventDefault();
        e.stopPropagation();
        api.blockSelection.shiftSelection("up");
        return;
      }
      if ((0, import_plate6.isHotkey)("shift+down")(e)) {
        e.preventDefault();
        e.stopPropagation();
        api.blockSelection.shiftSelection("down");
        return;
      }
      if ((0, import_plate6.isHotkey)("escape")(e)) {
        api.blockSelection.deselect();
        return;
      }
      if ((0, import_plate6.isHotkey)("mod+z")(e)) {
        editor.undo();
        selectInsertedBlocks(editor);
        return;
      }
      if ((0, import_plate6.isHotkey)("mod+a")(e)) {
        api.blockSelection.selectAll();
        return;
      }
      if ((0, import_plate6.isHotkey)("mod+shift+z")(e)) {
        editor.redo();
        selectInsertedBlocks(editor);
        return;
      }
      if (!getOption("isSelectingSome")) return;
      if ((0, import_plate6.isHotkey)("enter")(e)) {
        const entry = editor.api.node({
          at: [],
          block: true,
          match: (n) => !!n.id && selectedIds?.has(n.id)
        });
        if (entry) {
          const [, path] = entry;
          editor.tf.focus({ at: path, edge: "end" });
          e.preventDefault();
        }
        return;
      }
      if ((0, import_plate6.isHotkey)(["backspace", "delete"])(e) && !isReadonly) {
        e.preventDefault();
        editor.tf.withoutNormalizing(() => {
          const entries = [
            ...editor.api.nodes({
              at: [],
              match: (n) => !!n.id && selectedIds?.has(n.id)
            })
          ];
          for (const [, path] of [...entries].reverse()) {
            editor.tf.removeNodes({
              at: path
            });
          }
          const entry = entries[0];
          if (entry) {
            if (editor.children.length === 0) {
              editor.tf.focus();
            } else {
              const prevPath = (0, import_plate6.isHotkey)("backspace")(e) ? import_plate6.PathApi.previous(entry[1]) : entry[1];
              if (prevPath) {
                const prevEntry = editor.api.block({ at: prevPath });
                if (prevEntry) {
                  setOption(
                    "selectedIds",
                    /* @__PURE__ */ new Set([prevEntry[0].id])
                  );
                }
              }
            }
          }
        });
        return;
      }
      if ((0, import_plate6.isHotkey)("up")(e)) {
        e.preventDefault();
        e.stopPropagation();
        api.blockSelection.moveSelection("up");
        return;
      }
      if ((0, import_plate6.isHotkey)("down")(e)) {
        e.preventDefault();
        e.stopPropagation();
        api.blockSelection.moveSelection("down");
        return;
      }
    },
    [editor, getOptions, getOption, api.blockSelection, selectedIds, setOption]
  );
  const handleCopy = import_react17.default.useCallback(
    (e) => {
      e.preventDefault();
      if (getOption("isSelectingSome")) {
        copySelectedBlocks(editor);
      }
    },
    [editor, getOption]
  );
  const handleCut = import_react17.default.useCallback(
    (e) => {
      e.preventDefault();
      if (getOption("isSelectingSome")) {
        copySelectedBlocks(editor);
        if (!editor.api.isReadOnly()) {
          const entries = [
            ...editor.api.nodes({
              at: [],
              match: (n) => selectedIds?.has(n.id)
            })
          ];
          if (entries.length > 0) {
            editor.tf.withoutNormalizing(() => {
              for (const [, path] of [...entries].reverse()) {
                editor.tf.removeNodes({
                  at: path
                });
              }
            });
            const prevEntry = editor.api.block({ at: entries[0][1] });
            if (prevEntry) {
              setOption("selectedIds", /* @__PURE__ */ new Set([prevEntry[0].id]));
            }
          }
        }
      }
    },
    [getOption, editor, selectedIds, setOption]
  );
  const handlePaste = import_react17.default.useCallback(
    (e) => {
      e.preventDefault();
      if (!editor.api.isReadOnly()) {
        pasteSelectedBlocks(editor, e.nativeEvent);
      }
    },
    [editor]
  );
  if (!isMounted || typeof window === "undefined") {
    return null;
  }
  return import_react_dom.default.createPortal(
    /* @__PURE__ */ import_react17.default.createElement(
      "input",
      {
        ref: inputRef,
        className: "slate-shadow-input",
        style: {
          left: "-300px",
          opacity: 0,
          position: "fixed",
          top: "-300px",
          zIndex: 999
        },
        onCopy: handleCopy,
        onCut: handleCut,
        onKeyDown: handleKeyDown,
        onPaste: handlePaste
      }
    ),
    document.body
  );
};

// src/react/internal/api/moveSelection.ts
var import_react19 = require("@udecode/plate/react");
var moveSelection = (editor, direction) => {
  const { api, setOption } = (0, import_react19.getEditorPlugin)(editor, BlockSelectionPlugin);
  const blocks = api.blockSelection.getNodes();
  if (blocks.length === 0) return;
  if (direction === "up") {
    const [, topPath] = blocks[0];
    const prevEntry = editor.api.previous({
      at: topPath,
      from: "parent",
      match: api.blockSelection.isSelectable
    });
    if (prevEntry) {
      const [prevNode] = prevEntry;
      setOption("anchorId", prevNode.id);
      api.blockSelection.set(prevNode.id);
    } else {
      api.blockSelection.set(blocks[0][0].id);
    }
  } else {
    const [, bottomPath] = blocks.at(-1);
    const nextEntry = editor.api.next({
      at: bottomPath,
      from: "child",
      match: api.blockSelection.isSelectable
    });
    if (nextEntry) {
      const [nextNode] = nextEntry;
      setOption("anchorId", nextNode.id);
      api.blockSelection.set(nextNode.id);
    } else {
      api.blockSelection.set(blocks.at(-1)[0].id);
    }
  }
};

// src/react/internal/api/setSelectedIds.ts
var import_plate7 = require("@udecode/plate");
var setSelectedIds = (editor, {
  added,
  ids,
  removed
}) => {
  const { getOptions, setOption } = (0, import_plate7.getEditorPlugin)(
    editor,
    { key: "blockSelection" }
  );
  if (ids) {
    setOption("selectedIds", new Set(ids));
  }
  if (added || removed) {
    const { selectedIds: prev } = getOptions();
    const next = new Set(prev);
    if (added) {
      extractSelectableIds(added).forEach((id) => id && next.add(id));
    }
    if (removed) {
      extractSelectableIds(removed).forEach((id) => id && next.delete(id));
    }
    setOption("selectedIds", next);
  }
  setOption("isSelecting", true);
};
var addSelectedRow = (editor, id, options = {}) => {
  const { api, getOptions, setOption } = (0, import_plate7.getEditorPlugin)(
    editor,
    { key: "blockSelection" }
  );
  const { clear = true, delay } = options;
  const element = querySelectorSelectable(id);
  if (!element) return;
  if (!getOptions().selectedIds.has(id) && clear) {
    setOption("selectedIds", /* @__PURE__ */ new Set());
  }
  api.blockSelection.setSelectedIds({
    added: [element],
    removed: []
  });
  if (delay) {
    setTimeout(() => {
      api.blockSelection.setSelectedIds({
        added: [],
        removed: [element]
      });
    }, delay);
  }
};

// src/react/internal/api/shiftSelection.ts
var import_plate8 = require("@udecode/plate");
var import_react20 = require("@udecode/plate/react");
var shiftSelection = (editor, direction) => {
  const { api, getOption, getOptions, setOption } = (0, import_react20.getEditorPlugin)(
    editor,
    BlockSelectionPlugin
  );
  const blocks = api.blockSelection.getNodes();
  if (blocks.length === 0) return;
  const [topNode, topPath] = blocks[0];
  const [bottomNode, bottomPath] = blocks.at(-1);
  let anchorId = getOptions().anchorId;
  if (!anchorId) {
    anchorId = direction === "up" ? bottomNode.id : topNode.id;
    setOption("anchorId", anchorId);
  }
  const anchorIndex = blocks.findIndex(([node]) => node.id === anchorId);
  if (anchorIndex === -1) {
    setOption("anchorId", bottomNode.id);
    return;
  }
  const anchorIsTop = anchorIndex === 0;
  const anchorIsBottom = anchorIndex === blocks.length - 1;
  const newSelected = new Set(getOption("selectedIds"));
  if (direction === "down") {
    if (anchorIsTop) {
      const belowEntry = editor.api.next({
        at: bottomPath,
        mode: "highest",
        match: (n, p) => api.blockSelection.isSelectable(n, p) && !import_plate8.PathApi.isAncestor(p, bottomPath)
      });
      if (!belowEntry) return;
      const [belowNode] = belowEntry;
      newSelected.add(belowNode.id);
    } else {
      if (topNode.id && topNode.id !== anchorId) {
        newSelected.delete(topNode.id);
      }
    }
  } else {
    if (anchorIsBottom) {
      const aboveEntry = editor.api.previous({
        at: topPath,
        from: "parent",
        match: api.blockSelection.isSelectable
      });
      if (!aboveEntry) return;
      const [aboveNode, abovePath] = aboveEntry;
      if (import_plate8.PathApi.isAncestor(abovePath, topPath)) {
        newSelected.forEach((id) => {
          const entry = editor.api.node({ id, at: abovePath });
          if (!entry) return;
          if (import_plate8.PathApi.isDescendant(entry[1], abovePath)) {
            newSelected.delete(id);
            if (id === anchorId) {
              anchorId = aboveNode.id;
              setOption("anchorId", anchorId);
            }
          }
        });
      }
      newSelected.add(aboveNode.id);
    } else {
      if (bottomNode.id && bottomNode.id !== anchorId) {
        newSelected.delete(bottomNode.id);
      }
    }
  }
  newSelected.add(anchorId);
  setOption("selectedIds", newSelected);
};

// src/react/onKeyDownSelection.ts
var import_plate9 = require("@udecode/plate");
var onKeyDownSelection = ({
  api,
  editor,
  event
}) => {
  if ((0, import_plate9.isHotkey)("mod+a", event)) {
    if (event.defaultPrevented) return;
    const ancestorNode = editor.api.block({ highest: true });
    if (!ancestorNode) return;
    const [, path] = ancestorNode;
    if (editor.api.isAt({ block: true, end: true, start: true })) {
      return api.blockSelection.selectAll();
    }
    if (!editor.api.isAt({ block: true })) {
      return api.blockSelection.selectAll();
    }
    editor.tf.select(path);
    event.preventDefault();
    event.stopPropagation();
  }
  if ((0, import_plate9.isHotkey)("escape", event)) {
    if (event.defaultPrevented) return;
    const ancestorNode = editor.api.block({ highest: true });
    const id = ancestorNode?.[0].id;
    api.blockSelection.set(id);
    event.preventDefault();
    event.stopPropagation();
  }
};

// src/react/transforms/duplicateBlockSelectionNodes.ts
var import_plate10 = require("@udecode/plate");
var duplicateBlockSelectionNodes = (editor) => {
  const blocks = editor.getApi(BlockSelectionPlugin).blockSelection.getNodes();
  const lastBlock = blocks.at(-1);
  if (!lastBlock) return;
  editor.tf.duplicateNodes({
    at: lastBlock[1],
    nextBlock: true,
    nodes: blocks
  });
  const path = import_plate10.PathApi.next(lastBlock[1]);
  const ids = blocks.map((_, index) => {
    const targetPath = [path[0] + index];
    const targetNode = editor.api.node(targetPath);
    return targetNode?.[0].id;
  }).filter(Boolean);
  setTimeout(() => {
    editor.setOption(BlockSelectionPlugin, "selectedIds", new Set(ids));
  }, 0);
};

// src/react/transforms/insertBlocksAndSelect.ts
var import_plate11 = require("@udecode/plate");
var insertBlocksAndSelect = (editor, nodes, { at }) => {
  editor.tf.insertNodes(nodes, { at });
  const insertedNodes = [import_plate11.NodeApi.get(editor, at)];
  let count = 1;
  while (count < nodes.length) {
    at = import_plate11.PathApi.next(at);
    const nextNode = import_plate11.NodeApi.get(editor, at);
    insertedNodes.push(nextNode);
    count++;
  }
  setTimeout(() => {
    editor.setOption(
      BlockSelectionPlugin,
      "selectedIds",
      new Set(insertedNodes.map((n) => n.id))
    );
  }, 0);
};

// src/react/transforms/removeBlockSelectionNodes.ts
var removeBlockSelectionNodes = (editor) => {
  const selectedIds = editor.getOption(BlockSelectionPlugin, "selectedIds");
  if (!selectedIds) return;
  editor.tf.removeNodes({
    at: [],
    block: true,
    match: (n) => !!n.id && selectedIds.has(n.id)
  });
};

// src/react/transforms/selectBlockSelectionNodes.ts
var selectBlockSelectionNodes = (editor) => {
  editor.tf.select(
    editor.api.nodesRange(
      editor.getApi(BlockSelectionPlugin).blockSelection.getNodes()
    )
  );
  editor.getApi(BlockSelectionPlugin).blockSelection.clear();
};

// src/react/transforms/setBlockSelectionNodes.ts
var setBlockSelectionNodes = (editor, props, options) => {
  editor.tf.withoutNormalizing(() => {
    const blocks = editor.getApi(BlockSelectionPlugin).blockSelection.getNodes();
    blocks.forEach(([, path]) => {
      editor.tf.setNodes(props, {
        ...options,
        at: path
      });
    });
  });
};
var setBlockSelectionIndent = (editor, indent, options) => {
  const api = editor.getApi(BlockSelectionPlugin);
  editor.tf.withoutNormalizing(() => {
    const blocks = api.blockSelection.getNodes();
    blocks.forEach(([node, path]) => {
      const prevIndent = node.indent ?? 0;
      const currentIndent = prevIndent + indent;
      editor.tf.setNodes(
        { indent: Math.max(currentIndent, 0) },
        {
          ...options,
          at: path
        }
      );
    });
  });
};
var setBlockSelectionTexts = (editor, props, options) => {
  setBlockSelectionNodes(editor, props, {
    mode: "lowest",
    ...options
  });
};

// src/react/BlockSelectionPlugin.tsx
var BlockSelectionPlugin = (0, import_react21.createTPlatePlugin)({
  key: "blockSelection",
  handlers: {
    onKeyDown: onKeyDownSelection,
    onMouseDown: ({ api, editor, event, getOptions }) => {
      const target = event.target;
      if (
        // deprecated
        target.dataset.platePreventUnselect || target.dataset.platePreventDeselect
      )
        return;
      if (event.button === 0 && getOptions().selectedIds.size > 0 && !editor.getOption(BlockMenuPlugin, "openId")) {
        api.blockSelection.deselect();
      }
    }
  },
  inject: {
    isBlock: true,
    nodeProps: {
      transformProps: () => {
        return useBlockSelectable().props;
      }
    }
  },
  options: {
    anchorId: null,
    areaOptions: {
      features: {
        singleTap: {
          allow: false
        }
      }
    },
    enableContextMenu: false,
    isSelecting: false,
    isSelectionAreaVisible: false,
    selectedIds: /* @__PURE__ */ new Set(),
    shadowInputRef: { current: null },
    isSelectable: () => true
  },
  plugins: [BlockMenuPlugin],
  render: {
    afterEditable: BlockSelectionAfterEditable
  }
}).extend(() => ({
  inject: {}
})).extendSelectors(({ getOptions }) => ({
  isSelected: (id) => !!id && getOptions().selectedIds.has(id),
  isSelectingSome: () => getOptions().selectedIds.size > 0
})).extendApi(
  ({ editor, getOption, getOptions, setOption }) => ({
    moveSelection: (0, import_plate12.bindFirst)(moveSelection, editor),
    setSelectedIds: (0, import_plate12.bindFirst)(setSelectedIds, editor),
    shiftSelection: (0, import_plate12.bindFirst)(shiftSelection, editor),
    add: (id) => {
      const next = new Set(getOptions().selectedIds);
      if (Array.isArray(id)) {
        id.forEach((i) => next.add(i));
      } else {
        next.add(id);
      }
      setOption("selectedIds", next);
    },
    clear: () => {
      setOption("selectedIds", /* @__PURE__ */ new Set());
    },
    delete: (id) => {
      const next = new Set(getOptions().selectedIds);
      if (Array.isArray(id)) {
        id.forEach((i) => next.delete(i));
      } else {
        next.delete(id);
      }
      setOption("selectedIds", next);
    },
    deselect: () => {
      setOption("selectedIds", /* @__PURE__ */ new Set());
      setOption("isSelecting", false);
    },
    focus: () => {
      const shadowInputRef = getOption("shadowInputRef");
      if (shadowInputRef?.current) {
        shadowInputRef.current.focus({ preventScroll: true });
      }
    },
    getNodes: () => {
      const selectedIds = getOption("selectedIds");
      return editor.api.blocks({
        at: [],
        match: (n) => !!n.id && selectedIds?.has(n.id)
      });
    },
    has: (id) => {
      if (Array.isArray(id)) {
        return id.every((i) => getOptions().selectedIds.has(i));
      }
      return getOptions().selectedIds.has(id);
    },
    isSelectable: (element, path) => !!element.id && editor.api.isBlock(element) && getOptions().isSelectable(element, path),
    resetSelectedIds: () => {
      setOption("selectedIds", /* @__PURE__ */ new Set());
    },
    set: (id) => {
      setOption("selectedIds", new Set(Array.isArray(id) ? id : [id]));
    },
    unselect: () => {
      setOption("selectedIds", /* @__PURE__ */ new Set());
      setOption("isSelecting", false);
    }
  })
).extendApi(
  ({ api, editor, setOption }) => ({
    addSelectedRow: (0, import_plate12.bindFirst)(addSelectedRow, editor),
    selectAll: () => {
      const ids = api.blocks({
        at: [],
        mode: "highest",
        match: (n, p) => !!n.id && api.blockSelection.isSelectable(n, p)
      }).map((n) => n[0].id);
      setOption("selectedIds", new Set(ids));
      api.blockSelection.focus();
    }
  })
).extendTransforms(({ editor }) => ({
  /** Duplicate selected blocks */
  duplicate: (0, import_plate12.bindFirst)(duplicateBlockSelectionNodes, editor),
  /** Insert blocks and select */
  insertBlocksAndSelect: (0, import_plate12.bindFirst)(insertBlocksAndSelect, editor),
  /** Remove selected blocks */
  removeNodes: (0, import_plate12.bindFirst)(removeBlockSelectionNodes, editor),
  /** Set selection based on block selection */
  select: (0, import_plate12.bindFirst)(selectBlockSelectionNodes, editor),
  /**
   * Selects blocks in the editor based on the provided block ID.
   *
   * Uses block selection if any blocks are selected, otherwise falls back to
   * editor selection. If the provided block ID is already in the current
   * selection, maintains the existing selection. Otherwise, clears the
   * current selection and selects only the specified block.
   */
  selectBlocks: (0, import_plate12.bindFirst)(selectBlocks, editor),
  /** Set block indent */
  setIndent: (0, import_plate12.bindFirst)(setBlockSelectionIndent, editor),
  /** Set nodes on selected blocks */
  setNodes: (0, import_plate12.bindFirst)(setBlockSelectionNodes, editor),
  /** Set texts on selected blocks */
  setTexts: (0, import_plate12.bindFirst)(setBlockSelectionTexts, editor)
})).overrideEditor(({ api, editor, getOptions, tf: { setSelection } }) => ({
  transforms: {
    setSelection(props) {
      if (getOptions().selectedIds.size > 0 && !editor.getOption(BlockMenuPlugin, "openId")) {
        api.blockSelection.deselect();
      }
      setSelection(props);
    }
  }
}));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BLOCK_CONTEXT_MENU_ID,
  BlockMenuPlugin,
  BlockSelectionAfterEditable,
  BlockSelectionPlugin,
  CursorOverlayPlugin,
  FROZEN_EMPTY_ARRAY,
  copySelectedBlocks,
  duplicateBlockSelectionNodes,
  getCaretPosition,
  getCursorOverlayState,
  getSelectionRects,
  insertBlocksAndSelect,
  isSelectingOrFocused,
  onKeyDownSelection,
  pasteSelectedBlocks,
  removeBlockSelectionNodes,
  selectBlockSelectionNodes,
  selectInsertedBlocks,
  setBlockSelectionIndent,
  setBlockSelectionNodes,
  setBlockSelectionTexts,
  useBlockSelectable,
  useBlockSelected,
  useBlockSelectionFragment,
  useBlockSelectionFragmentProp,
  useBlockSelectionNodes,
  useCursorOverlay,
  useIsSelecting,
  useRefreshOnResize,
  useRequestReRender,
  useSelectionArea
});
//# sourceMappingURL=index.js.map