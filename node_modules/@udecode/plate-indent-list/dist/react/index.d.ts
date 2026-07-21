import * as _udecode_plate_core_react from '@udecode/plate-core/react';
import * as _udecode_plate_core from '@udecode/plate-core';
import { B as BaseIndentListConfig, G as GetSiblingIndentListOptions, L as ListStyleType } from '../BaseIndentListPlugin-BsmWXxhM.js';
import * as _udecode_slate from '@udecode/slate';
import { KeyboardHandler } from '@udecode/plate/react';
import * as zustand_x from 'zustand-x';
import * as mutative from 'mutative';
import * as is_hotkey from 'is-hotkey';
import * as _udecode_utils from '@udecode/utils';
import { TElement } from '@udecode/plate';

type IndentListConfig = BaseIndentListConfig;
/** Enables support for indented lists with React-specific features. */
declare const IndentListPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"listStyleType", {
    getSiblingIndentListOptions?: GetSiblingIndentListOptions<_udecode_slate.TElement>;
    listStyleTypes?: Record<string, {
        type: string;
        isOrdered?: boolean;
        liComponent?: React.FC<_udecode_plate_core.SlateRenderElementProps>;
        markerComponent?: React.FC<Omit<_udecode_plate_core.SlateRenderElementProps, "children">>;
    }>;
    getListStyleType?: (element: HTMLElement) => ListStyleType;
}, {}, {}, {}>>;

declare const onKeyDownIndentList: KeyboardHandler<IndentListConfig>;

declare const useIndentListToolbarButtonState: ({ nodeType, }?: {
    nodeType?: string;
}) => {
    nodeType: string;
    pressed: boolean;
};
declare const useIndentListToolbarButton: ({ nodeType, pressed, }: ReturnType<typeof useIndentListToolbarButtonState>) => {
    props: {
        pressed: boolean;
        onClick: () => void;
        onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
    };
};

declare const useIndentTodoListElementState: ({ element, }: {
    element: TElement;
}) => {
    checked: unknown;
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
        operations: _udecode_slate.Operation<TElement | _udecode_slate.TText>[];
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
    element: TElement;
    readOnly: boolean;
};
declare const useIndentTodoListElement: (state: ReturnType<typeof useIndentTodoListElementState>) => {
    checkboxProps: {
        checked: boolean;
        onCheckedChange: (value: boolean) => void;
        onMouseDown: (e: any) => void;
    };
};

declare const useIndentTodoToolBarButtonState: ({ nodeType, }?: {
    nodeType?: string;
}) => {
    nodeType: string;
    pressed: boolean;
};
declare const useIndentTodoToolBarButton: ({ nodeType, pressed, }: ReturnType<typeof useIndentTodoToolBarButtonState>) => {
    props: {
        pressed: boolean;
        onClick: () => void;
        onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
    };
};

export { type IndentListConfig, IndentListPlugin, onKeyDownIndentList, useIndentListToolbarButton, useIndentListToolbarButtonState, useIndentTodoListElement, useIndentTodoListElementState, useIndentTodoToolBarButton, useIndentTodoToolBarButtonState };
