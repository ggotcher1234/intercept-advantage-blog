// src/lib/BaseIndentPlugin.ts
import {
  BaseParagraphPlugin,
  createTSlatePlugin
} from "@udecode/plate";

// src/lib/withIndent.ts
import { getInjectMatch } from "@udecode/plate";
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
        const match = getInjectMatch(editor, plugin);
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
var BaseIndentPlugin = createTSlatePlugin({
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
    targetPlugins: [BaseParagraphPlugin.key]
  },
  options: {
    offset: 24,
    unit: "px"
  }
}).overrideEditor(withIndent);

// src/lib/BaseTextIndentPlugin.ts
import {
  BaseParagraphPlugin as BaseParagraphPlugin2,
  createTSlatePlugin as createTSlatePlugin2
} from "@udecode/plate";
var BaseTextIndentPlugin = createTSlatePlugin2({
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
    targetPlugins: [BaseParagraphPlugin2.key]
  },
  options: {
    offset: 24,
    unit: "px"
  }
});

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
export {
  BaseIndentPlugin,
  BaseTextIndentPlugin,
  indent,
  outdent,
  setIndent,
  withIndent
};
//# sourceMappingURL=index.mjs.map