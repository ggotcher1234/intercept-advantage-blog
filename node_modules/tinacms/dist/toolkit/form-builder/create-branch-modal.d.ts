import * as React from 'react';
export declare const CreateBranchModal: ({ close, safeSubmit, path, values, crudType, }: {
    safeSubmit: () => Promise<void>;
    close: () => void;
    path: string;
    values: Record<string, unknown>;
    crudType: string;
}) => React.JSX.Element;
export declare const PrefixedTextField: ({ label, prefix, ...props }: {
    [x: string]: any;
    label?: any;
    prefix?: string;
}) => React.JSX.Element;
