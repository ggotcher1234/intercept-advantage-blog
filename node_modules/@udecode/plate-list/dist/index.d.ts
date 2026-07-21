import { T as TodoListConfig, L as ListConfig } from './BaseListPlugin-kp1pCEoe.js';
export { B as BaseBulletedListPlugin, c as BaseListItemContentPlugin, b as BaseListItemPlugin, d as BaseListPlugin, a as BaseNumberedListPlugin, f as BaseTodoListPlugin, e as TTodoListItemElement, g as toggleBulletedList, t as toggleList, h as toggleNumberedList } from './BaseListPlugin-kp1pCEoe.js';
import { SlateEditor, ElementEntry, EditorNodesOptions, Path, OverrideEditor, NodeEntry, Descendant, TLocation, Point, TRange, Ancestor } from '@udecode/plate';
import '@udecode/plate-core';

declare const indentListItems: (editor: SlateEditor) => void;

/** Insert list item if selection in li>p. TODO: test */
declare const insertListItem: (editor: SlateEditor) => boolean;

/** Insert todo list item if selection in li>p. TODO: test */
declare const insertTodoListItem: (editor: SlateEditor, { inheritCheckStateOnLineEndBreak, inheritCheckStateOnLineStartBreak, }: TodoListConfig["options"]) => boolean;

interface MoveListItemDownOptions {
    list: ElementEntry;
    listItem: ElementEntry;
}
declare const moveListItemDown: (editor: SlateEditor, { list, listItem }: MoveListItemDownOptions) => false | undefined;

interface MoveListItemSublistItemsToListItemSublistOptions {
    /** The list item to merge. */
    fromListItem: ElementEntry;
    /** The list item where to merge. */
    toListItem: ElementEntry;
    /** Move to the start of the list instead of the end. */
    start?: boolean;
}
/**
 * Move fromListItem sublist list items to the end of `toListItem` sublist. If
 * there is no `toListItem` sublist, insert one.
 */
declare const moveListItemSublistItemsToListItemSublist: (editor: SlateEditor, { fromListItem, start, toListItem, }: MoveListItemSublistItemsToListItemSublistOptions) => boolean;

interface MoveListItemUpOptions {
    list: ElementEntry;
    listItem: ElementEntry;
}
/** Move a list item up. */
declare const moveListItemUp: (editor: SlateEditor, { list, listItem }: MoveListItemUpOptions) => boolean;

type MoveListItemsOptions = {
    at?: EditorNodesOptions['at'];
    enableResetOnShiftTab?: boolean;
    increase?: boolean;
};
declare const moveListItems: (editor: SlateEditor, { at, enableResetOnShiftTab, increase, }?: MoveListItemsOptions) => boolean | undefined;

interface MergeListItemIntoListOptions {
    /**
     * Delete `fromListItem` sublist if true.
     *
     * @default true
     */
    deleteFromList?: boolean;
    /** List items of the list will be moved. */
    fromList?: ElementEntry;
    /** List items of the sublist of this node will be moved. */
    fromListItem?: ElementEntry;
    fromStartIndex?: number;
    to?: Path;
    /** List items will be moved in this list. */
    toList?: ElementEntry;
    /** List position where to move the list items. */
    toListIndex?: number | null;
}
/**
 * Move the list items of the sublist of `fromListItem` to `toList` (if
 * `fromListItem` is defined). Move the list items of `fromList` to `toList` (if
 * `fromList` is defined).
 */
declare const moveListItemsToList: (editor: SlateEditor, { deleteFromList, fromList, fromListItem, fromStartIndex, to: _to, toList, toListIndex, }: MergeListItemIntoListOptions) => boolean;

declare const moveListSiblingsAfterCursor: (editor: SlateEditor, { at, to, }: {
    at: Path;
    to: Path;
}) => false | void;

/** If list is not nested and if li is not the first child, move li up. */
declare const removeFirstListItem: (editor: SlateEditor, { list, listItem, }: {
    list: ElementEntry;
    listItem: ElementEntry;
}) => boolean;

interface RemoveListItemOptions {
    list: ElementEntry;
    listItem: ElementEntry;
    reverse?: boolean;
}
/** Remove list item and move its sublist to list if any. */
declare const removeListItem: (editor: SlateEditor, { list, listItem, reverse }: RemoveListItemOptions) => boolean;

type UnindentListItemsOptions = Omit<MoveListItemsOptions, 'increase'>;
declare const unindentListItems: (editor: SlateEditor, options?: UnindentListItemsOptions) => boolean | undefined;

declare const unwrapList: (editor: SlateEditor, { at }?: {
    at?: Path;
}) => void;

declare const withDeleteForwardList: OverrideEditor<ListConfig>;

declare const withDeleteFragmentList: OverrideEditor<ListConfig>;

declare const withInsertFragmentList: OverrideEditor<ListConfig>;

/** Normalize list node to force the ul>li>p+ul structure. */
declare const withNormalizeList: OverrideEditor<ListConfig>;

declare const withTodoList: OverrideEditor<TodoListConfig>;

/**
 * Recursively get all the:
 *
 * - Block children
 * - Inline children except those at excludeDepth
 */
declare const getDeepInlineChildren: (editor: SlateEditor, { children, }: {
    children: NodeEntry<Descendant>[];
}) => NodeEntry<Descendant>[];
/**
 * If the list item has no child: insert an empty list item container. Else:
 * move the children that are not valid to the list item container.
 */
declare const normalizeListItem: (editor: SlateEditor, { listItem, validLiChildrenTypes, }: {
    listItem: ElementEntry;
} & ListConfig["options"]) => boolean;

declare const normalizeNestedList: (editor: SlateEditor, { nestedListItem }: {
    nestedListItem: ElementEntry;
}) => boolean | undefined;

/**
 * Find the highest end list that can be deleted. Its path should be different
 * to diffListPath. If the highest end list 2+ items, return liPath. Get the
 * parent list until:
 *
 * - The list has less than 2 items.
 * - Its path is not equals to diffListPath.
 */
declare const getHighestEmptyList: (editor: SlateEditor, { diffListPath, liPath, }: {
    liPath: Path;
    diffListPath?: Path;
}) => Path | undefined;

/**
 * Returns the nearest li and ul / ol wrapping node entries for a given path
 * (default = selection)
 */
declare const getListItemEntry: (editor: SlateEditor, { at }?: {
    at?: TLocation | null;
}) => {
    list: ElementEntry;
    listItem: ElementEntry;
} | undefined;

/** Searches upward for the root list element */
declare const getListRoot: (editor: SlateEditor, at?: Path | Point | TRange | null) => ElementEntry | undefined;

declare const getListTypes: (editor: SlateEditor) => string[];

/**
 * Returns the nearest li and ul / ol wrapping node entries for a given path
 * (default = selection)
 */
declare const getTodoListItemEntry: (editor: SlateEditor, { at }?: {
    at?: TLocation | null;
}) => {
    list: ElementEntry;
    listItem: ElementEntry;
} | undefined;

/** Is there a list child in the node. */
declare const hasListChild: (editor: SlateEditor, node: Ancestor) => boolean;

/** Is selection across blocks with list items */
declare const isAcrossListItems: (editor: SlateEditor, at?: TRange | null) => boolean;

/** Is the list nested, i.e. its parent is a list item. */
declare const isListNested: (editor: SlateEditor, listPath: Path) => boolean;

declare const isListRoot: (editor: SlateEditor, node: Descendant) => boolean;

declare const someList: (editor: SlateEditor, type: string) => boolean;

export { ListConfig, type MergeListItemIntoListOptions, type MoveListItemDownOptions, type MoveListItemSublistItemsToListItemSublistOptions, type MoveListItemUpOptions, type MoveListItemsOptions, type RemoveListItemOptions, TodoListConfig, type UnindentListItemsOptions, getDeepInlineChildren, getHighestEmptyList, getListItemEntry, getListRoot, getListTypes, getTodoListItemEntry, hasListChild, indentListItems, insertListItem, insertTodoListItem, isAcrossListItems, isListNested, isListRoot, moveListItemDown, moveListItemSublistItemsToListItemSublist, moveListItemUp, moveListItems, moveListItemsToList, moveListSiblingsAfterCursor, normalizeListItem, normalizeNestedList, removeFirstListItem, removeListItem, someList, unindentListItems, unwrapList, withDeleteForwardList, withDeleteFragmentList, withInsertFragmentList, withNormalizeList, withTodoList };
