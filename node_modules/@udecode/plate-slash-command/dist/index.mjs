// src/lib/BaseSlashPlugin.ts
import {
  createSlatePlugin,
  createTSlatePlugin
} from "@udecode/plate";
import {
  withTriggerCombobox
} from "@udecode/plate-combobox";
var BaseSlashInputPlugin = createSlatePlugin({
  key: "slash_input",
  node: { isElement: true, isInline: true, isVoid: true }
});
var BaseSlashPlugin = createTSlatePlugin({
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
}).overrideEditor(withTriggerCombobox);
export {
  BaseSlashInputPlugin,
  BaseSlashPlugin
};
//# sourceMappingURL=index.mjs.map