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
  BaseHeadingPlugin: () => BaseHeadingPlugin,
  BaseTocPlugin: () => BaseTocPlugin,
  HEADING_KEYS: () => HEADING_KEYS,
  HEADING_LEVELS: () => HEADING_LEVELS,
  insertToc: () => insertToc,
  isHeading: () => isHeading
});
module.exports = __toCommonJS(index_exports);

// src/lib/BaseHeadingPlugin.ts
var import_plate = require("@udecode/plate");

// src/lib/constants.ts
var HEADING_KEYS = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6"
};
var HEADING_LEVELS = [
  HEADING_KEYS.h1,
  HEADING_KEYS.h2,
  HEADING_KEYS.h3,
  HEADING_KEYS.h4,
  HEADING_KEYS.h5,
  HEADING_KEYS.h6
];

// src/lib/BaseHeadingPlugin.ts
var BaseHeadingPlugin = (0, import_plate.createTSlatePlugin)({
  key: "heading",
  options: {
    levels: [1, 2, 3, 4, 5, 6]
  }
}).extend(({ plugin }) => {
  const {
    options: { levels }
  } = plugin;
  const plugins = [];
  const headingLevels = Array.isArray(levels) ? levels : Array.from({ length: levels || 6 }, (_, i) => i + 1);
  headingLevels.forEach((level) => {
    const plugin2 = (0, import_plate.createSlatePlugin)({
      key: HEADING_LEVELS[level - 1],
      node: { isElement: true },
      parsers: {
        html: {
          deserializer: {
            rules: [
              {
                validNodeName: `H${level}`
              }
            ]
          }
        }
      }
    });
    plugins.push(plugin2);
  });
  return {
    plugins
  };
});

// src/lib/BaseTocPlugin.ts
var import_plate2 = require("@udecode/plate");
var BaseTocPlugin = (0, import_plate2.createTSlatePlugin)({
  key: "toc",
  node: { isElement: true, isVoid: true },
  options: {
    isScroll: true,
    topOffset: 80
  }
});

// src/lib/transforms/insertToc.ts
var insertToc = (editor, options) => {
  editor.tf.insertNodes(
    {
      children: [{ text: "" }],
      type: editor.getType(BaseTocPlugin)
    },
    options
  );
};

// src/lib/utils/isHeading.ts
var isHeading = (node) => {
  return node.type && HEADING_LEVELS.includes(node.type);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseHeadingPlugin,
  BaseTocPlugin,
  HEADING_KEYS,
  HEADING_LEVELS,
  insertToc,
  isHeading
});
//# sourceMappingURL=index.js.map