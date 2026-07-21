"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/react/index.ts
var react_exports = {};
__export(react_exports, {
  useComboboxInput: () => useComboboxInput,
  useHTMLInputCursorState: () => useHTMLInputCursorState
});
module.exports = __toCommonJS(react_exports);

// src/react/hooks/useComboboxInput.ts
var import_react = require("react");
var import_plate = require("@udecode/plate");
var import_react2 = require("@udecode/plate/react");
var useComboboxInput = ({
  autoFocus = true,
  cancelInputOnArrowLeftRight = true,
  cancelInputOnBackspace = true,
  cancelInputOnBlur = true,
  cancelInputOnDeselect = true,
  cancelInputOnEscape = true,
  cursorState,
  forwardUndoRedoToEditor = true,
  ref,
  onCancelInput
}) => {
  const editor = (0, import_react2.useEditorRef)();
  const element = (0, import_react2.useElement)();
  const selected = (0, import_react2.useSelected)();
  const cursorAtStart = cursorState?.atStart ?? false;
  const cursorAtEnd = cursorState?.atEnd ?? false;
  const removeInput = (0, import_react.useCallback)(
    (shouldFocusEditor = false) => {
      const path = editor.api.findPath(element);
      if (!path) return;
      editor.tf.removeNodes({ at: path });
      if (shouldFocusEditor) {
        editor.tf.focus();
      }
    },
    [editor, element]
  );
  const cancelInput = (0, import_react.useCallback)(
    (cause = "manual", shouldFocusEditor = false) => {
      removeInput(shouldFocusEditor);
      onCancelInput?.(cause);
    },
    [onCancelInput, removeInput]
  );
  (0, import_react.useEffect)(() => {
    if (autoFocus) {
      ref.current?.focus();
    }
  }, [autoFocus, ref]);
  const previousSelected = (0, import_react.useRef)(selected);
  (0, import_react.useEffect)(() => {
    if (previousSelected.current && !selected && cancelInputOnDeselect) {
      cancelInput("deselect");
    }
    previousSelected.current = selected;
  }, [selected, cancelInputOnDeselect, cancelInput]);
  return {
    cancelInput,
    props: {
      onBlur: () => {
        if (cancelInputOnBlur) {
          cancelInput("blur");
        }
      },
      onKeyDown: (event) => {
        if (cancelInputOnEscape && (0, import_plate.isHotkey)("escape", event)) {
          cancelInput("escape", true);
        }
        if (cancelInputOnBackspace && cursorAtStart && (0, import_plate.isHotkey)("backspace", event)) {
          cancelInput("backspace", true);
        }
        if (cancelInputOnArrowLeftRight && cursorAtStart && (0, import_plate.isHotkey)("arrowleft", event)) {
          cancelInput("arrowLeft", true);
        }
        if (cancelInputOnArrowLeftRight && cursorAtEnd && (0, import_plate.isHotkey)("arrowright", event)) {
          cancelInput("arrowRight", true);
        }
        const isUndo = import_plate.Hotkeys.isUndo(event) && editor.history.undos.length > 0;
        const isRedo = import_plate.Hotkeys.isRedo(event) && editor.history.redos.length > 0;
        if (forwardUndoRedoToEditor && (isUndo || isRedo)) {
          event.preventDefault();
          editor[isUndo ? "undo" : "redo"]();
          editor.tf.focus();
        }
      }
    },
    removeInput
  };
};

// src/react/hooks/useHTMLInputCursorState.ts
var import_react3 = require("react");
var useHTMLInputCursorState = (ref) => {
  const [atStart, setAtStart] = (0, import_react3.useState)(false);
  const [atEnd, setAtEnd] = (0, import_react3.useState)(false);
  const recomputeCursorState = (0, import_react3.useCallback)(() => {
    setTimeout(() => {
      if (!ref.current) return;
      const { selectionEnd, selectionStart, value } = ref.current;
      setAtStart(selectionStart === 0);
      setAtEnd(selectionEnd === value.length);
    });
  }, [ref]);
  (0, import_react3.useEffect)(() => {
    recomputeCursorState();
    const input = ref.current;
    if (!input) return;
    input.addEventListener("input", recomputeCursorState);
    input.addEventListener("selectionchange", recomputeCursorState);
    input.addEventListener("keydown", recomputeCursorState);
    input.addEventListener("pointerdown", recomputeCursorState);
    input.addEventListener("pointerup", recomputeCursorState);
    return () => {
      input.removeEventListener("input", recomputeCursorState);
      input.removeEventListener("selectionchange", recomputeCursorState);
      input.removeEventListener("keydown", recomputeCursorState);
      input.removeEventListener("pointerdown", recomputeCursorState);
      input.removeEventListener("pointerup", recomputeCursorState);
    };
  }, [recomputeCursorState, ref]);
  return (0, import_react3.useMemo)(
    () => ({
      atEnd,
      atStart
    }),
    [atStart, atEnd]
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useComboboxInput,
  useHTMLInputCursorState
});
//# sourceMappingURL=index.js.map