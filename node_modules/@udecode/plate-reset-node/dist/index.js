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
  BaseResetNodePlugin: () => BaseResetNodePlugin
});
module.exports = __toCommonJS(index_exports);

// src/lib/BaseResetNodePlugin.ts
var import_plate = require("@udecode/plate");
var BaseResetNodePlugin = (0, import_plate.createTSlatePlugin)({
  key: "resetNode",
  options: {
    rules: []
  }
}).overrideEditor(
  ({ editor, getOptions, tf: { deleteBackward, deleteFragment } }) => ({
    transforms: {
      deleteBackward(unit) {
        if (!getOptions().disableFirstBlockReset) {
          const { selection } = editor;
          if (selection && editor.api.isCollapsed()) {
            const start = editor.api.start([]);
            if (import_plate.PointApi.equals(selection.anchor, start)) {
              const node = import_plate.NodeApi.get(editor, [0]);
              const { children, ...props } = editor.api.create.block({}, [0]);
              editor.tf.withoutNormalizing(() => {
                const { id, ...nodeProps } = import_plate.NodeApi.extractProps(node);
                editor.tf.unsetNodes(Object.keys(nodeProps), { at: [0] });
                editor.tf.setNodes(props, { at: [0] });
              });
              return;
            }
          }
        }
        deleteBackward(unit);
      },
      deleteFragment(direction) {
        const deleteFragmentPlugin = () => {
          const { selection } = editor;
          if (!selection) return;
          if (import_plate.RangeApi.equals(selection, editor.api.range([]))) {
            editor.tf.reset({
              children: true,
              select: true
            });
            return true;
          }
        };
        if (!getOptions().disableEditorReset && deleteFragmentPlugin()) return;
        deleteFragment(direction);
      }
    }
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseResetNodePlugin
});
//# sourceMappingURL=index.js.map