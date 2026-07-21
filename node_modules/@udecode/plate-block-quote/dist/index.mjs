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
export {
  BaseBlockquotePlugin,
  withBlockquote
};
//# sourceMappingURL=index.mjs.map