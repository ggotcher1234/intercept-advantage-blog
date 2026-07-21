import * as _udecode_plate_core_react from '@udecode/plate-core/react';
import * as _udecode_plate_core from '@udecode/plate-core';
import { KeyboardHandler } from '@udecode/plate/react';
import { I as IndentConfig } from '../BaseIndentPlugin-TLs6Am33.js';
import '@udecode/plate';

declare const IndentPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"indent", {
    indentMax?: number;
    offset?: number;
    unit?: string;
}, {}, {}, {}>>;

declare const TextIndentPlugin: _udecode_plate_core_react.PlatePlugin<_udecode_plate_core.PluginConfig<"textIndent", {
    indentMax?: number;
    offset?: number;
    unit?: string;
}, {}, {}, {}>>;

declare const onKeyDownIndent: KeyboardHandler<IndentConfig>;

declare const useIndentButton: () => {
    props: {
        onClick: () => void;
        onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
    };
};

declare const useOutdentButton: () => {
    props: {
        onClick: () => void;
        onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void;
    };
};

export { IndentPlugin, TextIndentPlugin, onKeyDownIndent, useIndentButton, useOutdentButton };
