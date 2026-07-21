import * as _udecode_plate_core from '@udecode/plate-core';
import { PluginConfig, TElement, SlateEditor, OmitFirst } from '@udecode/plate';

type TodoListConfig = PluginConfig<'action_item', {
    inheritCheckStateOnLineEndBreak?: boolean;
    inheritCheckStateOnLineStartBreak?: boolean;
}>;
interface TTodoListItemElement extends TElement {
    checked?: boolean;
}
declare const BaseTodoListPlugin: _udecode_plate_core.SlatePlugin<TodoListConfig>;

declare const toggleList: (editor: SlateEditor, { type }: {
    type: string;
}) => boolean;
declare const toggleBulletedList: (editor: SlateEditor) => boolean;
declare const toggleNumberedList: (editor: SlateEditor) => boolean;

type ListConfig = PluginConfig<'list', {
    enableResetOnShiftTab?: boolean;
    /** Valid children types for list items, in addition to p and ul types. */
    validLiChildrenTypes?: string[];
}, {}, {
    toggle: {
        bulletedList: OmitFirst<typeof toggleBulletedList>;
        list: OmitFirst<typeof toggleList>;
        numberedList: OmitFirst<typeof toggleNumberedList>;
    };
}>;
declare const BaseBulletedListPlugin: _udecode_plate_core.SlatePlugin<PluginConfig<"ul", {}, {}, {}, {}>>;
declare const BaseNumberedListPlugin: _udecode_plate_core.SlatePlugin<PluginConfig<"ol", {}, {}, {}, {}>>;
declare const BaseListItemPlugin: _udecode_plate_core.SlatePlugin<PluginConfig<"li", {}, {}, {}, {}>>;
declare const BaseListItemContentPlugin: _udecode_plate_core.SlatePlugin<PluginConfig<"lic", {}, {}, {}, {}>>;
/** Enables support for bulleted, numbered and to-do lists. */
declare const BaseListPlugin: _udecode_plate_core.SlatePlugin<PluginConfig<"list", {
    enableResetOnShiftTab?: boolean;
    /** Valid children types for list items, in addition to p and ul types. */
    validLiChildrenTypes?: string[];
}, {}, {
    toggle: {
        bulletedList: (() => boolean) & (() => boolean);
        list: ((args_0: {
            type: string;
        }) => boolean) & ((args_0: {
            type: string;
        }) => boolean);
        numberedList: (() => boolean) & (() => boolean);
    };
}, {}>>;

export { BaseBulletedListPlugin as B, type ListConfig as L, type TodoListConfig as T, BaseNumberedListPlugin as a, BaseListItemPlugin as b, BaseListItemContentPlugin as c, BaseListPlugin as d, type TTodoListItemElement as e, BaseTodoListPlugin as f, toggleBulletedList as g, toggleNumberedList as h, toggleList as t };
