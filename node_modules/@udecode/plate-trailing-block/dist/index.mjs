// src/lib/TrailingBlockPlugin.ts
import {
  BaseParagraphPlugin,
  createTSlatePlugin
} from "@udecode/plate";

// src/lib/withTrailingBlock.ts
import { PathApi, queryNode } from "@udecode/plate";
var withTrailingBlock = ({
  editor,
  getOptions,
  tf: { normalizeNode }
}) => ({
  transforms: {
    normalizeNode([currentNode, currentPath]) {
      const { level, type, ...query } = getOptions();
      if (currentPath.length === 0) {
        const lastChild = editor.api.last([], { level });
        const lastChildNode = lastChild?.[0];
        if (!lastChildNode || lastChildNode.type !== type && queryNode(lastChild, query)) {
          const at = lastChild ? PathApi.next(lastChild[1]) : [0];
          editor.tf.insertNodes(editor.api.create.block({ type }, at), { at });
          return;
        }
      }
      return normalizeNode([currentNode, currentPath]);
    }
  }
});

// src/lib/TrailingBlockPlugin.ts
var TrailingBlockPlugin = createTSlatePlugin({
  key: "trailingBlock",
  options: {
    level: 0
  }
}).overrideEditor(withTrailingBlock).extend(({ editor }) => ({
  options: {
    type: editor.getType(BaseParagraphPlugin)
  }
}));
export {
  TrailingBlockPlugin,
  withTrailingBlock
};
//# sourceMappingURL=index.mjs.map