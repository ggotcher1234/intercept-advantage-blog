import { TElement, SlateEditor } from '@udecode/plate';

type CancelComboboxInputCause = 'arrowLeft' | 'arrowRight' | 'backspace' | 'blur' | 'deselect' | 'escape' | 'manual';
type ComboboxInputCursorState = {
    atEnd: boolean;
    atStart: boolean;
};
interface TriggerComboboxPluginOptions {
    trigger?: RegExp | string[] | string;
    triggerPreviousCharPattern?: RegExp;
    createComboboxInput?: (trigger: string) => TElement;
    triggerQuery?: (editor: SlateEditor) => boolean;
}

export type { CancelComboboxInputCause as C, TriggerComboboxPluginOptions as T, ComboboxInputCursorState as a };
