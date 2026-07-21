import * as _udecode_utils from '@udecode/utils';
import * as _udecode_plate_core from '@udecode/plate-core';
import { m as getEmptyTableNode, j as getEmptyCellNode, k as getEmptyRowNode, r as getTableCellBorders, t as getTableCellSize, o as getColSpan, p as getRowSpan, T as TTableCellElement, x as insertTable, y as insertTableColumn, z as insertTableRow, w as deleteTable, u as deleteColumn, v as deleteRow, n as mergeTableCells, s as splitTableCell, A as CellIndices, c as TableConfig, B as BorderDirection, a as TTableElement, q as BorderStylesDefault, b as TableStoreSizeOverrides } from '../BaseTablePlugin-C53dDW-d.mjs';
import * as _udecode_slate from '@udecode/slate';
import * as _udecode_plate_core_react from '@udecode/plate-core/react';
import { KeyboardHandler } from '@udecode/plate/react';
import { SlateEditor, TElement } from '@udecode/plate';
import React from 'react';
import { ResizeHandle } from '@udecode/plate-resizable';
import * as jotai from 'jotai';
import * as jotai_x from 'jotai-x';

declare const TableRowPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"tr", {}, {}, {}, {}>>;
declare const TableCellPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"td", {}, {}, {}, {}>>;
declare const TableCellHeaderPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"th", {}, {}, {}, {}>>;
/** Enables support for tables with React-specific features. */
declare const TablePlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"table", {
    _cellIndices: Record<string, {
        col: number;
        row: number;
    }>;
    selectedCells: _udecode_slate.TElement[] | null;
    selectedTables: _udecode_slate.TElement[] | null;
    disableExpandOnInsert?: boolean;
    disableMarginLeft?: boolean;
    disableMerge?: boolean;
    enableUnsetSingleColSize?: boolean;
    initialTableWidth?: number;
    minColumnWidth?: number;
}, {
    create: {
        table: _udecode_utils.OmitFirst<typeof getEmptyTableNode>;
        tableCell: _udecode_utils.OmitFirst<typeof getEmptyCellNode>;
        tableRow: _udecode_utils.OmitFirst<typeof getEmptyRowNode>;
    };
    table: {
        getCellBorders: _udecode_utils.OmitFirst<typeof getTableCellBorders>;
        getCellSize: _udecode_utils.OmitFirst<typeof getTableCellSize>;
        getColSpan: typeof getColSpan;
        getRowSpan: typeof getRowSpan;
        getCellChildren: (cell: TTableCellElement) => _udecode_slate.Descendant[];
    };
} & {
    create: {
        table: _udecode_utils.OmitFirst<typeof getEmptyTableNode>;
        tableCell: _udecode_utils.OmitFirst<typeof getEmptyCellNode>;
        tableRow: _udecode_utils.OmitFirst<typeof getEmptyRowNode>;
    };
    table: {
        getCellBorders: _udecode_utils.OmitFirst<typeof getTableCellBorders>;
        getCellSize: _udecode_utils.OmitFirst<typeof getTableCellSize>;
        getColSpan: typeof getColSpan;
        getRowSpan: typeof getRowSpan;
        getCellChildren: (cell: TTableCellElement) => _udecode_slate.Descendant[];
    };
}, {
    insert: {
        table: _udecode_utils.OmitFirst<typeof insertTable>;
        tableColumn: _udecode_utils.OmitFirst<typeof insertTableColumn>;
        tableRow: _udecode_utils.OmitFirst<typeof insertTableRow>;
    };
    remove: {
        table: _udecode_utils.OmitFirst<typeof deleteTable>;
        tableColumn: _udecode_utils.OmitFirst<typeof deleteColumn>;
        tableRow: _udecode_utils.OmitFirst<typeof deleteRow>;
    };
    table: {
        merge: _udecode_utils.OmitFirst<typeof mergeTableCells>;
        split: _udecode_utils.OmitFirst<typeof splitTableCell>;
    };
} & {
    insert: {
        table: _udecode_utils.OmitFirst<typeof insertTable>;
        tableColumn: _udecode_utils.OmitFirst<typeof insertTableColumn>;
        tableRow: _udecode_utils.OmitFirst<typeof insertTableRow>;
    };
    remove: {
        table: _udecode_utils.OmitFirst<typeof deleteTable>;
        tableColumn: _udecode_utils.OmitFirst<typeof deleteColumn>;
        tableRow: _udecode_utils.OmitFirst<typeof deleteRow>;
    };
    table: {
        merge: _udecode_utils.OmitFirst<typeof mergeTableCells>;
        split: _udecode_utils.OmitFirst<typeof splitTableCell>;
    };
}, {
    cellIndices?: (id: string) => CellIndices;
}>>;

declare const onKeyDownTable: KeyboardHandler<TableConfig>;

/**
 * Toggle logic for `'none'`, `'outer'`, `'top'|'bottom'|'left'|'right'`.
 * `'none'` toggles no borders ↔ all borders, `'outer'` toggles the bounding
 * rectangle's outer edges on/off, `'top'|'bottom'|'left'|'right'` toggles only
 * that side of the bounding rect.
 */
declare function setSelectedCellsBorder(editor: SlateEditor, { border, cells, }: {
    border: BorderDirection | 'none' | 'outer';
    cells: TTableCellElement[];
}): void;
/**
 * Returns a function that sets borders on the selection with toggling logic. If
 * selection has one or many cells, it's the same approach: we read the bounding
 * rectangle, then decide which edges to flip on/off.
 */
declare const getOnSelectTableBorderFactory: (editor: SlateEditor, selectedCells: TElement[] | null) => (border: BorderDirection | "none" | "outer") => () => void;

/**
 * Rounds a cell size to the nearest step, or returns the size if the step is
 * not set.
 */
declare const roundCellSizeToStep: (size: number, step?: number) => number;

declare const useIsCellSelected: (element: TElement) => boolean;

declare const useTableBordersDropdownMenuContentState: ({ element: el, }?: {
    element?: TTableElement;
}) => {
    getOnSelectTableBorder: (border: BorderDirection | "none" | "outer") => () => void;
    hasBottomBorder: boolean;
    hasLeftBorder: boolean;
    hasNoBorders: boolean;
    hasOuterBorders: boolean;
    hasRightBorder: boolean;
    hasTopBorder: boolean;
};

declare function useTableCellBorders({ element: el, }?: {
    element?: TTableCellElement;
}): BorderStylesDefault;

type TableCellElementState = {
    borders: BorderStylesDefault;
    colIndex: number;
    colSpan: number;
    isSelectingCell: boolean;
    minHeight: number | undefined;
    rowIndex: number;
    selected: boolean;
    width: number | string;
};
declare const useTableCellElement: () => TableCellElementState;

type TableCellElementResizableOptions = {
    /** Resize by step instead of by pixel. */
    step?: number;
    /** Overrides for X and Y axes. */
    stepX?: number;
    stepY?: number;
} & Pick<TableCellElementState, 'colIndex' | 'colSpan' | 'rowIndex'>;
declare const useTableCellElementResizable: ({ colIndex, colSpan, rowIndex, step, stepX, stepY, }: TableCellElementResizableOptions) => {
    bottomProps: React.ComponentPropsWithoutRef<typeof ResizeHandle>;
    hiddenLeft: boolean;
    leftProps: React.ComponentPropsWithoutRef<typeof ResizeHandle>;
    rightProps: React.ComponentPropsWithoutRef<typeof ResizeHandle>;
};

declare function useTableCellSize({ element: el, }?: {
    element?: TTableCellElement;
}): {
    minHeight: number | undefined;
    width: number;
};

/**
 * Many grid cells above and diff -> set No many grid cells above and diff ->
 * unset No selection -> unset
 */
declare const useSelectedCells: () => void;

/**
 * Returns colSizes with overrides applied. Unset node.colSizes if `colCount`
 * updates to 1.
 */
declare const useTableColSizes: ({ disableOverrides, transformColSizes, }?: {
    disableOverrides?: boolean;
    transformColSizes?: (colSizes: number[]) => number[];
}) => number[];

declare const useTableElement: () => {
    isSelectingCell: boolean;
    marginLeft: number;
    props: {
        onMouseDown: () => void;
    };
};

declare const useCellIndices: () => any;

declare const useTableMergeState: () => {
    canMerge: boolean;
    canSplit: boolean;
};

declare const TableProvider: React.FC<jotai_x.ProviderProps<{
    colSizeOverrides: TableStoreSizeOverrides;
    marginLeftOverride: number | null;
    rowSizeOverrides: TableStoreSizeOverrides;
}>>;
declare const tableStore: jotai_x.StoreApi<{
    colSizeOverrides: jotai.PrimitiveAtom<TableStoreSizeOverrides> & {
        init: TableStoreSizeOverrides;
    };
    marginLeftOverride: number | null;
    rowSizeOverrides: jotai.PrimitiveAtom<TableStoreSizeOverrides> & {
        init: TableStoreSizeOverrides;
    };
}, object, "table">;
declare const useTableSet: <K extends "colSizeOverrides" | "rowSizeOverrides" | "marginLeftOverride">(key: K, options?: string | jotai_x.UseAtomOptions) => ({
    colSizeOverrides: jotai.PrimitiveAtom<TableStoreSizeOverrides> & {
        init: TableStoreSizeOverrides;
    };
    marginLeftOverride: jotai_x.SimpleWritableAtom<number | null>;
    rowSizeOverrides: jotai.PrimitiveAtom<TableStoreSizeOverrides> & {
        init: TableStoreSizeOverrides;
    };
} & object)[K] extends jotai.WritableAtom<infer _V, infer A extends unknown[], infer R> ? (...args: A) => R : never;
declare const useTableState: <K extends "colSizeOverrides" | "rowSizeOverrides" | "marginLeftOverride">(key: K, options?: string | jotai_x.UseAtomOptions) => ({
    colSizeOverrides: jotai.PrimitiveAtom<TableStoreSizeOverrides> & {
        init: TableStoreSizeOverrides;
    };
    marginLeftOverride: jotai_x.SimpleWritableAtom<number | null>;
    rowSizeOverrides: jotai.PrimitiveAtom<TableStoreSizeOverrides> & {
        init: TableStoreSizeOverrides;
    };
} & object)[K] extends jotai.WritableAtom<infer V, infer A extends unknown[], infer R> ? [V, (...args: A) => R] : never;
declare const useTableStore: jotai_x.UseStoreApi<{
    colSizeOverrides: jotai.PrimitiveAtom<TableStoreSizeOverrides> & {
        init: TableStoreSizeOverrides;
    };
    marginLeftOverride: number | null;
    rowSizeOverrides: jotai.PrimitiveAtom<TableStoreSizeOverrides> & {
        init: TableStoreSizeOverrides;
    };
}, object>;
declare const useTableValue: <K extends "colSizeOverrides" | "rowSizeOverrides" | "marginLeftOverride", S = ({
    colSizeOverrides: jotai.PrimitiveAtom<TableStoreSizeOverrides> & {
        init: TableStoreSizeOverrides;
    };
    marginLeftOverride: jotai_x.SimpleWritableAtom<number | null>;
    rowSizeOverrides: jotai.PrimitiveAtom<TableStoreSizeOverrides> & {
        init: TableStoreSizeOverrides;
    };
} & object)[K] extends jotai.Atom<infer V> ? V : never>(key: K, options?: ({
    selector?: ((v: ({
        colSizeOverrides: jotai.PrimitiveAtom<TableStoreSizeOverrides> & {
            init: TableStoreSizeOverrides;
        };
        marginLeftOverride: jotai_x.SimpleWritableAtom<number | null>;
        rowSizeOverrides: jotai.PrimitiveAtom<TableStoreSizeOverrides> & {
            init: TableStoreSizeOverrides;
        };
    } & object)[K] extends jotai.Atom<infer V_1> ? V_1 : never, prevSelectorOutput?: S | undefined) => S) | undefined;
    equalityFn?: ((prev: S, next: S) => boolean) | undefined;
} & jotai_x.UseAtomOptions) | undefined, deps?: unknown[]) => S;
declare const useOverrideColSize: () => (index: number, size: number | null) => void;
declare const useOverrideRowSize: () => (index: number, size: number | null) => void;
declare const useOverrideMarginLeft: () => (args_0: number | null) => void;

export { type TableCellElementResizableOptions, type TableCellElementState, TableCellHeaderPlugin, TableCellPlugin, TablePlugin, TableProvider, TableRowPlugin, getOnSelectTableBorderFactory, onKeyDownTable, roundCellSizeToStep, setSelectedCellsBorder, tableStore, useCellIndices, useIsCellSelected, useOverrideColSize, useOverrideMarginLeft, useOverrideRowSize, useSelectedCells, useTableBordersDropdownMenuContentState, useTableCellBorders, useTableCellElement, useTableCellElementResizable, useTableCellSize, useTableColSizes, useTableElement, useTableMergeState, useTableSet, useTableState, useTableStore, useTableValue };
