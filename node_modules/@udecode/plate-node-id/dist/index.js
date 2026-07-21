"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  NodeIdPlugin: () => NodeIdPlugin,
  withNodeId: () => withNodeId
});
module.exports = __toCommonJS(index_exports);

// src/lib/NodeIdPlugin.ts
var import_plate2 = require("@udecode/plate");

// src/lib/withNodeId.ts
var import_plate = require("@udecode/plate");
var import_castArray = __toESM(require("lodash/castArray.js"));
var import_cloneDeep = __toESM(require("lodash/cloneDeep.js"));
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
    if ((0, import_plate.isDefined)(node._id)) {
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
          const node = (0, import_cloneDeep.default)(operation.node);
          (0, import_plate.applyDeepToNodes)({
            apply: removeIdFromNodeIfDuplicate,
            node,
            query,
            source: {}
          });
          (0, import_plate.defaultsDeepToNodes)({
            node,
            path: operation.path,
            query,
            source: idPropsCreator
          });
          if (!disableInsertOverrides) {
            (0, import_plate.applyDeepToNodes)({
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
          if ((0, import_plate.queryNode)([node, operation.path], query)) {
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
            node = (0, import_cloneDeep.default)(node);
          }
          node._id = node[idKey];
        }
        insertNode(node);
      },
      insertNodes(_nodes, options) {
        const nodes = (0, import_castArray.default)(_nodes).filter(
          (node) => !!node
        );
        if (nodes.length === 0) return;
        const { disableInsertOverrides, idKey = "" } = getOptions();
        insertNodes(
          nodes.map((node) => {
            if (!disableInsertOverrides && node[idKey]) {
              if (!Object.isExtensible(node)) {
                node = (0, import_cloneDeep.default)(node);
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
var NodeIdPlugin = (0, import_plate2.createTSlatePlugin)({
  key: "nodeId",
  options: {
    filterInline: true,
    filterText: true,
    idKey: "id",
    normalizeInitialValue: false,
    filter: () => true,
    idCreator: () => (0, import_plate2.nanoid)(10)
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
      if (!node[idKey] && (0, import_plate2.queryNode)([node, path], {
        allow,
        exclude,
        filter: (entry2) => {
          const [node2] = entry2;
          if (filterText && !import_plate2.ElementApi.isElement(node2)) {
            return false;
          }
          if (filterInline && import_plate2.ElementApi.isElement(node2) && !editor.api.isBlock(node2)) {
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
      if (import_plate2.ElementApi.isElement(node)) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NodeIdPlugin,
  withNodeId
});
//# sourceMappingURL=index.js.map