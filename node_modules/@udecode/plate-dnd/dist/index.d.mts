import * as _udecode_plate_core_react from '@udecode/plate-core/react';
import { TElement, PluginConfig, Path, NodeEntry, Editor, EditorNodesOptions, ValueOf } from '@udecode/plate';
import * as react_dnd from 'react-dnd';
import { DropTargetMonitor, DragSourceHookSpec, DropTargetHookSpec, ConnectDragSource } from 'react-dnd';
import { PlateEditor } from '@udecode/plate/react';
import React from 'react';
import * as _udecode_slate from '@udecode/slate';

type DragItemNode = ElementDragItemNode | FileDragItemNode;
type DropDirection = 'bottom' | 'left' | 'right' | 'top' | undefined;
type DropLineDirection = '' | 'bottom' | 'left' | 'right' | 'top';
interface ElementDragItemNode {
    /** Required to identify the node. */
    id: string;
    [key: string]: unknown;
    element: TElement;
}
interface FileDragItemNode {
    dataTransfer: DataTransfer[];
    files: FileList;
    items: DataTransferItemList;
}

interface ScrollAreaProps {
    placement: 'bottom' | 'top';
    containerRef?: React.RefObject<any>;
    enabled?: boolean;
    height?: number;
    minStrength?: number;
    scrollAreaProps?: React.HTMLAttributes<HTMLDivElement>;
    strengthMultiplier?: number;
    zIndex?: number;
}
declare function ScrollArea({ containerRef, enabled, height, minStrength, placement, scrollAreaProps, strengthMultiplier, zIndex, }: ScrollAreaProps): React.JSX.Element | null;

type ScrollerProps = Omit<ScrollAreaProps, 'placement'>;
/**
 * Set up an edge scroller at the top of the page for scrolling up. One at the
 * bottom for scrolling down.
 */
declare function Scroller(props: ScrollerProps): React.JSX.Element;

declare function DndScroller(props: Partial<ScrollerProps>): React.JSX.Element;

declare const DRAG_ITEM_BLOCK = "block";
type DndConfig = PluginConfig<'dnd', {
    draggingId?: string | null;
    dropTarget?: {
        id: string | null;
        line: DropLineDirection;
    };
    enableScroller?: boolean;
    isDragging?: boolean;
    scrollerProps?: Partial<ScrollerProps>;
    onDropFiles?: (props: {
        id: string;
        dragItem: FileDragItemNode;
        editor: PlateEditor;
        monitor: DropTargetMonitor<DragItemNode, unknown>;
        nodeRef: any;
        target?: Path;
    }) => void;
}>;
declare const DndPlugin: _udecode_plate_core_react.PlatePlugin<PluginConfig<"dnd", {
    draggingId?: string | null;
    dropTarget?: {
        id: string | null;
        line: DropLineDirection;
    };
    enableScroller?: boolean;
    isDragging?: boolean;
    scrollerProps?: Partial<ScrollerProps>;
    onDropFiles?: (props: {
        id: string;
        dragItem: FileDragItemNode;
        editor: PlateEditor;
        monitor: DropTargetMonitor<DragItemNode, unknown>;
        nodeRef: any;
        target?: Path;
    }) => void;
}, {}, {}, {}>>;

type DraggableState = {
    isDragging: boolean;
    /** The ref of the draggable element */
    previewRef: React.RefObject<HTMLDivElement | null>;
    /** The ref of the draggable handle */
    handleRef: (elementOrNode: Element | React.ReactElement<any> | React.RefObject<any> | null) => void;
};
declare const useDraggable: (props: UseDndNodeOptions) => DraggableState;

declare const useDropLine: ({ id: idProp, orientation, }?: {
    /** The id of the element to show the dropline for. */
    id?: string;
    orientation?: "horizontal" | "vertical";
}) => {
    dropLine?: DropLineDirection;
};

interface UseDragNodeOptions extends DragSourceHookSpec<DragItemNode, unknown, {
    isDragging: boolean;
}> {
    element: TElement;
}
/**
 * `useDrag` hook to drag a node from the editor. `item` with `id` is required.
 *
 * On drag start:
 *
 * - Set `isDragging` to true
 * - Add `dragging` class to `body`
 *
 * On drag end:
 *
 * - Set `isDragging` to false
 * - Remove `dragging` class to `body`
 *
 * Collect:
 *
 * - IsDragging: true if mouse is dragging the block
 */
declare const useDragNode: (editor: PlateEditor, { element: staleElement, item, ...options }: UseDragNodeOptions) => [{
    isDragging: boolean;
}, react_dnd.ConnectDragSource, react_dnd.ConnectDragPreview];

type CanDropCallback = (args: {
    dragEntry: NodeEntry<TElement>;
    dragItem: DragItemNode;
    dropEntry: NodeEntry<TElement>;
    editor: PlateEditor;
}) => boolean;
interface UseDropNodeOptions extends DropTargetHookSpec<DragItemNode, unknown, {
    isOver: boolean;
}> {
    /** The node to which the drop line is attached. */
    element: TElement;
    /** The reference to the node being dragged. */
    nodeRef: any;
    /**
     * Intercepts the drop handling. If `false` is returned, the default drop
     * behavior is called after. If `true` is returned, the default behavior is
     * not called.
     */
    canDropNode?: CanDropCallback;
    orientation?: 'horizontal' | 'vertical';
    onDropHandler?: (editor: PlateEditor, props: {
        id: string;
        dragItem: DragItemNode;
        monitor: DropTargetMonitor<DragItemNode, unknown>;
        nodeRef: any;
    }) => boolean | void;
}
/**
 * `useDrop` hook to drop a node on the editor.
 *
 * On drop:
 *
 * - Get hover direction (top, bottom or undefined), return early if undefined
 * - DragPath: find node with id = dragItem.id, return early if not found
 * - Focus editor
 * - DropPath: find node with id = id, its path should be next (bottom) or
 *   previous (top)
 * - Move node from dragPath to dropPath
 *
 * On hover:
 *
 * - Get drop line direction
 * - If differs from dropLine, setDropLine is called
 *
 * Collect:
 *
 * - IsOver: true if mouse is over the block
 */
declare const useDropNode: (editor: PlateEditor, { canDropNode, element, nodeRef, orientation, onDropHandler, ...options }: UseDropNodeOptions) => [{
    isOver: boolean;
}, react_dnd.ConnectDropTarget];

type UseDndNodeOptions = Pick<UseDropNodeOptions, 'element'> & Partial<Pick<UseDropNodeOptions, 'canDropNode' | 'nodeRef'>> & Partial<Pick<UseDragNodeOptions, 'type'>> & {
    /** Options passed to the drag hook. */
    drag?: Partial<Omit<UseDragNodeOptions, 'type'>>;
    /** Options passed to the drop hook, excluding element, nodeRef. */
    drop?: Partial<Omit<UseDropNodeOptions, 'canDropNode' | 'element' | 'nodeRef'>>;
    /** Orientation of the drag and drop interaction. */
    orientation?: 'horizontal' | 'vertical';
    preview?: {
        /** Whether to disable the preview. */
        disable?: boolean;
        /** The reference to the preview element. */
        ref?: any;
    };
    onDropHandler?: (editor: PlateEditor, props: {
        id: string;
        dragItem: DragItemNode;
        monitor: DropTargetMonitor<DragItemNode, unknown>;
        nodeRef: any;
    }) => boolean | void;
};
/**
 * {@link useDragNode} and {@link useDropNode} hooks to drag and drop a node from
 * the editor. A default preview is used to show the node being dragged, which
 * can be customized or removed. Returns the drag ref and drop line direction.
 */
declare const useDndNode: ({ canDropNode, drag: dragOptions, drop: dropOptions, element, nodeRef, orientation, preview: previewOptions, type, onDropHandler, }: UseDndNodeOptions) => {
    dragRef: ConnectDragSource;
    isDragging: boolean;
    isOver: boolean;
};

/** Get blocks with an id */
declare const getBlocksWithId: <E extends Editor>(editor: E, options: EditorNodesOptions<ValueOf<E>>) => _udecode_slate.NodeEntry<_udecode_slate.TElement | _udecode_slate.TText>[];

/** Select the start of a block by id and focus the editor. */
declare const focusBlockStartById: (editor: Editor, id: string) => void;

/** Callback called on drag and drop a node with id. */
declare const getDropPath: (editor: PlateEditor, { canDropNode, dragItem, element, monitor, nodeRef, orientation, }: {
    dragItem: DragItemNode;
    monitor: DropTargetMonitor;
} & Pick<UseDropNodeOptions, "canDropNode" | "element" | "nodeRef" | "orientation">) => {
    direction: "bottom" | "left" | "right" | "top";
    dragPath: Path | undefined;
    to: Path;
} | undefined;
declare const onDropNode: (editor: PlateEditor, { canDropNode, dragItem, element, monitor, nodeRef, orientation, }: {
    dragItem: ElementDragItemNode;
    monitor: DropTargetMonitor;
} & Pick<UseDropNodeOptions, "canDropNode" | "element" | "nodeRef" | "orientation">) => void;

/** Callback called when dragging a node and hovering nodes. */
declare const onHoverNode: (editor: PlateEditor, { canDropNode, dragItem, element, monitor, nodeRef, orientation, }: {
    dragItem: DragItemNode;
    monitor: DropTargetMonitor;
} & Pick<UseDropNodeOptions, "canDropNode" | "element" | "nodeRef" | "orientation">) => void;

/** Remove blocks with an id and focus the editor. */
declare const removeBlocksAndFocus: <E extends Editor = Editor>(editor: E, options: EditorNodesOptions<ValueOf<E>>) => void;

/** Select the block above the selection by id and focus the editor. */
declare const selectBlockById: (editor: Editor, id: string) => void;

/**
 * Select blocks by selection or by id. If the block with id is not selected,
 * select the block with id. Else, select the blocks above the selection.
 */
declare const selectBlocksBySelectionOrId: (editor: PlateEditor, id: string) => void;

interface GetHoverDirectionOptions {
    dragItem: DragItemNode;
    /** Hovering node. */
    element: TElement;
    monitor: DropTargetMonitor;
    /** The node ref of the node being dragged. */
    nodeRef: any;
    /** The orientation of the drag operation. */
    orientation?: 'horizontal' | 'vertical';
}
/**
 * If dragging a node A over another node B: get the direction of node A
 * relative to node B.
 */
declare const getHoverDirection: ({ dragItem, element, monitor, nodeRef, orientation, }: GetHoverDirectionOptions) => DropDirection;

/** Get new direction if updated */

declare const getNewDirection: (previousDir: string, dir?: string) => DropLineDirection | undefined;

export { type CanDropCallback, DRAG_ITEM_BLOCK, type DndConfig, DndPlugin, DndScroller, type DragItemNode, type DraggableState, type DropDirection, type DropLineDirection, type ElementDragItemNode, type FileDragItemNode, type GetHoverDirectionOptions, ScrollArea, type ScrollAreaProps, Scroller, type ScrollerProps, type UseDndNodeOptions, type UseDragNodeOptions, type UseDropNodeOptions, focusBlockStartById, getBlocksWithId, getDropPath, getHoverDirection, getNewDirection, onDropNode, onHoverNode, removeBlocksAndFocus, selectBlockById, selectBlocksBySelectionOrId, useDndNode, useDragNode, useDraggable, useDropLine, useDropNode };
