// src/lib/exit-break/BaseExitBreakPlugin.ts
import { createTSlatePlugin } from "@udecode/plate";
var BaseExitBreakPlugin = createTSlatePlugin({
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
import { BaseParagraphPlugin, PathApi } from "@udecode/plate";
var exitBreak = (editor, {
  before,
  defaultType = editor.getType(BaseParagraphPlugin),
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
  const insertPath = before ? slicedPath : PathApi.next(slicedPath);
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
import { createSlatePlugin } from "@udecode/plate";

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
var BaseSingleLinePlugin = createSlatePlugin({
  key: "singleLine"
}).overrideEditor(withSingleLine);

// src/lib/soft-break/BaseSoftBreakPlugin.ts
import {
  createTSlatePlugin as createTSlatePlugin2
} from "@udecode/plate";
var BaseSoftBreakPlugin = createTSlatePlugin2({
  key: "softBreak",
  options: {
    rules: [{ hotkey: "shift+enter" }]
  }
});
export {
  BaseExitBreakPlugin,
  BaseSingleLinePlugin,
  BaseSoftBreakPlugin,
  exitBreak,
  exitBreakAtEdges,
  withSingleLine
};
//# sourceMappingURL=index.mjs.map