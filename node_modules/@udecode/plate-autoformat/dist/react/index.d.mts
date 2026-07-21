import * as _udecode_plate_core_react from '@udecode/plate-core/react';
import * as _udecode_plate_core from '@udecode/plate-core';
import { a as AutoformatRule, A as AutoformatConfig } from '../BaseAutoformatPlugin-Cn7eN8JL.mjs';
import { KeyboardHandler } from '@udecode/plate/react';
import '@udecode/plate';

declare const AutoformatPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"autoformat", {
    enableUndoOnDelete?: boolean;
    rules?: AutoformatRule[];
}, {}, {}, {}>>;

declare const onKeyDownAutoformat: KeyboardHandler<AutoformatConfig>;

export { AutoformatPlugin, onKeyDownAutoformat };
