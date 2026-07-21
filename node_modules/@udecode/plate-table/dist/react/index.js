"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/react/index.ts
var react_exports = {};
__export(react_exports, {
  TableCellHeaderPlugin: () => TableCellHeaderPlugin,
  TableCellPlugin: () => TableCellPlugin,
  TablePlugin: () => TablePlugin,
  TableProvider: () => TableProvider,
  TableRowPlugin: () => TableRowPlugin,
  getOnSelectTableBorderFactory: () => getOnSelectTableBorderFactory,
  onKeyDownTable: () => onKeyDownTable,
  roundCellSizeToStep: () => roundCellSizeToStep,
  setSelectedCellsBorder: () => setSelectedCellsBorder,
  tableStore: () => tableStore,
  useCellIndices: () => useCellIndices,
  useIsCellSelected: () => useIsCellSelected,
  useOverrideColSize: () => useOverrideColSize,
  useOverrideMarginLeft: () => useOverrideMarginLeft,
  useOverrideRowSize: () => useOverrideRowSize,
  useSelectedCells: () => useSelectedCells,
  useTableBordersDropdownMenuContentState: () => useTableBordersDropdownMenuContentState,
  useTableCellBorders: () => useTableCellBorders,
  useTableCellElement: () => useTableCellElement,
  useTableCellElementResizable: () => useTableCellElementResizable,
  useTableCellSize: () => useTableCellSize,
  useTableColSizes: () => useTableColSizes,
  useTableElement: () => useTableElement,
  useTableMergeState: () => useTableMergeState,
  useTableSet: () => useTableSet,
  useTableState: () => useTableState,
  useTableStore: () => useTableStore,
  useTableValue: () => useTableValue
});
module.exports = __toCommonJS(react_exports);

// src/react/TablePlugin.tsx
var import_react = require("@udecode/plate/react");

// src/lib/BaseTablePlugin.ts
var import_plate35 = require("@udecode/plate");

// src/lib/api/getEmptyCellNode.ts
var getEmptyCellNode = (editor, { children, header, row } = {}) => {
  header = header ?? (row ? row.children.every(
    (c) => c.type === editor.getType(BaseTableCellHeaderPlugin)
  ) : false);
  return {
    children: children ?? [editor.api.create.block()],
    type: header ? editor.getType(BaseTableCellHeaderPlugin) : editor.getType(BaseTableCellPlugin)
  };
};

// src/lib/api/getEmptyRowNode.ts
var getEmptyRowNode = (editor, { colCount = 1, ...cellOptions } = {}) => {
  const { api } = editor.getPlugin({ key: "table" });
  return {
    children: Array.from({ length: colCount }).fill(colCount).map(() => api.create.tableCell(cellOptions)),
    type: editor.getType(BaseTableRowPlugin)
  };
};

// src/lib/api/getEmptyTableNode.ts
var getEmptyTableNode = (editor, {
  colCount,
  header,
  rowCount = 0,
  ...cellOptions
} = {}) => {
  const { api } = editor.getPlugin({ key: "table" });
  const rows = Array.from({ length: rowCount }).fill(rowCount).map(
    (_, index) => api.create.tableRow({
      colCount,
      ...cellOptions,
      header: header && index === 0
    })
  );
  return {
    children: rows,
    type: editor.getType(BaseTablePlugin)
  };
};

// src/lib/merge/deleteColumn.ts
var import_plate32 = require("@udecode/plate");
var import_cloneDeep5 = __toESM(require("lodash/cloneDeep.js"));

// src/lib/constants.ts
var KEY_SHIFT_EDGES = {
  "shift+down": "bottom",
  "shift+left": "left",
  "shift+right": "right",
  "shift+up": "top"
};

// src/lib/utils/computeCellIndices.ts
var import_plate = require("@udecode/plate");
function computeCellIndices(editor, {
  all,
  cellNode,
  tableNode
}) {
  const { api, getOptions, setOption } = (0, import_plate.getEditorPlugin)(editor, {
    key: "table"
  });
  if (!tableNode) {
    if (!cellNode) return;
    tableNode = editor.api.above({
      at: cellNode,
      match: { type: editor.getType(BaseTablePlugin) }
    })?.[0];
    if (!tableNode) return;
  }
  const { _cellIndices: prevIndices } = getOptions();
  const cellIndices = { ...prevIndices };
  let hasIndicesChanged = false;
  const skipCells = [];
  let targetIndices;
  for (let rowIndex = 0; rowIndex < tableNode.children.length; rowIndex++) {
    const row = tableNode.children[rowIndex];
    let colIndex = 0;
    for (const cellElement of row.children) {
      while (skipCells[rowIndex]?.[colIndex]) {
        colIndex++;
      }
      const currentIndices = { col: colIndex, row: rowIndex };
      const prevIndicesForCell = prevIndices[cellElement.id];
      if (prevIndicesForCell?.col !== currentIndices.col || prevIndicesForCell?.row !== currentIndices.row) {
        hasIndicesChanged = true;
      }
      cellIndices[cellElement.id] = currentIndices;
      if (cellElement.id === cellNode?.id) {
        targetIndices = currentIndices;
        if (!all) break;
      }
      const colSpan = api.table.getColSpan(cellElement);
      const rowSpan = api.table.getRowSpan(cellElement);
      for (let r = 0; r < rowSpan; r++) {
        skipCells[rowIndex + r] = skipCells[rowIndex + r] || [];
        for (let c = 0; c < colSpan; c++) {
          skipCells[rowIndex + r][colIndex + c] = true;
        }
      }
      colIndex += colSpan;
    }
  }
  if (hasIndicesChanged) {
    setOption("_cellIndices", cellIndices);
  }
  return targetIndices;
}

// src/lib/utils/getCellIndices.ts
var import_plate2 = require("@udecode/plate");
var getCellIndices = (editor, element) => {
  const { getOption } = (0, import_plate2.getEditorPlugin)(editor, {
    key: "table"
  });
  let indices = getOption("cellIndices", element.id);
  if (!indices) {
    indices = computeCellIndices(editor, {
      cellNode: element
    });
    if (!indices) {
      editor.api.debug.warn(
        "No cell indices found for element. Make sure all table cells have an id.",
        "TABLE_CELL_INDICES"
      );
    }
  }
  return indices ?? { col: 0, row: 0 };
};

// src/lib/utils/getCellRowIndexByPath.ts
var getCellRowIndexByPath = (cellPath) => {
  const index = cellPath.at(-2);
  if (index === void 0)
    throw new Error(`can not get rowIndex of path ${cellPath}`);
  return index;
};

// src/lib/utils/getCellType.ts
var import_plate3 = require("@udecode/plate");
var getCellTypes = (editor) => (0, import_plate3.getPluginTypes)(editor, [BaseTableCellPlugin, BaseTableCellHeaderPlugin]);

// src/lib/normalizeInitialValueTable.ts
var normalizeInitialValueTable = ({
  editor,
  type
}) => {
  const tables = editor.api.nodes({
    at: [],
    match: { type }
  });
  for (const [table] of tables) {
    computeCellIndices(editor, {
      tableNode: table
    });
  }
};

// src/lib/withApplyTable.ts
var import_plate9 = require("@udecode/plate");

// src/lib/transforms/overrideSelectionFromCell.ts
var import_plate8 = require("@udecode/plate");

// src/lib/transforms/moveSelectionFromCell.ts
var import_plate7 = require("@udecode/plate");

// src/lib/queries/getTableGridAbove.ts
var import_plate6 = require("@udecode/plate");

// src/lib/queries/getTableGridByRange.ts
var import_plate5 = require("@udecode/plate");

// src/lib/merge/getTableGridByRange.ts
var import_plate4 = require("@udecode/plate");

// src/lib/queries/getColSpan.ts
var getColSpan = (cellElem) => {
  return cellElem.colSpan || Number(cellElem.attributes?.colspan) || 1;
};

// src/lib/queries/getRowSpan.ts
var getRowSpan = (cellElem) => {
  return cellElem.rowSpan || Number(cellElem.attributes?.rowspan) || 1;
};

// src/lib/merge/getCellIndicesWithSpans.ts
var getCellIndicesWithSpans = ({ col, row }, endCell) => {
  return {
    col: col + getColSpan(endCell) - 1,
    row: row + getRowSpan(endCell) - 1
  };
};

// src/lib/merge/findCellByIndexes.ts
var findCellByIndexes = (editor, table, searchRowIndex, searchColIndex) => {
  const allCells = table.children.flatMap(
    (current) => current.children
  );
  const foundCell = allCells.find((cellNode) => {
    const indices = getCellIndices(editor, cellNode);
    const { col: _startColIndex, row: _startRowIndex } = indices;
    const { col: _endColIndex, row: _endRowIndex } = getCellIndicesWithSpans(
      indices,
      cellNode
    );
    if (searchColIndex >= _startColIndex && searchColIndex <= _endColIndex && searchRowIndex >= _startRowIndex && searchRowIndex <= _endRowIndex) {
      return true;
    }
    return false;
  });
  return foundCell;
};

// src/lib/merge/getTableGridByRange.ts
var getTableMergeGridByRange = (editor, { at, format }) => {
  const { api, type } = (0, import_plate4.getEditorPlugin)(editor, BaseTablePlugin);
  const startCellEntry = editor.api.node({
    at: at.anchor.path,
    match: { type: getCellTypes(editor) }
  });
  const endCellEntry = editor.api.node({
    at: at.focus.path,
    match: { type: getCellTypes(editor) }
  });
  const startCell = startCellEntry[0];
  const endCell = endCellEntry[0];
  const startCellPath = at.anchor.path;
  const tablePath = startCellPath.slice(0, -2);
  const tableEntry = editor.api.node({
    at: tablePath,
    match: { type }
  });
  const realTable = tableEntry[0];
  const { col: _startColIndex, row: _startRowIndex } = getCellIndicesWithSpans(
    getCellIndices(editor, startCell),
    startCell
  );
  const { col: _endColIndex, row: _endRowIndex } = getCellIndicesWithSpans(
    getCellIndices(editor, endCell),
    endCell
  );
  let startRowIndex = Math.min(_startRowIndex, _endRowIndex);
  let endRowIndex = Math.max(_startRowIndex, _endRowIndex);
  let startColIndex = Math.min(_startColIndex, _endColIndex);
  let endColIndex = Math.max(_startColIndex, _endColIndex);
  const relativeRowIndex = endRowIndex - startRowIndex;
  const relativeColIndex = endColIndex - startColIndex;
  let table = api.create.table({
    children: [],
    colCount: relativeColIndex + 1,
    rowCount: relativeRowIndex + 1
  });
  let cellEntries = [];
  let cellsSet = /* @__PURE__ */ new WeakSet();
  let rowIndex = startRowIndex;
  let colIndex = startColIndex;
  while (true) {
    const cell = findCellByIndexes(editor, realTable, rowIndex, colIndex);
    if (!cell) {
      break;
    }
    const indicies = getCellIndices(editor, cell);
    const { col: cellColWithSpan, row: cellRowWithSpan } = getCellIndicesWithSpans(indicies, cell);
    const { col: cellCol, row: cellRow } = indicies;
    const hasOverflowTop = cellRow < startRowIndex;
    const hasOverflowBottom = cellRowWithSpan > endRowIndex;
    const hasOverflowLeft = cellCol < startColIndex;
    const hasOverflowRight = cellColWithSpan > endColIndex;
    if (hasOverflowTop || hasOverflowBottom || hasOverflowLeft || hasOverflowRight) {
      cellsSet = /* @__PURE__ */ new WeakSet();
      cellEntries = [];
      startRowIndex = Math.min(startRowIndex, cellRow);
      endRowIndex = Math.max(endRowIndex, cellRowWithSpan);
      startColIndex = Math.min(startColIndex, cellCol);
      endColIndex = Math.max(endColIndex, cellColWithSpan);
      rowIndex = startRowIndex;
      colIndex = startColIndex;
      const newRelativeRowIndex = endRowIndex - startRowIndex;
      const newRelativeColIndex = endColIndex - startColIndex;
      table = api.create.table({
        children: [],
        colCount: newRelativeColIndex + 1,
        rowCount: newRelativeRowIndex + 1
      });
      continue;
    }
    if (!cellsSet.has(cell)) {
      cellsSet.add(cell);
      const rows = table.children[rowIndex - startRowIndex].children;
      rows[colIndex - startColIndex] = cell;
      const cellPath = editor.api.findPath(cell);
      cellEntries.push([cell, cellPath]);
    }
    if (colIndex + 1 <= endColIndex) {
      colIndex = colIndex + 1;
    } else if (rowIndex + 1 <= endRowIndex) {
      colIndex = startColIndex;
      rowIndex = rowIndex + 1;
    } else {
      break;
    }
  }
  const formatType = format || "table";
  if (formatType === "cell") {
    return cellEntries;
  }
  table.children?.forEach((rowEl) => {
    const rowElement = rowEl;
    const filteredChildren = rowElement.children?.filter((cellEl) => {
      const cellElement = cellEl;
      return api.table.getCellChildren(cellElement).length > 0;
    });
    rowElement.children = filteredChildren;
  });
  if (formatType === "table") {
    return [[table, tablePath]];
  }
  return {
    cellEntries,
    tableEntries: [[table, tablePath]]
  };
};

// src/lib/queries/getTableGridByRange.ts
var getTableGridByRange = (editor, { at, format = "table" }) => {
  const { api } = editor.getPlugin({ key: "table" });
  const { disableMerge } = editor.getOptions(BaseTablePlugin);
  if (!disableMerge) {
    return getTableMergeGridByRange(editor, { at, format });
  }
  const startCellPath = at.anchor.path;
  const endCellPath = at.focus.path;
  const _startRowIndex = startCellPath.at(-2);
  const _endRowIndex = endCellPath.at(-2);
  const _startColIndex = startCellPath.at(-1);
  const _endColIndex = endCellPath.at(-1);
  const startRowIndex = Math.min(_startRowIndex, _endRowIndex);
  const endRowIndex = Math.max(_startRowIndex, _endRowIndex);
  const startColIndex = Math.min(_startColIndex, _endColIndex);
  const endColIndex = Math.max(_startColIndex, _endColIndex);
  const tablePath = startCellPath.slice(0, -2);
  const relativeRowIndex = endRowIndex - startRowIndex;
  const relativeColIndex = endColIndex - startColIndex;
  const table = api.create.table({
    children: [],
    colCount: relativeColIndex + 1,
    rowCount: relativeRowIndex + 1
  });
  let rowIndex = startRowIndex;
  let colIndex = startColIndex;
  const cellEntries = [];
  while (true) {
    const cellPath = tablePath.concat([rowIndex, colIndex]);
    const cell = import_plate5.NodeApi.get(editor, cellPath);
    if (!cell) break;
    const rows = table.children[rowIndex - startRowIndex].children;
    rows[colIndex - startColIndex] = cell;
    cellEntries.push([cell, cellPath]);
    if (colIndex + 1 <= endColIndex) {
      colIndex += 1;
    } else if (rowIndex + 1 <= endRowIndex) {
      colIndex = startColIndex;
      rowIndex += 1;
    } else {
      break;
    }
  }
  if (format === "cell") {
    return cellEntries;
  }
  return [[table, tablePath]];
};

// src/lib/queries/getTableGridAbove.ts
var getTableGridAbove = (editor, { format = "table", ...options } = {}) => {
  const { api } = editor.getPlugin({ key: "table" });
  const edges = editor.api.edgeBlocks({
    match: {
      type: getCellTypes(editor)
    },
    ...options
  });
  if (edges) {
    const [start, end] = edges;
    if (!import_plate6.PathApi.equals(start[1], end[1])) {
      return getTableGridByRange(editor, {
        at: {
          anchor: {
            offset: 0,
            path: start[1]
          },
          focus: {
            offset: 0,
            path: end[1]
          }
        },
        format
      });
    }
    if (format === "table") {
      const table = api.create.table({ rowCount: 1 });
      table.children[0].children = [start[0]];
      return [[table, start[1].slice(0, -2)]];
    }
    return [start];
  }
  return [];
};

// src/lib/transforms/moveSelectionFromCell.ts
var moveSelectionFromCell = (editor, {
  at,
  edge,
  fromOneCell,
  reverse
} = {}) => {
  if (edge) {
    const cellEntries = getTableGridAbove(editor, { at, format: "cell" });
    const minCell = fromOneCell ? 0 : 1;
    if (cellEntries.length > minCell) {
      const [, firstCellPath] = cellEntries[0];
      const [, lastCellPath] = cellEntries.at(-1);
      const anchorPath = [...firstCellPath];
      const focusPath = [...lastCellPath];
      switch (edge) {
        case "bottom": {
          focusPath[focusPath.length - 2] += 1;
          break;
        }
        case "left": {
          anchorPath[anchorPath.length - 1] -= 1;
          break;
        }
        case "right": {
          focusPath[focusPath.length - 1] += 1;
          break;
        }
        case "top": {
          anchorPath[anchorPath.length - 2] -= 1;
          break;
        }
      }
      if (import_plate7.NodeApi.has(editor, anchorPath) && import_plate7.NodeApi.has(editor, focusPath)) {
        editor.tf.select({
          anchor: editor.api.start(anchorPath),
          focus: editor.api.start(focusPath)
        });
      }
      return true;
    }
    return;
  }
  const cellEntry = editor.api.block({
    at,
    match: { type: getCellTypes(editor) }
  });
  if (cellEntry) {
    const [, cellPath] = cellEntry;
    const nextCellPath = [...cellPath];
    const offset = reverse ? -1 : 1;
    nextCellPath[nextCellPath.length - 2] += offset;
    if (import_plate7.NodeApi.has(editor, nextCellPath)) {
      editor.tf.select(editor.api.start(nextCellPath));
    } else {
      const tablePath = cellPath.slice(0, -2);
      if (reverse) {
        editor.tf.withoutNormalizing(() => {
          editor.tf.select(editor.api.start(tablePath));
          editor.tf.move({ reverse: true });
        });
      } else {
        editor.tf.withoutNormalizing(() => {
          editor.tf.select(editor.api.end(tablePath));
          editor.tf.move();
        });
      }
    }
    return true;
  }
};

// src/lib/transforms/overrideSelectionFromCell.ts
var overrideSelectionFromCell = (editor, newSelection) => {
  let hotkey;
  if (!editor.currentKeyboardEvent || !["up", "down", "shift+up", "shift+right", "shift+down", "shift+left"].some(
    (key) => {
      const valid = (0, import_plate8.isHotkey)(key, editor.currentKeyboardEvent);
      if (valid) hotkey = key;
      return valid;
    }
  ) || !editor.selection?.focus || !newSelection?.focus || !editor.api.isAt({
    at: {
      anchor: editor.selection.focus,
      focus: newSelection.focus
    },
    blocks: true,
    match: { type: getCellTypes(editor) }
  })) {
    return;
  }
  if (!hotkey) return;
  const edge = KEY_SHIFT_EDGES[hotkey];
  if (edge && !editor.api.isAt({ block: true, match: { type: getCellTypes(editor) } })) {
    return;
  }
  const prevSelection = editor.selection;
  const reverse = ["shift+up", "up"].includes(hotkey);
  setTimeout(() => {
    moveSelectionFromCell(editor, {
      at: prevSelection,
      edge,
      fromOneCell: true,
      reverse
    });
  }, 0);
};

// src/lib/withApplyTable.ts
var withApplyTable = ({
  editor,
  getOptions,
  tf: { apply },
  type: tableType
}) => ({
  transforms: {
    apply(op) {
      if (op.type === "set_selection" && op.newProperties) {
        const newSelection = {
          ...editor.selection,
          ...op.newProperties
        };
        if (import_plate9.RangeApi.isRange(newSelection) && editor.api.isAt({
          at: newSelection,
          blocks: true,
          match: (n) => n.type === tableType
        })) {
          const anchorEntry = editor.api.block({
            at: newSelection.anchor,
            match: (n) => n.type === tableType
          });
          if (anchorEntry) {
            const [, anchorPath] = anchorEntry;
            const isBackward = import_plate9.RangeApi.isBackward(newSelection);
            if (isBackward) {
              op.newProperties.focus = editor.api.start(anchorPath);
            } else {
              const pointBefore = editor.api.before(anchorPath);
              if (pointBefore) {
                op.newProperties.focus = editor.api.end(anchorPath);
              }
            }
          } else {
            const focusEntry = editor.api.block({
              at: newSelection.focus,
              match: (n) => n.type === tableType
            });
            if (focusEntry) {
              const [, focusPath] = focusEntry;
              const isBackward = import_plate9.RangeApi.isBackward(newSelection);
              if (isBackward) {
                const startPoint = editor.api.start(focusPath);
                const pointBefore = editor.api.before(startPoint);
                op.newProperties.focus = pointBefore ?? startPoint;
              } else {
                op.newProperties.focus = editor.api.end(focusPath);
              }
            }
          }
        }
        overrideSelectionFromCell(editor, newSelection);
      }
      const opType = op.type === "remove_node" ? op.node.type : op.type === "move_node" ? editor.api.node(op.path)?.[0].type : void 0;
      const isTableOperation = (op.type === "remove_node" || op.type === "move_node") && opType && [
        editor.getType(BaseTableRowPlugin),
        tableType,
        ...getCellTypes(editor)
      ].includes(opType);
      if (isTableOperation && op.type === "remove_node") {
        const cells = [
          ...editor.api.nodes({
            at: op.path,
            match: { type: getCellTypes(editor) }
          })
        ];
        const cellIndices = getOptions()._cellIndices;
        cells.forEach(([cell]) => {
          delete cellIndices[cell.id];
        });
      }
      apply(op);
      let table;
      if (isTableOperation && // There is no new indices when moving/removing a table
      opType !== tableType) {
        table = editor.api.node({
          at: op.type === "move_node" ? op.newPath : op.path,
          match: { type: tableType }
        })?.[0];
        if (table) {
          computeCellIndices(editor, {
            tableNode: table
          });
        }
      }
    }
  }
});

// src/lib/withDeleteTable.ts
var import_plate10 = require("@udecode/plate");
var preventDeleteTableCell = (editor, {
  reverse,
  unit
}) => {
  const { selection } = editor;
  const getNextPoint = reverse ? editor.api.after : editor.api.before;
  if (editor.api.isCollapsed()) {
    const cellEntry = editor.api.block({
      match: { type: getCellTypes(editor) }
    });
    if (cellEntry) {
      const [, cellPath] = cellEntry;
      const start = reverse ? editor.api.end(cellPath) : editor.api.start(cellPath);
      if (selection && import_plate10.PointApi.equals(selection.anchor, start)) {
        return true;
      }
    } else {
      const nextPoint = getNextPoint(selection, { unit });
      const nextCellEntry = editor.api.block({
        at: nextPoint,
        match: { type: getCellTypes(editor) }
      });
      if (nextCellEntry) {
        editor.tf.move({ reverse: !reverse });
        return true;
      }
    }
  }
};
var withDeleteTable = ({
  editor,
  tf: { deleteBackward, deleteForward, deleteFragment },
  type
}) => ({
  transforms: {
    deleteBackward(unit) {
      if (preventDeleteTableCell(editor, { unit })) return;
      deleteBackward(unit);
    },
    deleteForward(unit) {
      if (preventDeleteTableCell(editor, {
        reverse: true,
        unit
      }))
        return;
      deleteForward(unit);
    },
    deleteFragment(direction) {
      if (editor.api.isAt({ block: true, match: (n) => n.type === type })) {
        const cellEntries = getTableGridAbove(editor, { format: "cell" });
        if (cellEntries.length > 1) {
          editor.tf.withoutNormalizing(() => {
            cellEntries.forEach(([, cellPath]) => {
              editor.tf.replaceNodes(editor.api.create.block(), {
                at: cellPath,
                children: true
              });
            });
            editor.tf.select({
              anchor: editor.api.start(cellEntries[0][1]),
              focus: editor.api.end(cellEntries.at(-1)[1])
            });
          });
          return;
        }
      }
      deleteFragment(direction);
    }
  }
});

// src/lib/withGetFragmentTable.ts
var withGetFragmentTable = ({
  api,
  api: { getFragment },
  editor,
  type
}) => ({
  api: {
    getFragment() {
      const fragment = getFragment();
      const newFragment = [];
      fragment.forEach((node) => {
        if (node.type === type) {
          const rows = node.children;
          const rowCount = rows.length;
          if (!rowCount) return;
          const colCount = rows[0].children.length;
          const hasOneCell = rowCount <= 1 && colCount <= 1;
          if (hasOneCell) {
            const cell = rows[0];
            const cellChildren = api.table.getCellChildren(cell);
            newFragment.push(...cellChildren[0].children);
            return;
          } else {
            const subTable = getTableGridAbove(editor);
            if (subTable.length > 0) {
              newFragment.push(subTable[0][0]);
              return;
            }
          }
        }
        newFragment.push(node);
      });
      return newFragment;
    }
  }
});

// src/lib/withInsertFragmentTable.ts
var import_plate11 = require("@udecode/plate");
var import_cloneDeep = __toESM(require("lodash/cloneDeep.js"));
var withInsertFragmentTable = ({
  api,
  editor,
  getOptions,
  tf: { insert, insertFragment },
  type
}) => ({
  transforms: {
    insertFragment(fragment) {
      const insertedTable = fragment.find(
        (n) => n.type === type
      );
      if (!insertedTable) {
        const tableEntry = getTableAbove(editor, {
          at: editor.selection?.anchor
        });
        if (tableEntry) {
          const cellEntries = getTableGridAbove(editor, {
            format: "cell"
          });
          if (cellEntries.length > 1) {
            cellEntries.forEach((cellEntry) => {
              if (cellEntry) {
                const [, cellPath] = cellEntry;
                editor.tf.replaceNodes((0, import_cloneDeep.default)(fragment), {
                  at: cellPath,
                  children: true
                });
              }
            });
            editor.tf.select({
              anchor: editor.api.start(cellEntries[0][1]),
              focus: editor.api.end(cellEntries.at(-1)[1])
            });
            return;
          }
        }
      }
      if (insertedTable) {
        const tableEntry = getTableAbove(editor, {
          at: editor.selection?.anchor
        });
        if (tableEntry) {
          const [cellEntry] = getTableGridAbove(editor, {
            at: editor.selection?.anchor,
            format: "cell"
          });
          if (cellEntry) {
            editor.tf.withoutNormalizing(() => {
              const [, startCellPath] = cellEntry;
              const cellPath = [...startCellPath];
              const startColIndex = cellPath.at(-1);
              let lastCellPath = null;
              let initRow = true;
              const insertedRows = insertedTable.children;
              insertedRows.forEach((row) => {
                cellPath[cellPath.length - 1] = startColIndex;
                if (!initRow) {
                  const fromRow = cellPath.slice(0, -1);
                  cellPath[cellPath.length - 2] += 1;
                  if (!import_plate11.NodeApi.has(editor, cellPath)) {
                    if (getOptions().disableExpandOnInsert) {
                      return;
                    } else {
                      insert.tableRow({
                        fromRow
                      });
                    }
                  }
                }
                initRow = false;
                const insertedCells = row.children;
                let initCell = true;
                insertedCells.forEach((cell) => {
                  if (!initCell) {
                    const fromCell = [...cellPath];
                    cellPath[cellPath.length - 1] += 1;
                    if (!import_plate11.NodeApi.has(editor, cellPath)) {
                      if (getOptions().disableExpandOnInsert) {
                        return;
                      } else {
                        insert.tableColumn({
                          fromCell
                        });
                      }
                    }
                  }
                  initCell = false;
                  const cellChildren = api.table.getCellChildren(
                    cell
                  );
                  editor.tf.replaceNodes((0, import_cloneDeep.default)(cellChildren), {
                    at: cellPath,
                    children: true
                  });
                  lastCellPath = [...cellPath];
                });
              });
              if (lastCellPath) {
                editor.tf.select({
                  anchor: editor.api.start(startCellPath),
                  focus: editor.api.end(lastCellPath)
                });
              }
            });
            return;
          }
        } else if (fragment.length === 1 && fragment[0].type === BaseTablePlugin.key) {
          editor.tf.insertNodes(fragment[0]);
          return;
        }
      }
      insertFragment(fragment);
    }
  }
});

// src/lib/queries/getCellInNextTableRow.ts
var import_plate12 = require("@udecode/plate");
var getCellInNextTableRow = (editor, currentRowPath) => {
  const nextRow = editor.api.node(import_plate12.PathApi.next(currentRowPath));
  if (!nextRow) return;
  const [nextRowNode, nextRowPath] = nextRow;
  const nextCell = nextRowNode?.children?.[0];
  const nextCellPath = nextRowPath.concat(0);
  if (nextCell && nextCellPath) {
    return editor.api.node(nextCellPath);
  }
};

// src/lib/queries/getCellInPreviousTableRow.ts
var import_plate13 = require("@udecode/plate");
var getCellInPreviousTableRow = (editor, currentRowPath) => {
  const prevPath = import_plate13.PathApi.previous(currentRowPath);
  if (!prevPath) return;
  const previousRow = editor.api.node(prevPath);
  if (!previousRow) return;
  const [previousRowNode, previousRowPath] = previousRow;
  const previousCell = previousRowNode?.children?.[previousRowNode.children.length - 1];
  const previousCellPath = previousRowPath.concat(
    previousRowNode.children.length - 1
  );
  if (previousCell && previousCellPath) {
    return editor.api.node(previousCellPath);
  }
};

// src/lib/queries/getLeftTableCell.ts
var import_plate14 = require("@udecode/plate");
var getLeftTableCell = (editor, {
  at: cellPath
} = {}) => {
  if (!cellPath) {
    cellPath = editor.api.node({
      match: { type: getCellTypes(editor) }
    })?.[1];
    if (!cellPath) return;
  }
  const cellIndex = cellPath.at(-1);
  if (!cellIndex) return;
  const prevCellPath = import_plate14.PathApi.previous(cellPath);
  return editor.api.node(prevCellPath);
};

// src/lib/queries/getNextTableCell.ts
var import_plate15 = require("@udecode/plate");
var getNextTableCell = (editor, currentCell, currentPath, currentRow) => {
  const cell = editor.api.node(import_plate15.PathApi.next(currentPath));
  if (cell) return cell;
  const [, currentRowPath] = currentRow;
  return getCellInNextTableRow(editor, currentRowPath);
};

// src/lib/queries/getPreviousTableCell.ts
var import_plate16 = require("@udecode/plate");
var getPreviousTableCell = (editor, currentCell, currentPath, currentRow) => {
  const prevPath = import_plate16.PathApi.previous(currentPath);
  if (!prevPath) {
    const [, currentRowPath] = currentRow;
    return getCellInPreviousTableRow(editor, currentRowPath);
  }
  const cell = editor.api.node(prevPath);
  if (cell) return cell;
};

// src/lib/queries/getSelectedCellsBoundingBox.ts
function getSelectedCellsBoundingBox(editor, cells) {
  let minRow = Infinity;
  let maxRow = -Infinity;
  let minCol = Infinity;
  let maxCol = -Infinity;
  for (const cell of cells) {
    const { col, row } = getCellIndices(editor, cell);
    const cSpan = getColSpan(cell);
    const rSpan = getRowSpan(cell);
    const endRow = row + rSpan - 1;
    const endCol = col + cSpan - 1;
    if (row < minRow) minRow = row;
    if (endRow > maxRow) maxRow = endRow;
    if (col < minCol) minCol = col;
    if (endCol > maxCol) maxCol = endCol;
  }
  return { maxCol, maxRow, minCol, minRow };
}

// src/lib/queries/getTopTableCell.ts
var import_plate17 = require("@udecode/plate");
var getTopTableCell = (editor, {
  at: cellPath
} = {}) => {
  if (!cellPath) {
    cellPath = editor.api.node({
      match: { type: getCellTypes(editor) }
    })?.[1];
    if (!cellPath) return;
  }
  const cellIndex = cellPath.at(-1);
  const rowIndex = cellPath.at(-2);
  if (rowIndex === 0) return;
  const cellAbovePath = [
    ...import_plate17.PathApi.parent(import_plate17.PathApi.parent(cellPath)),
    rowIndex - 1,
    cellIndex
  ];
  return editor.api.node(cellAbovePath);
};

// src/lib/queries/getSelectedCellsBorders.ts
var getSelectedCellsBorders = (editor, selectedCells, options = {}) => {
  const { select = { none: true, outer: true, side: true } } = options;
  if (!selectedCells || selectedCells.length === 0) {
    const cell = editor.api.block({ match: { type: getCellTypes(editor) } });
    if (cell) {
      selectedCells = [cell[0]];
    } else {
      return {
        bottom: true,
        left: true,
        none: false,
        outer: true,
        right: true,
        top: true
      };
    }
  }
  const cells = selectedCells.map((cell) => cell);
  const { maxCol, maxRow, minCol, minRow } = getSelectedCellsBoundingBox(
    editor,
    cells
  );
  let hasAnyBorder = false;
  let allOuterBordersSet = true;
  const borderStates = {
    bottom: false,
    left: false,
    right: false,
    top: false
  };
  for (const cell of cells) {
    const { col, row } = getCellIndices(editor, cell);
    const cellPath = editor.api.findPath(cell);
    const cSpan = getColSpan(cell);
    const rSpan = getRowSpan(cell);
    const isFirstRow = row === 0;
    const isFirstCell = col === 0;
    if (!cellPath) continue;
    if (select.none && !hasAnyBorder) {
      if (isFirstRow && (cell.borders?.top?.size ?? 1) > 0) hasAnyBorder = true;
      if (isFirstCell && (cell.borders?.left?.size ?? 1) > 0)
        hasAnyBorder = true;
      if ((cell.borders?.bottom?.size ?? 1) > 0) hasAnyBorder = true;
      if ((cell.borders?.right?.size ?? 1) > 0) hasAnyBorder = true;
      if (!hasAnyBorder) {
        if (!isFirstRow) {
          const cellAboveEntry = getTopTableCell(editor, { at: cellPath });
          if (cellAboveEntry && (cellAboveEntry[0].borders?.bottom?.size ?? 1) > 0) {
            hasAnyBorder = true;
          }
        }
        if (!isFirstCell) {
          const prevCellEntry = getLeftTableCell(editor, { at: cellPath });
          if (prevCellEntry && (prevCellEntry[0].borders?.right?.size ?? 1) > 0) {
            hasAnyBorder = true;
          }
        }
      }
    }
    if (select.side || select.outer) {
      for (let rr = row; rr < row + rSpan; rr++) {
        for (let cc = col; cc < col + cSpan; cc++) {
          if (rr === minRow) {
            if (isFirstRow) {
              if ((cell.borders?.top?.size ?? 1) < 1) {
                borderStates.top = false;
                if (select.outer) allOuterBordersSet = false;
              } else if (!borderStates.top) {
                borderStates.top = true;
              }
            } else {
              const cellAboveEntry = getTopTableCell(editor, { at: cellPath });
              if (cellAboveEntry) {
                const [cellAbove] = cellAboveEntry;
                if ((cellAbove.borders?.bottom?.size ?? 1) < 1) {
                  borderStates.top = false;
                  if (select.outer) allOuterBordersSet = false;
                } else if (!borderStates.top) {
                  borderStates.top = true;
                }
              }
            }
          }
          if (rr === maxRow) {
            if ((cell.borders?.bottom?.size ?? 1) < 1) {
              borderStates.bottom = false;
              if (select.outer) allOuterBordersSet = false;
            } else if (!borderStates.bottom) {
              borderStates.bottom = true;
            }
          }
          if (cc === minCol) {
            if (isFirstCell) {
              if ((cell.borders?.left?.size ?? 1) < 1) {
                borderStates.left = false;
                if (select.outer) allOuterBordersSet = false;
              } else if (!borderStates.left) {
                borderStates.left = true;
              }
            } else {
              const prevCellEntry = getLeftTableCell(editor, { at: cellPath });
              if (prevCellEntry) {
                const [prevCell] = prevCellEntry;
                if ((prevCell.borders?.right?.size ?? 1) < 1) {
                  borderStates.left = false;
                  if (select.outer) allOuterBordersSet = false;
                } else if (!borderStates.left) {
                  borderStates.left = true;
                }
              }
            }
          }
          if (cc === maxCol) {
            if ((cell.borders?.right?.size ?? 1) < 1) {
              borderStates.right = false;
              if (select.outer) allOuterBordersSet = false;
            } else if (!borderStates.right) {
              borderStates.right = true;
            }
          }
        }
      }
    }
  }
  return {
    ...select.side ? borderStates : { bottom: true, left: true, right: true, top: true },
    none: select.none ? !hasAnyBorder : false,
    outer: select.outer ? allOuterBordersSet : true
  };
};
function isSelectedCellBorder(editor, cells, side) {
  const { maxCol, maxRow, minCol, minRow } = getSelectedCellsBoundingBox(
    editor,
    cells
  );
  return cells.every((cell) => {
    const { col, row } = getCellIndices(editor, cell);
    const cSpan = getColSpan(cell);
    const rSpan = getRowSpan(cell);
    const cellPath = editor.api.findPath(cell);
    if (!cellPath) return true;
    for (let rr = row; rr < row + rSpan; rr++) {
      for (let cc = col; cc < col + cSpan; cc++) {
        if (side === "top" && rr === minRow) {
          const isFirstRow = row === 0;
          if (isFirstRow) {
            return (cell.borders?.top?.size ?? 1) >= 1;
          }
          const cellAboveEntry = getTopTableCell(editor, { at: cellPath });
          if (!cellAboveEntry) return true;
          const [cellAboveNode] = cellAboveEntry;
          return (cellAboveNode.borders?.bottom?.size ?? 1) >= 1;
        }
        if (side === "bottom" && rr === maxRow) {
          return (cell.borders?.bottom?.size ?? 1) >= 1;
        }
        if (side === "left" && cc === minCol) {
          const isFirstCell = col === 0;
          if (isFirstCell) {
            return (cell.borders?.left?.size ?? 1) >= 1;
          }
          const prevCellEntry = getLeftTableCell(editor, { at: cellPath });
          if (!prevCellEntry) return true;
          const [prevCellNode] = prevCellEntry;
          return (prevCellNode.borders?.right?.size ?? 1) >= 1;
        }
        if (side === "right" && cc === maxCol) {
          return (cell.borders?.right?.size ?? 1) >= 1;
        }
      }
    }
    return true;
  });
}

// src/lib/queries/getTableAbove.ts
var getTableAbove = (editor, options) => editor.api.block({
  above: true,
  match: {
    type: editor.getType(BaseTablePlugin)
  },
  ...options
});

// src/lib/queries/getTableCellBorders.ts
var getTableCellBorders = (editor, {
  cellIndices,
  defaultBorder = {
    size: 1
  },
  element
}) => {
  const cellPath = editor.api.findPath(element);
  const [rowNode, rowPath] = editor.api.parent(cellPath) ?? [];
  if (!rowNode || !rowPath) {
    return {
      bottom: defaultBorder,
      right: defaultBorder
    };
  }
  const [tableNode] = editor.api.parent(rowPath);
  const { col } = cellIndices ?? getCellIndices(editor, element);
  const isFirstCell = col === 0;
  const isFirstRow = tableNode.children?.[0] === rowNode;
  const getBorder = (dir) => {
    const border = element.borders?.[dir];
    return {
      color: border?.color ?? defaultBorder.color,
      size: border?.size ?? defaultBorder.size,
      style: border?.style ?? defaultBorder.style
    };
  };
  return {
    bottom: getBorder("bottom"),
    left: isFirstCell ? getBorder("left") : void 0,
    right: getBorder("right"),
    top: isFirstRow ? getBorder("top") : void 0
  };
};

// src/lib/queries/getTableCellSize.ts
var import_plate18 = require("@udecode/plate");
var getTableCellSize = (editor, {
  cellIndices,
  colSizes,
  element,
  rowSize
}) => {
  const { api } = (0, import_plate18.getEditorPlugin)(editor, {
    key: "table"
  });
  const path = editor.api.findPath(element);
  if (!rowSize) {
    const [rowElement] = editor.api.parent(path) ?? [];
    if (!rowElement) return { minHeight: 0, width: 0 };
    rowSize = rowElement.size;
  }
  if (!colSizes) {
    const [, rowPath] = editor.api.parent(path);
    const [tableNode] = editor.api.parent(rowPath);
    colSizes = getTableOverriddenColSizes(tableNode);
  }
  const colSpan = api.table.getColSpan(element);
  const { col } = cellIndices ?? getCellIndices(editor, element);
  const width = (colSizes ?? []).slice(col, col + colSpan).reduce((total, w) => total + (w || 0), 0);
  return { minHeight: rowSize, width };
};

// src/lib/queries/getTableColumnCount.ts
var getTableColumnCount = (tableNode) => {
  if (tableNode.children?.[0]?.children) {
    return tableNode.children[0].children.map(
      (element) => element.colSpan || element?.attributes?.colspan || 1
    ).reduce((total, num) => Number(total) + Number(num));
  }
  return 0;
};

// src/lib/queries/getTableEntries.ts
var getTableEntries = (editor, { at = editor.selection } = {}) => {
  if (!at) return;
  const cellEntry = editor.api.node({
    at,
    match: {
      type: getCellTypes(editor)
    }
  });
  if (!cellEntry) return;
  const [, cellPath] = cellEntry;
  const rowEntry = editor.api.above({
    at: cellPath,
    match: { type: editor.getType(BaseTableRowPlugin) }
  });
  if (!rowEntry) return;
  const [, rowPath] = rowEntry;
  const tableEntry = editor.api.above({
    at: rowPath,
    match: { type: editor.getType(BaseTablePlugin) }
  });
  if (!tableEntry) return;
  return {
    cell: cellEntry,
    row: rowEntry,
    table: tableEntry
  };
};

// src/lib/queries/getTableOverriddenColSizes.ts
var getTableOverriddenColSizes = (tableNode, colSizeOverrides) => {
  const colCount = getTableColumnCount(tableNode);
  const colSizes = (tableNode.colSizes ? [...tableNode.colSizes] : Array.from({ length: colCount }).fill(0)).map((size, index) => colSizeOverrides?.get?.(index) ?? size);
  return colSizes;
};

// src/lib/withInsertTextTable.ts
var withInsertTextTable = ({
  editor,
  tf: { insertText }
}) => ({
  transforms: {
    insertText(text, options) {
      if (editor.api.isExpanded()) {
        const entry = getTableAbove(editor, {
          at: editor.selection?.anchor
        });
        if (entry) {
          const cellEntries = getTableGridAbove(editor, {
            format: "cell"
          });
          if (cellEntries.length > 1) {
            editor.tf.collapse({
              edge: "focus"
            });
          }
        }
      }
      insertText(text, options);
    }
  }
});

// src/lib/withMarkTable.tsx
var import_plate19 = require("@udecode/plate");
var withMarkTable = ({
  api: { marks },
  editor,
  tf: { addMark, removeMark }
}) => ({
  api: {
    marks() {
      const { selection } = editor;
      if (!selection || editor.api.isCollapsed()) return marks();
      const matchesCell = getTableGridAbove(editor, { format: "cell" });
      if (matchesCell.length === 0) return marks();
      const totalMarks = {};
      matchesCell.forEach(([_cell, cellPath]) => {
        const textNodeEntry = editor.api.nodes({
          at: cellPath,
          match: (n) => import_plate19.TextApi.isText(n)
        });
        Array.from(textNodeEntry, (item) => item[0]).forEach((item) => {
          const keys = Object.keys(item);
          if (keys.length === 1) return;
          keys.splice(keys.indexOf("text"), 1);
          keys.forEach((k) => {
            totalMarks[k] = item[k];
          });
        });
      });
      return totalMarks;
    }
  },
  transforms: {
    addMark(key, value) {
      const { selection } = editor;
      if (!selection || editor.api.isCollapsed()) return addMark(key, value);
      const matchesCell = getTableGridAbove(editor, { format: "cell" });
      if (matchesCell.length <= 1) return addMark(key, value);
      matchesCell.forEach(([_cell, cellPath]) => {
        editor.tf.setNodes(
          {
            [key]: value
          },
          {
            at: cellPath,
            split: true,
            voids: true,
            match: (n) => import_plate19.TextApi.isText(n)
          }
        );
      });
    },
    removeMark(key) {
      const { selection } = editor;
      if (!selection || editor.api.isCollapsed()) return removeMark(key);
      const matchesCell = getTableGridAbove(editor, { format: "cell" });
      if (matchesCell.length === 0) return removeMark(key);
      matchesCell.forEach(([_cell, cellPath]) => {
        editor.tf.unsetNodes(key, {
          at: cellPath,
          split: true,
          voids: true,
          match: (n) => import_plate19.TextApi.isText(n)
        });
      });
    }
  }
});

// src/lib/withNormalizeTable.ts
var import_plate20 = require("@udecode/plate");
var withNormalizeTable = ({
  editor,
  getOption,
  getOptions,
  tf: { normalizeNode },
  type
}) => ({
  transforms: {
    normalizeNode([n, path]) {
      const { enableUnsetSingleColSize, initialTableWidth } = getOptions();
      if (import_plate20.ElementApi.isElement(n)) {
        if (n.type === type) {
          const node = n;
          if (!node.children.some(
            (child) => import_plate20.ElementApi.isElement(child) && child.type === editor.getType(BaseTableRowPlugin)
          )) {
            editor.tf.removeNodes({ at: path });
            return;
          }
          if (node.colSizes && node.colSizes.length > 0 && enableUnsetSingleColSize && getTableColumnCount(node) < 2) {
            editor.tf.unsetNodes("colSizes", {
              at: path
            });
            return;
          }
          const tableEntry = editor.api.block({
            above: true,
            at: path,
            match: { type }
          });
          if (tableEntry) {
            editor.tf.unwrapNodes({
              at: path
            });
            return;
          }
          if (initialTableWidth) {
            const tableNode = node;
            const colCount = tableNode.children[0]?.children?.length;
            if (colCount) {
              const colSizes = [];
              if (!tableNode.colSizes) {
                for (let i = 0; i < colCount; i++) {
                  colSizes.push(initialTableWidth / colCount);
                }
              } else if (tableNode.colSizes.some((size) => !size)) {
                tableNode.colSizes.forEach((colSize) => {
                  colSizes.push(colSize || initialTableWidth / colCount);
                });
              }
              if (colSizes.length > 0) {
                editor.tf.setNodes({ colSizes }, { at: path });
                return;
              }
            }
          }
        }
        if (n.type === editor.getType(BaseTableRowPlugin)) {
          const parentEntry = editor.api.parent(path);
          if (parentEntry?.[0].type !== type) {
            editor.tf.unwrapNodes({
              at: path
            });
            return;
          }
        }
        if (getCellTypes(editor).includes(n.type)) {
          const node = n;
          const cellIndices = getOption("cellIndices", node.id);
          if (node.id && !cellIndices) {
            computeCellIndices(editor, {
              all: true,
              cellNode: node
            });
          }
          const { children } = node;
          const parentEntry = editor.api.parent(path);
          if (parentEntry?.[0].type !== editor.getType(BaseTableRowPlugin)) {
            editor.tf.unwrapNodes({
              at: path
            });
            return;
          }
          if (import_plate20.TextApi.isText(children[0])) {
            editor.tf.wrapNodes(editor.api.create.block({}, path), {
              at: path,
              children: true
            });
            return;
          }
        }
      }
      normalizeNode([n, path]);
    }
  }
});

// src/lib/withSetFragmentDataTable.ts
var withSetFragmentDataTable = ({
  api,
  editor,
  plugin,
  tf: { setFragmentData }
}) => ({
  transforms: {
    setFragmentData(data, originEvent) {
      const tableEntry = getTableGridAbove(editor, {
        format: "table"
      })?.[0];
      const selectedCellEntries = getTableGridAbove(editor, {
        format: "cell"
      });
      const initialSelection = editor.selection;
      if (!tableEntry || !initialSelection) {
        setFragmentData(data, originEvent);
        return;
      }
      const [tableNode, tablePath] = tableEntry;
      const tableRows = tableNode.children;
      tableNode.children = tableNode.children.filter(
        (v) => v.children.length > 0
      );
      let textCsv = "";
      let textTsv = "";
      const divElement = document.createElement("div");
      const tableElement = document.createElement("table");
      if (tableEntry && initialSelection && selectedCellEntries.length === 1 && (originEvent === "copy" || originEvent === "cut")) {
        setFragmentData(data);
        return;
      }
      editor.tf.withoutNormalizing(() => {
        tableRows.forEach((row) => {
          const rowCells = row.children;
          const cellStrings = [];
          const rowElement = row.type === editor.getType(BaseTableCellHeaderPlugin) ? document.createElement("th") : document.createElement("tr");
          rowCells.forEach((cell) => {
            data.clearData();
            const cellPath = editor.api.findPath(cell);
            editor.tf.select({
              anchor: editor.api.start(cellPath),
              focus: editor.api.end(cellPath)
            });
            setFragmentData(data);
            cellStrings.push(data.getData("text/plain"));
            const cellElement = document.createElement("td");
            const colSpan = api.table.getColSpan(cell);
            cellElement.colSpan = colSpan;
            const rowSpan = api.table.getRowSpan(cell);
            cellElement.rowSpan = rowSpan;
            cellElement.innerHTML = data.getData("text/html");
            rowElement.append(cellElement);
          });
          tableElement.append(rowElement);
          textCsv += `${cellStrings.join(",")}
`;
          textTsv += `${cellStrings.join("	")}
`;
        });
        const _tableEntry = editor.api.node({
          at: tablePath,
          match: { type: BaseTablePlugin.key }
        });
        if (_tableEntry != null && _tableEntry.length > 0) {
          const realTable = _tableEntry[0];
          if (realTable.attributes != null) {
            Object.entries(realTable.attributes).forEach(([key, value]) => {
              if (value != null && plugin.node.dangerouslyAllowAttributes?.includes(key)) {
                tableElement.setAttribute(key, String(value));
              }
            });
          }
        }
        editor.tf.select(initialSelection);
        divElement.append(tableElement);
      });
      data.setData("text/csv", textCsv);
      data.setData("text/tsv", textTsv);
      data.setData("text/plain", textTsv);
      data.setData("text/html", divElement.innerHTML);
      const selectedFragmentStr = JSON.stringify([tableNode]);
      const encodedFragment = window.btoa(
        encodeURIComponent(selectedFragmentStr)
      );
      data.setData("application/x-slate-fragment", encodedFragment);
    }
  }
});

// src/lib/withTable.ts
var withTable = (ctx) => {
  const mark = withMarkTable(ctx);
  return {
    api: {
      // getFragment
      ...withGetFragmentTable(ctx).api,
      ...mark.api
    },
    transforms: {
      // normalize
      ...withNormalizeTable(ctx).transforms,
      // delete
      ...withDeleteTable(ctx).transforms,
      // insertFragment
      ...withInsertFragmentTable(ctx).transforms,
      // insertText
      ...withInsertTextTable(ctx).transforms,
      // apply
      ...withApplyTable(ctx).transforms,
      // setFragmentData
      ...withSetFragmentDataTable(ctx).transforms,
      // addMark, removeMark
      ...mark.transforms
    }
  };
};

// src/lib/transforms/deleteColumn.ts
var import_plate22 = require("@udecode/plate");

// src/lib/merge/deleteColumnWhenExpanded.ts
var import_plate21 = require("@udecode/plate");
var deleteColumnWhenExpanded = (editor, tableEntry) => {
  const [start, end] = import_plate21.RangeApi.edges(editor.selection);
  const firstRow = import_plate21.NodeApi.child(tableEntry[0], 0);
  const lastRow = import_plate21.NodeApi.child(
    tableEntry[0],
    tableEntry[0].children.length - 1
  );
  const firstSelectionRow = editor.api.above({
    at: start,
    match: (n) => n.type === BaseTableRowPlugin.key
  });
  const lastSelectionRow = editor.api.above({
    at: end,
    match: (n) => n.type === BaseTableRowPlugin.key
  });
  if (!firstSelectionRow || !lastSelectionRow) return;
  if (firstRow.id === firstSelectionRow[0].id && lastSelectionRow[0].id === lastRow.id)
    deleteSelection(editor);
};
var deleteSelection = (editor) => {
  const cells = getTableGridAbove(editor, {
    format: "cell"
  });
  const pathRefs = [];
  cells.forEach(([_cell, cellPath]) => {
    pathRefs.push(editor.api.pathRef(cellPath));
  });
  pathRefs.forEach((pathRef) => {
    editor.tf.removeNodes({ at: pathRef.unref() });
  });
};

// src/lib/transforms/deleteColumn.ts
var deleteColumn = (editor) => {
  const { getOptions, type } = (0, import_plate22.getEditorPlugin)(editor, {
    key: "table"
  });
  const { disableMerge } = getOptions();
  const tableEntry = editor.api.above({
    match: { type }
  });
  if (!tableEntry) return;
  editor.tf.withoutNormalizing(() => {
    if (!disableMerge) {
      deleteTableMergeColumn(editor);
      return;
    }
    if (editor.api.isExpanded())
      return deleteColumnWhenExpanded(editor, tableEntry);
    const tdEntry = editor.api.above({
      match: { type: getCellTypes(editor) }
    });
    const trEntry = editor.api.above({
      match: { type: editor.getType(BaseTableRowPlugin) }
    });
    if (tdEntry && trEntry && tableEntry && // Cannot delete the last cell
    trEntry[0].children.length > 1) {
      const [tableNode, tablePath] = tableEntry;
      const tdPath = tdEntry[1];
      const colIndex = tdPath.at(-1);
      const pathToDelete = tdPath.slice();
      const replacePathPos = pathToDelete.length - 2;
      tableNode.children.forEach((row, rowIdx) => {
        pathToDelete[replacePathPos] = rowIdx;
        if (row.children.length === 1 || colIndex > row.children.length - 1)
          return;
        editor.tf.removeNodes({ at: pathToDelete });
      });
      const { colSizes } = tableNode;
      if (colSizes) {
        const newColSizes = [...colSizes];
        newColSizes.splice(colIndex, 1);
        editor.tf.setNodes(
          { colSizes: newColSizes },
          { at: tablePath }
        );
      }
    }
  });
};

// src/lib/transforms/deleteRow.ts
var import_plate25 = require("@udecode/plate");

// src/lib/merge/deleteRow.ts
var import_plate24 = require("@udecode/plate");
var import_cloneDeep2 = __toESM(require("lodash/cloneDeep.js"));

// src/lib/merge/deleteRowWhenExpanded.ts
var import_plate23 = require("@udecode/plate");
var deleteRowWhenExpanded = (editor, [table, tablePath]) => {
  const { api } = (0, import_plate23.getEditorPlugin)(editor, BaseTablePlugin);
  const columnCount = getTableMergedColumnCount(table);
  const cells = getTableGridAbove(editor, {
    format: "cell"
  });
  const firsRowIndex = getCellRowIndexByPath(cells[0][1]);
  if (firsRowIndex === null) return;
  let acrossColumn = 0;
  let lastRowIndex = -1;
  let rowSpanCarry = 0;
  let acrossRow = 0;
  cells.forEach(([cell, cellPath]) => {
    if (cellPath.at(-2) === firsRowIndex) {
      acrossColumn += cell.colSpan ?? 1;
    }
    const currentRowIndex = getCellRowIndexByPath(cellPath);
    if (lastRowIndex !== currentRowIndex) {
      if (rowSpanCarry !== 0) {
        rowSpanCarry--;
        return;
      }
      const rowSpan = api.table.getRowSpan(cell);
      rowSpanCarry = rowSpan && rowSpan > 1 ? rowSpan - 1 : 0;
      acrossRow += rowSpan ?? 1;
    }
    lastRowIndex = currentRowIndex;
  });
  if (acrossColumn === columnCount) {
    const pathRefs = [];
    for (let i = firsRowIndex; i < firsRowIndex + acrossRow; i++) {
      const removedPath = tablePath.concat(i);
      pathRefs.push(editor.api.pathRef(removedPath));
    }
    pathRefs.forEach((item) => {
      editor.tf.removeNodes({ at: item.unref() });
    });
  }
};

// src/lib/merge/deleteRow.ts
var deleteTableMergeRow = (editor) => {
  const { api, tf, type } = (0, import_plate24.getEditorPlugin)(editor, {
    key: "table"
  });
  if (editor.api.some({
    match: { type }
  })) {
    const currentTableItem = editor.api.above({
      match: { type }
    });
    if (!currentTableItem) return;
    if (editor.api.isExpanded())
      return deleteRowWhenExpanded(editor, currentTableItem);
    const table = currentTableItem[0];
    const selectedCellEntry = editor.api.above({
      match: { type: getCellTypes(editor) }
    });
    if (!selectedCellEntry) return;
    const selectedCell = selectedCellEntry[0];
    const { row: deletingRowIndex } = getCellIndices(editor, selectedCell);
    const rowsDeleteNumber = api.table.getRowSpan(selectedCell);
    const endingRowIndex = deletingRowIndex + rowsDeleteNumber - 1;
    const colNumber = getTableColumnCount(table);
    const affectedCellsSet = /* @__PURE__ */ new Set();
    Array.from({ length: colNumber }, (_, i) => i).forEach((cI) => {
      return Array.from({ length: rowsDeleteNumber }, (_, i) => i).forEach(
        (rI) => {
          const rowIndex = deletingRowIndex + rI;
          const found = findCellByIndexes(editor, table, rowIndex, cI);
          affectedCellsSet.add(found);
        }
      );
    });
    const affectedCells = Array.from(affectedCellsSet);
    const { moveToNextRowCells, squizeRowSpanCells } = affectedCells.reduce(
      (acc, cur) => {
        if (!cur) return acc;
        const currentCell = cur;
        const { row: curRowIndex } = getCellIndices(editor, currentCell);
        const curRowSpan = api.table.getRowSpan(currentCell);
        if (curRowIndex < deletingRowIndex && curRowSpan > 1) {
          acc.squizeRowSpanCells.push(currentCell);
        } else if (curRowSpan > 1 && curRowIndex + curRowSpan - 1 > endingRowIndex) {
          acc.moveToNextRowCells.push(currentCell);
        }
        return acc;
      },
      { moveToNextRowCells: [], squizeRowSpanCells: [] }
    );
    const nextRowIndex = deletingRowIndex + rowsDeleteNumber;
    const nextRow = table.children[nextRowIndex];
    if (nextRow === void 0 && deletingRowIndex === 0) {
      tf.remove.table();
      return;
    }
    if (nextRow) {
      for (let index = 0; index < moveToNextRowCells.length; index++) {
        const curRowCell = moveToNextRowCells[index];
        const { col: curRowCellColIndex, row: curRowCellRowIndex } = getCellIndices(editor, curRowCell);
        const curRowCellRowSpan = api.table.getRowSpan(curRowCell);
        const startingCellIndex = nextRow.children.findIndex((curC) => {
          const cell = curC;
          const { col: curColIndex } = getCellIndices(editor, cell);
          return curColIndex >= curRowCellColIndex;
        });
        if (startingCellIndex === -1) {
          const startingCell2 = nextRow.children.at(-1);
          const startingCellPath2 = editor.api.findPath(startingCell2);
          const tablePath2 = startingCellPath2.slice(0, -2);
          const colPath2 = startingCellPath2.at(-1) + index + 1;
          const nextRowStartCellPath2 = [...tablePath2, nextRowIndex, colPath2];
          const rowsNumberAffected2 = endingRowIndex - curRowCellRowIndex + 1;
          const rowSpan2 = curRowCellRowSpan - rowsNumberAffected2;
          const newCell2 = (0, import_cloneDeep2.default)({ ...curRowCell, rowSpan: rowSpan2 });
          if (newCell2.attributes?.rowspan) {
            newCell2.attributes.rowspan = rowSpan2.toString();
          }
          editor.tf.insertNodes(newCell2, {
            at: nextRowStartCellPath2
          });
          continue;
        }
        const startingCell = nextRow.children[startingCellIndex];
        const { col: startingColIndex } = getCellIndices(editor, startingCell);
        let incrementBy = index;
        if (startingColIndex < curRowCellColIndex) {
          incrementBy += 1;
        }
        const startingCellPath = editor.api.findPath(startingCell);
        const tablePath = startingCellPath.slice(0, -2);
        const colPath = startingCellPath.at(-1);
        const nextRowStartCellPath = [
          ...tablePath,
          nextRowIndex,
          colPath + incrementBy
        ];
        const rowsNumberAffected = endingRowIndex - curRowCellRowIndex + 1;
        const rowSpan = curRowCellRowSpan - rowsNumberAffected;
        const newCell = (0, import_cloneDeep2.default)({ ...curRowCell, rowSpan });
        if (newCell.attributes?.rowspan) {
          newCell.attributes.rowspan = rowSpan.toString();
        }
        editor.tf.insertNodes(newCell, {
          at: nextRowStartCellPath
        });
      }
    }
    squizeRowSpanCells.forEach((cur) => {
      const curRowCell = cur;
      const { row: curRowCellRowIndex } = getCellIndices(editor, curRowCell);
      const curRowCellRowSpan = api.table.getRowSpan(curRowCell);
      const curCellPath = editor.api.findPath(curRowCell);
      const curCellEndingRowIndex = Math.min(
        curRowCellRowIndex + curRowCellRowSpan - 1,
        endingRowIndex
      );
      const rowsNumberAffected = curCellEndingRowIndex - deletingRowIndex + 1;
      const rowSpan = curRowCellRowSpan - rowsNumberAffected;
      const newCell = (0, import_cloneDeep2.default)({ ...curRowCell, rowSpan });
      if (newCell.attributes?.rowspan) {
        newCell.attributes.rowspan = rowSpan.toString();
      }
      editor.tf.setNodes(newCell, { at: curCellPath });
    });
    const rowToDelete = table.children[deletingRowIndex];
    const rowPath = editor.api.findPath(rowToDelete);
    Array.from({ length: rowsDeleteNumber }).forEach(() => {
      editor.tf.removeNodes({
        at: rowPath
      });
    });
  }
};

// src/lib/transforms/deleteRow.ts
var deleteRow = (editor) => {
  const { getOptions, type } = (0, import_plate25.getEditorPlugin)(editor, {
    key: "table"
  });
  const { disableMerge } = getOptions();
  if (!disableMerge) {
    return deleteTableMergeRow(editor);
  }
  if (editor.api.some({
    match: { type }
  })) {
    const currentTableItem = editor.api.above({
      match: { type }
    });
    if (!currentTableItem) return;
    if (editor.api.isExpanded())
      return deleteRowWhenExpanded(editor, currentTableItem);
    const currentRowItem = editor.api.above({
      match: { type: editor.getType(BaseTableRowPlugin) }
    });
    if (currentRowItem && currentTableItem && // Cannot delete the last row
    currentTableItem[0].children.length > 1) {
      editor.tf.removeNodes({
        at: currentRowItem[1]
      });
    }
  }
};

// src/lib/transforms/deleteTable.ts
var deleteTable = (editor) => {
  if (editor.api.some({
    match: { type: editor.getType(BaseTablePlugin) }
  })) {
    const tableItem = editor.api.above({
      match: { type: editor.getType(BaseTablePlugin) }
    });
    if (tableItem) {
      editor.tf.removeNodes({
        at: tableItem[1]
      });
    }
  }
};

// src/lib/transforms/insertTable.ts
var import_plate26 = require("@udecode/plate");
var insertTable = (editor, { colCount = 2, header, rowCount = 2 } = {}, { select: shouldSelect, ...options } = {}) => {
  const { api } = editor.getPlugin({ key: "table" });
  const type = editor.getType(BaseTablePlugin);
  editor.tf.withoutNormalizing(() => {
    const newTable = api.create.table({
      colCount,
      header,
      rowCount
    });
    if (!options.at) {
      const currentTableEntry = editor.api.block({
        match: { type }
      });
      if (currentTableEntry) {
        const [, tablePath] = currentTableEntry;
        const insertPath = import_plate26.PathApi.next(tablePath);
        editor.tf.insertNodes(newTable, {
          at: insertPath,
          ...options
        });
        if (editor.selection) {
          editor.tf.select(editor.api.start(insertPath));
        }
        return;
      }
    }
    editor.tf.insertNodes(newTable, {
      nextBlock: !options.at,
      select: shouldSelect,
      ...options
    });
    if (shouldSelect) {
      const tableEntry = editor.api.node({
        at: options.at,
        match: { type }
      });
      if (!tableEntry) return;
      editor.tf.select(editor.api.start(tableEntry[1]));
    }
  });
};

// src/lib/transforms/insertTableColumn.ts
var import_plate28 = require("@udecode/plate");

// src/lib/merge/insertTableColumn.ts
var import_plate27 = require("@udecode/plate");
var import_cloneDeep3 = __toESM(require("lodash/cloneDeep.js"));

// src/lib/merge/getCellPath.ts
var getCellPath = (editor, tableEntry, curRowIndex, curColIndex) => {
  const [tableNode, tablePath] = tableEntry;
  const rowElem = tableNode.children[curRowIndex];
  const foundColIndex = rowElem.children.findIndex((c) => {
    const cE = c;
    const { col: colIndex } = getCellIndices(editor, cE);
    return colIndex === curColIndex;
  });
  return tablePath.concat([curRowIndex, foundColIndex]);
};

// src/lib/merge/insertTableColumn.ts
var insertTableMergeColumn = (editor, {
  at,
  before,
  fromCell,
  header,
  select: shouldSelect
} = {}) => {
  const { api, getOptions, type } = (0, import_plate27.getEditorPlugin)(editor, BaseTablePlugin);
  const { initialTableWidth, minColumnWidth } = getOptions();
  if (at && !fromCell) {
    const table = import_plate27.NodeApi.get(editor, at);
    if (table?.type === editor.getType(BaseTablePlugin)) {
      fromCell = import_plate27.NodeApi.lastChild(editor, at.concat([0]))[1];
      at = void 0;
    }
  }
  const cellEntry = fromCell ? editor.api.node({
    at: fromCell,
    match: { type: getCellTypes(editor) }
  }) : editor.api.block({
    match: { type: getCellTypes(editor) }
  });
  if (!cellEntry) return;
  const [, cellPath] = cellEntry;
  const cell = cellEntry[0];
  const tableEntry = editor.api.block({
    above: true,
    at: cellPath,
    match: { type }
  });
  if (!tableEntry) return;
  const [tableNode, tablePath] = tableEntry;
  const { col: cellColIndex } = getCellIndices(editor, cell);
  const cellColSpan = api.table.getColSpan(cell);
  let nextColIndex;
  let checkingColIndex;
  if (import_plate27.PathApi.isPath(at)) {
    nextColIndex = cellColIndex;
    checkingColIndex = cellColIndex - 1;
  } else {
    nextColIndex = before ? cellColIndex : cellColIndex + cellColSpan;
    checkingColIndex = before ? cellColIndex : cellColIndex + cellColSpan - 1;
  }
  const rowNumber = tableNode.children.length;
  const firstCol = nextColIndex <= 0;
  let placementCorrection = before ? 0 : 1;
  if (firstCol) {
    checkingColIndex = 0;
    placementCorrection = 0;
  }
  const affectedCellsSet = /* @__PURE__ */ new Set();
  Array.from({ length: rowNumber }, (_, i) => i).forEach((rI) => {
    const found = findCellByIndexes(editor, tableNode, rI, checkingColIndex);
    if (found) {
      affectedCellsSet.add(found);
    }
  });
  const affectedCells = Array.from(affectedCellsSet);
  affectedCells.forEach((curCell) => {
    const { col: curColIndex, row: curRowIndex } = getCellIndices(
      editor,
      curCell
    );
    const curRowSpan = api.table.getRowSpan(curCell);
    const curColSpan = api.table.getColSpan(curCell);
    const currentCellPath = getCellPath(
      editor,
      tableEntry,
      curRowIndex,
      curColIndex
    );
    const endCurI = curColIndex + curColSpan - 1;
    if (endCurI >= nextColIndex && !firstCol && !before) {
      const colSpan = curColSpan + 1;
      const newCell = (0, import_cloneDeep3.default)({ ...curCell, colSpan });
      if (newCell.attributes?.colspan) {
        newCell.attributes.colspan = colSpan.toString();
      }
      editor.tf.setNodes(newCell, { at: currentCellPath });
    } else {
      const curRowPath = currentCellPath.slice(0, -1);
      const curColPath = currentCellPath.at(-1);
      const placementPath = [
        ...curRowPath,
        before ? curColPath : curColPath + placementCorrection
      ];
      const row = editor.api.parent(currentCellPath);
      const rowElement = row[0];
      const emptyCell = {
        ...api.create.tableCell({ header, row: rowElement }),
        colSpan: 1,
        rowSpan: curRowSpan
      };
      editor.tf.insertNodes(emptyCell, {
        at: placementPath,
        select: shouldSelect
      });
    }
  });
  editor.tf.withoutNormalizing(() => {
    const { colSizes } = tableNode;
    if (colSizes) {
      let newColSizes = [
        ...colSizes.slice(0, nextColIndex),
        0,
        ...colSizes.slice(nextColIndex)
      ];
      if (initialTableWidth) {
        newColSizes[nextColIndex] = colSizes[nextColIndex] ?? colSizes[nextColIndex - 1] ?? initialTableWidth / colSizes.length;
        const oldTotal = colSizes.reduce((a, b) => a + b, 0);
        const newTotal = newColSizes.reduce((a, b) => a + b, 0);
        const maxTotal = Math.max(oldTotal, initialTableWidth);
        if (newTotal > maxTotal) {
          const factor = maxTotal / newTotal;
          newColSizes = newColSizes.map(
            (size) => Math.max(minColumnWidth ?? 0, Math.floor(size * factor))
          );
        }
      }
      editor.tf.setNodes(
        {
          colSizes: newColSizes
        },
        {
          at: tablePath
        }
      );
    }
  });
};

// src/lib/transforms/insertTableColumn.ts
var insertTableColumn = (editor, options = {}) => {
  const { api, getOptions, type } = (0, import_plate28.getEditorPlugin)(editor, BaseTablePlugin);
  const { disableMerge, initialTableWidth, minColumnWidth } = getOptions();
  if (!disableMerge) {
    return insertTableMergeColumn(editor, options);
  }
  const { before, header, select: shouldSelect } = options;
  let { at, fromCell } = options;
  if (at && !fromCell) {
    const table = import_plate28.NodeApi.get(editor, at);
    if (table?.type === editor.getType(BaseTablePlugin)) {
      fromCell = import_plate28.NodeApi.lastChild(editor, at.concat([0]))[1];
      at = void 0;
    }
  }
  const cellEntry = editor.api.block({
    at: fromCell,
    match: { type: getCellTypes(editor) }
  });
  if (!cellEntry) return;
  const [, cellPath] = cellEntry;
  const tableEntry = editor.api.block({
    above: true,
    at: cellPath,
    match: { type }
  });
  if (!tableEntry) return;
  const [tableNode, tablePath] = tableEntry;
  let nextCellPath;
  let nextColIndex;
  if (import_plate28.PathApi.isPath(at)) {
    nextCellPath = at;
    nextColIndex = at.at(-1);
  } else {
    nextCellPath = before ? cellPath : import_plate28.PathApi.next(cellPath);
    nextColIndex = before ? cellPath.at(-1) : cellPath.at(-1) + 1;
  }
  const currentRowIndex = cellPath.at(-2);
  editor.tf.withoutNormalizing(() => {
    tableNode.children.forEach((row, rowIndex) => {
      const insertCellPath = [...nextCellPath];
      if (import_plate28.PathApi.isPath(at)) {
        insertCellPath[at.length - 2] = rowIndex;
      } else {
        insertCellPath[cellPath.length - 2] = rowIndex;
      }
      const isHeaderRow = header === void 0 ? row.children.every(
        (c) => c.type === editor.getType(BaseTableCellHeaderPlugin)
      ) : header;
      editor.tf.insertNodes(
        api.create.tableCell({
          header: isHeaderRow
        }),
        {
          at: insertCellPath,
          select: shouldSelect && rowIndex === currentRowIndex
        }
      );
    });
    const { colSizes } = tableNode;
    if (colSizes) {
      let newColSizes = [
        ...colSizes.slice(0, nextColIndex),
        0,
        ...colSizes.slice(nextColIndex)
      ];
      if (initialTableWidth) {
        newColSizes[nextColIndex] = colSizes[nextColIndex] ?? colSizes[nextColIndex - 1] ?? initialTableWidth / colSizes.length;
        const oldTotal = colSizes.reduce((a, b) => a + b, 0);
        const newTotal = newColSizes.reduce((a, b) => a + b, 0);
        const maxTotal = Math.max(oldTotal, initialTableWidth);
        if (newTotal > maxTotal) {
          const factor = maxTotal / newTotal;
          newColSizes = newColSizes.map(
            (size) => Math.max(minColumnWidth ?? 0, Math.floor(size * factor))
          );
        }
      }
      editor.tf.setNodes(
        {
          colSizes: newColSizes
        },
        {
          at: tablePath
        }
      );
    }
  });
};

// src/lib/transforms/insertTableRow.ts
var import_plate30 = require("@udecode/plate");

// src/lib/merge/insertTableRow.ts
var import_plate29 = require("@udecode/plate");
var import_cloneDeep4 = __toESM(require("lodash/cloneDeep.js"));
var insertTableMergeRow = (editor, {
  at,
  before,
  fromRow,
  header,
  select: shouldSelect
} = {}) => {
  const { api, type } = (0, import_plate29.getEditorPlugin)(editor, BaseTablePlugin);
  if (at && !fromRow) {
    const table = import_plate29.NodeApi.get(editor, at);
    if (table?.type === editor.getType(BaseTablePlugin)) {
      fromRow = import_plate29.NodeApi.lastChild(editor, at)[1];
      at = void 0;
    }
  }
  const trEntry = editor.api.block({
    at: fromRow,
    match: { type: editor.getType(BaseTableRowPlugin) }
  });
  if (!trEntry) return;
  const [, trPath] = trEntry;
  const tableEntry = editor.api.block({
    above: true,
    at: trPath,
    match: { type }
  });
  if (!tableEntry) return;
  const tableNode = tableEntry[0];
  const cellEntry = editor.api.node({
    at: fromRow,
    match: { type: getCellTypes(editor) }
  });
  if (!cellEntry) return;
  const [cellNode, cellPath] = cellEntry;
  const cellElement = cellNode;
  const cellRowSpan = api.table.getRowSpan(cellElement);
  const { row: cellRowIndex } = getCellIndices(editor, cellElement);
  const rowPath = cellPath.at(-2);
  const tablePath = cellPath.slice(0, -2);
  let nextRowIndex;
  let checkingRowIndex;
  let nextRowPath;
  if (import_plate29.PathApi.isPath(at)) {
    nextRowIndex = at.at(-1);
    checkingRowIndex = cellRowIndex - 1;
    nextRowPath = at;
  } else {
    nextRowIndex = before ? cellRowIndex : cellRowIndex + cellRowSpan;
    checkingRowIndex = before ? cellRowIndex - 1 : cellRowIndex + cellRowSpan - 1;
    nextRowPath = [...tablePath, before ? rowPath : rowPath + cellRowSpan];
  }
  const firstRow = nextRowIndex === 0;
  if (firstRow) {
    checkingRowIndex = 0;
  }
  const colCount = getTableColumnCount(tableNode);
  const affectedCellsSet = /* @__PURE__ */ new Set();
  Array.from({ length: colCount }, (_, i) => i).forEach((cI) => {
    const found = findCellByIndexes(editor, tableNode, checkingRowIndex, cI);
    if (found) {
      affectedCellsSet.add(found);
    }
  });
  const affectedCells = Array.from(affectedCellsSet);
  const newRowChildren = [];
  affectedCells.forEach((cur) => {
    if (!cur) return;
    const curCell = cur;
    const { col: curColIndex, row: curRowIndex } = getCellIndices(
      editor,
      curCell
    );
    const curRowSpan = api.table.getRowSpan(curCell);
    const curColSpan = api.table.getColSpan(curCell);
    const currentCellPath = getCellPath(
      editor,
      tableEntry,
      curRowIndex,
      curColIndex
    );
    const endCurI = curRowIndex + curRowSpan - 1;
    if (endCurI >= nextRowIndex && !firstRow) {
      const rowSpan = curRowSpan + 1;
      const newCell = (0, import_cloneDeep4.default)({ ...curCell, rowSpan });
      if (newCell.attributes?.rowspan) {
        newCell.attributes.rowspan = rowSpan.toString();
      }
      editor.tf.setNodes(newCell, { at: currentCellPath });
    } else {
      const row = editor.api.parent(currentCellPath);
      const rowElement = row[0];
      const emptyCell = api.create.tableCell({ header, row: rowElement });
      newRowChildren.push({
        ...emptyCell,
        colSpan: curColSpan,
        rowSpan: 1
      });
    }
  });
  editor.tf.withoutNormalizing(() => {
    editor.tf.insertNodes(
      {
        children: newRowChildren,
        type: editor.getType(BaseTableRowPlugin)
      },
      {
        at: nextRowPath,
        select: false
      }
    );
    if (shouldSelect) {
      const cellEntry2 = editor.api.node({
        at: nextRowPath,
        match: { type: getCellTypes(editor) }
      });
      if (cellEntry2) {
        const [, nextCellPath] = cellEntry2;
        editor.tf.select(nextCellPath);
      }
    }
  });
};

// src/lib/transforms/insertTableRow.ts
var insertTableRow = (editor, options = {}) => {
  const { api, getOptions, type } = (0, import_plate30.getEditorPlugin)(editor, BaseTablePlugin);
  const { disableMerge } = getOptions();
  if (!disableMerge) {
    return insertTableMergeRow(editor, options);
  }
  const { before, header, select: shouldSelect } = options;
  let { at, fromRow } = options;
  if (at && !fromRow) {
    const table = import_plate30.NodeApi.get(editor, at);
    if (table?.type === editor.getType(BaseTablePlugin)) {
      fromRow = import_plate30.NodeApi.lastChild(editor, at)[1];
      at = void 0;
    }
  }
  const trEntry = editor.api.block({
    at: fromRow,
    match: { type: editor.getType(BaseTableRowPlugin) }
  });
  if (!trEntry) return;
  const [trNode, trPath] = trEntry;
  const tableEntry = editor.api.block({
    above: true,
    at: trPath,
    match: { type }
  });
  if (!tableEntry) return;
  const getEmptyRowNode2 = () => ({
    children: trNode.children.map((_, i) => {
      const hasSingleRow = tableEntry[0].children.length === 1;
      const isHeaderColumn = !hasSingleRow && tableEntry[0].children.every(
        (n) => n.children[i].type === editor.getType(BaseTableCellHeaderPlugin)
      );
      return api.create.tableCell({
        header: header ?? isHeaderColumn
      });
    }),
    type: editor.getType(BaseTableRowPlugin)
  });
  editor.tf.withoutNormalizing(() => {
    editor.tf.insertNodes(getEmptyRowNode2(), {
      at: import_plate30.PathApi.isPath(at) ? at : before ? trPath : import_plate30.PathApi.next(trPath)
    });
  });
  if (shouldSelect) {
    const cellEntry = editor.api.block({
      match: { type: getCellTypes(editor) }
    });
    if (!cellEntry) return;
    const [, nextCellPath] = cellEntry;
    if (import_plate30.PathApi.isPath(at)) {
      nextCellPath[nextCellPath.length - 2] = at.at(-2);
    } else {
      nextCellPath[nextCellPath.length - 2] = before ? nextCellPath.at(-2) : nextCellPath.at(-2) + 1;
    }
    editor.tf.select(nextCellPath);
  }
};

// src/lib/transforms/setBorderSize.ts
var import_plate31 = require("@udecode/plate");
var setBorderSize = (editor, size, {
  at,
  border = "all"
} = {}) => {
  const cellEntry = editor.api.node({
    at,
    match: { type: getCellTypes(editor) }
  });
  if (!cellEntry) return;
  const [cellNode, cellPath] = cellEntry;
  const cellIndex = cellPath.at(-1);
  const rowIndex = cellPath.at(-2);
  const borderStyle = {
    size
  };
  const setNodesOptions = {
    match: (n) => import_plate31.ElementApi.isElement(n) && getCellTypes(editor).includes(n.type)
  };
  if (border === "top") {
    const isFirstRow = rowIndex === 0;
    if (isFirstRow) {
      const newBorders2 = {
        ...cellNode.borders,
        top: borderStyle
      };
      editor.tf.setNodes(
        { borders: newBorders2 },
        {
          at: cellPath,
          ...setNodesOptions
        }
      );
      return;
    }
    const cellAboveEntry = getTopTableCell(editor, { at: cellPath });
    if (!cellAboveEntry) return;
    const [cellAboveNode, cellAbovePath] = cellAboveEntry;
    const newBorders = {
      ...cellAboveNode.borders,
      bottom: borderStyle
    };
    editor.tf.setNodes(
      { borders: newBorders },
      {
        at: cellAbovePath,
        ...setNodesOptions
      }
    );
  } else if (border === "bottom") {
    const newBorders = {
      ...cellNode.borders,
      bottom: borderStyle
    };
    editor.tf.setNodes(
      { borders: newBorders },
      {
        at: cellPath,
        ...setNodesOptions
      }
    );
  }
  if (border === "left") {
    const isFirstCell = cellIndex === 0;
    if (isFirstCell) {
      const newBorders2 = {
        ...cellNode.borders,
        left: borderStyle
      };
      editor.tf.setNodes(
        { borders: newBorders2 },
        {
          at: cellPath,
          ...setNodesOptions
        }
      );
      return;
    }
    const prevCellEntry = getLeftTableCell(editor, { at: cellPath });
    if (!prevCellEntry) return;
    const [prevCellNode, prevCellPath] = prevCellEntry;
    const newBorders = {
      ...prevCellNode.borders,
      right: borderStyle
    };
    editor.tf.setNodes(
      { borders: newBorders },
      {
        at: prevCellPath,
        ...setNodesOptions
      }
    );
  } else if (border === "right") {
    const newBorders = {
      ...cellNode.borders,
      right: borderStyle
    };
    editor.tf.setNodes(
      { borders: newBorders },
      {
        at: cellPath,
        ...setNodesOptions
      }
    );
  }
  if (border === "all") {
    editor.tf.withoutNormalizing(() => {
      setBorderSize(editor, size, { at, border: "top" });
      setBorderSize(editor, size, { at, border: "bottom" });
      setBorderSize(editor, size, { at, border: "left" });
      setBorderSize(editor, size, { at, border: "right" });
    });
  }
};

// src/lib/transforms/setTableColSize.ts
var setTableColSize = (editor, { colIndex, width }, options = {}) => {
  const table = editor.api.node({
    match: { type: BaseTablePlugin.key },
    ...options
  });
  if (!table) return;
  const [tableNode, tablePath] = table;
  const colSizes = tableNode.colSizes ? [...tableNode.colSizes] : Array.from({ length: getTableColumnCount(tableNode) }).fill(0);
  colSizes[colIndex] = width;
  editor.tf.setNodes({ colSizes }, { at: tablePath });
};

// src/lib/transforms/setTableMarginLeft.ts
var setTableMarginLeft = (editor, { marginLeft }, options = {}) => {
  const table = editor.api.node({
    match: { type: BaseTablePlugin.key },
    ...options
  });
  if (!table) return;
  const [, tablePath] = table;
  editor.tf.setNodes({ marginLeft }, { at: tablePath });
};

// src/lib/transforms/setTableRowSize.ts
var setTableRowSize = (editor, { height, rowIndex }, options = {}) => {
  const table = editor.api.node({
    match: { type: BaseTablePlugin.key },
    ...options
  });
  if (!table) return;
  const [, tablePath] = table;
  const tableRowPath = [...tablePath, rowIndex];
  editor.tf.setNodes({ size: height }, { at: tableRowPath });
};

// src/lib/merge/deleteColumn.ts
var deleteTableMergeColumn = (editor) => {
  const type = editor.getType(BaseTablePlugin);
  const tableEntry = editor.api.above({
    match: { type }
  });
  if (!tableEntry) return;
  editor.tf.withoutNormalizing(() => {
    const { api } = (0, import_plate32.getEditorPlugin)(editor, BaseTablePlugin);
    if (editor.api.isExpanded()) {
      return deleteColumnWhenExpanded(editor, tableEntry);
    }
    const table = tableEntry[0];
    const selectedCellEntry = editor.api.above({
      match: {
        type: getCellTypes(editor)
      }
    });
    if (!selectedCellEntry) return;
    const selectedCell = selectedCellEntry[0];
    const { col: deletingColIndex } = getCellIndices(editor, selectedCell);
    const colsDeleteNumber = api.table.getColSpan(selectedCell);
    const endingColIndex = deletingColIndex + colsDeleteNumber - 1;
    const rowNumber = table.children.length;
    const affectedCellsSet = /* @__PURE__ */ new Set();
    Array.from({ length: rowNumber }, (_, i) => i).forEach((rI) => {
      return Array.from({ length: colsDeleteNumber }, (_, i) => i).forEach(
        (cI) => {
          const colIndex = deletingColIndex + cI;
          const found = findCellByIndexes(editor, table, rI, colIndex);
          if (found) {
            affectedCellsSet.add(found);
          }
        }
      );
    });
    const affectedCells = Array.from(affectedCellsSet);
    const { squizeColSpanCells } = affectedCells.reduce(
      (acc, cur) => {
        if (!cur) return acc;
        const currentCell = cur;
        const { col: curColIndex } = getCellIndices(editor, currentCell);
        const curColSpan = api.table.getColSpan(currentCell);
        if (curColIndex < deletingColIndex && curColSpan > 1) {
          acc.squizeColSpanCells.push(currentCell);
        } else if (curColSpan > 1 && curColIndex + curColSpan - 1 > endingColIndex) {
          acc.squizeColSpanCells.push(currentCell);
        }
        return acc;
      },
      { squizeColSpanCells: [] }
    );
    squizeColSpanCells.forEach((cur) => {
      const curCell = cur;
      const { col: curColIndex, row: curColRowIndex } = getCellIndices(
        editor,
        curCell
      );
      const curColSpan = api.table.getColSpan(curCell);
      const curCellPath = getCellPath(
        editor,
        tableEntry,
        curColRowIndex,
        curColIndex
      );
      const curCellEndingColIndex = Math.min(
        curColIndex + curColSpan - 1,
        endingColIndex
      );
      const colsNumberAffected = curCellEndingColIndex - deletingColIndex + 1;
      const colSpan = curColSpan - colsNumberAffected;
      const newCell = (0, import_cloneDeep5.default)({ ...curCell, colSpan });
      if (newCell.attributes?.colspan) {
        newCell.attributes.colspan = colSpan.toString();
      }
      editor.tf.setNodes(newCell, { at: curCellPath });
    });
    const trEntry = editor.api.above({
      match: { type: editor.getType(BaseTableRowPlugin) }
    });
    if (selectedCell && trEntry && tableEntry && // Cannot delete the last cell
    trEntry[0].children.length > 1) {
      const [tableNode, tablePath] = tableEntry;
      const paths = [];
      affectedCells.forEach((cur) => {
        const curCell = cur;
        const { col: curColIndex, row: curRowIndex } = getCellIndices(
          editor,
          curCell
        );
        if (!squizeColSpanCells.includes(curCell) && curColIndex >= deletingColIndex && curColIndex <= endingColIndex) {
          const cellPath = getCellPath(
            editor,
            tableEntry,
            curRowIndex,
            curColIndex
          );
          if (!paths[curRowIndex]) {
            paths[curRowIndex] = [];
          }
          paths[curRowIndex].push(cellPath);
        }
      });
      paths.forEach((cellPaths) => {
        const pathToDelete = cellPaths[0];
        cellPaths.forEach(() => {
          editor.tf.removeNodes({
            at: pathToDelete
          });
        });
      });
      const { colSizes } = tableNode;
      if (colSizes) {
        const newColSizes = [...colSizes];
        newColSizes.splice(deletingColIndex, 1);
        editor.tf.setNodes(
          { colSizes: newColSizes },
          { at: tablePath }
        );
      }
    }
  });
};

// src/lib/merge/getTableMergedColumnCount.ts
var getTableMergedColumnCount = (tableNode) => {
  return tableNode.children?.[0]?.children?.reduce(
    (prev, cur) => prev + (getColSpan(cur) ?? 1),
    0
  );
};

// src/lib/merge/isTableRectangular.ts
var allEqual = (arr) => arr.every((val) => val === arr[0]);
var isTableRectangular = (table) => {
  const arr = [];
  table?.children?.forEach((row, rI) => {
    const rowEl = row;
    rowEl.children?.forEach((cell) => {
      const cellElem = cell;
      Array.from({
        length: getRowSpan(cellElem) || 1
      }).forEach((_, i) => {
        if (!arr[rI + i]) {
          arr[rI + i] = 0;
        }
        arr[rI + i] += getColSpan(cellElem);
      });
    });
  });
  return allEqual(arr);
};

// src/lib/merge/mergeTableCells.ts
var import_plate33 = require("@udecode/plate");
var import_cloneDeep6 = __toESM(require("lodash/cloneDeep.js"));
var mergeTableCells = (editor) => {
  const { api } = (0, import_plate33.getEditorPlugin)(editor, BaseTablePlugin);
  const cellEntries = getTableGridAbove(editor, {
    format: "cell"
  });
  editor.tf.withoutNormalizing(() => {
    let colSpan = 0;
    for (const entry of cellEntries) {
      const [cell, path] = entry;
      const rowIndex = path.at(-2);
      if (rowIndex === cellEntries[0][1].at(-2)) {
        const cellColSpan = api.table.getColSpan(cell);
        colSpan += cellColSpan;
      }
    }
    let rowSpan = 0;
    const { col } = getCellIndices(editor, cellEntries[0][0]);
    cellEntries.forEach((entry) => {
      const cell = entry[0];
      const { col: curCol } = getCellIndices(editor, cell);
      if (col === curCol) {
        rowSpan += api.table.getRowSpan(cell);
      }
    });
    const mergingCellChildren = [];
    for (const cellEntry of cellEntries) {
      const [el] = cellEntry;
      const cellChildren = api.table.getCellChildren(el);
      if (cellChildren.length !== 1 || !editor.api.isEmpty(cellChildren[0])) {
        mergingCellChildren.push(...(0, import_cloneDeep6.default)(cellChildren));
      }
    }
    const cols = {};
    cellEntries.forEach(([_entry, path]) => {
      const rowIndex = path.at(-2);
      if (cols[rowIndex]) {
        cols[rowIndex].push(path);
      } else {
        cols[rowIndex] = [path];
      }
    });
    Object.values(cols).forEach((paths) => {
      paths?.forEach(() => {
        editor.tf.removeNodes({ at: paths[0] });
      });
    });
    const mergedCell = {
      ...api.create.tableCell({
        children: mergingCellChildren,
        header: cellEntries[0][0].type === editor.getType(BaseTableCellHeaderPlugin)
      }),
      colSpan,
      rowSpan
    };
    editor.tf.insertNodes(mergedCell, { at: cellEntries[0][1] });
  });
  editor.tf.select(editor.api.end(cellEntries[0][1]));
};

// src/lib/merge/splitTableCell.ts
var import_plate34 = require("@udecode/plate");
var splitTableCell = (editor) => {
  const { api } = (0, import_plate34.getEditorPlugin)(editor, BaseTablePlugin);
  const tableRowType = editor.getType(BaseTableRowPlugin);
  const cellEntries = getTableGridAbove(editor, { format: "cell" });
  const [[cellElem, path]] = cellEntries;
  editor.tf.withoutNormalizing(() => {
    const createEmptyCell = (children) => {
      return {
        ...api.create.tableCell({
          children,
          header: cellElem.type === editor.getType(BaseTableCellHeaderPlugin)
        }),
        colSpan: 1,
        rowSpan: 1
      };
    };
    const tablePath = path.slice(0, -2);
    const cellPath = path.slice(-2);
    const [rowPath, colPath] = cellPath;
    const colSpan = api.table.getColSpan(cellElem);
    const rowSpan = api.table.getRowSpan(cellElem);
    const colPaths = [];
    for (let i = 0; i < colSpan; i++) {
      colPaths.push(colPath + i);
    }
    const { col } = getCellIndices(editor, cellElem);
    editor.tf.removeNodes({ at: path });
    const getClosestColPathForRow = (row, targetCol) => {
      const rowEntry = editor.api.node({
        at: [...tablePath, row],
        match: { type: tableRowType }
      });
      if (!rowEntry) {
        return 0;
      }
      const rowEl = rowEntry[0];
      let closestColPath = [];
      let smallestDiff = Number.POSITIVE_INFINITY;
      let isDirectionLeft = false;
      rowEl.children.forEach((cell) => {
        const cellElement = cell;
        const { col: cellCol } = getCellIndices(editor, cellElement);
        const diff = Math.abs(cellCol - targetCol);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          closestColPath = editor.api.findPath(cellElement);
          isDirectionLeft = cellCol < targetCol;
        }
      });
      if (closestColPath.length > 0) {
        const lastIndex = closestColPath.at(-1);
        if (isDirectionLeft) {
          return lastIndex + 1;
        }
        return lastIndex;
      }
      return 1;
    };
    for (let i = 0; i < rowSpan; i++) {
      const currentRowPath = rowPath + i;
      const pathForNextRows = getClosestColPathForRow(currentRowPath, col);
      const newRowChildren = [];
      const _rowPath = [...tablePath, currentRowPath];
      const rowEntry = editor.api.node({
        at: _rowPath,
        match: { type: tableRowType }
      });
      for (let j = 0; j < colPaths.length; j++) {
        const cellChildren = api.table.getCellChildren(cellElem);
        const cellToInsert = i === 0 && j === 0 ? createEmptyCell(cellChildren) : createEmptyCell();
        if (rowEntry) {
          const currentColPath = i === 0 ? colPaths[j] : pathForNextRows;
          const pathForNewCell = [...tablePath, currentRowPath, currentColPath];
          editor.tf.insertNodes(cellToInsert, { at: pathForNewCell });
        } else {
          newRowChildren.push(cellToInsert);
        }
      }
      if (!rowEntry) {
        editor.tf.insertNodes(
          {
            children: newRowChildren,
            type: editor.getType(BaseTableRowPlugin)
          },
          { at: _rowPath }
        );
      }
    }
  });
  editor.tf.select(editor.api.end(path));
};

// src/lib/BaseTablePlugin.ts
var parse = ({ element, type }) => {
  const background = element.style.background || element.style.backgroundColor;
  if (background) {
    return {
      background,
      type
    };
  }
  return { type };
};
var BaseTableRowPlugin = (0, import_plate35.createSlatePlugin)({
  key: "tr",
  node: { isElement: true },
  parsers: {
    html: {
      deserializer: {
        rules: [{ validNodeName: "TR" }]
      }
    }
  }
});
var BaseTableCellPlugin = (0, import_plate35.createSlatePlugin)({
  key: "td",
  node: {
    dangerouslyAllowAttributes: ["colspan", "rowspan"],
    isElement: true,
    props: ({ element }) => ({
      colSpan: element?.attributes?.colspan,
      rowSpan: element?.attributes?.rowspan
    })
  },
  parsers: {
    html: {
      deserializer: {
        attributeNames: ["rowspan", "colspan"],
        parse,
        rules: [{ validNodeName: "TD" }]
      }
    }
  }
});
var BaseTableCellHeaderPlugin = (0, import_plate35.createSlatePlugin)({
  key: "th",
  node: {
    dangerouslyAllowAttributes: ["colspan", "rowspan"],
    isElement: true,
    props: ({ element }) => ({
      colSpan: element?.attributes?.colspan,
      rowSpan: element?.attributes?.rowspan
    })
  },
  parsers: {
    html: {
      deserializer: {
        attributeNames: ["rowspan", "colspan"],
        parse,
        rules: [{ validNodeName: "TH" }]
      }
    }
  }
});
var BaseTablePlugin = (0, import_plate35.createTSlatePlugin)({
  key: "table",
  // dependencies: [NodeIdPlugin.key],
  node: {
    isElement: true
  },
  normalizeInitialValue: normalizeInitialValueTable,
  options: {
    _cellIndices: {},
    disableMerge: false,
    minColumnWidth: 48,
    selectedCells: null,
    selectedTables: null
  },
  parsers: {
    html: {
      deserializer: {
        rules: [{ validNodeName: "TABLE" }]
      }
    }
  },
  plugins: [BaseTableRowPlugin, BaseTableCellPlugin, BaseTableCellHeaderPlugin]
}).extendSelectors(({ getOptions }) => ({
  cellIndices: (id) => getOptions()._cellIndices[id]
})).extendEditorApi(({ editor }) => ({
  create: {
    table: (0, import_plate35.bindFirst)(getEmptyTableNode, editor),
    tableCell: (0, import_plate35.bindFirst)(getEmptyCellNode, editor),
    tableRow: (0, import_plate35.bindFirst)(getEmptyRowNode, editor)
  },
  table: {
    getCellBorders: (0, import_plate35.bindFirst)(getTableCellBorders, editor),
    getCellSize: (0, import_plate35.bindFirst)(getTableCellSize, editor),
    getColSpan,
    getRowSpan,
    getCellChildren: (cell) => cell.children
  }
})).extendEditorTransforms(({ editor }) => ({
  insert: {
    table: (0, import_plate35.bindFirst)(insertTable, editor),
    tableColumn: (0, import_plate35.bindFirst)(insertTableColumn, editor),
    tableRow: (0, import_plate35.bindFirst)(insertTableRow, editor)
  },
  remove: {
    table: (0, import_plate35.bindFirst)(deleteTable, editor),
    tableColumn: (0, import_plate35.bindFirst)(deleteColumn, editor),
    tableRow: (0, import_plate35.bindFirst)(deleteRow, editor)
  },
  table: {
    merge: (0, import_plate35.bindFirst)(mergeTableCells, editor),
    split: (0, import_plate35.bindFirst)(splitTableCell, editor)
  }
})).overrideEditor(withTable);

// src/react/onKeyDownTable.ts
var import_plate36 = require("@udecode/plate");
var onKeyDownTable = ({
  editor,
  event,
  type
}) => {
  if (event.defaultPrevented) return;
  const compositeKeyCode = 229;
  if (
    // This exception only occurs when IME composition is triggered, and can be identified by this keycode
    event.which === compositeKeyCode && editor.selection && editor.api.isExpanded()
  ) {
    const tdEntries = Array.from(
      editor.api.nodes({
        at: editor.selection,
        match: { type: getCellTypes(editor) }
      })
    );
    if (tdEntries.length > 1) {
      editor.tf.collapse({
        edge: "end"
      });
      return;
    }
  }
  const isKeyDown = {
    "shift+down": (0, import_plate36.isHotkey)("shift+down", event),
    "shift+left": (0, import_plate36.isHotkey)("shift+left", event),
    "shift+right": (0, import_plate36.isHotkey)("shift+right", event),
    "shift+up": (0, import_plate36.isHotkey)("shift+up", event)
  };
  Object.keys(isKeyDown).forEach((key) => {
    if (isKeyDown[key] && // if many cells are selected
    moveSelectionFromCell(editor, {
      edge: KEY_SHIFT_EDGES[key],
      reverse: key === "shift+up"
    })) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
  const isTab = import_plate36.Hotkeys.isTab(editor, event);
  const isUntab = import_plate36.Hotkeys.isUntab(editor, event);
  if (isTab || isUntab) {
    const entries = getTableEntries(editor);
    if (!entries) return;
    const { cell, row } = entries;
    const [, cellPath] = cell;
    if (isUntab) {
      const previousCell = getPreviousTableCell(editor, cell, cellPath, row);
      if (previousCell) {
        const [, previousCellPath] = previousCell;
        editor.tf.select(previousCellPath);
      }
    } else if (isTab) {
      const nextCell = getNextTableCell(editor, cell, cellPath, row);
      if (nextCell) {
        const [, nextCellPath] = nextCell;
        editor.tf.select(nextCellPath);
      }
    }
    event.preventDefault();
    event.stopPropagation();
  }
  if ((0, import_plate36.isHotkey)("mod+a", event)) {
    const res = editor.api.above({ match: { type } });
    if (!res) return;
    const [, tablePath] = res;
    editor.tf.select(tablePath);
    event.preventDefault();
    event.stopPropagation();
  }
};

// src/react/TablePlugin.tsx
var TableRowPlugin = (0, import_react.toPlatePlugin)(BaseTableRowPlugin);
var TableCellPlugin = (0, import_react.toPlatePlugin)(BaseTableCellPlugin);
var TableCellHeaderPlugin = (0, import_react.toPlatePlugin)(BaseTableCellHeaderPlugin);
var TablePlugin = (0, import_react.toPlatePlugin)(BaseTablePlugin, {
  handlers: {
    onKeyDown: onKeyDownTable
  },
  plugins: [TableRowPlugin, TableCellPlugin, TableCellHeaderPlugin]
});

// src/react/components/TableCellElement/getOnSelectTableBorderFactory.ts
function setCellBorderSize(editor, cell, directions, size) {
  const at = editor.api.findPath(cell);
  if (!at) return;
  if (directions === "all") {
    setBorderSize(editor, size, { at, border: "all" });
  } else {
    for (const dir of directions) {
      setBorderSize(editor, size, { at, border: dir });
    }
  }
}
function setSelectedCellsBorder(editor, {
  border,
  cells
}) {
  if (cells.length === 0) return;
  if (border === "none") {
    const { none: allNone } = getSelectedCellsBorders(editor, cells);
    const newSize2 = allNone ? 1 : 0;
    for (const cell of cells) {
      const cellPath = editor.api.findPath(cell);
      if (!cellPath) continue;
      const { col, row } = getCellIndices(editor, cell);
      const edges = [];
      if (row === 0) edges.push("top");
      if (col === 0) edges.push("left");
      edges.push("bottom", "right");
      if (row > 0) {
        const cellAboveEntry = getTopTableCell(editor, { at: cellPath });
        if (cellAboveEntry) {
          const [cellAbove] = cellAboveEntry;
          setCellBorderSize(editor, cellAbove, ["bottom"], newSize2);
        }
      }
      if (col > 0) {
        const prevCellEntry = getLeftTableCell(editor, { at: cellPath });
        if (prevCellEntry) {
          const [prevCell] = prevCellEntry;
          setCellBorderSize(editor, prevCell, ["right"], newSize2);
        }
      }
      if (edges.length > 0) {
        setCellBorderSize(editor, cell, edges, newSize2);
      }
    }
    return;
  }
  if (border === "outer") {
    const { outer: allOut } = getSelectedCellsBorders(editor, cells);
    const newSize2 = allOut ? 0 : 1;
    const { maxCol: maxCol2, maxRow: maxRow2, minCol: minCol2, minRow: minRow2 } = getSelectedCellsBoundingBox(
      editor,
      cells
    );
    for (const cell of cells) {
      const { col, row } = getCellIndices(editor, cell);
      const cSpan = getColSpan(cell);
      const rSpan = getRowSpan(cell);
      for (let rr = row; rr < row + rSpan; rr++) {
        for (let cc = col; cc < col + cSpan; cc++) {
          const edges = [];
          if (rr === minRow2) edges.push("top");
          if (rr === maxRow2) edges.push("bottom");
          if (cc === minCol2) edges.push("left");
          if (cc === maxCol2) edges.push("right");
          if (edges.length > 0) {
            setCellBorderSize(editor, cell, edges, newSize2);
          }
        }
      }
    }
    return;
  }
  const allSet = isSelectedCellBorder(editor, cells, border);
  const newSize = allSet ? 0 : 1;
  const { maxCol, maxRow, minCol, minRow } = getSelectedCellsBoundingBox(
    editor,
    cells
  );
  for (const cell of cells) {
    const { col, row } = getCellIndices(editor, cell);
    const cSpan = getColSpan(cell);
    const rSpan = getRowSpan(cell);
    const cellPath = editor.api.findPath(cell);
    if (!cellPath) continue;
    const edges = [];
    if (border === "top" && row === minRow) {
      const isFirstRow = row === 0;
      if (isFirstRow) {
        edges.push("top");
      } else {
        const cellAboveEntry = getTopTableCell(editor, { at: cellPath });
        if (cellAboveEntry) {
          const [cellAbove] = cellAboveEntry;
          setCellBorderSize(editor, cellAbove, ["bottom"], newSize);
        }
      }
    }
    if (border === "bottom" && row + rSpan - 1 === maxRow) {
      edges.push("bottom");
    }
    if (border === "left" && col === minCol) {
      const isFirstCell = col === 0;
      if (isFirstCell) {
        edges.push("left");
      } else {
        const prevCellEntry = getLeftTableCell(editor, { at: cellPath });
        if (prevCellEntry) {
          const [prevCell] = prevCellEntry;
          setCellBorderSize(editor, prevCell, ["right"], newSize);
        }
      }
    }
    if (border === "right" && col + cSpan - 1 === maxCol) {
      edges.push("right");
    }
    if (edges.length > 0) {
      setCellBorderSize(editor, cell, edges, newSize);
    }
  }
}
var getOnSelectTableBorderFactory = (editor, selectedCells) => (border) => () => {
  if (!selectedCells || selectedCells.length === 0) {
    const cell = editor.api.block({ match: { type: getCellTypes(editor) } });
    if (cell) {
      selectedCells = [cell[0]];
    } else {
      return;
    }
  }
  const cellElems = selectedCells.map((v) => v);
  setSelectedCellsBorder(editor, { border, cells: cellElems });
};

// src/react/components/TableCellElement/roundCellSizeToStep.ts
var roundCellSizeToStep = (size, step) => {
  return step ? Math.round(size / step) * step : size;
};

// src/react/components/TableCellElement/useIsCellSelected.ts
var import_react2 = require("@udecode/plate/react");
var useIsCellSelected = (element) => {
  const selectedCells = (0, import_react2.usePluginOption)(TablePlugin, "selectedCells");
  return !!selectedCells?.includes(element);
};

// src/react/components/TableCellElement/useTableBordersDropdownMenuContentState.ts
var import_react3 = require("@udecode/plate/react");
var useTableBordersDropdownMenuContentState = ({
  element: el
} = {}) => {
  const { editor } = (0, import_react3.useEditorPlugin)(TablePlugin);
  const element = (0, import_react3.useElement)() ?? el;
  const selectedCells = (0, import_react3.usePluginOption)(TablePlugin, "selectedCells");
  const borderStates = (0, import_react3.useEditorSelector)(
    (editor2) => getSelectedCellsBorders(editor2, selectedCells),
    [selectedCells, element]
  );
  return {
    getOnSelectTableBorder: getOnSelectTableBorderFactory(
      editor,
      selectedCells
    ),
    hasBottomBorder: borderStates.bottom,
    hasLeftBorder: borderStates.left,
    hasNoBorders: borderStates.none,
    hasOuterBorders: borderStates.outer,
    hasRightBorder: borderStates.right,
    hasTopBorder: borderStates.top
  };
};

// src/react/components/TableCellElement/useTableCellBorders.ts
var import_react6 = __toESM(require("react"));
var import_react7 = require("@udecode/plate/react");

// src/react/hooks/useCellIndices.ts
var import_react4 = __toESM(require("react"));
var import_react5 = require("@udecode/plate/react");
var useCellIndices = () => {
  const { editor } = (0, import_react5.useEditorPlugin)(TablePlugin);
  const element = (0, import_react5.useElement)();
  const cellIndices = (0, import_react5.usePluginOption)(TablePlugin, "cellIndices", element.id);
  return import_react4.default.useMemo(() => {
    if (!cellIndices) {
      return computeCellIndices(editor, {
        cellNode: element
      }) ?? { col: 0, row: 0 };
    }
    return cellIndices ?? { col: 0, row: 0 };
  }, [cellIndices, editor, element]);
};

// src/react/components/TableCellElement/useTableCellBorders.ts
function useTableCellBorders({
  element: el
} = {}) {
  const { editor } = (0, import_react7.useEditorPlugin)(TablePlugin);
  const element = (0, import_react7.useElement)() ?? el;
  const cellIndices = useCellIndices();
  return import_react6.default.useMemo(() => {
    return getTableCellBorders(editor, { cellIndices, element });
  }, [editor, element, cellIndices]);
}

// src/react/components/TableCellElement/useTableCellElement.ts
var import_react16 = __toESM(require("react"));
var import_react17 = require("@udecode/plate/react");

// src/react/stores/useTableStore.ts
var import_react8 = __toESM(require("react"));
var import_react9 = require("@udecode/plate/react");
var {
  TableProvider,
  tableStore,
  useTableSet,
  useTableState,
  useTableStore,
  useTableValue
} = (0, import_react9.createAtomStore)(
  {
    colSizeOverrides: (0, import_react9.atom)(/* @__PURE__ */ new Map()),
    marginLeftOverride: null,
    rowSizeOverrides: (0, import_react9.atom)(/* @__PURE__ */ new Map())
  },
  { name: "table" }
);
var useOverrideSizeFactory = (setOverrides) => import_react8.default.useCallback(
  (index, size) => {
    setOverrides((overrides) => {
      const newOverrides = new Map(overrides);
      if (size === null) {
        newOverrides.delete(index);
      } else {
        newOverrides.set(index, size);
      }
      return newOverrides;
    });
  },
  [setOverrides]
);
var useOverrideColSize = () => {
  const setColSizeOverrides = useTableSet("colSizeOverrides");
  return useOverrideSizeFactory(setColSizeOverrides);
};
var useOverrideRowSize = () => {
  const setRowSizeOverrides = useTableSet("rowSizeOverrides");
  return useOverrideSizeFactory(setRowSizeOverrides);
};
var useOverrideMarginLeft = () => useTableSet("marginLeftOverride");

// src/react/components/TableCellElement/useTableCellSize.ts
var import_react14 = __toESM(require("react"));
var import_react15 = require("@udecode/plate/react");

// src/react/components/TableElement/useSelectedCells.ts
var import_react10 = __toESM(require("react"));
var import_react11 = require("@udecode/plate/react");
var useSelectedCells = () => {
  const readOnly = (0, import_react11.useReadOnly)();
  const selected = (0, import_react11.useSelected)();
  const editor = (0, import_react11.useEditorRef)();
  const { setOption } = (0, import_react11.useEditorPlugin)(TablePlugin);
  const selectedCells = (0, import_react11.usePluginOption)(TablePlugin, "selectedCells");
  import_react10.default.useEffect(() => {
    if (!selected || readOnly) {
      setOption("selectedCells", null);
      setOption("selectedTables", null);
    }
  }, [selected, editor, readOnly, setOption]);
  import_react10.default.useEffect(() => {
    if (readOnly) return;
    const tableEntries = getTableGridAbove(editor, { format: "table" });
    const cellEntries = getTableGridAbove(editor, { format: "cell" });
    if (cellEntries?.length > 1) {
      const cells = cellEntries.map((entry) => entry[0]);
      const tables = tableEntries.map((entry) => entry[0]);
      if (JSON.stringify(cells) !== JSON.stringify(selectedCells)) {
        setOption("selectedCells", cells);
        setOption("selectedTables", tables);
      }
    } else if (selectedCells) {
      setOption("selectedCells", null);
      setOption("selectedTables", null);
    }
  }, [editor, editor.selection, readOnly, selectedCells, setOption]);
};

// src/react/components/TableElement/useTableColSizes.ts
var import_plate37 = require("@udecode/plate");
var import_react12 = require("@udecode/plate/react");
var useTableColSizes = ({
  disableOverrides = false,
  transformColSizes
} = {}) => {
  const colSizeOverrides = useTableValue("colSizeOverrides");
  const overriddenColSizes = (0, import_react12.useElementSelector)(
    ([tableNode]) => {
      const colSizes = getTableOverriddenColSizes(
        tableNode,
        disableOverrides ? void 0 : colSizeOverrides
      );
      if (transformColSizes) {
        return transformColSizes(colSizes);
      }
      return colSizes;
    },
    [disableOverrides, colSizeOverrides, transformColSizes],
    {
      key: TablePlugin.key,
      equalityFn: (a, b) => !!a && !!b && import_plate37.PathApi.equals(a, b)
    }
  );
  return overriddenColSizes;
};

// src/react/components/TableElement/useTableElement.ts
var import_react13 = require("@udecode/plate/react");
var useTableElement = () => {
  const { editor, getOptions } = (0, import_react13.useEditorPlugin)(TablePlugin);
  const { disableMarginLeft } = getOptions();
  const element = (0, import_react13.useElement)();
  const selectedCells = (0, import_react13.usePluginOption)(TablePlugin, "selectedCells");
  const marginLeftOverride = useTableValue("marginLeftOverride");
  const marginLeft = disableMarginLeft ? 0 : marginLeftOverride ?? element.marginLeft ?? 0;
  useSelectedCells();
  return {
    isSelectingCell: !!selectedCells,
    marginLeft,
    props: {
      onMouseDown: () => {
        if (selectedCells) {
          editor.tf.collapse();
        }
      }
    }
  };
};

// src/react/components/TableCellElement/useTableCellSize.ts
function useTableCellSize({
  element: el
} = {}) {
  const { api } = (0, import_react15.useEditorPlugin)(TablePlugin);
  const element = (0, import_react15.useElement)() ?? el;
  const colSizes = useTableColSizes();
  const cellIndices = useCellIndices();
  const rowSize = (0, import_react15.useElementSelector)(
    ([node]) => node.size,
    [],
    {
      key: TableRowPlugin.key
    }
  );
  return import_react14.default.useMemo(
    () => api.table.getCellSize({ cellIndices, colSizes, element, rowSize }),
    [api.table, cellIndices, colSizes, element, rowSize]
  );
}

// src/react/components/TableCellElement/useTableCellElement.ts
var useTableCellElement = () => {
  const { api, setOption } = (0, import_react17.useEditorPlugin)(TablePlugin);
  const element = (0, import_react17.useElement)();
  const isCellSelected = useIsCellSelected(element);
  const selectedCells = (0, import_react17.usePluginOption)(TablePlugin, "selectedCells");
  import_react16.default.useEffect(() => {
    if (selectedCells?.some((v) => v.id === element.id && element !== v)) {
      setOption(
        "selectedCells",
        selectedCells.map((v) => v.id === element.id ? element : v)
      );
    }
  }, [element]);
  const rowSizeOverrides = useTableValue("rowSizeOverrides");
  const { minHeight, width } = useTableCellSize({ element });
  const borders = useTableCellBorders({ element });
  const { col, row } = useCellIndices();
  const colSpan = api.table.getColSpan(element);
  const rowSpan = api.table.getRowSpan(element);
  const endingRowIndex = row + rowSpan - 1;
  const endingColIndex = col + colSpan - 1;
  return {
    borders,
    colIndex: endingColIndex,
    colSpan,
    isSelectingCell: !!selectedCells,
    minHeight: rowSizeOverrides.get?.(endingRowIndex) ?? minHeight,
    rowIndex: endingRowIndex,
    selected: isCellSelected,
    width
  };
};

// src/react/components/TableCellElement/useTableCellElementResizable.ts
var import_react18 = __toESM(require("react"));
var import_plate_resizable = require("@udecode/plate-resizable");
var import_react19 = require("@udecode/plate/react");
var useTableCellElementResizable = ({
  colIndex,
  colSpan,
  rowIndex,
  step,
  stepX = step,
  stepY = step
}) => {
  const { editor, getOptions } = (0, import_react19.useEditorPlugin)(TablePlugin);
  const element = (0, import_react19.useElement)();
  const { disableMarginLeft, minColumnWidth = 0 } = getOptions();
  const initialWidth = (0, import_react19.useElementSelector)(
    ([node]) => colSpan > 1 ? node.colSizes?.[colIndex] : void 0,
    [colSpan, colIndex],
    { key: TablePlugin.key }
  );
  const marginLeft = (0, import_react19.useElementSelector)(
    ([node]) => node.marginLeft ?? 0,
    [],
    { key: TablePlugin.key }
  );
  const colSizesWithoutOverrides = useTableColSizes({ disableOverrides: true });
  const colSizesWithoutOverridesRef = import_react18.default.useRef(colSizesWithoutOverrides);
  import_react18.default.useEffect(() => {
    colSizesWithoutOverridesRef.current = colSizesWithoutOverrides;
  }, [colSizesWithoutOverrides]);
  const overrideColSize = useOverrideColSize();
  const overrideRowSize = useOverrideRowSize();
  const overrideMarginLeft = useOverrideMarginLeft();
  const setColSize = import_react18.default.useCallback(
    (colIndex2, width) => {
      setTableColSize(editor, { colIndex: colIndex2, width }, { at: element });
      setTimeout(() => overrideColSize(colIndex2, null), 0);
    },
    [editor, element, overrideColSize]
  );
  const setRowSize = import_react18.default.useCallback(
    (rowIndex2, height) => {
      setTableRowSize(editor, { height, rowIndex: rowIndex2 }, { at: element });
      setTimeout(() => overrideRowSize(rowIndex2, null), 0);
    },
    [editor, element, overrideRowSize]
  );
  const setMarginLeft = import_react18.default.useCallback(
    (marginLeft2) => {
      setTableMarginLeft(editor, { marginLeft: marginLeft2 }, { at: element });
      setTimeout(() => overrideMarginLeft(null), 0);
    },
    [editor, element, overrideMarginLeft]
  );
  const handleResizeRight = import_react18.default.useCallback(
    ({ delta, finished, initialSize: currentInitial }) => {
      const nextInitial = colSizesWithoutOverridesRef.current[colIndex + 1];
      const complement = (width) => currentInitial + nextInitial - width;
      const currentNew = roundCellSizeToStep(
        (0, import_plate_resizable.resizeLengthClampStatic)(currentInitial + delta, {
          max: nextInitial ? complement(minColumnWidth) : void 0,
          min: minColumnWidth
        }),
        stepX
      );
      const nextNew = nextInitial ? complement(currentNew) : void 0;
      const fn = finished ? setColSize : overrideColSize;
      fn(colIndex, currentNew);
      if (nextNew) fn(colIndex + 1, nextNew);
    },
    [colIndex, minColumnWidth, overrideColSize, setColSize, stepX]
  );
  const handleResizeBottom = import_react18.default.useCallback(
    (event) => {
      const newHeight = roundCellSizeToStep(
        event.initialSize + event.delta,
        stepY
      );
      if (event.finished) {
        setRowSize(rowIndex, newHeight);
      } else {
        overrideRowSize(rowIndex, newHeight);
      }
    },
    [overrideRowSize, rowIndex, setRowSize, stepY]
  );
  const handleResizeLeft = import_react18.default.useCallback(
    (event) => {
      const initial = colSizesWithoutOverridesRef.current[colIndex];
      const complement = (width) => initial + marginLeft - width;
      const newMargin = roundCellSizeToStep(
        (0, import_plate_resizable.resizeLengthClampStatic)(marginLeft + event.delta, {
          max: complement(minColumnWidth),
          min: 0
        }),
        stepX
      );
      const newWidth = complement(newMargin);
      if (event.finished) {
        setMarginLeft(newMargin);
        setColSize(colIndex, newWidth);
      } else {
        overrideMarginLeft(newMargin);
        overrideColSize(colIndex, newWidth);
      }
    },
    [
      colIndex,
      marginLeft,
      minColumnWidth,
      overrideColSize,
      overrideMarginLeft,
      setColSize,
      setMarginLeft,
      stepX
    ]
  );
  const hasLeftHandle = colIndex === 0 && !disableMarginLeft;
  return {
    bottomProps: import_react18.default.useMemo(
      () => ({
        options: {
          direction: "bottom",
          onResize: handleResizeBottom
        }
      }),
      [handleResizeBottom]
    ),
    hiddenLeft: !hasLeftHandle,
    leftProps: import_react18.default.useMemo(
      () => ({
        options: {
          direction: "left",
          onResize: handleResizeLeft
        }
      }),
      [handleResizeLeft]
    ),
    rightProps: import_react18.default.useMemo(
      () => ({
        options: {
          direction: "right",
          initialSize: initialWidth,
          onResize: handleResizeRight
        }
      }),
      [initialWidth, handleResizeRight]
    )
  };
};

// src/react/hooks/useTableMergeState.ts
var import_react20 = require("@udecode/plate/react");
var useTableMergeState = () => {
  const { api, getOptions } = (0, import_react20.useEditorPlugin)(TablePlugin);
  const { disableMerge } = getOptions();
  if (disableMerge) return { canMerge: false, canSplit: false };
  const readOnly = (0, import_react20.useReadOnly)();
  const someTable = (0, import_react20.useEditorSelector)(
    (editor) => editor.api.some({ match: { type: TablePlugin.key } }),
    []
  );
  const selectionExpanded = (0, import_react20.useEditorSelector)(
    (editor) => editor.api.isExpanded(),
    []
  );
  const collapsed = !readOnly && someTable && !selectionExpanded;
  const selectedTables = (0, import_react20.usePluginOption)(TablePlugin, "selectedTables");
  const selectedTable = selectedTables?.[0];
  const selectedCellEntries = (0, import_react20.useEditorSelector)(
    (editor) => getTableGridAbove(editor, {
      format: "cell"
    }),
    []
  );
  if (!selectedCellEntries) return { canMerge: false, canSplit: false };
  const canMerge = !readOnly && someTable && selectionExpanded && selectedCellEntries.length > 1 && isTableRectangular(selectedTable);
  const canSplit = collapsed && selectedCellEntries.length === 1 && (api.table.getColSpan(selectedCellEntries[0][0]) > 1 || api.table.getRowSpan(selectedCellEntries[0][0]) > 1);
  return { canMerge, canSplit };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableProvider,
  TableRowPlugin,
  getOnSelectTableBorderFactory,
  onKeyDownTable,
  roundCellSizeToStep,
  setSelectedCellsBorder,
  tableStore,
  useCellIndices,
  useIsCellSelected,
  useOverrideColSize,
  useOverrideMarginLeft,
  useOverrideRowSize,
  useSelectedCells,
  useTableBordersDropdownMenuContentState,
  useTableCellBorders,
  useTableCellElement,
  useTableCellElementResizable,
  useTableCellSize,
  useTableColSizes,
  useTableElement,
  useTableMergeState,
  useTableSet,
  useTableState,
  useTableStore,
  useTableValue
});
//# sourceMappingURL=index.js.map