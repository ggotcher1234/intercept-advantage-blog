import * as _udecode_plate_core_react from '@udecode/plate-core/react';
import * as _udecode_plate_core from '@udecode/plate-core';
import * as _udecode_utils from '@udecode/utils';
import { g as toggleBulletedList, t as toggleList, h as toggleNumberedList, L as ListConfig, e as TTodoListItemElement } from '../BaseListPlugin-kp1pCEoe.js';
import { KeyboardHandler, OverrideEditor } from '@udecode/plate/react';
import * as zustand_x from 'zustand-x';
import * as mutative from 'mutative';
import * as is_hotkey from 'is-hotkey';
import * as _udecode_slate from '@udecode/slate';
import '@udecode/plate';

declare const BulletedListPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"ul", {
    enableResetOnShiftTab?: boolean;
    validLiChildrenTypes?: string[];
}, {}, {
    toggle: {
        bulletedList: _udecode_utils.OmitFirst<typeof toggleBulletedList>;
        list: _udecode_utils.OmitFirst<typeof toggleList>;
        numberedList: _udecode_utils.OmitFirst<typeof toggleNumberedList>;
    };
}, {}>>;
declare const NumberedListPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"ol", {
    enableResetOnShiftTab?: boolean;
    validLiChildrenTypes?: string[];
}, {}, {
    toggle: {
        bulletedList: _udecode_utils.OmitFirst<typeof toggleBulletedList>;
        list: _udecode_utils.OmitFirst<typeof toggleList>;
        numberedList: _udecode_utils.OmitFirst<typeof toggleNumberedList>;
    };
}, {}>>;
declare const ListItemContentPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"lic", {}, {}, {}, {}>>;
declare const ListItemPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"li", {}, {}, {}, {}>>;
/**
 * Enables support for bulleted, numbered and to-do lists with React-specific
 * features.
 */
declare const ListPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"list", {
    enableResetOnShiftTab?: boolean;
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

/** Enables support for todo lists with React-specific features. */
declare const TodoListPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"action_item", {
    inheritCheckStateOnLineEndBreak?: boolean;
    inheritCheckStateOnLineStartBreak?: boolean;
}, {}, {}, {}>>;

declare const onKeyDownList: KeyboardHandler<ListConfig>;

declare const withDeleteBackwardList: OverrideEditor<ListConfig>;

declare const withInsertBreakList: OverrideEditor<ListConfig>;

declare const withList: OverrideEditor<ListConfig>;

declare const useListToolbarButtonState: ({ nodeType, }?: {
    nodeType?: string | undefined;
}) => {
    nodeType: string;
    pressed: boolean;
};
declare const useListToolbarButton: (state: ReturnType<typeof useListToolbarButtonState>) => {
    props: {
        pressed: boolean;
        onClick: () => void;
        onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
    };
};

declare const useTodoListElementState: ({ element, }: {
    element: TTodoListItemElement;
}) => {
    checked: boolean | undefined;
    editor: {
        api: _udecode_slate.EditorApi & _udecode_utils.UnionToIntersection<_udecode_plate_core.InferApi<_udecode_plate_core_react.PlateCorePlugin>>;
        pluginList: _udecode_plate_core_react.AnyEditorPlatePlugin[];
        plugins: Record<string, _udecode_plate_core_react.AnyEditorPlatePlugin>;
        shortcuts: _udecode_plate_core_react.Shortcuts;
        tf: _udecode_slate.EditorTransforms & _udecode_utils.UnionToIntersection<_udecode_plate_core.InferTransforms<_udecode_plate_core_react.PlateCorePlugin>>;
        transforms: _udecode_slate.EditorTransforms & _udecode_utils.UnionToIntersection<_udecode_plate_core.InferTransforms<_udecode_plate_core_react.PlateCorePlugin>>;
        getApi: <C extends _udecode_plate_core.AnyPluginConfig = _udecode_plate_core.PluginConfig>(plugin?: _udecode_plate_core.WithRequiredKey<C>) => _udecode_plate_core_react.PlateEditor["api"] & _udecode_plate_core.InferApi<C>;
        getPlugin: <C extends _udecode_plate_core.AnyPluginConfig = _udecode_plate_core.PluginConfig>(plugin: _udecode_plate_core.WithRequiredKey<C>) => C extends {
            node: any;
        } ? C : _udecode_plate_core_react.EditorPlatePlugin<C>;
        getTransforms: <C extends _udecode_plate_core.AnyPluginConfig = _udecode_plate_core.PluginConfig>(plugin?: _udecode_plate_core.WithRequiredKey<C>) => _udecode_plate_core_react.PlateEditor["tf"] & _udecode_plate_core.InferTransforms<C>;
        uid?: string;
    } & {
        id: string;
        children: _udecode_slate.Value;
        history: _udecode_slate.History;
        marks: _udecode_slate.EditorMarks | null;
        operations: _udecode_slate.Operation<_udecode_slate.TElement | _udecode_slate.TText>[];
        selection: _udecode_slate.EditorSelection;
    } & _udecode_slate.EditorMethods<_udecode_slate.Value> & _udecode_utils.UnknownObject & {
        key: any;
        currentKeyboardEvent: is_hotkey.KeyboardEventLike | null;
        isFallback: boolean;
        pluginList: any[];
        plugins: Record<string, any>;
        prevSelection: _udecode_slate.TRange | null;
        setOptions: {
            <C extends _udecode_plate_core.AnyPluginConfig>(plugin: _udecode_plate_core.WithRequiredKey<C>, options: (state: mutative.Draft<Partial<_udecode_plate_core.InferOptions<C>>>) => void): void;
            <C extends _udecode_plate_core.AnyPluginConfig>(plugin: _udecode_plate_core.WithRequiredKey<C>, options: Partial<_udecode_plate_core.InferOptions<C>>): void;
        };
        getInjectProps: <C extends _udecode_plate_core.AnyPluginConfig = _udecode_plate_core.PluginConfig>(plugin: _udecode_plate_core.WithRequiredKey<C>) => _udecode_plate_core.InjectNodeProps<C>;
        getOption: <C extends _udecode_plate_core.AnyPluginConfig, StateType extends _udecode_plate_core.InferOptions<C>, TSelectors extends _udecode_plate_core.InferSelectors<C>, K extends keyof StateType | keyof TSelectors | "state">(plugin: _udecode_plate_core.WithRequiredKey<C>, key: K, ...args: K extends keyof TSelectors ? Parameters<TSelectors[K]> : []) => K extends "state" ? StateType : K extends keyof TSelectors ? ReturnType<TSelectors[K]> : K extends keyof StateType ? StateType[K] : never;
        getOptions: <C extends _udecode_plate_core.AnyPluginConfig = _udecode_plate_core.PluginConfig>(plugin: _udecode_plate_core.WithRequiredKey<C>) => _udecode_plate_core.InferOptions<C>;
        getOptionsStore: <C extends _udecode_plate_core.AnyPluginConfig>(plugin: _udecode_plate_core.WithRequiredKey<C>) => zustand_x.TStateApi<_udecode_plate_core.InferOptions<C>, [["zustand/mutative-x", never]], {}, _udecode_plate_core.InferSelectors<C>>;
        getPlugin: <C extends _udecode_plate_core.AnyPluginConfig = _udecode_plate_core.PluginConfig>(plugin: _udecode_plate_core.WithRequiredKey<C>) => C extends {
            node: any;
        } ? C : _udecode_plate_core.EditorPlugin<C>;
        getType: (plugin: _udecode_plate_core.WithRequiredKey) => string;
        setOption: <C extends _udecode_plate_core.AnyPluginConfig, K extends keyof _udecode_plate_core.InferOptions<C>>(plugin: _udecode_plate_core.WithRequiredKey<C>, optionKey: K, value: _udecode_plate_core.InferOptions<C>[K]) => void;
    } & {
        store: _udecode_plate_core_react.PlateStore;
    };
    element: TTodoListItemElement;
    readOnly: boolean;
};
declare const useTodoListElement: (state: ReturnType<typeof useTodoListElementState>) => {
    checkboxProps: {
        checked: boolean;
        onCheckedChange: (value: boolean) => void;
    };
};

export { BulletedListPlugin, ListItemContentPlugin, ListItemPlugin, ListPlugin, NumberedListPlugin, TodoListPlugin, onKeyDownList, useListToolbarButton, useListToolbarButtonState, useTodoListElement, useTodoListElementState, withDeleteBackwardList, withInsertBreakList, withList };
