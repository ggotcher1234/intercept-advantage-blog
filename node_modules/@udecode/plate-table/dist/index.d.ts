import { T as TTableCellElement, a as TTableElement, B as BorderDirection, b as TableStoreSizeOverrides, c as TableConfig } from './BaseTablePlugin-C53dDW-d.js';
export { f as BaseTableCellHeaderPlugin, e as BaseTableCellPlugin, g as BaseTablePlugin, d as BaseTableRowPlugin, h as BorderStyle, q as BorderStylesDefault, A as CellIndices, C as CreateCellOptions, G as GetEmptyRowNodeOptions, l as GetEmptyTableNodeOptions, i as TTableRowElement, u as deleteColumn, v as deleteRow, w as deleteTable, D as getCellIndices, o as getColSpan, j as getEmptyCellNode, k as getEmptyRowNode, m as getEmptyTableNode, p as getRowSpan, r as getTableCellBorders, t as getTableCellSize, x as insertTable, y as insertTableColumn, z as insertTableRow, n as mergeTableCells, s as splitTableCell } from './BaseTablePlugin-C53dDW-d.js';
import { SlateEditor, Path, NodeEntry, TRange, ElementEntry, TElement, Editor, EditorAboveOptions, TLocation, NormalizeInitialValue, OverrideEditor } from '@udecode/plate';
import * as _udecode_slate from '@udecode/slate';
import '@udecode/plate-core';

declare function computeCellIndices(editor: SlateEditor, { all, cellNode, tableNode, }: {
    all?: boolean;
    cellNode?: TTableCellElement;
    tableNode?: TTableElement;
}): {
    col: number;
    row: number;
} | undefined;

declare const getCellRowIndexByPath: (cellPath: Path) => number;

/** Get td and th types */
declare const getCellTypes: (editor: SlateEditor) => string[];

declare const deleteTableMergeColumn: (editor: SlateEditor) => void;

declare const deleteColumnWhenExpanded: (editor: SlateEditor, tableEntry: NodeEntry<TTableCellElement>) => void;

declare const deleteTableMergeRow: (editor: SlateEditor) => void;

declare const deleteRowWhenExpanded: (editor: SlateEditor, [table, tablePath]: NodeEntry<TTableCellElement>) => void;

declare const findCellByIndexes: (editor: SlateEditor, table: TTableElement, searchRowIndex: number, searchColIndex: number) => TTableCellElement | undefined;

declare const getCellIndicesWithSpans: ({ col, row }: {
    col: number;
    row: number;
}, endCell: TTableCellElement) => {
    col: number;
    row: number;
};

declare const getCellPath: (editor: SlateEditor, tableEntry: NodeEntry<TTableElement>, curRowIndex: number, curColIndex: number) => number[];

declare const getSelectionWidth: <T extends [TTableCellElement, Path]>(cells: T[]) => number;

type FormatType = 'all' | 'cell' | 'table';
interface GetTableGridByRangeOptions$1<T extends FormatType> {
    at: TRange;
    /**
     * Format of the output:
     *
     * - Table element
     * - Array of cells
     */
    format?: T;
}
type GetTableGridReturnType<T> = T extends 'all' ? TableGridEntries : ElementEntry[];
interface TableGridEntries {
    cellEntries: ElementEntry[];
    tableEntries: ElementEntry[];
}
/**
 * Get sub table between 2 cell paths. Ensure that the selection is always a
 * valid table grid.
 */
declare const getTableMergeGridByRange: <T extends FormatType>(editor: SlateEditor, { at, format }: GetTableGridByRangeOptions$1<T>) => GetTableGridReturnType<T>;

declare const getTableMergedColumnCount: (tableNode: TElement) => number;

declare const insertTableMergeColumn: (editor: SlateEditor, { at, before, fromCell, header, select: shouldSelect, }?: {
    /** Exact path of the cell to insert the column at. Will overrule `fromCell`. */
    at?: Path;
    /** Insert the column before the current column instead of after */
    before?: boolean;
    /** Path of the cell to insert the column from. */
    fromCell?: Path;
    header?: boolean;
    select?: boolean;
}) => void;

declare const insertTableMergeRow: (editor: SlateEditor, { at, before, fromRow, header, select: shouldSelect, }?: {
    /** Exact path of the row to insert the column at. Will overrule `fromRow`. */
    at?: Path;
    /** Insert the row before the current row instead of after */
    before?: boolean;
    fromRow?: Path;
    header?: boolean;
    select?: boolean;
}) => void;

/**
 * Checks if the given table is rectangular, meaning all rows have the same
 * effective number of cells, considering colspan and rowspan.
 */
declare const isTableRectangular: (table?: TTableElement) => boolean;

declare const getCellInNextTableRow: (editor: Editor, currentRowPath: Path) => NodeEntry | undefined;

declare const getCellInPreviousTableRow: (editor: Editor, currentRowPath: Path) => NodeEntry | undefined;

declare const getLeftTableCell: (editor: SlateEditor, { at: cellPath, }?: {
    at?: Path;
}) => _udecode_slate.NodeEntry<TTableCellElement> | undefined;

declare const getNextTableCell: (editor: Editor, currentCell: NodeEntry, currentPath: Path, currentRow: NodeEntry) => NodeEntry | undefined;

declare const getPreviousTableCell: (editor: Editor, currentCell: NodeEntry, currentPath: Path, currentRow: NodeEntry) => NodeEntry | undefined;

interface GetSelectedCellsBordersOptions {
    select?: {
        none?: boolean;
        outer?: boolean;
        side?: boolean;
    };
}
interface TableBorderStates {
    bottom: boolean;
    left: boolean;
    none: boolean;
    outer: boolean;
    right: boolean;
    top: boolean;
}
/**
 * Get all border states for the selected cells at once. Returns an object with
 * boolean flags for each border state:
 *
 * - Top/bottom/left/right: true if border is visible (size > 0)
 * - Outer: true if all outer borders are visible
 * - None: true if all borders are hidden (size === 0)
 */
declare const getSelectedCellsBorders: (editor: SlateEditor, selectedCells?: TElement[] | null, options?: GetSelectedCellsBordersOptions) => TableBorderStates;
/**
 * Tells if the entire selection is currently borderless (size=0 on all edges).
 * If **any** edge is > 0, returns false.
 */
declare function isSelectedCellBordersNone(editor: SlateEditor, cells: TTableCellElement[]): boolean;
/**
 * Tells if the bounding rectangle for the entire selection is fully set for the
 * **outer** edges, i.e. top/left/bottom/right edges have size=1. We ignore
 * internal edges, only bounding rectangle edges.
 */
declare function isSelectedCellBordersOuter(editor: SlateEditor, cells: TTableCellElement[]): boolean;
/**
 * Tells if the bounding rectangle for the entire selection is fully set for
 * that single side. Example: border='top' => if every cell that sits along the
 * top boundary has top=1.
 */
declare function isSelectedCellBorder(editor: SlateEditor, cells: TTableCellElement[], side: BorderDirection): boolean;

/** Return bounding box [minRow..maxRow, minCol..maxCol] of all selected cells. */
declare function getSelectedCellsBoundingBox(editor: SlateEditor, cells: TTableCellElement[]): {
    maxCol: number;
    maxRow: number;
    minCol: number;
    minRow: number;
};

declare const getTableAbove: (editor: SlateEditor, options?: EditorAboveOptions) => _udecode_slate.NodeEntry<_udecode_slate.TElement> | undefined;

declare const getTableColumnCount: (tableNode: TElement) => number;

/** Get table column index of a cell node. */
declare const getTableColumnIndex: (editor: Editor, cellNode: TElement) => number;

/**
 * If at (default = selection) is in table>tr>td|th, return table, row, and cell
 * node entries.
 */
declare const getTableEntries: (editor: SlateEditor, { at }?: {
    at?: TLocation | null;
}) => {
    cell: _udecode_slate.NodeEntry<_udecode_slate.TElement | _udecode_slate.TText>;
    row: _udecode_slate.NodeEntry<_udecode_slate.TElement | _udecode_slate.Editor<_udecode_slate.Value>>;
    table: _udecode_slate.NodeEntry<_udecode_slate.TElement | _udecode_slate.Editor<_udecode_slate.Value>>;
} | undefined;

interface GetTableGridByRangeOptions {
    at: TRange;
    /**
     * Format of the output:
     *
     * - Table element
     * - Array of cells
     */
    format?: 'cell' | 'table';
}
/** Get sub table between 2 cell paths. */
declare const getTableGridByRange: (editor: SlateEditor, { at, format }: GetTableGridByRangeOptions) => ElementEntry[];

type GetTableGridAboveOptions = EditorAboveOptions & Pick<GetTableGridByRangeOptions, 'format'>;
/** Get sub table above anchor and focus. Format: tables or cells. */
declare const getTableGridAbove: (editor: SlateEditor, { format, ...options }?: GetTableGridAboveOptions) => ElementEntry[];

/**
 * Returns node.colSizes if it exists, applying overrides, otherwise returns a
 * 0-filled array.
 */
declare const getTableOverriddenColSizes: (tableNode: TTableElement, colSizeOverrides?: TableStoreSizeOverrides) => number[];

/** Get table row index of a cell node. */
declare const getTableRowIndex: (editor: Editor, cellNode: TElement) => number;

declare const getTopTableCell: (editor: SlateEditor, { at: cellPath, }?: {
    at?: Path;
}) => _udecode_slate.NodeEntry<TTableCellElement> | undefined;

declare const isTableBorderHidden: (editor: SlateEditor, border: BorderDirection) => boolean;

/** Move selection by cell unit. */
declare const moveSelectionFromCell: (editor: SlateEditor, { at, edge, fromOneCell, reverse, }?: {
    at?: TLocation;
    /** Expand cell selection to an edge. */
    edge?: "bottom" | "left" | "right" | "top";
    /** Move selection from one selected cell */
    fromOneCell?: boolean;
    /** False: move selection to cell below true: move selection to cell above */
    reverse?: boolean;
}) => true | undefined;

/**
 * Override the new selection if the previous selection and the new one are in
 * different cells.
 */
declare const overrideSelectionFromCell: (editor: SlateEditor, newSelection?: TRange | null) => void;

declare const setBorderSize: (editor: SlateEditor, size: number, { at, border, }?: {
    at?: Path;
    border?: BorderDirection | "all";
}) => void;

declare const setCellBackground: (editor: SlateEditor, options: {
    color: string | null;
    selectedCells?: TElement[];
}) => void;

declare const setTableColSize: (editor: SlateEditor, { colIndex, width }: {
    colIndex: number;
    width: number;
}, options?: EditorAboveOptions) => void;

declare const setTableMarginLeft: (editor: SlateEditor, { marginLeft }: {
    marginLeft: number;
}, options?: EditorAboveOptions) => void;

declare const setTableRowSize: (editor: SlateEditor, { height, rowIndex }: {
    height: number;
    rowIndex: number;
}, options?: EditorAboveOptions) => void;

declare const KEY_SHIFT_EDGES: {
    'shift+down': string;
    'shift+left': string;
    'shift+right': string;
    'shift+up': string;
};

declare const normalizeInitialValueTable: NormalizeInitialValue<TableConfig>;

/**
 * Selection table:
 *
 * - If anchor is in table, focus in a block before: set focus to start of table
 * - If anchor is in table, focus in a block after: set focus to end of table
 * - If focus is in table, anchor in a block before: set focus to end of table
 * - If focus is in table, anchor in a block after: set focus to the point before
 *   start of table
 */
declare const withApplyTable: OverrideEditor<TableConfig>;

/**
 * Return true if:
 *
 * - At start/end of a cell.
 * - Next to a table cell. Move selection to the table cell.
 */
declare const preventDeleteTableCell: (editor: SlateEditor, { reverse, unit, }: {
    reverse?: boolean;
    unit?: "block" | "character" | "line" | "word";
}) => true | undefined;
/** Prevent cell deletion. */
declare const withDeleteTable: OverrideEditor<TableConfig>;

/** If selection is in a table, get subtable above. */
declare const withGetFragmentTable: OverrideEditor<TableConfig>;

/**
 * If inserting a table, If block above anchor is a table,
 *
 * - Replace each cell above by the inserted table until out of bounds.
 * - Select the inserted cells.
 */
declare const withInsertFragmentTable: OverrideEditor<TableConfig>;

declare const withInsertTextTable: OverrideEditor<TableConfig>;

declare const withMarkTable: OverrideEditor<TableConfig>;

/**
 * Normalize table:
 *
 * - Wrap cell children in a paragraph if they are texts.
 */
declare const withNormalizeTable: OverrideEditor<TableConfig>;

declare const withSetFragmentDataTable: OverrideEditor<TableConfig>;

declare const withTable: OverrideEditor<TableConfig>;

export { BorderDirection, type GetSelectedCellsBordersOptions, type GetTableGridAboveOptions, type GetTableGridByRangeOptions, KEY_SHIFT_EDGES, TTableCellElement, TTableElement, type TableBorderStates, TableConfig, TableStoreSizeOverrides, computeCellIndices, deleteColumnWhenExpanded, deleteRowWhenExpanded, deleteTableMergeColumn, deleteTableMergeRow, findCellByIndexes, getCellInNextTableRow, getCellInPreviousTableRow, getCellIndicesWithSpans, getCellPath, getCellRowIndexByPath, getCellTypes, getLeftTableCell, getNextTableCell, getPreviousTableCell, getSelectedCellsBorders, getSelectedCellsBoundingBox, getSelectionWidth, getTableAbove, getTableColumnCount, getTableColumnIndex, getTableEntries, getTableGridAbove, getTableGridByRange, getTableMergeGridByRange, getTableMergedColumnCount, getTableOverriddenColSizes, getTableRowIndex, getTopTableCell, insertTableMergeColumn, insertTableMergeRow, isSelectedCellBorder, isSelectedCellBordersNone, isSelectedCellBordersOuter, isTableBorderHidden, isTableRectangular, moveSelectionFromCell, normalizeInitialValueTable, overrideSelectionFromCell, preventDeleteTableCell, setBorderSize, setCellBackground, setTableColSize, setTableMarginLeft, setTableRowSize, withApplyTable, withDeleteTable, withGetFragmentTable, withInsertFragmentTable, withInsertTextTable, withMarkTable, withNormalizeTable, withSetFragmentDataTable, withTable };
