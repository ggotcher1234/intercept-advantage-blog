// src/react/HorizontalRulePlugin.tsx
import { toPlatePlugin } from "@udecode/plate/react";

// src/lib/BaseHorizontalRulePlugin.ts
import { createSlatePlugin } from "@udecode/plate";
var BaseHorizontalRulePlugin = createSlatePlugin({
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
var HorizontalRulePlugin = toPlatePlugin(BaseHorizontalRulePlugin);
export {
  HorizontalRulePlugin
};
//# sourceMappingURL=index.mjs.map