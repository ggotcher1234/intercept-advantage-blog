// src/lib/BaseHeadingPlugin.ts
import {
  createSlatePlugin,
  createTSlatePlugin
} from "@udecode/plate";

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
var BaseHeadingPlugin = createTSlatePlugin({
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
    const plugin2 = createSlatePlugin({
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
import {
  createTSlatePlugin as createTSlatePlugin2
} from "@udecode/plate";
var BaseTocPlugin = createTSlatePlugin2({
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
export {
  BaseHeadingPlugin,
  BaseTocPlugin,
  HEADING_KEYS,
  HEADING_LEVELS,
  insertToc,
  isHeading
};
//# sourceMappingURL=index.mjs.map