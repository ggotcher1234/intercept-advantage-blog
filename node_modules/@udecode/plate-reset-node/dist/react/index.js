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
  ResetNodePlugin: () => ResetNodePlugin,
  SIMULATE_BACKSPACE: () => SIMULATE_BACKSPACE,
  onKeyDownResetNode: () => onKeyDownResetNode
});
module.exports = __toCommonJS(react_exports);

// src/react/ResetNodePlugin.tsx
var import_react = require("@udecode/plate/react");

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

// src/react/onKeyDownResetNode.ts
var import_plate2 = require("@udecode/plate");
var SIMULATE_BACKSPACE = {
  key: "",
  which: 8
};
var onKeyDownResetNode = ({
  editor,
  event,
  getOptions
}) => {
  const { rules = [] } = getOptions();
  if (event.defaultPrevented) return;
  let reset;
  if (!editor.selection) return;
  if (editor.api.isCollapsed()) {
    rules.forEach(({ defaultType, hotkey, predicate, types, onReset }) => {
      if (hotkey && (0, import_plate2.isHotkey)(hotkey, event) && predicate(editor) && editor.api.some({ match: { type: types } })) {
        event.preventDefault?.();
        editor.tf.setNodes({ type: defaultType });
        if (onReset) {
          onReset(editor);
        }
        reset = true;
      }
    });
  }
  return reset;
};

// src/react/ResetNodePlugin.tsx
var ResetNodePlugin = (0, import_react.toTPlatePlugin)(
  BaseResetNodePlugin,
  {
    handlers: {
      onKeyDown: onKeyDownResetNode
    }
  }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ResetNodePlugin,
  SIMULATE_BACKSPACE,
  onKeyDownResetNode
});
//# sourceMappingURL=index.js.map