// src/react/exit-break/ExitBreakPlugin.tsx
import { toPlatePlugin } from "@udecode/plate/react";

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

// src/react/exit-break/onKeyDownExitBreak.ts
import { isHotkey, queryNode } from "@udecode/plate";

// src/lib/exit-break/transforms/exitBreak.ts
import { BaseParagraphPlugin, PathApi } from "@udecode/plate";

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

// src/react/exit-break/onKeyDownExitBreak.ts
var onKeyDownExitBreak = ({
  editor,
  event,
  getOptions
}) => {
  const { rules = [] } = getOptions();
  if (event.defaultPrevented) return;
  const entry = editor.api.block();
  if (!entry) return;
  rules.forEach(({ hotkey, ...rule }) => {
    if (isHotkey(hotkey, event) && queryNode(entry, rule.query) && exitBreak(editor, rule)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
};

// src/react/exit-break/ExitBreakPlugin.tsx
var ExitBreakPlugin = toPlatePlugin(BaseExitBreakPlugin, {
  handlers: {
    onKeyDown: onKeyDownExitBreak
  }
});

// src/react/single-line/SingleLinePlugin.tsx
import { toPlatePlugin as toPlatePlugin2 } from "@udecode/plate/react";

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

// src/react/single-line/onKeyDownSingleLine.ts
import { Hotkeys } from "@udecode/plate";
var onKeyDownSingleLine = ({ event }) => {
  if (event.defaultPrevented) return;
  if (Hotkeys.isSplitBlock(event)) {
    event.preventDefault();
  }
};

// src/react/single-line/SingleLinePlugin.tsx
var SingleLinePlugin = toPlatePlugin2(BaseSingleLinePlugin, {
  handlers: {
    onKeyDown: onKeyDownSingleLine
  }
});

// src/react/soft-break/SoftBreakPlugin.tsx
import { toPlatePlugin as toPlatePlugin3 } from "@udecode/plate/react";

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

// src/react/soft-break/onKeyDownSoftBreak.ts
import { isHotkey as isHotkey2, queryNode as queryNode2 } from "@udecode/plate";
var onKeyDownSoftBreak = ({
  editor,
  event,
  getOptions
}) => {
  const { rules = [] } = getOptions();
  if (event.defaultPrevented) return;
  const entry = editor.api.block();
  if (!entry) return;
  rules.forEach(({ hotkey, query }) => {
    if (isHotkey2(hotkey, event) && queryNode2(entry, query)) {
      event.preventDefault();
      event.stopPropagation();
      editor.tf.insertText("\n");
    }
  });
};

// src/react/soft-break/SoftBreakPlugin.tsx
var SoftBreakPlugin = toPlatePlugin3(BaseSoftBreakPlugin, {
  handlers: {
    onKeyDown: onKeyDownSoftBreak
  }
});
export {
  ExitBreakPlugin,
  SingleLinePlugin,
  SoftBreakPlugin,
  onKeyDownExitBreak,
  onKeyDownSingleLine,
  onKeyDownSoftBreak
};
//# sourceMappingURL=index.mjs.map