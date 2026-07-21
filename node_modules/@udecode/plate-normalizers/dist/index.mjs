// src/lib/NormalizeTypesPlugin.ts
import {
  createTSlatePlugin
} from "@udecode/plate";

// src/lib/withNormalizeTypes.ts
import {
  ElementApi,
  NodeApi
} from "@udecode/plate";
var withNormalizeTypes = ({
  editor,
  getOptions,
  tf: { normalizeNode }
}) => ({
  transforms: {
    normalizeNode([currentNode, currentPath]) {
      const { rules, onError } = getOptions();
      if (currentPath.length === 0) {
        const endCurrentNormalizationPass = rules.some(
          ({ path, strictType, type }) => {
            const node = NodeApi.get(editor, path);
            if (node) {
              if (strictType && ElementApi.isElement(node) && node.type !== strictType) {
                const { children, ...props } = editor.api.create.block({
                  type: strictType
                });
                editor.tf.setNodes(props, {
                  at: path
                });
                return true;
              }
            } else {
              try {
                editor.tf.insertNodes(
                  editor.api.create.block({ type: strictType ?? type }),
                  { at: path }
                );
                return true;
              } catch (error) {
                onError?.(error);
              }
            }
            return false;
          }
        );
        if (endCurrentNormalizationPass) {
          return;
        }
      }
      return normalizeNode([currentNode, currentPath]);
    }
  }
});

// src/lib/NormalizeTypesPlugin.ts
var NormalizeTypesPlugin = createTSlatePlugin({
  key: "normalizeTypes",
  options: {
    rules: []
  }
}).overrideEditor(withNormalizeTypes);

// src/lib/RemoveEmptyNodesPlugin.ts
import { createTSlatePlugin as createTSlatePlugin2 } from "@udecode/plate";

// src/lib/withRemoveEmptyNodes.ts
import { ElementApi as ElementApi2, NodeApi as NodeApi2 } from "@udecode/plate";
import castArray from "lodash/castArray.js";
var withRemoveEmptyNodes = ({
  editor,
  getOptions,
  tf: { normalizeNode }
}) => ({
  transforms: {
    normalizeNode([node, path]) {
      const types = castArray(getOptions().types ?? []);
      if (ElementApi2.isElement(node) && node.type && types.includes(node.type) && NodeApi2.string(node) === "") {
        editor.tf.removeNodes({ at: path });
        return;
      }
      normalizeNode([node, path]);
    }
  }
});

// src/lib/RemoveEmptyNodesPlugin.ts
var RemoveEmptyNodesPlugin = createTSlatePlugin2({
  key: "removeEmptyNodes"
}).overrideEditor(withRemoveEmptyNodes);
export {
  NormalizeTypesPlugin,
  RemoveEmptyNodesPlugin,
  withNormalizeTypes,
  withRemoveEmptyNodes
};
//# sourceMappingURL=index.mjs.map