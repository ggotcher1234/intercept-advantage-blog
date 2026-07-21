import React from 'react';
export interface DropResult {
    destination: {
        index: number;
    } | null;
    source: {
        index: number;
    };
    type: string;
}
export interface DragDropContextProps {
    onDragEnd: (result: DropResult) => void;
    children: React.ReactNode;
}
export interface DroppableProps {
    droppableId: string;
    type: string;
    children: (provided: {
        innerRef: React.RefObject<HTMLDivElement>;
        placeholder: React.ReactNode;
    }) => React.ReactNode;
}
export interface DraggableProps {
    draggableId: string;
    index: number;
    children: (provided: {
        innerRef: React.RefObject<HTMLElement>;
        draggableProps: {
            style?: React.CSSProperties;
            ref?: any;
            [key: string]: any;
        };
        dragHandleProps: {
            style?: React.CSSProperties;
            [key: string]: any;
        };
    }, snapshot: {
        isDragging: boolean;
    }) => React.ReactNode;
}
export declare const DragDropContext: React.FC<DragDropContextProps>;
export declare const Droppable: React.FC<DroppableProps>;
export declare const Draggable: React.FC<DraggableProps>;
interface SortableProviderProps {
    items: string[];
    children: React.ReactNode;
}
export declare const SortableProvider: React.FC<SortableProviderProps>;
export {};
