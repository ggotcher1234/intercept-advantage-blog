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

// src/react/index.ts
var react_exports = {};
__export(react_exports, {
  IndentPlugin: () => IndentPlugin,
  TextIndentPlugin: () => TextIndentPlugin,
  onKeyDownIndent: () => onKeyDownIndent,
  useIndentButton: () => useIndentButton,
  useOutdentButton: () => useOutdentButton
});
module.exports = __toCommonJS(react_exports);

// src/react/IndentPlugin.tsx
var import_react = require("@udecode/plate/react");

// src/lib/BaseIndentPlugin.ts
var import_plate2 = require("@udecode/plate");

// src/lib/withIndent.ts
var import_plate = require("@udecode/plate");
var withIndent = ({
  editor,
  getOptions,
  plugin,
  tf: { normalizeNode }
}) => {
  return {
    transforms: {
      normalizeNode([node, path]) {
        const { indentMax } = getOptions();
        const element = node;
        const { type } = element;
        const match = (0, import_plate.getInjectMatch)(editor, plugin);
        if (type) {
          if (match(element, path)) {
            if (indentMax && element.indent && element.indent > indentMax) {
              editor.tf.setNodes({ indent: indentMax }, { at: path });
              return;
            }
          } else if (element.indent) {
            editor.tf.unsetNodes("indent", { at: path });
            return;
          }
        }
        return normalizeNode([node, path]);
      }
    }
  };
};

// src/lib/BaseIndentPlugin.ts
var BaseIndentPlugin = (0, import_plate2.createTSlatePlugin)({
  key: "indent",
  inject: {
    isBlock: true,
    nodeProps: {
      nodeKey: "indent",
      styleKey: "marginLeft",
      transformNodeValue: ({ getOptions, nodeValue }) => {
        const { offset, unit } = getOptions();
        return nodeValue * offset + unit;
      }
    },
    targetPlugins: [import_plate2.BaseParagraphPlugin.key]
  },
  options: {
    offset: 24,
    unit: "px"
  }
}).overrideEditor(withIndent);

// src/react/onKeyDownIndent.ts
var import_plate3 = require("@udecode/plate");

// src/lib/transforms/setIndent.ts
var setIndent = (editor, {
  getNodesOptions,
  offset = 1,
  setNodesProps,
  unsetNodesProps = []
}) => {
  const { nodeKey } = editor.getInjectProps(BaseIndentPlugin);
  const _nodes = editor.api.nodes({
    block: true,
    mode: "lowest",
    ...getNodesOptions
  });
  const nodes = Array.from(_nodes);
  editor.tf.withoutNormalizing(() => {
    nodes.forEach(([node, path]) => {
      const blockIndent = node[nodeKey] ?? 0;
      const newIndent = blockIndent + offset;
      const props = setNodesProps?.({ indent: newIndent }) ?? {};
      if (newIndent <= 0) {
        editor.tf.unsetNodes([nodeKey, ...unsetNodesProps], {
          at: path
        });
      } else {
        editor.tf.setNodes({ [nodeKey]: newIndent, ...props }, { at: path });
      }
    });
  });
};

// src/lib/transforms/indent.ts
var indent = (editor, options) => {
  setIndent(editor, { offset: 1, ...options });
};

// src/lib/transforms/outdent.ts
var outdent = (editor, options) => {
  setIndent(editor, { offset: -1, ...options });
};

// src/react/onKeyDownIndent.ts
var onKeyDownIndent = ({
  editor,
  event
}) => {
  if (event.defaultPrevented) return;
  if (import_plate3.Hotkeys.isTab(editor, event)) {
    event.preventDefault();
    indent(editor);
  }
  if (import_plate3.Hotkeys.isUntab(editor, event)) {
    event.preventDefault();
    outdent(editor);
  }
};

// src/react/IndentPlugin.tsx
var IndentPlugin = (0, import_react.toPlatePlugin)(BaseIndentPlugin, {
  handlers: {
    onKeyDown: onKeyDownIndent
  }
});

// src/react/TextIndentPlugin.tsx
var import_react2 = require("@udecode/plate/react");

// src/lib/BaseTextIndentPlugin.ts
var import_plate4 = require("@udecode/plate");
var BaseTextIndentPlugin = (0, import_plate4.createTSlatePlugin)({
  key: "textIndent",
  inject: {
    isBlock: true,
    nodeProps: {
      nodeKey: "textIndent",
      styleKey: "textIndent",
      transformNodeValue({ getOptions, nodeValue }) {
        const { offset, unit } = getOptions();
        return nodeValue * offset + unit;
      }
    },
    targetPlugins: [import_plate4.BaseParagraphPlugin.key]
  },
  options: {
    offset: 24,
    unit: "px"
  }
});

// src/react/TextIndentPlugin.tsx
var TextIndentPlugin = (0, import_react2.toPlatePlugin)(BaseTextIndentPlugin);

// src/react/hooks/useIndentButton.ts
var import_react3 = require("@udecode/plate/react");
var useIndentButton = () => {
  const editor = (0, import_react3.useEditorRef)();
  return {
    props: {
      onClick: () => {
        indent(editor);
      },
      onMouseDown: (e) => {
        e.preventDefault();
      }
    }
  };
};

// src/react/hooks/useOutdentButton.ts
var import_react4 = require("@udecode/plate/react");
var useOutdentButton = () => {
  const editor = (0, import_react4.useEditorRef)();
  return {
    props: {
      onClick: () => {
        outdent(editor);
      },
      onMouseDown: (e) => {
        e.preventDefault();
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IndentPlugin,
  TextIndentPlugin,
  onKeyDownIndent,
  useIndentButton,
  useOutdentButton
});
//# sourceMappingURL=index.js.map