import * as _udecode_plate_core from '@udecode/plate-core';
import { createLowlight } from 'lowlight';
import { PluginConfig, TElement, SlateEditor, NodeEntry, OverrideEditor, HtmlDeserializer, Editor, ElementOf, TLocation, ElementEntry, InsertNodesOptions } from '@udecode/plate';
import * as slate from 'slate';

type CodeBlockConfig = PluginConfig<'code_block', {
    /**
     * Default language to use when no language is specified. Set to null to
     * disable syntax highlighting by default.
     */
    defaultLanguage?: string | null;
    /**
     * Lowlight instance to use for highlighting. If not provided, syntax
     * highlighting will be disabled.
     */
    lowlight?: ReturnType<typeof createLowlight> | null;
}>;
declare const BaseCodeLinePlugin: _udecode_plate_core.SlatePlugin<PluginConfig>;
declare const BaseCodeSyntaxPlugin: _udecode_plate_core.SlatePlugin<PluginConfig<"code_syntax", {}, {}, {}, {}>>;
declare const BaseCodeBlockPlugin: _udecode_plate_core.SlatePlugin<CodeBlockConfig>;

interface TCodeBlockElement extends TElement {
    lang?: string;
}

declare const CODE_LINE_TO_DECORATIONS: WeakMap<TElement, slate.DecoratedRange[]>;
declare function codeBlockToDecorations(editor: SlateEditor, [block, blockPath]: NodeEntry<TCodeBlockElement>): Map<TElement, slate.DecoratedRange[]>;
declare function setCodeBlockToDecorations(editor: SlateEditor, [block, blockPath]: NodeEntry<TCodeBlockElement>): void;
declare function resetCodeBlockDecorations(codeBlock: TCodeBlockElement): void;

declare const withCodeBlock: OverrideEditor<CodeBlockConfig>;

declare const withInsertDataCodeBlock: OverrideEditor;

declare const withInsertFragmentCodeBlock: OverrideEditor;

/** Normalize code block node to force the pre>code>div.codeline structure. */
declare const withNormalizeCodeBlock: OverrideEditor;

declare const htmlDeserializerCodeBlock: HtmlDeserializer;

declare const isLangSupported: (lang?: string) => boolean;
declare const isValidSyntax: (code: string, lang?: string) => boolean;
declare const formatCodeBlock: (editor: Editor, { element, }: {
    element: TCodeBlockElement;
}) => void;

declare const formatJson: (code: string) => string;
declare const isValidJson: (code: string) => boolean;

/** If at (default = selection) is in ul>li>p, return li and ul node entries. */
declare const getCodeLineEntry: <N extends ElementOf<E>, E extends SlateEditor>(editor: E, { at }?: {
    at?: TLocation | null;
}) => {
    codeBlock: NodeEntry<N>;
    codeLine: NodeEntry<N>;
} | undefined;

interface IndentCodeLineOptions {
    codeBlock: ElementEntry;
    codeLine: ElementEntry;
    indentDepth?: number;
}
/**
 * Indent if:
 *
 * - The selection is expanded OR
 * - There are no non-whitespace characters left of the cursor Indentation = 2
 *   spaces.
 */
declare const indentCodeLine: (editor: Editor, { codeLine, indentDepth }: IndentCodeLineOptions) => void;

declare const getIndentDepth: (editor: Editor, { codeLine }: IndentCodeLineOptions) => number;

/** Is the selection inside an empty code block */
declare const isCodeBlockEmpty: (editor: SlateEditor) => boolean;

/** Is the selection at the start of the first code line in a code block */
declare const isSelectionAtCodeBlockStart: (editor: SlateEditor) => boolean;

interface OutdentCodeLineOptions {
    codeBlock: ElementEntry;
    codeLine: ElementEntry;
}
/** Outdent the code line. Remove 2 whitespace characters if any. */
declare const outdentCodeLine: (editor: Editor, { codeBlock, codeLine }: OutdentCodeLineOptions) => void;

/** If there is a whitespace character at the start of the code line, delete it. */
declare const deleteStartSpace: (editor: Editor, { codeLine }: OutdentCodeLineOptions) => boolean;

/**
 * Insert a code block: set the node to code line and wrap it with a code block.
 * If the cursor is not at the block start, insert break before.
 */
declare const insertCodeBlock: (editor: SlateEditor, insertNodesOptions?: Omit<InsertNodesOptions, "match">) => void;

/** Insert a code line starting with indentation. */
declare const insertCodeLine: (editor: SlateEditor, indentDepth?: number) => void;

interface CodeBlockInsertOptions {
    defaultType?: string;
    insertNodesOptions?: Omit<InsertNodesOptions, 'match'>;
}
/**
 * Called by toolbars to make sure a code-block gets inserted below a paragraph
 * rather than awkwardly splitting the current selection.
 */
declare const insertEmptyCodeBlock: (editor: SlateEditor, { defaultType, insertNodesOptions, }?: CodeBlockInsertOptions) => void;

declare const toggleCodeBlock: (editor: SlateEditor) => void;

declare const unwrapCodeBlock: (editor: SlateEditor) => void;

export { BaseCodeBlockPlugin, BaseCodeLinePlugin, BaseCodeSyntaxPlugin, CODE_LINE_TO_DECORATIONS, type CodeBlockConfig, type CodeBlockInsertOptions, type IndentCodeLineOptions, type OutdentCodeLineOptions, type TCodeBlockElement, codeBlockToDecorations, deleteStartSpace, formatCodeBlock, formatJson, getCodeLineEntry, getIndentDepth, htmlDeserializerCodeBlock, indentCodeLine, insertCodeBlock, insertCodeLine, insertEmptyCodeBlock, isCodeBlockEmpty, isLangSupported, isSelectionAtCodeBlockStart, isValidJson, isValidSyntax, outdentCodeLine, resetCodeBlockDecorations, setCodeBlockToDecorations, toggleCodeBlock, unwrapCodeBlock, withCodeBlock, withInsertDataCodeBlock, withInsertFragmentCodeBlock, withNormalizeCodeBlock };
