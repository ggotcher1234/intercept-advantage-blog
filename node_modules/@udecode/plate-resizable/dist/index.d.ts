import * as csstype from 'csstype';
import React from 'react';
import * as jotai from 'jotai';
import * as jotai_x from 'jotai-x';
import { TElement } from '@udecode/plate';

type ResizeDirection = 'bottom' | 'left' | 'right' | 'top';
type ResizeEvent = {
    delta: ResizeLengthStatic;
    direction: ResizeDirection;
    finished: boolean;
    initialSize: ResizeLengthStatic;
};
type ResizeLength = ResizeLengthRelative | ResizeLengthStatic;
type ResizeLengthRelative = string;
type ResizeLengthStatic = number;

interface ResizableOptions {
    /** Node alignment. */
    align?: 'center' | 'left' | 'right';
    maxWidth?: ResizeLength;
    minWidth?: ResizeLength;
    readOnly?: boolean;
}
declare const useResizableState: ({ align, maxWidth, minWidth, }?: ResizableOptions) => {
    align: "left" | "right" | "center";
    maxWidth: ResizeLength;
    minWidth: ResizeLength;
    setNodeWidth: (w: number) => void;
    setWidth: (args_0: csstype.Property.Width<string | number> | undefined) => void;
    width: csstype.Property.Width<string | number> | undefined;
};
declare const useResizable: ({ align, maxWidth, minWidth, setNodeWidth, setWidth, width, }: ReturnType<typeof useResizableState>) => {
    context: {
        onResize: ({ delta, direction, finished, initialSize }: ResizeEvent) => void;
    };
    props: {
        style: React.CSSProperties;
    };
    wrapperProps: {
        style: React.CSSProperties;
    };
    wrapperRef: React.RefObject<HTMLDivElement | null>;
};
declare const Resizable: React.ForwardRefExoticComponent<{
    options: ResizableOptions;
} & React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>>;

type ResizeHandleStoreState = {
    onResize: (event: ResizeEvent) => void;
};
declare const ResizeHandleProvider: React.FC<jotai_x.ProviderProps<{
    onResize: (event: ResizeEvent) => void;
}>>;
declare const useResizeHandleSet: <K extends "onResize">(key: K, options?: string | jotai_x.UseAtomOptions) => ({
    onResize: jotai_x.SimpleWritableAtom<(event: ResizeEvent) => void>;
} & object)[K] extends jotai.WritableAtom<infer _V, infer A extends unknown[], infer R> ? (...args: A) => R : never;
declare const useResizeHandleStore: jotai_x.UseStoreApi<ResizeHandleStoreState, object>;
declare const useResizeHandleValue: <K extends "onResize", S = ({
    onResize: jotai_x.SimpleWritableAtom<(event: ResizeEvent) => void>;
} & object)[K] extends jotai.Atom<infer V> ? V : never>(key: K, options?: ({
    selector?: ((v: ({
        onResize: jotai_x.SimpleWritableAtom<(event: ResizeEvent) => void>;
    } & object)[K] extends jotai.Atom<infer V_1> ? V_1 : never, prevSelectorOutput?: S | undefined) => S) | undefined;
    equalityFn?: ((prev: S, next: S) => boolean) | undefined;
} & jotai_x.UseAtomOptions) | undefined, deps?: unknown[]) => S;
type ResizeHandleOptions = {
    direction?: ResizeDirection;
    initialSize?: number;
    onHover?: () => void;
    onHoverEnd?: () => void;
    onMouseDown?: React.MouseEventHandler;
    onResize?: (event: ResizeEvent) => void;
    onTouchStart?: React.TouchEventHandler;
};
declare const useResizeHandleState: ({ direction, initialSize: _initialSize, onHover, onHoverEnd, onMouseDown, onResize: onResizeProp, onTouchStart, }: ResizeHandleOptions) => {
    direction: ResizeDirection;
    initialPosition: number;
    initialSize: number;
    isHorizontal: boolean;
    isResizing: boolean;
    readOnly: boolean;
    setInitialPosition: React.Dispatch<React.SetStateAction<number>>;
    setInitialSize: React.Dispatch<React.SetStateAction<number>>;
    setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
    onHover: (() => void) | undefined;
    onHoverEnd: (() => void) | undefined;
    onMouseDown: React.MouseEventHandler<Element> | undefined;
    onResize: (event: ResizeEvent) => void;
    onTouchStart: React.TouchEventHandler<Element> | undefined;
};
declare const useResizeHandle: ({ isHorizontal, isResizing, readOnly, setInitialPosition, setInitialSize, setIsResizing, onHover, onHoverEnd, onMouseDown, onTouchStart, }: ReturnType<typeof useResizeHandleState>) => {
    hidden: boolean;
    props: {
        onMouseDown: React.MouseEventHandler<Element>;
        onMouseOut: () => void;
        onMouseOver: () => void;
        onTouchEnd: () => void;
        onTouchMove: () => void;
        onTouchStart: React.TouchEventHandler<Element>;
    };
};
declare const ResizeHandle: React.ForwardRefExoticComponent<{
    as?: React.ElementType;
    asChild?: boolean;
    className?: string;
    options?: ResizeHandleOptions | undefined;
    state?: {
        direction: ResizeDirection;
        initialPosition: number;
        initialSize: number;
        isHorizontal: boolean;
        isResizing: boolean;
        readOnly: boolean;
        setInitialPosition: React.Dispatch<React.SetStateAction<number>>;
        setInitialSize: React.Dispatch<React.SetStateAction<number>>;
        setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
        onHover: (() => void) | undefined;
        onHoverEnd: (() => void) | undefined;
        onMouseDown: React.MouseEventHandler<Element> | undefined;
        onResize: (event: ResizeEvent) => void;
        onTouchStart: React.TouchEventHandler<Element> | undefined;
    } | undefined;
    style?: React.CSSProperties;
    setProps?: ((hookProps: {
        onMouseDown: React.MouseEventHandler<Element>;
        onMouseOut: () => void;
        onMouseOver: () => void;
        onTouchEnd: () => void;
        onTouchMove: () => void;
        onTouchStart: React.TouchEventHandler<Element>;
    }) => Omit<React.HTMLAttributes<HTMLDivElement>, "onResize">) | undefined;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onResize"> & React.RefAttributes<any>>;
type ResizeHandleProps = React.ComponentPropsWithRef<typeof ResizeHandle>;

interface TResizableElement extends TElement {
    align?: 'center' | 'left' | 'right';
    width?: number;
}

declare const ResizableProvider: React.FC<jotai_x.ProviderProps<{
    width: React.CSSProperties["width"];
}>>;
declare const resizableStore: jotai_x.StoreApi<{
    width: React.CSSProperties["width"];
}, object, "resizable">;
declare const useResizableSet: <K extends "width">(key: K, options?: string | jotai_x.UseAtomOptions) => ({
    width: jotai_x.SimpleWritableAtom<csstype.Property.Width<string | number> | undefined>;
} & object)[K] extends jotai.WritableAtom<infer _V, infer A extends unknown[], infer R> ? (...args: A) => R : never;
declare const useResizableStore: jotai_x.UseStoreApi<{
    width: React.CSSProperties["width"];
}, object>;
declare const useResizableValue: <K extends "width", S = ({
    width: jotai_x.SimpleWritableAtom<csstype.Property.Width<string | number> | undefined>;
} & object)[K] extends jotai.Atom<infer V> ? V : never>(key: K, options?: ({
    selector?: ((v: ({
        width: jotai_x.SimpleWritableAtom<csstype.Property.Width<string | number> | undefined>;
    } & object)[K] extends jotai.Atom<infer V_1> ? V_1 : never, prevSelectorOutput?: S | undefined) => S) | undefined;
    equalityFn?: ((prev: S, next: S) => boolean) | undefined;
} & jotai_x.UseAtomOptions) | undefined, deps?: unknown[]) => S;

declare const isTouchEvent: (event: MouseEvent | TouchEvent) => event is TouchEvent;

interface ResizeLengthClampOptions<T = ResizeLength> {
    max?: T;
    min?: T;
}
declare const resizeLengthClampStatic: (length: ResizeLengthStatic, { max, min }: ResizeLengthClampOptions<ResizeLengthStatic>) => ResizeLengthStatic;
declare const resizeLengthClamp: <T extends ResizeLength>(length: T, parentLength: number, { max, min }: ResizeLengthClampOptions<ResizeLength>) => T;

declare const resizeLengthToRelative: (length: ResizeLength, parentLength: number) => ResizeLengthRelative;

declare const resizeLengthToStatic: (length: ResizeLength, parentLength: number) => ResizeLengthStatic;

export { Resizable, type ResizableOptions, ResizableProvider, type ResizeDirection, type ResizeEvent, ResizeHandle, type ResizeHandleOptions, type ResizeHandleProps, ResizeHandleProvider, type ResizeHandleStoreState, type ResizeLength, type ResizeLengthClampOptions, type ResizeLengthRelative, type ResizeLengthStatic, type TResizableElement, isTouchEvent, resizableStore, resizeLengthClamp, resizeLengthClampStatic, resizeLengthToRelative, resizeLengthToStatic, useResizable, useResizableSet, useResizableState, useResizableStore, useResizableValue, useResizeHandle, useResizeHandleSet, useResizeHandleState, useResizeHandleStore, useResizeHandleValue };
