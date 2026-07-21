import { RefObject, HTMLAttributes } from 'react';
import { a as ComboboxInputCursorState, C as CancelComboboxInputCause } from '../types-CKfVCavl.mjs';
import '@udecode/plate';

interface UseComboboxInputOptions {
    ref: RefObject<HTMLElement | null>;
    autoFocus?: boolean;
    cancelInputOnArrowLeftRight?: boolean;
    cancelInputOnBackspace?: boolean;
    cancelInputOnBlur?: boolean;
    cancelInputOnDeselect?: boolean;
    cancelInputOnEscape?: boolean;
    cursorState?: ComboboxInputCursorState;
    forwardUndoRedoToEditor?: boolean;
    onCancelInput?: (cause: CancelComboboxInputCause) => void;
}
interface UseComboboxInputResult {
    props: Required<Pick<HTMLAttributes<HTMLElement>, 'onBlur' | 'onKeyDown'>>;
    cancelInput: (cause?: CancelComboboxInputCause, focusEditor?: boolean) => void;
    removeInput: (focusEditor?: boolean) => void;
}
declare const useComboboxInput: ({ autoFocus, cancelInputOnArrowLeftRight, cancelInputOnBackspace, cancelInputOnBlur, cancelInputOnDeselect, cancelInputOnEscape, cursorState, forwardUndoRedoToEditor, ref, onCancelInput, }: UseComboboxInputOptions) => UseComboboxInputResult;

declare const useHTMLInputCursorState: (ref: RefObject<HTMLInputElement | null>) => ComboboxInputCursorState;

export { type UseComboboxInputOptions, type UseComboboxInputResult, useComboboxInput, useHTMLInputCursorState };
