// src/react/hooks/useComboboxInput.ts
import {
  useCallback,
  useEffect,
  useRef
} from "react";
import { Hotkeys, isHotkey } from "@udecode/plate";
import { useEditorRef, useElement, useSelected } from "@udecode/plate/react";
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
  const editor = useEditorRef();
  const element = useElement();
  const selected = useSelected();
  const cursorAtStart = cursorState?.atStart ?? false;
  const cursorAtEnd = cursorState?.atEnd ?? false;
  const removeInput = useCallback(
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
  const cancelInput = useCallback(
    (cause = "manual", shouldFocusEditor = false) => {
      removeInput(shouldFocusEditor);
      onCancelInput?.(cause);
    },
    [onCancelInput, removeInput]
  );
  useEffect(() => {
    if (autoFocus) {
      ref.current?.focus();
    }
  }, [autoFocus, ref]);
  const previousSelected = useRef(selected);
  useEffect(() => {
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
        if (cancelInputOnEscape && isHotkey("escape", event)) {
          cancelInput("escape", true);
        }
        if (cancelInputOnBackspace && cursorAtStart && isHotkey("backspace", event)) {
          cancelInput("backspace", true);
        }
        if (cancelInputOnArrowLeftRight && cursorAtStart && isHotkey("arrowleft", event)) {
          cancelInput("arrowLeft", true);
        }
        if (cancelInputOnArrowLeftRight && cursorAtEnd && isHotkey("arrowright", event)) {
          cancelInput("arrowRight", true);
        }
        const isUndo = Hotkeys.isUndo(event) && editor.history.undos.length > 0;
        const isRedo = Hotkeys.isRedo(event) && editor.history.redos.length > 0;
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
import {
  useCallback as useCallback2,
  useEffect as useEffect2,
  useMemo,
  useState
} from "react";
var useHTMLInputCursorState = (ref) => {
  const [atStart, setAtStart] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const recomputeCursorState = useCallback2(() => {
    setTimeout(() => {
      if (!ref.current) return;
      const { selectionEnd, selectionStart, value } = ref.current;
      setAtStart(selectionStart === 0);
      setAtEnd(selectionEnd === value.length);
    });
  }, [ref]);
  useEffect2(() => {
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
  return useMemo(
    () => ({
      atEnd,
      atStart
    }),
    [atStart, atEnd]
  );
};
export {
  useComboboxInput,
  useHTMLInputCursorState
};
//# sourceMappingURL=index.mjs.map