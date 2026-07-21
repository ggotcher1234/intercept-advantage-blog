import * as _udecode_plate_core from '@udecode/plate-core';
import { Descendant, TElement, SlateEditor, InsertNodesOptions, Path, PluginConfig, OmitFirst } from '@udecode/plate';
import * as _udecode_slate from '@udecode/slate';

type BorderDirection = 'bottom' | 'left' | 'right' | 'top';
interface BorderStyle {
    color?: string;
    size?: number;
    style?: string;
}
type CreateCellOptions = {
    children?: Descendant[];
    header?: boolean;
    row?: TTableRowElement;
};
type TableStoreSizeOverrides = Map<number, number>;
interface TTableCellElement extends TElement {
    id?: string;
    attributes?: {
        colspan?: string;
        rowspan?: string;
    };
    background?: string;
    borders?: {
        /** Only the last row cells have a bottom border. */
        bottom?: BorderStyle;
        left?: BorderStyle;
        /** Only the last column cells have a right border. */
        right?: BorderStyle;
        top?: BorderStyle;
    };
    colSpan?: number;
    rowSpan?: number;
    size?: number;
}
interface TTableElement extends TElement {
    colSizes?: number[];
    marginLeft?: number;
}
interface TTableRowElement extends TElement {
    size?: number;
}

type CellIndices = {
    col: number;
    row: number;
};
declare const getCellIndices: (editor: SlateEditor, element: TTableCellElement) => CellIndices;

declare const getEmptyCellNode: (editor: SlateEditor, { children, header, row }?: CreateCellOptions) => {
    children: _udecode_slate.Descendant[];
    type: string;
};

interface GetEmptyRowNodeOptions extends CreateCellOptions {
    colCount?: number;
}
declare const getEmptyRowNode: (editor: SlateEditor, { colCount, ...cellOptions }?: GetEmptyRowNodeOptions) => {
    children: {
        children: _udecode_slate.Descendant[];
        type: string;
    }[];
    type: string;
};

interface GetEmptyTableNodeOptions extends GetEmptyRowNodeOptions {
    rowCount?: number;
}
declare const getEmptyTableNode: (editor: SlateEditor, { colCount, header, rowCount, ...cellOptions }?: GetEmptyTableNodeOptions) => TTableElement;

/** Merges multiple selected cells into one. */
declare const mergeTableCells: (editor: SlateEditor) => void;

declare const splitTableCell: (editor: SlateEditor) => void;

/**
 * Returns the colspan attribute of the table cell element.
 *
 * @default 1 if undefined.
 */
declare const getColSpan: (cellElem: TTableCellElement) => number;

/**
 * Returns the rowspan attribute of the table cell element.
 *
 * @default 1 if undefined
 */
declare const getRowSpan: (cellElem: TTableCellElement) => number;

interface BorderStylesDefault {
    bottom: BorderStyle;
    right: BorderStyle;
    left?: BorderStyle;
    top?: BorderStyle;
}
declare const getTableCellBorders: (editor: SlateEditor, { cellIndices, defaultBorder, element, }: {
    element: TTableCellElement;
    cellIndices?: CellIndices;
    defaultBorder?: BorderStyle;
}) => BorderStylesDefault;

/** Get the width of a cell with colSpan support. */
declare const getTableCellSize: (editor: SlateEditor, { cellIndices, colSizes, element, rowSize, }: {
    element: TTableCellElement;
    cellIndices?: CellIndices;
    colSizes?: number[];
    rowSize?: number;
}) => {
    minHeight: number | undefined;
    width: number;
};

declare const deleteColumn: (editor: SlateEditor) => void;

declare const deleteRow: (editor: SlateEditor) => void;

declare const deleteTable: (editor: SlateEditor) => void;

/**
 * Insert table. If selection in table and no 'at' specified, insert after
 * current table. Select start of new table.
 */
declare const insertTable: (editor: SlateEditor, { colCount, header, rowCount }?: GetEmptyTableNodeOptions, { select: shouldSelect, ...options }?: InsertNodesOptions) => void;

declare const insertTableColumn: (editor: SlateEditor, options?: {
    /** Exact path of the cell to insert the column at. Will overrule `fromCell`. */
    at?: Path;
    /** Insert the column before the current column instead of after */
    before?: boolean;
    /** Path of the cell to insert the column from. */
    fromCell?: Path;
    header?: boolean;
    select?: boolean;
}) => void;

declare const insertTableRow: (editor: SlateEditor, options?: {
    /**
     * Exact path of the row to insert the column at. Pass the table path to
     * insert at the end of the table. Will overrule `fromRow`.
     */
    at?: Path;
    /** Insert the row before the current row instead of after */
    before?: boolean;
    fromRow?: Path;
    header?: boolean;
    select?: boolean;
}) => void;

declare const BaseTableRowPlugin: _udecode_plate_core.SlatePlugin<PluginConfig<"tr", {}, {}, {}, {}>>;
declare const BaseTableCellPlugin: _udecode_plate_core.SlatePlugin<PluginConfig<"td", {}, {}, {}, {}>>;
declare const BaseTableCellHeaderPlugin: _udecode_plate_core.SlatePlugin<PluginConfig<"th", {}, {}, {}, {}>>;
type TableConfig = PluginConfig<'table', {
    /** @private Keeps Track of cell indices by id. */
    _cellIndices: Record<string, {
        col: number;
        row: number;
    }>;
    /** The currently selected cells. */
    selectedCells: TElement[] | null;
    /** The currently selected tables. */
    selectedTables: TElement[] | null;
    /** Disable expanding the table when inserting cells. */
    disableExpandOnInsert?: boolean;
    disableMarginLeft?: boolean;
    /**
     * Disable cell merging functionality.
     *
     * @default false
     */
    disableMerge?: boolean;
    /**
     * Disable unsetting the first column width when the table has one column.
     * Set it to true if you want to resize the table width when there is only
     * one column. Keep it false if you have a full-width table.
     */
    enableUnsetSingleColSize?: boolean;
    /**
     * If defined, a normalizer will set each undefined table `colSizes` to this
     * value divided by the number of columns. Merged cells not supported.
     */
    initialTableWidth?: number;
    /**
     * The minimum width of a column.
     *
     * @default 48
     */
    minColumnWidth?: number;
}, {
    create: {
        table: OmitFirst<typeof getEmptyTableNode>;
        /** Cell node factory used each time a cell is created. */
        tableCell: OmitFirst<typeof getEmptyCellNode>;
        tableRow: OmitFirst<typeof getEmptyRowNode>;
    };
    table: {
        getCellBorders: OmitFirst<typeof getTableCellBorders>;
        getCellSize: OmitFirst<typeof getTableCellSize>;
        getColSpan: typeof getColSpan;
        getRowSpan: typeof getRowSpan;
        getCellChildren: (cell: TTableCellElement) => Descendant[];
    };
}, {
    insert: {
        table: OmitFirst<typeof insertTable>;
        tableColumn: OmitFirst<typeof insertTableColumn>;
        tableRow: OmitFirst<typeof insertTableRow>;
    };
    remove: {
        table: OmitFirst<typeof deleteTable>;
        tableColumn: OmitFirst<typeof deleteColumn>;
        tableRow: OmitFirst<typeof deleteRow>;
    };
    table: {
        merge: OmitFirst<typeof mergeTableCells>;
        split: OmitFirst<typeof splitTableCell>;
    };
}, {
    cellIndices?: (id: string) => CellIndices;
}>;
/** Enables support for tables. */
declare const BaseTablePlugin: _udecode_plate_core.SlatePlugin<PluginConfig<"table", {
    /** @private Keeps Track of cell indices by id. */
    _cellIndices: Record<string, {
        col: number;
        row: number;
    }>;
    /** The currently selected cells. */
    selectedCells: TElement[] | null;
    /** The currently selected tables. */
    selectedTables: TElement[] | null;
    /** Disable expanding the table when inserting cells. */
    disableExpandOnInsert?: boolean;
    disableMarginLeft?: boolean;
    /**
     * Disable cell merging functionality.
     *
     * @default false
     */
    disableMerge?: boolean;
    /**
     * Disable unsetting the first column width when the table has one column.
     * Set it to true if you want to resize the table width when there is only
     * one column. Keep it false if you have a full-width table.
     */
    enableUnsetSingleColSize?: boolean;
    /**
     * If defined, a normalizer will set each undefined table `colSizes` to this
     * value divided by the number of columns. Merged cells not supported.
     */
    initialTableWidth?: number;
    /**
     * The minimum width of a column.
     *
     * @default 48
     */
    minColumnWidth?: number;
}, {
    create: {
        table: OmitFirst<typeof getEmptyTableNode>;
        tableCell: OmitFirst<typeof getEmptyCellNode>;
        tableRow: OmitFirst<typeof getEmptyRowNode>;
    };
    table: {
        getCellBorders: OmitFirst<typeof getTableCellBorders>;
        getCellSize: OmitFirst<typeof getTableCellSize>;
        getColSpan: typeof getColSpan;
        getRowSpan: typeof getRowSpan;
        getCellChildren: (cell: TTableCellElement) => Descendant[];
    };
}, {
    insert: {
        table: OmitFirst<typeof insertTable>;
        tableColumn: OmitFirst<typeof insertTableColumn>;
        tableRow: OmitFirst<typeof insertTableRow>;
    };
    remove: {
        table: OmitFirst<typeof deleteTable>;
        tableColumn: OmitFirst<typeof deleteColumn>;
        tableRow: OmitFirst<typeof deleteRow>;
    };
    table: {
        merge: OmitFirst<typeof mergeTableCells>;
        split: OmitFirst<typeof splitTableCell>;
    };
}, {
    cellIndices?: (id: string) => CellIndices;
}>>;

export { type CellIndices as A, type BorderDirection as B, type CreateCellOptions as C, getCellIndices as D, type GetEmptyRowNodeOptions as G, type TTableCellElement as T, type TTableElement as a, type TableStoreSizeOverrides as b, type TableConfig as c, BaseTableRowPlugin as d, BaseTableCellPlugin as e, BaseTableCellHeaderPlugin as f, BaseTablePlugin as g, type BorderStyle as h, type TTableRowElement as i, getEmptyCellNode as j, getEmptyRowNode as k, type GetEmptyTableNodeOptions as l, getEmptyTableNode as m, mergeTableCells as n, getColSpan as o, getRowSpan as p, type BorderStylesDefault as q, getTableCellBorders as r, splitTableCell as s, getTableCellSize as t, deleteColumn as u, deleteRow as v, deleteTable as w, insertTable as x, insertTableColumn as y, insertTableRow as z };
