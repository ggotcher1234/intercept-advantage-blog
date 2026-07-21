import * as _udecode_plate_core from '@udecode/plate-core';
import { OverrideEditor } from '@udecode/plate';

/** Enables support for block quotes, useful for quotations and passages. */
declare const BaseBlockquotePlugin: _udecode_plate_core.SlatePlugin<_udecode_plate_core.PluginConfig<"blockquote", {}, {}, {}, {}>>;

declare const withBlockquote: OverrideEditor;

export { BaseBlockquotePlugin, withBlockquote };
