import * as _udecode_plate_core from '@udecode/plate-core';
import { Point, Editor, SlateEditor, PluginConfig } from '@udecode/plate';

type GetMatchPointsReturnType = {
    afterStartMatchPoint: Point | undefined;
    beforeEndMatchPoint: Point;
    beforeStartMatchPoint: Point | undefined;
} | undefined;
declare const getMatchPoints: (editor: Editor, { end, start }: MatchRange) => {
    afterStartMatchPoint: Point | undefined;
    beforeEndMatchPoint: Point;
    beforeStartMatchPoint: Point | undefined;
} | undefined;

interface AutoformatBlockRule extends AutoformatCommonRule {
    match: string[] | string;
    /**
     * - Text: insert text.
     * - Block: set block type or custom format.
     * - Mark: insert mark(s) between matches.
     *
     * @default 'text'
     */
    mode: 'block';
    /**
     * If true, allow to autoformat even if there is a block of the same type
     * above the selected block.
     *
     * @default false
     */
    allowSameTypeAbove?: boolean;
    /**
     * Custom formatting function.
     *
     * @default editor.tf.setNodes({ type }, { match: (n) => editor.api.isBlock(n) })
     *
     * @param matchString - The string that was matched
     */
    format?: (editor: SlateEditor, ctx: {
        matchString: string;
    }) => void;
    /**
     * If true, `match` will be interpreted as regex expression(s). Otherwise, it
     * will be compared by string equality.
     *
     * @default false
     */
    matchByRegex?: boolean;
    /**
     * Function called just before `format`. Generally used to reset the selected
     * block.
     */
    preFormat?: (editor: SlateEditor) => void;
    /**
     * If true, the trigger should be at block start to allow autoformatting.
     *
     * @default true
     */
    triggerAtBlockStart?: boolean;
    /**
     * For `mode: 'block'`: set block type. If `format` is defined, this field is
     * ignored. For `mode: 'mark'`: Mark(s) to add.
     */
    type?: string;
}
interface AutoformatCommonRule {
    /**
     * The rule applies when the trigger and the text just before the cursor
     * matches. For `mode: 'block'`: lookup for the end match(es) before the
     * cursor. For `mode: 'text'`: lookup for the end match(es) before the cursor.
     * If `format` is an array, also lookup for the start match(es). For `mode:
     * 'mark'`: lookup for the start and end matches. Note: `'_*'`, `['_*']` and
     * `{ start: '_*', end: '*_' }` are equivalent.
     */
    match: MatchRange | MatchRange[] | string[] | string;
    /**
     * If true, insert the triggering character after autoformatting.
     *
     * @default: false
     */
    insertTrigger?: boolean;
    /** Query to allow autoformat. */
    query?: (editor: SlateEditor, options: AutoformatQueryOptions) => boolean;
    /**
     * Triggering character to autoformat.
     *
     * @default the last character of `match` or `match.end`
     */
    trigger?: string[] | string;
}
interface AutoformatMarkRule extends AutoformatCommonRule {
    mode: 'mark';
    /** Mark(s) to add. */
    type: string[] | string;
    /** If false, do not format when the string can be trimmed. */
    ignoreTrim?: boolean;
}
interface AutoformatQueryOptions extends Omit<AutoformatCommonRule, 'query'> {
    /** `insertText` text. */
    text: string;
}
type AutoformatRule = AutoformatBlockRule | AutoformatMarkRule | AutoformatTextRule;
interface AutoformatTextRule extends AutoformatCommonRule {
    /**
     * String: the matched text is replaced by that string. string[]: the matched
     * texts are replaced by these strings. function: called when there is a
     * match.
     */
    format: ((editor: SlateEditor, options: GetMatchPointsReturnType) => void) | string[] | string;
    match: string[] | string;
    mode: 'text';
}
interface MatchRange {
    end: string;
    start: string;
}

type AutoformatConfig = PluginConfig<'autoformat', {
    enableUndoOnDelete?: boolean;
    /** A list of triggering rules. */
    rules?: AutoformatRule[];
}>;
/** @see {@link withAutoformat} */
declare const BaseAutoformatPlugin: _udecode_plate_core.SlatePlugin<AutoformatConfig>;

export { type AutoformatConfig as A, BaseAutoformatPlugin as B, type GetMatchPointsReturnType as G, type MatchRange as M, type AutoformatRule as a, type AutoformatBlockRule as b, type AutoformatMarkRule as c, type AutoformatTextRule as d, type AutoformatCommonRule as e, type AutoformatQueryOptions as f, getMatchPoints as g };
