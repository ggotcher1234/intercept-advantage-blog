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
  NormalizeTypesPlugin: () => NormalizeTypesPlugin,
  RemoveEmptyNodesPlugin: () => RemoveEmptyNodesPlugin,
  withNormalizeTypes: () => withNormalizeTypes,
  withRemoveEmptyNodes: () => withRemoveEmptyNodes
});
module.exports = __toCommonJS(index_exports);

// src/lib/NormalizeTypesPlugin.ts
var import_plate2 = require("@udecode/plate");

// src/lib/withNormalizeTypes.ts
var import_plate = require("@udecode/plate");
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
            const node = import_plate.NodeApi.get(editor, path);
            if (node) {
              if (strictType && import_plate.ElementApi.isElement(node) && node.type !== strictType) {
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
var NormalizeTypesPlugin = (0, import_plate2.createTSlatePlugin)({
  key: "normalizeTypes",
  options: {
    rules: []
  }
}).overrideEditor(withNormalizeTypes);

// src/lib/RemoveEmptyNodesPlugin.ts
var import_plate4 = require("@udecode/plate");

// src/lib/withRemoveEmptyNodes.ts
var import_plate3 = require("@udecode/plate");
var import_castArray = __toESM(require("lodash/castArray.js"));
var withRemoveEmptyNodes = ({
  editor,
  getOptions,
  tf: { normalizeNode }
}) => ({
  transforms: {
    normalizeNode([node, path]) {
      const types = (0, import_castArray.default)(getOptions().types ?? []);
      if (import_plate3.ElementApi.isElement(node) && node.type && types.includes(node.type) && import_plate3.NodeApi.string(node) === "") {
        editor.tf.removeNodes({ at: path });
        return;
      }
      normalizeNode([node, path]);
    }
  }
});

// src/lib/RemoveEmptyNodesPlugin.ts
var RemoveEmptyNodesPlugin = (0, import_plate4.createTSlatePlugin)({
  key: "removeEmptyNodes"
}).overrideEditor(withRemoveEmptyNodes);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NormalizeTypesPlugin,
  RemoveEmptyNodesPlugin,
  withNormalizeTypes,
  withRemoveEmptyNodes
});
//# sourceMappingURL=index.js.map