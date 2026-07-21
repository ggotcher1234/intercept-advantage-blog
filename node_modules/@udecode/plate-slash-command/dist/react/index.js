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
  SlashInputPlugin: () => SlashInputPlugin,
  SlashPlugin: () => SlashPlugin
});
module.exports = __toCommonJS(react_exports);

// src/react/SlashPlugin.tsx
var import_react = require("@udecode/plate/react");

// src/lib/BaseSlashPlugin.ts
var import_plate = require("@udecode/plate");
var import_plate_combobox = require("@udecode/plate-combobox");
var BaseSlashInputPlugin = (0, import_plate.createSlatePlugin)({
  key: "slash_input",
  node: { isElement: true, isInline: true, isVoid: true }
});
var BaseSlashPlugin = (0, import_plate.createTSlatePlugin)({
  key: "slash_command",
  options: {
    trigger: "/",
    triggerPreviousCharPattern: /^\s?$/,
    createComboboxInput: () => ({
      children: [{ text: "" }],
      type: BaseSlashInputPlugin.key
    })
  },
  plugins: [BaseSlashInputPlugin]
}).overrideEditor(import_plate_combobox.withTriggerCombobox);

// src/react/SlashPlugin.tsx
var SlashInputPlugin = (0, import_react.toPlatePlugin)(BaseSlashInputPlugin);
var SlashPlugin = (0, import_react.toPlatePlugin)(BaseSlashPlugin);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SlashInputPlugin,
  SlashPlugin
});
//# sourceMappingURL=index.js.map