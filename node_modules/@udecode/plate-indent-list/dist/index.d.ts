import { B as BaseIndentListConfig, G as GetSiblingIndentListOptions, L as ListStyleType } from './BaseIndentListPlugin-BsmWXxhM.js';
export { a as BaseIndentListPlugin, I as INDENT_LIST_KEYS, U as ULIST_STYLE_TYPES, g as getSiblingIndentList } from './BaseIndentListPlugin-BsmWXxhM.js';
import { RenderStaticNodeWrapper, OverrideEditor, Editor, NodeEntry, ElementOf, ElementEntryOf, EditorAboveOptions, SlateEditor, TElement, TLocation, Path } from '@udecode/plate';
import '@udecode/plate-core';

declare const renderIndentListBelowNodes: RenderStaticNodeWrapper;

declare const withIndentList: OverrideEditor<BaseIndentListConfig>;

declare const withNormalizeIndentList: OverrideEditor<BaseIndentListConfig>;

/** Unset IndentListPlugin.key, listStart if BaseIndentPlugin.key is not defined. */
declare const normalizeIndentListNotIndented: (editor: Editor, [node, path]: NodeEntry) => true | undefined;

declare const getIndentListExpectedListStart: (entry: NodeEntry, prevEntry?: NodeEntry) => number;
declare const normalizeIndentListStart: <N extends ElementOf<E>, E extends Editor = Editor>(editor: E, entry: ElementEntryOf<E>, options?: Partial<GetSiblingIndentListOptions<N, E>>) => boolean;

declare const shouldMergeNodesRemovePrevNodeIndentList: OverrideEditor;

declare const withDeleteBackwardIndentList: OverrideEditor<BaseIndentListConfig>;

declare const withInsertBreakIndentList: OverrideEditor<BaseIndentListConfig>;

declare const areEqListStyleType: (editor: Editor, entries: NodeEntry[], { listStyleType, }: {
    listStyleType?: string;
}) => boolean;

declare const getIndentListAbove: <N extends ElementOf<E>, E extends Editor = Editor>(editor: E, options?: Omit<EditorAboveOptions, "match">) => NodeEntry<N> | undefined;

interface GetIndentListSiblingsOptions<N extends ElementOf<E>, E extends Editor = Editor> extends Partial<GetSiblingIndentListOptions<N, E>> {
    current?: boolean;
    next?: boolean;
    previous?: boolean;
}
declare const getIndentListSiblings: <N extends ElementOf<E>, E extends Editor = Editor>(editor: E, entry: ElementEntryOf<E>, { current, next, previous, ...options }?: GetIndentListSiblingsOptions<N, E>) => NodeEntry[];

/** Get the next indent list. */
declare const getNextIndentList: <N extends ElementOf<E>, E extends Editor = Editor>(editor: E, entry: ElementEntryOf<E>, options?: Partial<GetSiblingIndentListOptions<N, E>>) => NodeEntry<N> | undefined;

/** Get the previous indent list node. */
declare const getPreviousIndentList: <N extends ElementOf<E>, E extends Editor = Editor>(editor: E, entry: ElementEntryOf<E>, options?: Partial<GetSiblingIndentListOptions<N, E>>) => NodeEntry<N> | undefined;

/**
 * Get the first sibling list style type at the given indent. If none, return
 * the entry list style type.
 */
declare const getSiblingListStyleType: <E extends SlateEditor>(editor: E, { entry, indent, ...options }: {
    entry: NodeEntry<TElement>;
    indent: number;
} & GetIndentListSiblingsOptions<ElementOf<E>, E>) => ListStyleType;

declare const someIndentList: (editor: SlateEditor, type: string[] | string) => boolean;

declare const someIndentTodo: (editor: SlateEditor) => boolean;

interface IndentListOptions {
    at?: TLocation;
    listRestart?: number;
    listRestartPolite?: number;
    listStyleType?: ListStyleType | string;
}
/** Increase the indentation of the selected blocks. */
declare const indentList: (editor: SlateEditor, { listStyleType, ...options }?: IndentListOptions) => void;
declare const indentTodo: (editor: SlateEditor, { listStyleType, ...options }?: IndentListOptions) => void;

/** Decrease the indentation of the selected blocks. */
declare const outdentList: (editor: SlateEditor, options?: IndentListOptions) => void;

declare const setIndentListNode: (editor: Editor, { at, indent, listStyleType, }: {
    at: Path;
    indent?: number;
    listStyleType?: string;
}) => void;
declare const setIndentTodoNode: (editor: Editor, { at, indent, listStyleType, }: {
    at: Path;
    indent?: number;
    listStyleType?: string;
}) => void;

/**
 * Set indent list to the given entries. Add indent if listStyleType was not
 * defined.
 */
declare const setIndentListNodes: (editor: Editor, entries: NodeEntry[], { listStyleType, }: {
    listStyleType?: string;
}) => void;

/** Set indent list to entry + siblings. */
declare const setIndentListSiblingNodes: <N extends ElementOf<E>, E extends Editor = Editor>(editor: E, entry: ElementEntryOf<E>, { getSiblingIndentListOptions, listStyleType, }: {
    getSiblingIndentListOptions?: GetSiblingIndentListOptions<N, E>;
    listStyleType?: string;
}) => void;

/** Toggle indent list. */
declare const toggleIndentList: <N extends ElementOf<E>, E extends SlateEditor = SlateEditor>(editor: E, options: IndentListOptions, getSiblingIndentListOptions?: GetSiblingIndentListOptions<N, E>) => void;

declare const toggleIndentListByPath: (editor: SlateEditor, [node, path]: NodeEntry, listStyleType: string) => void;
declare const toggleIndentListByPathUnSet: (editor: SlateEditor, [, path]: NodeEntry) => void;

/** Set indent list if not set. */
declare const toggleIndentListSet: (editor: Editor, [node, _path]: NodeEntry, { listStyleType, ...options }: IndentListOptions) => true | undefined;

/** Unset list style type if already set. */
declare const toggleIndentListUnset: (editor: Editor, [node, path]: NodeEntry, { listStyleType, }: {
    listStyleType?: string;
}) => true | undefined;

export { BaseIndentListConfig, type GetIndentListSiblingsOptions, GetSiblingIndentListOptions, type IndentListOptions, ListStyleType, areEqListStyleType, getIndentListAbove, getIndentListExpectedListStart, getIndentListSiblings, getNextIndentList, getPreviousIndentList, getSiblingListStyleType, indentList, indentTodo, normalizeIndentListNotIndented, normalizeIndentListStart, outdentList, renderIndentListBelowNodes, setIndentListNode, setIndentListNodes, setIndentListSiblingNodes, setIndentTodoNode, shouldMergeNodesRemovePrevNodeIndentList, someIndentList, someIndentTodo, toggleIndentList, toggleIndentListByPath, toggleIndentListByPathUnSet, toggleIndentListSet, toggleIndentListUnset, withDeleteBackwardIndentList, withIndentList, withInsertBreakIndentList, withNormalizeIndentList };
