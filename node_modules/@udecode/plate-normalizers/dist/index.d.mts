import * as _udecode_plate_core from '@udecode/plate-core';
import { PluginConfig, Path, OverrideEditor } from '@udecode/plate';

type NormalizeTypesConfig = PluginConfig<'normalizeTypes', {
    /**
     * Set of rules for the types. For each rule, provide a `path` and either
     * `strictType` or `type`. If there is no node existing at `path`: insert a
     * node with `strictType`. If there is a node existing at `path` but its
     * type is not `strictType` or `type`: set the node type to `strictType` or
     * `type`.
     */
    rules?: Rule[];
    onError?: (err: any) => void;
}>;
interface Rule {
    /** Path where the rule applies */
    path: Path;
    /** Force the type of the node at the given path */
    strictType?: string;
    /** Type of the inserted node at the given path if `strictType` is not provided */
    type?: string;
}
/** @see {@link withNormalizeTypes} */
declare const NormalizeTypesPlugin: _udecode_plate_core.SlatePlugin<NormalizeTypesConfig>;

type RemoveEmptyNodesConfig = PluginConfig<'removeEmptyNodes', {
    types?: string[] | string;
}>;
/** @see {@link withRemoveEmptyNodes} */
declare const RemoveEmptyNodesPlugin: _udecode_plate_core.SlatePlugin<RemoveEmptyNodesConfig>;

declare const withNormalizeTypes: OverrideEditor<NormalizeTypesConfig>;

/** Remove nodes with empty text. */
declare const withRemoveEmptyNodes: OverrideEditor<RemoveEmptyNodesConfig>;

export { type NormalizeTypesConfig, NormalizeTypesPlugin, type RemoveEmptyNodesConfig, RemoveEmptyNodesPlugin, withNormalizeTypes, withRemoveEmptyNodes };
