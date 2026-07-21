// src/lib/NodeIdPlugin.ts
import {
  createTSlatePlugin,
  ElementApi,
  nanoid,
  queryNode as queryNode2
} from "@udecode/plate";

// src/lib/withNodeId.ts
import {
  applyDeepToNodes,
  defaultsDeepToNodes,
  isDefined,
  queryNode
} from "@udecode/plate";
import castArray from "lodash/castArray.js";
import cloneDeep from "lodash/cloneDeep.js";
var withNodeId = ({
  editor,
  getOptions,
  tf: { apply, insertNode, insertNodes }
}) => {
  const idPropsCreator = () => ({
    [getOptions().idKey ?? ""]: getOptions().idCreator()
  });
  const filterNode = (nodeEntry) => {
    const { filter, filterText } = getOptions();
    return filter(nodeEntry) && (!filterText || nodeEntry[0]?.type !== void 0);
  };
  const removeIdFromNodeIfDuplicate = (node) => {
    const { idKey = "", reuseId } = getOptions();
    if (!reuseId && editor.api.some({ at: [], match: { [idKey]: node[idKey] } })) {
      delete node[idKey];
    }
  };
  const overrideIdIfSet = (node) => {
    const { idKey = "" } = getOptions();
    if (isDefined(node._id)) {
      const id = node._id;
      delete node._id;
      if (!editor.api.some({ at: [], match: { [idKey]: id } })) {
        node[idKey] = id;
      }
    }
  };
  return {
    transforms: {
      apply(operation) {
        const {
          allow,
          disableInsertOverrides,
          exclude,
          idCreator,
          idKey = "",
          reuseId
        } = getOptions();
        const query = {
          allow,
          exclude,
          filter: filterNode
        };
        if (operation.type === "insert_node") {
          const node = cloneDeep(operation.node);
          applyDeepToNodes({
            apply: removeIdFromNodeIfDuplicate,
            node,
            query,
            source: {}
          });
          defaultsDeepToNodes({
            node,
            path: operation.path,
            query,
            source: idPropsCreator
          });
          if (!disableInsertOverrides) {
            applyDeepToNodes({
              apply: overrideIdIfSet,
              node,
              query,
              source: {}
            });
          }
          return apply({
            ...operation,
            node
          });
        }
        if (operation.type === "split_node") {
          const node = operation.properties;
          let id = operation.properties[idKey];
          if (queryNode([node, operation.path], query)) {
            if (!reuseId || id === void 0 || editor.api.some({
              at: [],
              match: { [idKey]: id }
            })) {
              id = idCreator();
            }
            return apply({
              ...operation,
              properties: {
                ...operation.properties,
                [idKey]: id
              }
            });
          }
          if (id) {
            delete operation.properties[idKey];
          }
        }
        return apply(operation);
      },
      insertNode(node) {
        const { disableInsertOverrides, idKey = "" } = getOptions();
        if (!disableInsertOverrides && node[idKey]) {
          if (!Object.isExtensible(node)) {
            node = cloneDeep(node);
          }
          node._id = node[idKey];
        }
        insertNode(node);
      },
      insertNodes(_nodes, options) {
        const nodes = castArray(_nodes).filter(
          (node) => !!node
        );
        if (nodes.length === 0) return;
        const { disableInsertOverrides, idKey = "" } = getOptions();
        insertNodes(
          nodes.map((node) => {
            if (!disableInsertOverrides && node[idKey]) {
              if (!Object.isExtensible(node)) {
                node = cloneDeep(node);
              }
              node._id = node[idKey];
            }
            return node;
          }),
          options
        );
      }
    }
  };
};

// src/lib/NodeIdPlugin.ts
var NodeIdPlugin = createTSlatePlugin({
  key: "nodeId",
  options: {
    filterInline: true,
    filterText: true,
    idKey: "id",
    normalizeInitialValue: false,
    filter: () => true,
    idCreator: () => nanoid(10)
  },
  normalizeInitialValue: ({ editor, getOptions }) => {
    const {
      allow,
      exclude,
      filter,
      filterInline,
      filterText,
      idKey,
      normalizeInitialValue
    } = getOptions();
    if (!normalizeInitialValue) {
      const firstNode = editor.children[0];
      const lastNode = editor.children.at(-1);
      if (firstNode?.id && lastNode?.id) {
        return;
      }
    }
    const addNodeId = (entry) => {
      const [node, path] = entry;
      if (!node[idKey] && queryNode2([node, path], {
        allow,
        exclude,
        filter: (entry2) => {
          const [node2] = entry2;
          if (filterText && !ElementApi.isElement(node2)) {
            return false;
          }
          if (filterInline && ElementApi.isElement(node2) && !editor.api.isBlock(node2)) {
            return false;
          }
          return filter(entry2);
        }
      })) {
        const existingNode = editor.api.node(path);
        if (!existingNode) {
          return;
        }
        editor.tf.withoutSaving(() => {
          editor.tf.setNodes(
            { [idKey]: getOptions().idCreator() },
            { at: path }
          );
        });
      }
      if (ElementApi.isElement(node)) {
        node.children.forEach((child, index) => {
          addNodeId([child, [...path, index]]);
        });
      }
    };
    editor.children.forEach((node, index) => {
      addNodeId([node, [index]]);
    });
  }
}).overrideEditor(withNodeId);
export {
  NodeIdPlugin,
  withNodeId
};
//# sourceMappingURL=index.mjs.map