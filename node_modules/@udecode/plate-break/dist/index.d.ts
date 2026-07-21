import { E as ExitBreakRule } from './BaseSoftBreakPlugin-CeLtcSTo.js';
export { B as BaseExitBreakPlugin, c as BaseSoftBreakPlugin, a as ExitBreakConfig, S as SoftBreakConfig, b as SoftBreakRule } from './BaseSoftBreakPlugin-CeLtcSTo.js';
import { Editor, SlateEditor, OverrideEditor } from '@udecode/plate';
import * as _udecode_plate_core from '@udecode/plate-core';

/**
 * Check if the selection is at the edge of its parent block. If it is and if
 * the selection is expanded, delete its content.
 */
declare const exitBreakAtEdges: (editor: Editor, { end, start, }: {
    end?: boolean;
    start?: boolean;
}) => {
    isEdge: boolean;
    isStart: boolean;
    queryEdge: boolean;
};

declare const exitBreak: (editor: SlateEditor, { before, defaultType, level, query, relative, }: Omit<ExitBreakRule, "hotkey">) => true | undefined;

/** Forces editor to only have one line. */
declare const BaseSingleLinePlugin: _udecode_plate_core.SlatePlugin<_udecode_plate_core.PluginConfig<"singleLine", {}, {}, {}, {}>>;

declare const withSingleLine: OverrideEditor;

export { BaseSingleLinePlugin, ExitBreakRule, exitBreak, exitBreakAtEdges, withSingleLine };
