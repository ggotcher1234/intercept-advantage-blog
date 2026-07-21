// src/react/SlashPlugin.tsx
import { toPlatePlugin } from "@udecode/plate/react";

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

// src/react/SlashPlugin.tsx
var SlashInputPlugin = toPlatePlugin(BaseSlashInputPlugin);
var SlashPlugin = toPlatePlugin(BaseSlashPlugin);
export {
  SlashInputPlugin,
  SlashPlugin
};
//# sourceMappingURL=index.mjs.map