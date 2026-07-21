import * as _udecode_plate_core from '@udecode/plate-core';
import { QueryNodeOptions, PluginConfig } from '@udecode/plate';

interface ExitBreakRule {
    /** Hotkey to trigger exit break. */
    hotkey: string;
    /** @see {@link QueryNodeOptions} */
    query?: {
        /** When the selection is at the end of the block above. */
        end?: boolean;
        /** When the selection is at the start of the block above. */
        start?: boolean;
    } & QueryNodeOptions;
    /** Exit before the selected block if true. */
    before?: boolean;
    defaultType?: string;
    /** Path level where to exit. Default is 0. */
    level?: number;
    /**
     * If true, exit relative to current level. Otherwise, exit at the given
     * level. Default is false.
     */
    relative?: boolean;
}

type ExitBreakConfig = PluginConfig<'exitBreak', {
    rules?: ExitBreakRule[];
}>;
/**
 * Insert soft break following configurable rules. Each rule specifies a hotkey
 * and query options.
 */
declare const BaseExitBreakPlugin: _udecode_plate_core.SlatePlugin<ExitBreakConfig>;

type SoftBreakConfig = PluginConfig<'softBreak', {
    rules?: SoftBreakRule[];
}>;
interface SoftBreakRule {
    hotkey: string;
    /** Filter the block types where the rule applies. */
    query?: QueryNodeOptions;
}
/**
 * Insert soft break following configurable rules. Each rule specifies a hotkey
 * and query options.
 */
declare const BaseSoftBreakPlugin: _udecode_plate_core.SlatePlugin<SoftBreakConfig>;

export { BaseExitBreakPlugin as B, type ExitBreakRule as E, type SoftBreakConfig as S, type ExitBreakConfig as a, type SoftBreakRule as b, BaseSoftBreakPlugin as c };
