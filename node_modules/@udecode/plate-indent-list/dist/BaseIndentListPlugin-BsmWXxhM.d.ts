import * as _udecode_plate_core from '@udecode/plate-core';
import { ElementOf, Editor, TNode, NodeEntry, ElementOrTextOf, ElementEntryOf, PluginConfig, TElement, SlateRenderElementProps } from '@udecode/plate';

interface GetSiblingIndentListOptions<N extends ElementOf<E>, E extends Editor = Editor> {
    breakOnEqIndentNeqListStyleType?: boolean;
    breakOnListRestart?: boolean;
    breakOnLowerIndent?: boolean;
    breakQuery?: (siblingNode: TNode, currentNode: TNode) => boolean | undefined;
    getNextEntry?: (entry: NodeEntry<ElementOrTextOf<E>>) => NodeEntry<N> | undefined;
    getPreviousEntry?: (entry: NodeEntry<ElementOrTextOf<E>>) => NodeEntry<N> | undefined;
    /** Query to break lookup */
    eqIndent?: boolean;
    /** Query to validate lookup. If false, check the next sibling. */
    query?: (siblingNode: TNode, currentNode: TNode) => boolean | undefined;
}
/**
 * Get the next sibling indent list node. Default query: the sibling node should
 * have the same listStyleType.
 */
declare const getSiblingIndentList: <N extends ElementOf<E>, E extends Editor = Editor>(editor: E, [node, path]: ElementEntryOf<E>, { breakOnEqIndentNeqListStyleType, breakOnListRestart, breakOnLowerIndent, breakQuery, eqIndent, getNextEntry, getPreviousEntry, query, }: GetSiblingIndentListOptions<N, E>) => NodeEntry<N> | undefined;

declare enum ListStyleType {
    ArabicIndic = "arabic-indic",
    Armenian = "armenian",
    Bengali = "bengali",
    Cambodian = "cambodian",
    Circle = "circle",
    CjkDecimal = "cjk-decimal",
    CjkEarthlyBranch = "cjk-earthly-branch",
    CjkHeavenlyStem = "cjk-heavenly-stem",
    Decimal = "decimal",
    DecimalLeadingZero = "decimal-leading-zero",
    Devanagari = "devanagari",
    Disc = "disc",
    DisclosureClosed = "disclosure-closed",
    DisclosureOpen = "disclosure-open",
    EthiopicNumeric = "ethiopic-numeric",
    Georgian = "georgian",
    Gujarati = "gujarati",
    Gurmukhi = "gurmukhi",
    Hebrew = "hebrew",
    Hiragana = "hiragana",
    HiraganaIroha = "hiragana-iroha",
    Inherit = "inherit",
    Initial = "initial",
    JapaneseFormal = "japanese-formal",
    JapaneseInformal = "japanese-informal",
    Kannada = "kannada",
    Katakana = "katakana",
    KatakanaIroha = "katakana-iroha",
    Khmer = "khmer",
    KoreanHangulFormal = "korean-hangul-formal",
    KoreanHanjaFormal = "korean-hanja-formal",
    KoreanHanjaInformal = "korean-hanja-informal",
    Lao = "lao",
    LowerAlpha = "lower-alpha",
    LowerArmenian = "lower-armenian",
    LowerGreek = "lower-greek",
    LowerLatin = "lower-latin",
    LowerRoman = "lower-roman",
    Malayalam = "malayalam",
    Mongolian = "mongolian",
    Myanmar = "myanmar",
    None = "none",
    Oriya = "oriya",
    Persian = "persian",
    SimpChineseFormal = "simp-chinese-formal",
    SimpChineseInformal = "simp-chinese-informal",
    Square = "square",
    Tamil = "tamil",
    Telugu = "telugu",
    Thai = "thai",
    Tibetan = "tibetan",
    TradChineseFormal = "trad-chinese-formal",
    TradChineseInformal = "trad-chinese-informal",
    UpperAlpha = "upper-alpha",
    UpperArmenian = "upper-armenian",
    UpperLatin = "upper-latin",
    UpperRoman = "upper-roman"
}
declare const ULIST_STYLE_TYPES: readonly [ListStyleType.Disc, ListStyleType.Circle, ListStyleType.Square, ListStyleType.DisclosureOpen, ListStyleType.DisclosureClosed];

/**
 * All list items are normalized to have a listStart prop indicating their
 * position in the list (unless listStart would be 1, in which case it is
 * omitted).
 *
 * ListRestart causes listStart to restart from the given number, regardless of
 * any previous listStart.
 *
 * ListRestartPolite acts like listRestart, except it only takes effect for list
 * items at the start of a list. When not at the start of a list, this prop is
 * ignored, although it is not removed and may take effect in the future.
 */
declare const INDENT_LIST_KEYS: {
    readonly checked: "checked";
    readonly listRestart: "listRestart";
    readonly listRestartPolite: "listRestartPolite";
    readonly listStart: "listStart";
    readonly todo: "todo";
};
type BaseIndentListConfig = PluginConfig<'listStyleType', {
    getSiblingIndentListOptions?: GetSiblingIndentListOptions<TElement>;
    listStyleTypes?: Record<string, {
        type: string;
        isOrdered?: boolean;
        liComponent?: React.FC<SlateRenderElementProps>;
        markerComponent?: React.FC<Omit<SlateRenderElementProps, 'children'>>;
    }>;
    /** Map html element to list style type. */
    getListStyleType?: (element: HTMLElement) => ListStyleType;
}>;
declare const BaseIndentListPlugin: _udecode_plate_core.SlatePlugin<BaseIndentListConfig>;

export { type BaseIndentListConfig as B, type GetSiblingIndentListOptions as G, INDENT_LIST_KEYS as I, ListStyleType as L, ULIST_STYLE_TYPES as U, BaseIndentListPlugin as a, getSiblingIndentList as g };
