import * as _udecode_plate_core from '@udecode/plate-core';
import { PluginConfig, QueryNodeOptions, OverrideEditor } from '@udecode/plate';

type TrailingBlockConfig = PluginConfig<'trailingBlock', {
    /** Level where the trailing node should be, the first level being 0. */
    level?: number;
    /** Type of the trailing block */
    type?: string;
} & QueryNodeOptions>;
/** @see {@link withTrailingBlock} */
declare const TrailingBlockPlugin: _udecode_plate_core.SlatePlugin<PluginConfig<"trailingBlock", {
    type: string;
} & {
    /** Level where the trailing node should be, the first level being 0. */
    level?: number;
    /** Type of the trailing block */
    type?: string;
} & QueryNodeOptions, {}, {}, {}>>;

/**
 * Add a trailing block when the last node type is not `type` and when the
 * editor has .
 */
declare const withTrailingBlock: OverrideEditor<TrailingBlockConfig>;

export { type TrailingBlockConfig, TrailingBlockPlugin, withTrailingBlock };
