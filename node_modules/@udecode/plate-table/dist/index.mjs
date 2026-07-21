// src/lib/BaseTablePlugin.ts
import {
  bindFirst,
  createSlatePlugin,
  createTSlatePlugin
} from "@udecode/plate";

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
import { getEditorPlugin as getEditorPlugin5 } from "@udecode/plate";
import cloneDeep from "lodash/cloneDeep.js";

// src/lib/merge/deleteColumnWhenExpanded.ts
import {
  NodeApi as NodeApi2,
  RangeApi
} from "@udecode/plate";

// src/lib/queries/getCellInNextTableRow.ts
import {
  PathApi
} from "@udecode/plate";
var getCellInNextTableRow = (editor, currentRowPath) => {
  const nextRow = editor.api.node(PathApi.next(currentRowPath));
  if (!nextRow) return;
  const [nextRowNode, nextRowPath] = nextRow;
  const nextCell = nextRowNode?.children?.[0];
  const nextCellPath = nextRowPath.concat(0);
  if (nextCell && nextCellPath) {
    return editor.api.node(nextCellPath);
  }
};

// src/lib/queries/getCellInPreviousTableRow.ts
import {
  PathApi as PathApi2
} from "@udecode/plate";
var getCellInPreviousTableRow = (editor, currentRowPath) => {
  const prevPath = PathApi2.previous(currentRowPath);
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

// src/lib/queries/getColSpan.ts
var getColSpan = (cellElem) => {
  return cellElem.colSpan || Number(cellElem.attributes?.colspan) || 1;
};

// src/lib/queries/getLeftTableCell.ts
import { PathApi as PathApi3 } from "@udecode/plate";

// src/lib/utils/computeCellIndices.ts
import { getEditorPlugin } from "@udecode/plate";
function computeCellIndices(editor, {
  all,
  cellNode,
  tableNode
}) {
  const { api, getOptions, setOption } = getEditorPlugin(editor, {
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
import { getEditorPlugin as getEditorPlugin2 } from "@udecode/plate";
var getCellIndices = (editor, element) => {
  const { getOption } = getEditorPlugin2(editor, {
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
import { getPluginTypes } from "@udecode/plate";
var getCellTypes = (editor) => getPluginTypes(editor, [BaseTableCellPlugin, BaseTableCellHeaderPlugin]);

// src/lib/queries/getLeftTableCell.ts
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
  const prevCellPath = PathApi3.previous(cellPath);
  return editor.api.node(prevCellPath);
};

// src/lib/queries/getNextTableCell.ts
import {
  PathApi as PathApi4
} from "@udecode/plate";
var getNextTableCell = (editor, currentCell, currentPath, currentRow) => {
  const cell = editor.api.node(PathApi4.next(currentPath));
  if (cell) return cell;
  const [, currentRowPath] = currentRow;
  return getCellInNextTableRow(editor, currentRowPath);
};

// src/lib/queries/getPreviousTableCell.ts
import {
  PathApi as PathApi5
} from "@udecode/plate";
var getPreviousTableCell = (editor, currentCell, currentPath, currentRow) => {
  const prevPath = PathApi5.previous(currentPath);
  if (!prevPath) {
    const [, currentRowPath] = currentRow;
    return getCellInPreviousTableRow(editor, currentRowPath);
  }
  const cell = editor.api.node(prevPath);
  if (cell) return cell;
};

// src/lib/queries/getRowSpan.ts
var getRowSpan = (cellElem) => {
  return cellElem.rowSpan || Number(cellElem.attributes?.rowspan) || 1;
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
import { PathApi as PathApi6 } from "@udecode/plate";
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
    ...PathApi6.parent(PathApi6.parent(cellPath)),
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
function isSelectedCellBordersNone(editor, cells) {
  return cells.every((cell) => {
    const { borders } = cell;
    const { col, row } = getCellIndices(editor, cell);
    const cellPath = editor.api.findPath(cell);
    if (!cellPath) return true;
    const isFirstRow = row === 0;
    const isFirstCell = col === 0;
    if (isFirstRow && (borders?.top?.size ?? 1) > 0) return false;
    if (isFirstCell && (borders?.left?.size ?? 1) > 0) return false;
    if ((borders?.bottom?.size ?? 1) > 0) return false;
    if ((borders?.right?.size ?? 1) > 0) return false;
    if (!isFirstRow) {
      const cellAboveEntry = getTopTableCell(editor, { at: cellPath });
      if (cellAboveEntry) {
        const [cellAbove] = cellAboveEntry;
        if ((cellAbove.borders?.bottom?.size ?? 1) > 0) return false;
      }
    }
    if (!isFirstCell) {
      const prevCellEntry = getLeftTableCell(editor, { at: cellPath });
      if (prevCellEntry) {
        const [prevCell] = prevCellEntry;
        if ((prevCell.borders?.right?.size ?? 1) > 0) return false;
      }
    }
    return true;
  });
}
function isSelectedCellBordersOuter(editor, cells) {
  const { maxCol, maxRow, minCol, minRow } = getSelectedCellsBoundingBox(
    editor,
    cells
  );
  for (const cell of cells) {
    const { col, row } = getCellIndices(editor, cell);
    const cSpan = getColSpan(cell);
    const rSpan = getRowSpan(cell);
    for (let rr = row; rr < row + rSpan; rr++) {
      for (let cc = col; cc < col + cSpan; cc++) {
        if (rr === minRow && (cell.borders?.top?.size ?? 1) < 1) return false;
        if (rr === maxRow && (cell.borders?.bottom?.size ?? 1) < 1)
          return false;
        if (cc === minCol && (cell.borders?.left?.size ?? 1) < 1) return false;
        if (cc === maxCol && (cell.borders?.right?.size ?? 1) < 1) return false;
      }
    }
  }
  return true;
}
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
import { getEditorPlugin as getEditorPlugin3 } from "@udecode/plate";
var getTableCellSize = (editor, {
  cellIndices,
  colSizes,
  element,
  rowSize
}) => {
  const { api } = getEditorPlugin3(editor, {
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

// src/lib/queries/getTableColumnIndex.ts
var getTableColumnIndex = (editor, cellNode) => {
  const path = editor.api.findPath(cellNode);
  if (!path) return -1;
  const [trNode] = editor.api.parent(path) ?? [];
  if (!trNode) return -1;
  let colIndex = -1;
  trNode.children.some((item, index) => {
    if (item === cellNode) {
      colIndex = index;
      return true;
    }
    return false;
  });
  return colIndex;
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

// src/lib/queries/getTableGridAbove.ts
import {
  PathApi as PathApi7
} from "@udecode/plate";

// src/lib/queries/getTableGridByRange.ts
import {
  NodeApi
} from "@udecode/plate";

// src/lib/merge/getTableGridByRange.ts
import {
  getEditorPlugin as getEditorPlugin4
} from "@udecode/plate";

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
  const { api, type } = getEditorPlugin4(editor, BaseTablePlugin);
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
    const cell = NodeApi.get(editor, cellPath);
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
    if (!PathApi7.equals(start[1], end[1])) {
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

// src/lib/queries/getTableOverriddenColSizes.ts
var getTableOverriddenColSizes = (tableNode, colSizeOverrides) => {
  const colCount = getTableColumnCount(tableNode);
  const colSizes = (tableNode.colSizes ? [...tableNode.colSizes] : Array.from({ length: colCount }).fill(0)).map((size, index) => colSizeOverrides?.get?.(index) ?? size);
  return colSizes;
};

// src/lib/queries/getTableRowIndex.ts
import { PathApi as PathApi8 } from "@udecode/plate";
var getTableRowIndex = (editor, cellNode) => {
  const path = editor.api.findPath(cellNode);
  if (!path) return 0;
  const rowPath = PathApi8.parent(path);
  return rowPath.at(-1);
};

// src/lib/queries/isTableBorderHidden.ts
var isTableBorderHidden = (editor, border) => {
  if (border === "left") {
    const node = getLeftTableCell(editor)?.[0];
    if (node) {
      return node.borders?.right?.size === 0;
    }
  }
  if (border === "top") {
    const node = getTopTableCell(editor)?.[0];
    if (node) {
      return node.borders?.bottom?.size === 0;
    }
  }
  return editor.api.node({
    match: { type: getCellTypes(editor) }
  })?.[0].borders?.[border]?.size === 0;
};

// src/lib/merge/deleteColumnWhenExpanded.ts
var deleteColumnWhenExpanded = (editor, tableEntry) => {
  const [start, end] = RangeApi.edges(editor.selection);
  const firstRow = NodeApi2.child(tableEntry[0], 0);
  const lastRow = NodeApi2.child(
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

// src/lib/merge/deleteColumn.ts
var deleteTableMergeColumn = (editor) => {
  const type = editor.getType(BaseTablePlugin);
  const tableEntry = editor.api.above({
    match: { type }
  });
  if (!tableEntry) return;
  editor.tf.withoutNormalizing(() => {
    const { api } = getEditorPlugin5(editor, BaseTablePlugin);
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
      const newCell = cloneDeep({ ...curCell, colSpan });
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

// src/lib/merge/deleteRow.ts
import { getEditorPlugin as getEditorPlugin7 } from "@udecode/plate";
import cloneDeep2 from "lodash/cloneDeep.js";

// src/lib/merge/deleteRowWhenExpanded.ts
import {
  getEditorPlugin as getEditorPlugin6
} from "@udecode/plate";
var deleteRowWhenExpanded = (editor, [table, tablePath]) => {
  const { api } = getEditorPlugin6(editor, BaseTablePlugin);
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
  const { api, tf, type } = getEditorPlugin7(editor, {
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
          const newCell2 = cloneDeep2({ ...curRowCell, rowSpan: rowSpan2 });
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
        const newCell = cloneDeep2({ ...curRowCell, rowSpan });
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
      const newCell = cloneDeep2({ ...curRowCell, rowSpan });
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

// src/lib/merge/getSelectionWidth.ts
var getSelectionWidth = (cells) => {
  let max = 0;
  let lastCellRowIndex = getCellRowIndexByPath(cells[0][1]);
  let total = 0;
  cells.forEach(([cell, cellPath]) => {
    const currentCellRowIndex = getCellRowIndexByPath(cellPath);
    if (currentCellRowIndex === lastCellRowIndex) {
      const colSpan = cell.colSpan ?? cell.attributes?.colspan;
      const colSpanNumbered = colSpan ? Number(colSpan) : 1;
      total += colSpanNumbered;
    } else {
      max = Math.max(total, max);
      total = 0;
    }
    lastCellRowIndex = currentCellRowIndex;
  });
  return Math.max(total, max);
};

// src/lib/merge/getTableMergedColumnCount.ts
var getTableMergedColumnCount = (tableNode) => {
  return tableNode.children?.[0]?.children?.reduce(
    (prev, cur) => prev + (getColSpan(cur) ?? 1),
    0
  );
};

// src/lib/merge/insertTableColumn.ts
import {
  getEditorPlugin as getEditorPlugin8,
  NodeApi as NodeApi3,
  PathApi as PathApi9
} from "@udecode/plate";
import cloneDeep3 from "lodash/cloneDeep.js";
var insertTableMergeColumn = (editor, {
  at,
  before,
  fromCell,
  header,
  select: shouldSelect
} = {}) => {
  const { api, getOptions, type } = getEditorPlugin8(editor, BaseTablePlugin);
  const { initialTableWidth, minColumnWidth } = getOptions();
  if (at && !fromCell) {
    const table = NodeApi3.get(editor, at);
    if (table?.type === editor.getType(BaseTablePlugin)) {
      fromCell = NodeApi3.lastChild(editor, at.concat([0]))[1];
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
  if (PathApi9.isPath(at)) {
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
      const newCell = cloneDeep3({ ...curCell, colSpan });
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

// src/lib/merge/insertTableRow.ts
import {
  getEditorPlugin as getEditorPlugin9,
  NodeApi as NodeApi4,
  PathApi as PathApi10
} from "@udecode/plate";
import cloneDeep4 from "lodash/cloneDeep.js";
var insertTableMergeRow = (editor, {
  at,
  before,
  fromRow,
  header,
  select: shouldSelect
} = {}) => {
  const { api, type } = getEditorPlugin9(editor, BaseTablePlugin);
  if (at && !fromRow) {
    const table = NodeApi4.get(editor, at);
    if (table?.type === editor.getType(BaseTablePlugin)) {
      fromRow = NodeApi4.lastChild(editor, at)[1];
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
  if (PathApi10.isPath(at)) {
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
      const newCell = cloneDeep4({ ...curCell, rowSpan });
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
import {
  getEditorPlugin as getEditorPlugin10
} from "@udecode/plate";
import cloneDeep5 from "lodash/cloneDeep.js";
var mergeTableCells = (editor) => {
  const { api } = getEditorPlugin10(editor, BaseTablePlugin);
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
        mergingCellChildren.push(...cloneDeep5(cellChildren));
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
import {
  getEditorPlugin as getEditorPlugin11
} from "@udecode/plate";
var splitTableCell = (editor) => {
  const { api } = getEditorPlugin11(editor, BaseTablePlugin);
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

// src/lib/transforms/deleteColumn.ts
import {
  getEditorPlugin as getEditorPlugin12
} from "@udecode/plate";
var deleteColumn = (editor) => {
  const { getOptions, type } = getEditorPlugin12(editor, {
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
import { getEditorPlugin as getEditorPlugin13 } from "@udecode/plate";
var deleteRow = (editor) => {
  const { getOptions, type } = getEditorPlugin13(editor, {
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
import {
  PathApi as PathApi11
} from "@udecode/plate";
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
        const insertPath = PathApi11.next(tablePath);
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
import {
  getEditorPlugin as getEditorPlugin14,
  NodeApi as NodeApi5,
  PathApi as PathApi12
} from "@udecode/plate";
var insertTableColumn = (editor, options = {}) => {
  const { api, getOptions, type } = getEditorPlugin14(editor, BaseTablePlugin);
  const { disableMerge, initialTableWidth, minColumnWidth } = getOptions();
  if (!disableMerge) {
    return insertTableMergeColumn(editor, options);
  }
  const { before, header, select: shouldSelect } = options;
  let { at, fromCell } = options;
  if (at && !fromCell) {
    const table = NodeApi5.get(editor, at);
    if (table?.type === editor.getType(BaseTablePlugin)) {
      fromCell = NodeApi5.lastChild(editor, at.concat([0]))[1];
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
  if (PathApi12.isPath(at)) {
    nextCellPath = at;
    nextColIndex = at.at(-1);
  } else {
    nextCellPath = before ? cellPath : PathApi12.next(cellPath);
    nextColIndex = before ? cellPath.at(-1) : cellPath.at(-1) + 1;
  }
  const currentRowIndex = cellPath.at(-2);
  editor.tf.withoutNormalizing(() => {
    tableNode.children.forEach((row, rowIndex) => {
      const insertCellPath = [...nextCellPath];
      if (PathApi12.isPath(at)) {
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
import {
  getEditorPlugin as getEditorPlugin15,
  NodeApi as NodeApi6,
  PathApi as PathApi13
} from "@udecode/plate";
var insertTableRow = (editor, options = {}) => {
  const { api, getOptions, type } = getEditorPlugin15(editor, BaseTablePlugin);
  const { disableMerge } = getOptions();
  if (!disableMerge) {
    return insertTableMergeRow(editor, options);
  }
  const { before, header, select: shouldSelect } = options;
  let { at, fromRow } = options;
  if (at && !fromRow) {
    const table = NodeApi6.get(editor, at);
    if (table?.type === editor.getType(BaseTablePlugin)) {
      fromRow = NodeApi6.lastChild(editor, at)[1];
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
      at: PathApi13.isPath(at) ? at : before ? trPath : PathApi13.next(trPath)
    });
  });
  if (shouldSelect) {
    const cellEntry = editor.api.block({
      match: { type: getCellTypes(editor) }
    });
    if (!cellEntry) return;
    const [, nextCellPath] = cellEntry;
    if (PathApi13.isPath(at)) {
      nextCellPath[nextCellPath.length - 2] = at.at(-2);
    } else {
      nextCellPath[nextCellPath.length - 2] = before ? nextCellPath.at(-2) : nextCellPath.at(-2) + 1;
    }
    editor.tf.select(nextCellPath);
  }
};

// src/lib/transforms/moveSelectionFromCell.ts
import { NodeApi as NodeApi7 } from "@udecode/plate";
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
      if (NodeApi7.has(editor, anchorPath) && NodeApi7.has(editor, focusPath)) {
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
    if (NodeApi7.has(editor, nextCellPath)) {
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
import { isHotkey } from "@udecode/plate";
var overrideSelectionFromCell = (editor, newSelection) => {
  let hotkey;
  if (!editor.currentKeyboardEvent || !["up", "down", "shift+up", "shift+right", "shift+down", "shift+left"].some(
    (key) => {
      const valid = isHotkey(key, editor.currentKeyboardEvent);
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

// src/lib/transforms/setBorderSize.ts
import {
  ElementApi
} from "@udecode/plate";
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
    match: (n) => ElementApi.isElement(n) && getCellTypes(editor).includes(n.type)
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

// src/lib/transforms/setCellBackground.ts
var setCellBackground = (editor, options) => {
  const { color, selectedCells } = options;
  const hasSelectedCells = selectedCells && selectedCells.length > 0;
  if (hasSelectedCells) {
    selectedCells.forEach((cell) => {
      const cellPath = editor.api.findPath(cell);
      if (cellPath) {
        editor.tf.setNodes(
          { background: color },
          {
            at: cellPath
          }
        );
      }
    });
    return;
  }
  const currentCell = editor.api.node({
    match: { type: getCellTypes(editor) }
  })?.[0];
  if (currentCell) {
    const cellPath = editor.api.findPath(currentCell);
    if (cellPath) {
      editor.tf.setNodes(
        { background: color },
        {
          at: cellPath
        }
      );
    }
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

// src/lib/withApplyTable.ts
import {
  RangeApi as RangeApi2
} from "@udecode/plate";
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
        if (RangeApi2.isRange(newSelection) && editor.api.isAt({
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
            const isBackward = RangeApi2.isBackward(newSelection);
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
              const isBackward = RangeApi2.isBackward(newSelection);
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
import {
  PointApi
} from "@udecode/plate";
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
      if (selection && PointApi.equals(selection.anchor, start)) {
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
import {
  NodeApi as NodeApi8
} from "@udecode/plate";
import cloneDeep6 from "lodash/cloneDeep.js";
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
                editor.tf.replaceNodes(cloneDeep6(fragment), {
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
                  if (!NodeApi8.has(editor, cellPath)) {
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
                    if (!NodeApi8.has(editor, cellPath)) {
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
                  editor.tf.replaceNodes(cloneDeep6(cellChildren), {
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
import { TextApi } from "@udecode/plate";
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
          match: (n) => TextApi.isText(n)
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
            match: (n) => TextApi.isText(n)
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
          match: (n) => TextApi.isText(n)
        });
      });
    }
  }
});

// src/lib/withNormalizeTable.ts
import {
  ElementApi as ElementApi2,
  TextApi as TextApi2
} from "@udecode/plate";
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
      if (ElementApi2.isElement(n)) {
        if (n.type === type) {
          const node = n;
          if (!node.children.some(
            (child) => ElementApi2.isElement(child) && child.type === editor.getType(BaseTableRowPlugin)
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
          if (TextApi2.isText(children[0])) {
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
var BaseTableRowPlugin = createSlatePlugin({
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
var BaseTableCellPlugin = createSlatePlugin({
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
var BaseTableCellHeaderPlugin = createSlatePlugin({
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
var BaseTablePlugin = createTSlatePlugin({
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
    table: bindFirst(getEmptyTableNode, editor),
    tableCell: bindFirst(getEmptyCellNode, editor),
    tableRow: bindFirst(getEmptyRowNode, editor)
  },
  table: {
    getCellBorders: bindFirst(getTableCellBorders, editor),
    getCellSize: bindFirst(getTableCellSize, editor),
    getColSpan,
    getRowSpan,
    getCellChildren: (cell) => cell.children
  }
})).extendEditorTransforms(({ editor }) => ({
  insert: {
    table: bindFirst(insertTable, editor),
    tableColumn: bindFirst(insertTableColumn, editor),
    tableRow: bindFirst(insertTableRow, editor)
  },
  remove: {
    table: bindFirst(deleteTable, editor),
    tableColumn: bindFirst(deleteColumn, editor),
    tableRow: bindFirst(deleteRow, editor)
  },
  table: {
    merge: bindFirst(mergeTableCells, editor),
    split: bindFirst(splitTableCell, editor)
  }
})).overrideEditor(withTable);

// src/lib/constants.ts
var KEY_SHIFT_EDGES = {
  "shift+down": "bottom",
  "shift+left": "left",
  "shift+right": "right",
  "shift+up": "top"
};
export {
  BaseTableCellHeaderPlugin,
  BaseTableCellPlugin,
  BaseTablePlugin,
  BaseTableRowPlugin,
  KEY_SHIFT_EDGES,
  computeCellIndices,
  deleteColumn,
  deleteColumnWhenExpanded,
  deleteRow,
  deleteRowWhenExpanded,
  deleteTable,
  deleteTableMergeColumn,
  deleteTableMergeRow,
  findCellByIndexes,
  getCellInNextTableRow,
  getCellInPreviousTableRow,
  getCellIndices,
  getCellIndicesWithSpans,
  getCellPath,
  getCellRowIndexByPath,
  getCellTypes,
  getColSpan,
  getEmptyCellNode,
  getEmptyRowNode,
  getEmptyTableNode,
  getLeftTableCell,
  getNextTableCell,
  getPreviousTableCell,
  getRowSpan,
  getSelectedCellsBorders,
  getSelectedCellsBoundingBox,
  getSelectionWidth,
  getTableAbove,
  getTableCellBorders,
  getTableCellSize,
  getTableColumnCount,
  getTableColumnIndex,
  getTableEntries,
  getTableGridAbove,
  getTableGridByRange,
  getTableMergeGridByRange,
  getTableMergedColumnCount,
  getTableOverriddenColSizes,
  getTableRowIndex,
  getTopTableCell,
  insertTable,
  insertTableColumn,
  insertTableMergeColumn,
  insertTableMergeRow,
  insertTableRow,
  isSelectedCellBorder,
  isSelectedCellBordersNone,
  isSelectedCellBordersOuter,
  isTableBorderHidden,
  isTableRectangular,
  mergeTableCells,
  moveSelectionFromCell,
  normalizeInitialValueTable,
  overrideSelectionFromCell,
  preventDeleteTableCell,
  setBorderSize,
  setCellBackground,
  setTableColSize,
  setTableMarginLeft,
  setTableRowSize,
  splitTableCell,
  withApplyTable,
  withDeleteTable,
  withGetFragmentTable,
  withInsertFragmentTable,
  withInsertTextTable,
  withMarkTable,
  withNormalizeTable,
  withSetFragmentDataTable,
  withTable
};
//# sourceMappingURL=index.mjs.map