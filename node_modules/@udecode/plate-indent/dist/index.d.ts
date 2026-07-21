import { I as IndentConfig } from './BaseIndentPlugin-TLs6Am33.js';
export { B as BaseIndentPlugin, T as TIndentElement } from './BaseIndentPlugin-TLs6Am33.js';
import * as _udecode_plate_core from '@udecode/plate-core';
import { PluginConfig, OverrideEditor, EditorNodesOptions, AnyObject, SlateEditor } from '@udecode/plate';

type TextIndentConfig = PluginConfig<'textIndent', IndentConfig['options']>;
declare const BaseTextIndentPlugin: _udecode_plate_core.SlatePlugin<TextIndentConfig>;

/**
 * - `node.indent` can not exceed `indentMax`
 * - `node.indent` is unset if `node.type` is not in `types`
 */
declare const withIndent: OverrideEditor<IndentConfig>;

interface SetIndentOptions {
    /** GetNodeEntries options */
    getNodesOptions?: EditorNodesOptions;
    /**
     * 1 to indent -1 to outdent
     *
     * @default 1
     */
    offset?: number;
    /** Set other props than the indent one. These will be unset if indent = 0. */
    setNodesProps?: ({ indent }: {
        indent: number;
    }) => AnyObject;
    /** Nodes props to unset when indent = 0. */
    unsetNodesProps?: string[];
}
/** Add offset to the indentation of the selected blocks. */
declare const setIndent: (editor: SlateEditor, { getNodesOptions, offset, setNodesProps, unsetNodesProps, }: SetIndentOptions) => void;

/** Increase the indentation of the selected blocks. */
declare const indent: (editor: SlateEditor, options?: SetIndentOptions) => void;

/** Decrease the indentation of the selected blocks. */
declare const outdent: (editor: SlateEditor, options?: SetIndentOptions) => void;

export { BaseTextIndentPlugin, IndentConfig, type SetIndentOptions, type TextIndentConfig, indent, outdent, setIndent, withIndent };
