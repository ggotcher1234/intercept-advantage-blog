import { H as Heading } from './types-BLNkiwWE.js';
export { B as BaseHeadingPlugin, a as HeadingConfig, b as HeadingLevel } from './types-BLNkiwWE.js';
import * as _udecode_plate_core from '@udecode/plate-core';
import { PluginConfig, SlateEditor, InsertNodesOptions, TNode } from '@udecode/plate';

type TocConfig = PluginConfig<'toc', {
    isScroll: boolean;
    topOffset: number;
    queryHeading?: (editor: SlateEditor) => Heading[];
}>;
declare const BaseTocPlugin: _udecode_plate_core.SlatePlugin<TocConfig>;

declare const HEADING_KEYS: {
    readonly h1: "h1";
    readonly h2: "h2";
    readonly h3: "h3";
    readonly h4: "h4";
    readonly h5: "h5";
    readonly h6: "h6";
};
declare const HEADING_LEVELS: ("h1" | "h2" | "h3" | "h4" | "h5" | "h6")[];

declare const insertToc: (editor: SlateEditor, options?: InsertNodesOptions) => void;

declare const isHeading: (node: TNode) => unknown;

export { BaseTocPlugin, HEADING_KEYS, HEADING_LEVELS, Heading, type TocConfig, insertToc, isHeading };
