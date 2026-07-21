import * as lowlight from 'lowlight';
import * as _udecode_plate_core_react from '@udecode/plate-core/react';
import * as _udecode_plate_core from '@udecode/plate-core';
import { KeyboardHandler } from '@udecode/plate/react';

declare const CodeSyntaxPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"code_syntax", {}, {}, {}, {}>>;
declare const CodeLinePlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<any, {}, {}, {}, {}>>;
/** Enables support for pre-formatted code blocks. */
declare const CodeBlockPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"code_block", {
    defaultLanguage?: string | null;
    lowlight?: ReturnType<typeof lowlight.createLowlight> | null;
}, {}, {}, {}>>;

/**
 * - Shift+Tab: outdent code line.
 * - Tab: indent code line.
 */
declare const onKeyDownCodeBlock: KeyboardHandler;

export { CodeBlockPlugin, CodeLinePlugin, CodeSyntaxPlugin, onKeyDownCodeBlock };
