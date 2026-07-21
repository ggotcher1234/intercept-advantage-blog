import * as _udecode_plate_core_react from '@udecode/plate-core/react';
import * as _udecode_plate_core from '@udecode/plate-core';
import { E as ExitBreakRule, a as ExitBreakConfig, b as SoftBreakRule, S as SoftBreakConfig } from '../BaseSoftBreakPlugin-CeLtcSTo.js';
import { KeyboardHandler } from '@udecode/plate/react';
import '@udecode/plate';

declare const ExitBreakPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"exitBreak", {
    rules?: ExitBreakRule[];
}, {}, {}, {}>>;

declare const onKeyDownExitBreak: KeyboardHandler<ExitBreakConfig>;

declare const SingleLinePlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"singleLine", {}, {}, {}, {}>>;

declare const onKeyDownSingleLine: KeyboardHandler;

declare const SoftBreakPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"softBreak", {
    rules?: SoftBreakRule[];
}, {}, {}, {}>>;

declare const onKeyDownSoftBreak: KeyboardHandler<SoftBreakConfig>;

export { ExitBreakPlugin, SingleLinePlugin, SoftBreakPlugin, onKeyDownExitBreak, onKeyDownSingleLine, onKeyDownSoftBreak };
