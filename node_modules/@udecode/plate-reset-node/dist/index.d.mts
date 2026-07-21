import * as _udecode_plate_core from '@udecode/plate-core';
import { SlateEditor, PluginConfig } from '@udecode/plate';

interface ResetNodePluginRule {
    /** Additional condition to the rule. */
    predicate: (editor: SlateEditor) => boolean;
    /** Node types where the rule applies. */
    types: string[];
    defaultType?: string;
    hotkey?: string[] | string;
    /** Callback called when resetting. */
    onReset?: (editor: SlateEditor) => void;
}

type ResetNodeConfig = PluginConfig<'resetNode', {
    disableEditorReset?: boolean;
    disableFirstBlockReset?: boolean;
    rules?: ResetNodePluginRule[];
}>;
/** Enables support for resetting block type from rules. */
declare const BaseResetNodePlugin: _udecode_plate_core.SlatePlugin<ResetNodeConfig>;

export { BaseResetNodePlugin, type ResetNodeConfig, type ResetNodePluginRule };
