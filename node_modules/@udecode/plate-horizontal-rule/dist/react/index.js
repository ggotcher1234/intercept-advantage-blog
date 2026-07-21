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
  HorizontalRulePlugin: () => HorizontalRulePlugin
});
module.exports = __toCommonJS(react_exports);

// src/react/HorizontalRulePlugin.tsx
var import_react = require("@udecode/plate/react");

// src/lib/BaseHorizontalRulePlugin.ts
var import_plate = require("@udecode/plate");
var BaseHorizontalRulePlugin = (0, import_plate.createSlatePlugin)({
  key: "hr",
  node: { isElement: true, isVoid: true },
  parsers: {
    html: {
      deserializer: {
        rules: [
          {
            validNodeName: "HR"
          }
        ]
      }
    }
  }
});

// src/react/HorizontalRulePlugin.tsx
var HorizontalRulePlugin = (0, import_react.toPlatePlugin)(BaseHorizontalRulePlugin);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HorizontalRulePlugin
});
//# sourceMappingURL=index.js.map