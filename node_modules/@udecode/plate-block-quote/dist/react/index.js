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
  BlockquotePlugin: () => BlockquotePlugin
});
module.exports = __toCommonJS(react_exports);

// src/react/BlockquotePlugin.tsx
var import_react = require("@udecode/plate/react");

// src/lib/BaseBlockquotePlugin.ts
var import_plate = require("@udecode/plate");

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
var BaseBlockquotePlugin = (0, import_plate.createSlatePlugin)({
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
var BlockquotePlugin = (0, import_react.toPlatePlugin)(
  BaseBlockquotePlugin,
  ({ editor, type }) => ({
    shortcuts: {
      toggleBlockquote: {
        keys: [[import_react.Key.Mod, import_react.Key.Shift, "period"]],
        preventDefault: true,
        handler: () => {
          editor.tf.toggleBlock(type);
        }
      }
    }
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BlockquotePlugin
});
//# sourceMappingURL=index.js.map