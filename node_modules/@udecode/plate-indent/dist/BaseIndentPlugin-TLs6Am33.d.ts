import * as _udecode_plate_core from '@udecode/plate-core';
import { PluginConfig, TElement } from '@udecode/plate';

type IndentConfig = PluginConfig<'indent', {
    /** Maximum number of indentation. */
    indentMax?: number;
    /**
     * Indentation offset used in `(offset * element.indent) + unit`.
     *
     * @default 40
     */
    offset?: number;
    /**
     * Indentation unit used in `(offset * element.indent) + unit`.
     *
     * @default 'px'
     */
    unit?: string;
}>;
interface TIndentElement extends TElement {
    indent: number;
}
declare const BaseIndentPlugin: _udecode_plate_core.SlatePlugin<IndentConfig>;

export { BaseIndentPlugin as B, type IndentConfig as I, type TIndentElement as T };
