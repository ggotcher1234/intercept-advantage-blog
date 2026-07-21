// src/react/BlockquotePlugin.tsx
import { Key, toPlatePlugin } from "@udecode/plate/react";

// src/lib/BaseBlockquotePlugin.ts
import { createSlatePlugin } from "@udecode/plate";

// src/lib/withBlockquote.ts
var withBlockquote = ({
  api: { shouldMergeNodesRemovePrevNode }
}) => ({
  api: {
    shouldMergeNodesRemovePrevNode(prevNodeEntry, curNodeEntry) {
      const prevNode = prevNodeEntry[0];
      if (prevNode.type === BaseBlockquotePlugin.key) return false;
      return shouldMergeNodesRemovePrevNode(prevNodeEntry, curNodeEntry);
    }
  }
});

// src/lib/BaseBlockquotePlugin.ts
var BaseBlockquotePlugin = createSlatePlugin({
  key: "blockquote",
  node: { isElement: true },
  parsers: {
    html: {
      deserializer: {
        rules: [
          {
            validNodeName: "BLOCKQUOTE"
          }
        ]
      }
    }
  }
}).overrideEditor(withBlockquote);

// src/react/BlockquotePlugin.tsx
var BlockquotePlugin = toPlatePlugin(
  BaseBlockquotePlugin,
  ({ editor, type }) => ({
    shortcuts: {
      toggleBlockquote: {
        keys: [[Key.Mod, Key.Shift, "period"]],
        preventDefault: true,
        handler: () => {
          editor.tf.toggleBlock(type);
        }
      }
    }
  })
);
export {
  BlockquotePlugin
};
//# sourceMappingURL=index.mjs.map