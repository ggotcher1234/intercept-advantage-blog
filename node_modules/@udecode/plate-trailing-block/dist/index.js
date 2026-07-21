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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  TrailingBlockPlugin: () => TrailingBlockPlugin,
  withTrailingBlock: () => withTrailingBlock
});
module.exports = __toCommonJS(index_exports);

// src/lib/TrailingBlockPlugin.ts
var import_plate2 = require("@udecode/plate");

// src/lib/withTrailingBlock.ts
var import_plate = require("@udecode/plate");
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
        if (!lastChildNode || lastChildNode.type !== type && (0, import_plate.queryNode)(lastChild, query)) {
          const at = lastChild ? import_plate.PathApi.next(lastChild[1]) : [0];
          editor.tf.insertNodes(editor.api.create.block({ type }, at), { at });
          return;
        }
      }
      return normalizeNode([currentNode, currentPath]);
    }
  }
});

// src/lib/TrailingBlockPlugin.ts
var TrailingBlockPlugin = (0, import_plate2.createTSlatePlugin)({
  key: "trailingBlock",
  options: {
    level: 0
  }
}).overrideEditor(withTrailingBlock).extend(({ editor }) => ({
  options: {
    type: editor.getType(import_plate2.BaseParagraphPlugin)
  }
}));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TrailingBlockPlugin,
  withTrailingBlock
});
//# sourceMappingURL=index.js.map