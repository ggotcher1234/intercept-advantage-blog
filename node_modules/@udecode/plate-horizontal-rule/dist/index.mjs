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
export {
  BaseHorizontalRulePlugin
};
//# sourceMappingURL=index.mjs.map