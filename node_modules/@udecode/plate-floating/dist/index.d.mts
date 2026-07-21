import { ClientRectObject } from '@floating-ui/core';
import * as _floating_ui_react from '@floating-ui/react';
import { VirtualElement, UseFloatingOptions, ReferenceType, UseFloatingReturn } from '@floating-ui/react';
export { AlignedPlacement, AutoUpdateOptions, Axis, Boundary, ClientRectObject, ComputePositionConfig, ComputePositionReturn, ContextData, Coords, DetectOverflowOptions, Dimensions, ElementContext, ElementProps, ElementRects, Elements, ExtendedRefs, FloatingArrow, FloatingContext, FloatingDelayGroup, FloatingElement, FloatingEvents, FloatingFocusManager, FloatingNode, FloatingNodeType, FloatingOverlay, FloatingPortal, FloatingTree, FloatingTreeType, Length, Middleware, MiddlewareData, MiddlewareReturn, NodeScroll, Padding, Placement, Platform, Rect, ReferenceElement, ReferenceType, RootBoundary, Side, SideObject, SizeOptions, Strategy, UseFloatingData, UseFloatingOptions, UseFloatingReturn, VirtualElement, arrow, autoPlacement, autoUpdate, computePosition, detectOverflow, flip, getOverflowAncestors, hide, inline, limitShift, offset, safePolygon, shift, size, useClick, useDelayGroup, useDelayGroupContext, useDismiss, useFloating, useFloatingNodeId, useFloatingParentNodeId, useFloatingPortalNode, useFloatingTree, useFocus, useHover, useId, useInteractions, useListNavigation, useRole, useTypeahead } from '@floating-ui/react';
import * as _udecode_react_utils from '@udecode/react-utils';
import React from 'react';
import { Editor, TLocation, TRange } from '@udecode/plate';
import { PlateEditor } from '@udecode/plate/react';

declare const getDefaultBoundingClientRect: () => ClientRectObject;
declare const createVirtualElement: () => VirtualElement;

interface UseVirtualFloatingOptions extends Partial<UseFloatingOptions> {
    open?: boolean;
    getBoundingClientRect?: () => ClientRectObject;
}
interface UseVirtualFloatingReturn<RT extends ReferenceType = ReferenceType> extends UseFloatingReturn<RT> {
    style: React.CSSProperties;
    virtualElementRef: React.MutableRefObject<VirtualElement>;
}
/**
 * `useFloating` with a controlled virtual element. Used to follow cursor
 * position.
 *
 * Default options:
 *
 * - `whileElementsMounted: autoUpdate`
 *
 * Additional options:
 *
 * - `getBoundingClientRect` to get the bounding client rect.
 * - `hidden` to hide the floating element
 *
 * Additional returns:
 *
 * - `style` to apply to the floating element
 * - `virtualElementRef`
 *
 * @see useFloating
 * @see https://floating-ui.com/docs/react-dom#virtual-element
 */
declare const useVirtualFloating: <RT extends ReferenceType = ReferenceType>({ getBoundingClientRect, ...floatingOptions }: UseVirtualFloatingOptions) => UseVirtualFloatingReturn<RT>;

type FloatingToolbarState = {
    floatingOptions?: UseVirtualFloatingOptions;
    hideToolbar?: boolean;
    showWhenReadOnly?: boolean;
};
declare const useFloatingToolbarState: ({ editorId, floatingOptions, focusedEditorId, hideToolbar, showWhenReadOnly, }: {
    editorId: string;
    focusedEditorId: string | null;
} & FloatingToolbarState) => {
    editorId: string;
    floating: UseVirtualFloatingReturn<_floating_ui_react.ReferenceType>;
    focused: boolean;
    focusedEditorId: string | null;
    hideToolbar: boolean | undefined;
    mousedown: boolean;
    open: boolean;
    readOnly: boolean;
    selectionExpanded: boolean;
    selectionText: string;
    setMousedown: React.Dispatch<React.SetStateAction<boolean>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setWaitForCollapsedSelection: React.Dispatch<React.SetStateAction<boolean>>;
    showWhenReadOnly: boolean | undefined;
    waitForCollapsedSelection: boolean;
};
declare const useFloatingToolbar: ({ editorId, floating, focusedEditorId, hideToolbar, mousedown, open, readOnly, selectionExpanded, selectionText, setMousedown, setOpen, setWaitForCollapsedSelection, showWhenReadOnly, waitForCollapsedSelection, }: ReturnType<typeof useFloatingToolbarState>) => {
    clickOutsideRef: _udecode_react_utils.UseOnClickOutsideReturn;
    hidden: boolean;
    props: {
        style: React.CSSProperties;
    };
    ref: ((node: HTMLElement | null) => void) & ((node: HTMLElement | null) => void);
};

type VirtualRef = React.RefObject<Pick<HTMLElement, 'getBoundingClientRect'> | null>;
declare const createVirtualRef: (editor: Editor, at?: TLocation | TLocation[], { fallbackRect, }?: {
    fallbackRect?: ClientRect;
}) => VirtualRef;

declare const getBoundingClientRect: (editor: Editor, at?: TLocation | TLocation[]) => DOMRect | undefined;

/** Get bounding client rect of the editor selection */
declare const getDOMSelectionBoundingClientRect: () => ClientRectObject;

/** Get bounding client rect by slate range */
declare const getRangeBoundingClientRect: (editor: Editor, at: TRange | null) => ClientRectObject;

/** Get bounding client rect of the editor selection */
declare const getSelectionBoundingClientRect: (editor: PlateEditor) => ClientRectObject;

declare const makeClientRect: ({ bottom, left, right, top, }: {
    bottom: number;
    left: number;
    right: number;
    top: number;
}) => DOMRect;

declare const mergeClientRects: (clientRects: DOMRect[]) => DOMRect;

export { type FloatingToolbarState, type UseVirtualFloatingOptions, type UseVirtualFloatingReturn, type VirtualRef, createVirtualElement, createVirtualRef, getBoundingClientRect, getDOMSelectionBoundingClientRect, getDefaultBoundingClientRect, getRangeBoundingClientRect, getSelectionBoundingClientRect, makeClientRect, mergeClientRects, useFloatingToolbar, useFloatingToolbarState, useVirtualFloating };
