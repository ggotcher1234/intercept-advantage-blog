import { T as TriggerComboboxPluginOptions } from './types-CKfVCavl.js';
export { C as CancelComboboxInputCause, a as ComboboxInputCursorState } from './types-CKfVCavl.js';
import { OverrideEditor, PluginConfig } from '@udecode/plate';

declare const withTriggerCombobox: OverrideEditor<PluginConfig<any, TriggerComboboxPluginOptions>>;

interface FilterWordsOptions {
    prefixMode?: 'all-words' | 'last-word' | 'none';
    wordBoundary?: RegExp;
    wordQuantifier?: 'match-all' | 'match-any';
}
declare const filterWords: (haystack: string, needle: string, { prefixMode, wordBoundary, wordQuantifier, }?: FilterWordsOptions) => boolean;

export { type FilterWordsOptions, TriggerComboboxPluginOptions, filterWords, withTriggerCombobox };
