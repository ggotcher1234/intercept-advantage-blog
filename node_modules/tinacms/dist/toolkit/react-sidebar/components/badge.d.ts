import * as React from 'react';
export declare const Badge: ({ children, calloutStyle, className, displayIcon, ...props }: {
    children?: React.ReactNode;
    calloutStyle?: "warning" | "info" | "success" | "error";
    displayIcon?: boolean;
} & React.HTMLProps<HTMLDivElement>) => React.JSX.Element;
