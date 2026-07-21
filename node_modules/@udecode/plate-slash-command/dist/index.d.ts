import * as _udecode_plate_core from '@udecode/plate-core';
import { PluginConfig, TElement } from '@udecode/plate';
import { TriggerComboboxPluginOptions } from '@udecode/plate-combobox';

type SlashConfig = PluginConfig<'slash_command', TriggerComboboxPluginOptions>;
interface TSlashInputElement extends TElement {
}
declare const BaseSlashInputPlugin: _udecode_plate_core.SlatePlugin<PluginConfig<"slash_input", {}, {}, {}, {}>>;
declare const BaseSlashPlugin: _udecode_plate_core.SlatePlugin<SlashConfig>;

export { BaseSlashInputPlugin, BaseSlashPlugin, type SlashConfig, type TSlashInputElement };
