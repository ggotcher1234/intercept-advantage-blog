import * as _udecode_plate_core from '@udecode/plate-core';
import { b as HeadingLevel, H as Heading } from '../types-BLNkiwWE.js';
import { PlatePlugin } from '@udecode/plate/react';
import * as _udecode_plate_core_react from '@udecode/plate-core/react';
import React$1 from 'react';
import * as zustand_x from 'zustand-x';
import * as mutative from 'mutative';
import * as is_hotkey from 'is-hotkey';
import * as _udecode_utils from '@udecode/utils';
import * as _udecode_slate from '@udecode/slate';
import '@udecode/plate';

declare const HeadingPlugin: PlatePlugin<_udecode_plate_core.PluginConfig<"heading", {
    levels?: HeadingLevel | HeadingLevel[];
}, {}, {}, {}>>;

declare const TocPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"toc", {
    isScroll: boolean;
    topOffset: number;
    queryHeading?: (editor: _udecode_plate_core.SlateEditor) => Heading[];
}, {}, {}, {}>>;

interface TocSideBarProps {
    open?: boolean;
    rootMargin?: string;
    topOffset?: number;
}
interface UseContentController {
    containerRef: React.RefObject<HTMLDivElement | null>;
    isObserve: boolean;
    rootMargin: string;
    topOffset: number;
}

declare const useContentController: ({ containerRef, isObserve, rootMargin, topOffset, }: UseContentController) => {
    activeContentId: string;
    onContentScroll: ({ id, behavior, el, }: {
        id: string;
        el: HTMLElement;
        behavior?: ScrollBehavior;
    }) => void;
};

interface UseContentObserver {
    editorContentRef: React$1.RefObject<HTMLElement | null>;
    isObserve: boolean;
    isScroll: boolean;
    rootMargin: string;
    status: number;
}
declare const useContentObserver: ({ editorContentRef, isObserve, isScroll, rootMargin, status, }: UseContentObserver) => {
    activeId: string;
};

interface UseTocController {
    activeId: string;
    isObserve: boolean;
    tocRef: React$1.RefObject<HTMLElement | null>;
}
declare const useTocController: ({ activeId, isObserve, tocRef, }: UseTocController) => void;

declare const useTocElementState: () => {
    editor: _udecode_plate_core_react.PlateEditor;
    headingList: Heading[];
    onContentScroll: (el: HTMLElement, id: string, behavior?: ScrollBehavior) => void;
};
declare const useTocElement: ({ editor, onContentScroll, }: ReturnType<typeof useTocElementState>) => {
    props: {
        onClick: (e: React$1.MouseEvent<HTMLElement, globalThis.MouseEvent>, item: Heading, behavior: ScrollBehavior) => void;
    };
};

interface UseTocObserver {
    activeId: string;
    isObserve: boolean;
    tocRef: React$1.RefObject<HTMLElement | null>;
}
declare const useTocObserver: ({ activeId, isObserve, tocRef, }: UseTocObserver) => {
    offset: number;
    visible: boolean;
};

declare const useTocSideBarState: ({ open, rootMargin, topOffset, }: TocSideBarProps) => {
    activeContentId: string;
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
    headingList: Heading[];
    mouseInToc: boolean;
    open: boolean;
    setIsObserve: React$1.Dispatch<React$1.SetStateAction<boolean>>;
    setMouseInToc: React$1.Dispatch<React$1.SetStateAction<boolean>>;
    tocRef: React$1.RefObject<HTMLElement | null>;
    onContentScroll: ({ id, behavior, el, }: {
        id: string;
        el: HTMLElement;
        behavior?: ScrollBehavior;
    }) => void;
};
declare const useTocSideBar: ({ editor, mouseInToc, open, setIsObserve, setMouseInToc, tocRef, onContentScroll, }: ReturnType<typeof useTocSideBarState>) => {
    navProps: {
        ref: React$1.RefObject<HTMLElement | null>;
        onMouseEnter: () => void;
        onMouseLeave: (e: React$1.MouseEvent<HTMLElement, globalThis.MouseEvent>) => void;
    };
    onContentClick: (e: React$1.MouseEvent<HTMLElement, globalThis.MouseEvent>, item: Heading, behavior?: ScrollBehavior) => void;
};

declare function checkIn(e: React.MouseEvent<HTMLElement, globalThis.MouseEvent>): boolean;

declare const heightToTop: (ele: HTMLElement, editorContentRef?: React$1.RefObject<HTMLDivElement | null>) => number;

export { HeadingPlugin, TocPlugin, type TocSideBarProps, type UseContentController, checkIn, heightToTop, useContentController, useContentObserver, useTocController, useTocElement, useTocElementState, useTocObserver, useTocSideBar, useTocSideBarState };
