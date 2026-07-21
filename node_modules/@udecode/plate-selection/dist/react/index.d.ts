import * as _udecode_plate_core_react from '@udecode/plate-core/react';
import { PluginConfig, SlateEditor, TElement, Path, OmitFirst, NodeEntry, UnknownObject, TRange, EditorPropOptions, Editor, NodeProps, SetNodesOptions, TText } from '@udecode/plate';
import * as _udecode_slate from '@udecode/slate';
import React, { CSSProperties } from 'react';
import { KeyboardHandler, EditableSiblingComponent, PlateEditor } from '@udecode/plate/react';

declare const BLOCK_CONTEXT_MENU_ID = "context";
type BlockMenuConfig = PluginConfig<'blockMenu', {
    openId: OpenId | null;
    position: {
        x: number;
        y: number;
    };
}, {
    blockMenu: {
        hide: () => void;
        show: (id: OpenId, position?: {
            x: number;
            y: number;
        }) => void;
        showContextMenu: (blockId: string, position: {
            x: number;
            y: number;
        }) => void;
    };
}>;
type OpenId = (string & {}) | typeof BLOCK_CONTEXT_MENU_ID;
declare const BlockMenuPlugin: _udecode_plate_core_react.PlatePlugin<PluginConfig<"blockMenu", {
    openId: OpenId | null;
    position: {
        x: number;
        y: number;
    };
}, {
    blockMenu: {
        hide: () => void;
        show: (id: OpenId, position?: {
            x: number;
            y: number;
        }) => void;
        showContextMenu: (blockId: string, position: {
            x: number;
            y: number;
        }) => void;
    };
} & Record<"blockMenu", Partial<{
    hide: () => void;
    show: (id: OpenId, position?: {
        x: number;
        y: number;
    }) => void;
    showContextMenu: (blockId: string, position: {
        x: number;
        y: number;
    }) => void;
}>>, {}, {}>>;

type Intersection = 'center' | 'cover' | 'touch';

interface Behaviour {
    intersect: Intersection;
    overlap: OverlapMode;
    scrolling: Scrolling;
    startThreshold: Coordinates | number;
    triggers: Trigger[];
}
interface Coordinates {
    x: number;
    y: number;
}
type DeepPartial<T> = T extends unknown[] ? T : T extends HTMLElement ? T : {
    [P in keyof T]?: DeepPartial<T[P]>;
};
interface Features {
    range: boolean;
    singleTap: SingleTap;
    touch: boolean;
}
type Modifier = 'alt' | 'ctrl' | 'shift';
type MouseButton = 0 | 1 | 2 | 3 | 4;
type MouseButtonWithModifiers = {
    button: MouseButton;
    modifiers: Modifier[];
};
type OverlapMode = 'drop' | 'invert' | 'keep';
type PartialSelectionOptions = {
    document?: Document;
} & DeepPartial<Omit<SelectionOptions, 'document'>>;
type Quantify<T> = T | T[];
interface Scrolling {
    manualSpeed: number;
    speedDivider: number;
    startScrollMargins: {
        x: number;
        y: number;
    };
}
interface SelectionOptions {
    behaviour: Behaviour;
    boundaries: Quantify<HTMLElement | string>;
    container: Quantify<HTMLElement | string>;
    document: Document;
    features: Features;
    selectables: Quantify<string>;
    selectionAreaClass: string;
    startAreas: Quantify<HTMLElement | string>;
}
interface SingleTap {
    allow: boolean;
    intersect: TapMode;
}
type TapMode = 'native' | 'touch';
type Trigger = MouseButton | MouseButtonWithModifiers;

declare const setSelectedIds: (editor: SlateEditor, { added, ids, removed, }: Partial<{
    added: Element[];
    removed: Element[];
}> & {
    ids?: string[];
}) => void;

type BlockSelectionConfig = PluginConfig<'blockSelection', {
    anchorId?: string | null;
    areaOptions?: PartialSelectionOptions;
    editorPaddingRight?: CSSProperties['width'];
    enableContextMenu?: boolean;
    isSelecting?: boolean;
    isSelectionAreaVisible?: boolean;
    rightSelectionAreaClassName?: string;
    selectedIds?: Set<string>;
    shadowInputRef?: React.RefObject<HTMLInputElement | null>;
    /** Check if a block is selectable */
    isSelectable?: (element: TElement, path: Path) => boolean;
    onKeyDownSelecting?: (e: KeyboardEvent) => void;
}, {
    blockSelection: {
        /** Set selected block ids */
        setSelectedIds: OmitFirst<typeof setSelectedIds>;
        /** Add a block to the selection. */
        add: (id: string[] | string) => void;
        /**
         * Select a block by id, with optional delay and clear options.
         *
         * @deprecated Use `add` or `set` instead.
         */
        addSelectedRow: (id: string, options?: {
            clear?: boolean;
            delay?: number;
        }) => void;
        /** Clear block selection */
        clear: () => void;
        /** Delete a block from the selection. */
        delete: (id: string[] | string) => void;
        /** Deselect all blocks */
        deselect: () => void;
        /** Focus block selection – that differs from the editor focus */
        focus: () => void;
        /** Get selected blocks */
        getNodes: () => NodeEntry<TElement & {
            id: string;
        }>[];
        /** Check if a block is selected. */
        has: (id: string[] | string) => boolean;
        /** Check if a block is selectable. */
        isSelectable: (element: TElement, path: Path) => boolean;
        /** Arrow-based move selection */
        moveSelection: (direction: 'down' | 'up') => void;
        /** Reset selected block ids. @deprecated Use `clear` instead. */
        resetSelectedIds: () => void;
        /** Select all selectable blocks */
        selectAll: () => void;
        /** Set a block to be selected. */
        set: (id: string[] | string) => void;
        /** Shift-based expand/shrink selection */
        shiftSelection: (direction: 'down' | 'up') => void;
        /** Deselect all blocks. @deprecated Use `deselect` instead. */
        unselect: () => void;
    };
}, {}, {
    /** Check if a block is selected by id */
    isSelected?: (id?: string) => boolean;
    /** Check if any blocks are selected */
    isSelectingSome?: () => boolean;
}>;
declare const BlockSelectionPlugin: _udecode_plate_core_react.PlatePlugin<PluginConfig<"blockSelection", {
    anchorId?: string | null;
    areaOptions?: PartialSelectionOptions;
    editorPaddingRight?: CSSProperties["width"];
    enableContextMenu?: boolean;
    isSelecting?: boolean;
    isSelectionAreaVisible?: boolean;
    rightSelectionAreaClassName?: string;
    selectedIds?: Set<string>;
    shadowInputRef?: React.RefObject<HTMLInputElement | null>;
    /** Check if a block is selectable */
    isSelectable?: (element: TElement, path: Path) => boolean;
    onKeyDownSelecting?: (e: KeyboardEvent) => void;
}, {
    blockSelection: {
        /** Set selected block ids */
        setSelectedIds: OmitFirst<typeof setSelectedIds>;
        /** Add a block to the selection. */
        add: (id: string[] | string) => void;
        /**
         * Select a block by id, with optional delay and clear options.
         *
         * @deprecated Use `add` or `set` instead.
         */
        addSelectedRow: (id: string, options?: {
            clear?: boolean;
            delay?: number;
        }) => void;
        /** Clear block selection */
        clear: () => void;
        /** Delete a block from the selection. */
        delete: (id: string[] | string) => void;
        /** Deselect all blocks */
        deselect: () => void;
        /** Focus block selection – that differs from the editor focus */
        focus: () => void;
        /** Get selected blocks */
        getNodes: () => NodeEntry<TElement & {
            id: string;
        }>[];
        /** Check if a block is selected. */
        has: (id: string[] | string) => boolean;
        /** Check if a block is selectable. */
        isSelectable: (element: TElement, path: Path) => boolean;
        /** Arrow-based move selection */
        moveSelection: (direction: "down" | "up") => void;
        /** Reset selected block ids. @deprecated Use `clear` instead. */
        resetSelectedIds: () => void;
        /** Select all selectable blocks */
        selectAll: () => void;
        /** Set a block to be selected. */
        set: (id: string[] | string) => void;
        /** Shift-based expand/shrink selection */
        shiftSelection: (direction: "down" | "up") => void;
        /** Deselect all blocks. @deprecated Use `deselect` instead. */
        unselect: () => void;
    };
} & Record<"blockSelection", Partial<{
    /** Set selected block ids */
    setSelectedIds: OmitFirst<typeof setSelectedIds>;
    /** Add a block to the selection. */
    add: (id: string[] | string) => void;
    /**
     * Select a block by id, with optional delay and clear options.
     *
     * @deprecated Use `add` or `set` instead.
     */
    addSelectedRow: (id: string, options?: {
        clear?: boolean;
        delay?: number;
    }) => void;
    /** Clear block selection */
    clear: () => void;
    /** Delete a block from the selection. */
    delete: (id: string[] | string) => void;
    /** Deselect all blocks */
    deselect: () => void;
    /** Focus block selection – that differs from the editor focus */
    focus: () => void;
    /** Get selected blocks */
    getNodes: () => NodeEntry<TElement & {
        id: string;
    }>[];
    /** Check if a block is selected. */
    has: (id: string[] | string) => boolean;
    /** Check if a block is selectable. */
    isSelectable: (element: TElement, path: Path) => boolean;
    /** Arrow-based move selection */
    moveSelection: (direction: "down" | "up") => void;
    /** Reset selected block ids. @deprecated Use `clear` instead. */
    resetSelectedIds: () => void;
    /** Select all selectable blocks */
    selectAll: () => void;
    /** Set a block to be selected. */
    set: (id: string[] | string) => void;
    /** Shift-based expand/shrink selection */
    shiftSelection: (direction: "down" | "up") => void;
    /** Deselect all blocks. @deprecated Use `deselect` instead. */
    unselect: () => void;
}>>, Record<"blockSelection", {
    /** Duplicate selected blocks */
    duplicate: () => void;
    /** Insert blocks and select */
    insertBlocksAndSelect: (nodes: TElement[], args_1: {
        at: Path;
    }) => void;
    /** Remove selected blocks */
    removeNodes: () => void;
    /** Set selection based on block selection */
    select: () => void;
    /**
     * Selects blocks in the editor based on the provided block ID.
     *
     * Uses block selection if any blocks are selected, otherwise falls back to
     * editor selection. If the provided block ID is already in the current
     * selection, maintains the existing selection. Otherwise, clears the
     * current selection and selects only the specified block.
     */
    selectBlocks: (at: Path | _udecode_slate.TNode) => void;
    /** Set block indent */
    setIndent: (indent: number, options?: _udecode_slate.SetNodesOptions | undefined) => void;
    /** Set nodes on selected blocks */
    setNodes: (props: Partial<Omit<TElement, "children">>, options?: _udecode_slate.SetNodesOptions | undefined) => void;
    /** Set texts on selected blocks */
    setTexts: (props: Partial<Omit<_udecode_slate.TText, "text">>, options?: Omit<_udecode_slate.SetNodesOptions, "at"> | undefined) => void;
}>, {
    /** Check if a block is selected by id */
    isSelected?: (id?: string) => boolean;
    /** Check if any blocks are selected */
    isSelectingSome?: () => boolean;
}>>;

type CaretPosition = {
    height: number;
    left: number;
    top: number;
};
type CursorData = {
    selectionStyle?: React.CSSProperties;
    style?: React.CSSProperties;
};
interface CursorOverlayState<TCursorData extends Record<string, unknown>> extends CursorState<TCursorData> {
    caretPosition: CaretPosition | null;
    selectionRects: SelectionRect[];
}
type CursorState<TCursorData extends UnknownObject = UnknownObject> = {
    id: any;
    selection: TRange | null;
    data?: TCursorData;
};
type SelectionRect = {
    height: number;
    left: number;
    top: number;
    width: number;
};

type CursorOverlayConfig = PluginConfig<'cursorOverlay', {
    cursors: Record<string, CursorState<CursorData>>;
}, {
    cursorOverlay: {
        addCursor: (id: string, cursor: Omit<CursorState<CursorData>, 'id'>) => void;
        removeCursor: (id: (string & {}) | 'drag' | 'selection') => void;
    };
}>;
declare const CursorOverlayPlugin: _udecode_plate_core_react.PlatePlugin<PluginConfig<"cursorOverlay", {
    cursors: Record<string, CursorState<CursorData>>;
}, {
    cursorOverlay: {
        addCursor: (id: string, cursor: Omit<CursorState<CursorData>, "id">) => void;
        removeCursor: (id: (string & {}) | "drag" | "selection") => void;
    };
} & Record<"cursorOverlay", {
    addCursor: (id: string, cursor: Omit<CursorState<CursorData>, "id">) => void;
    removeCursor: (id: (string & {}) | "drag" | "selection") => void;
}>, {}, {}>>;

declare const onKeyDownSelection: KeyboardHandler<BlockSelectionConfig>;

declare const BlockSelectionAfterEditable: EditableSiblingComponent;

declare const useBlockSelectable: () => {
    props: {
        className: string;
        onContextMenu: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    } | {
        className?: undefined;
        onContextMenu?: undefined;
    };
};

declare const useBlockSelected: (_id?: string) => any;

declare function useBlockSelectionNodes(): _udecode_slate.NodeEntry<TElement>[];
declare function useBlockSelectionFragment(): TElement[];
declare function useBlockSelectionFragmentProp(options?: Omit<EditorPropOptions, 'nodes'>): string | undefined;

type UseCursorOverlayOptions = {
    /**
     * Minimum width of a selection rect.
     *
     * @default 1
     */
    minSelectionWidth?: number;
    /**
     * Whether to refresh the cursor overlay positions on container resize.
     *
     * @default true
     */
    refreshOnResize?: boolean;
};
declare const FROZEN_EMPTY_ARRAY: SelectionRect[];
declare const useCursorOverlay: <TCursorData extends UnknownObject>({ minSelectionWidth, refreshOnResize, }?: UseCursorOverlayOptions) => {
    cursors: CursorOverlayState<TCursorData>[];
    refresh: () => void;
};

declare const isSelectingOrFocused: (editor: PlateEditor) => any;
declare const useIsSelecting: () => any;

interface UseRefreshOnResizeOptions {
    selectionRectCache: React.MutableRefObject<WeakMap<TRange, SelectionRect[]>>;
    containerRef?: React.RefObject<HTMLElement | null>;
    refreshOnResize?: boolean;
}
declare const useRefreshOnResize: ({ containerRef, refreshOnResize, selectionRectCache, }: UseRefreshOnResizeOptions) => {
    refresh: (sync?: boolean) => void;
};

declare const useRequestReRender: () => (immediate?: boolean) => void;

declare const useSelectionArea: () => void;

/** Get the caret position of a range from selectionRects. */
declare const getCaretPosition: (selectionRects: SelectionRect[], range: TRange) => CaretPosition | null;

/** Get cursor overlay state from selection rects. */
declare const getCursorOverlayState: <TCursorData extends UnknownObject = UnknownObject>({ cursors: cursorStates, selectionRects, }: {
    cursors: Record<string, CursorState<TCursorData>>;
    selectionRects: Record<string, SelectionRect[]>;
}) => CursorOverlayState<TCursorData>[];

declare const getSelectionRects: (editor: Editor, { range, xOffset, yOffset, }: {
    range: TRange;
    xOffset: number;
    yOffset: number;
}) => SelectionRect[];

declare const duplicateBlockSelectionNodes: (editor: PlateEditor) => void;

declare const insertBlocksAndSelect: (editor: PlateEditor, nodes: TElement[], { at }: {
    at: Path;
}) => void;

declare const removeBlockSelectionNodes: (editor: SlateEditor) => void;

declare const selectBlockSelectionNodes: (editor: SlateEditor) => void;

declare const setBlockSelectionNodes: (editor: PlateEditor, props: Partial<NodeProps<TElement>>, options?: SetNodesOptions) => void;
declare const setBlockSelectionIndent: (editor: PlateEditor, indent: number, options?: SetNodesOptions) => void;
declare const setBlockSelectionTexts: (editor: PlateEditor, props: Partial<NodeProps<TText>>, options?: Omit<SetNodesOptions, "at">) => void;

declare const copySelectedBlocks: (editor: SlateEditor) => void;

declare const pasteSelectedBlocks: (editor: SlateEditor, e: ClipboardEvent) => void;

/** Select inserted blocks from the last operations. */
declare const selectInsertedBlocks: (editor: SlateEditor) => void;

export { BLOCK_CONTEXT_MENU_ID, type BlockMenuConfig, BlockMenuPlugin, BlockSelectionAfterEditable, type BlockSelectionConfig, BlockSelectionPlugin, type CaretPosition, type CursorData, type CursorOverlayConfig, CursorOverlayPlugin, type CursorOverlayState, type CursorState, FROZEN_EMPTY_ARRAY, type SelectionRect, type UseCursorOverlayOptions, type UseRefreshOnResizeOptions, copySelectedBlocks, duplicateBlockSelectionNodes, getCaretPosition, getCursorOverlayState, getSelectionRects, insertBlocksAndSelect, isSelectingOrFocused, onKeyDownSelection, pasteSelectedBlocks, removeBlockSelectionNodes, selectBlockSelectionNodes, selectInsertedBlocks, setBlockSelectionIndent, setBlockSelectionNodes, setBlockSelectionTexts, useBlockSelectable, useBlockSelected, useBlockSelectionFragment, useBlockSelectionFragmentProp, useBlockSelectionNodes, useCursorOverlay, useIsSelecting, useRefreshOnResize, useRequestReRender, useSelectionArea };
