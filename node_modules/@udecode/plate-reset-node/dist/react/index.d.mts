import * as _udecode_plate_core_react from '@udecode/plate-core/react';
import * as _udecode_plate_core from '@udecode/plate-core';
import { ResetNodePluginRule, ResetNodeConfig } from '../index.mjs';
import { KeyboardHandler } from '@udecode/plate/react';
import '@udecode/plate';

/**
 * Enables support for resetting block type from rules with React-specific
 * features.
 */
declare const ResetNodePlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"resetNode", {
    disableEditorReset?: boolean;
    disableFirstBlockReset?: boolean;
    rules?: ResetNodePluginRule[];
}, {}, {}, {}>>;

declare const SIMULATE_BACKSPACE: any;
declare const onKeyDownResetNode: KeyboardHandler<ResetNodeConfig>;

export { ResetNodePlugin, SIMULATE_BACKSPACE, onKeyDownResetNode };
