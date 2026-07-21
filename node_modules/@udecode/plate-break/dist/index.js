"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BaseExitBreakPlugin: () => BaseExitBreakPlugin,
  BaseSingleLinePlugin: () => BaseSingleLinePlugin,
  BaseSoftBreakPlugin: () => BaseSoftBreakPlugin,
  exitBreak: () => exitBreak,
  exitBreakAtEdges: () => exitBreakAtEdges,
  withSingleLine: () => withSingleLine
});
module.exports = __toCommonJS(index_exports);

// src/lib/exit-break/BaseExitBreakPlugin.ts
var import_plate = require("@udecode/plate");
var BaseExitBreakPlugin = (0, import_plate.createTSlatePlugin)({
  key: "exitBreak",
  options: {
    rules: [
      { hotkey: "mod+enter" },
      { before: true, hotkey: "mod+shift+enter" }
    ]
  }
});

// src/lib/exit-break/queries/exitBreakAtEdges.ts
var exitBreakAtEdges = (editor, {
  end,
  start
}) => {
  let queryEdge = false;
  let isEdge = false;
  let isStart = false;
  if (start || end) {
    queryEdge = true;
    if (start && editor.api.isAt({ start: true })) {
      isEdge = true;
      isStart = true;
    }
    if (end && editor.api.isAt({ end: true })) {
      isEdge = true;
    }
    if (isEdge && editor.api.isExpanded()) {
      editor.tf.deleteFragment();
    }
  }
  return {
    isEdge,
    isStart,
    queryEdge
  };
};

// src/lib/exit-break/transforms/exitBreak.ts
var import_plate2 = require("@udecode/plate");
var exitBreak = (editor, {
  before,
  defaultType = editor.getType(import_plate2.BaseParagraphPlugin),
  level = 0,
  query = {},
  relative = false
}) => {
  if (!editor.selection) return;
  const { isEdge, isStart, queryEdge } = exitBreakAtEdges(editor, query);
  if (isStart) before = true;
  if (queryEdge && !isEdge) return;
  const selectionPath = editor.api.path(editor.selection);
  const slicedPath = relative ? selectionPath.slice(0, -level) : selectionPath.slice(0, level + 1);
  const insertPath = before ? slicedPath : import_plate2.PathApi.next(slicedPath);
  editor.tf.insertNodes(
    editor.api.create.block({ children: [{ text: "" }], type: defaultType }),
    {
      at: insertPath,
      select: !isStart
    }
  );
  return true;
};

// src/lib/single-line/BaseSingleLinePlugin.ts
var import_plate3 = require("@udecode/plate");

// src/lib/single-line/withSingleLine.ts
var withSingleLine = ({
  editor,
  tf: { normalizeNode }
}) => ({
  transforms: {
    insertBreak() {
      return null;
    },
    normalizeNode(entry) {
      if (entry[1].length === 0 && editor.children.length > 1) {
        editor.tf.removeNodes({
          at: [],
          mode: "highest",
          match: (node, path) => path.length === 1 && path[0] > 0
        });
        return;
      }
      normalizeNode(entry);
    }
  }
});

// src/lib/single-line/BaseSingleLinePlugin.ts
var BaseSingleLinePlugin = (0, import_plate3.createSlatePlugin)({
  key: "singleLine"
}).overrideEditor(withSingleLine);

// src/lib/soft-break/BaseSoftBreakPlugin.ts
var import_plate4 = require("@udecode/plate");
var BaseSoftBreakPlugin = (0, import_plate4.createTSlatePlugin)({
  key: "softBreak",
  options: {
    rules: [{ hotkey: "shift+enter" }]
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseExitBreakPlugin,
  BaseSingleLinePlugin,
  BaseSoftBreakPlugin,
  exitBreak,
  exitBreakAtEdges,
  withSingleLine
});
//# sourceMappingURL=index.js.map