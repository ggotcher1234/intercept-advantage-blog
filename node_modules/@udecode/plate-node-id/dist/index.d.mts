import * as _udecode_plate_core from '@udecode/plate-core';
import { PluginConfig, QueryNodeOptions, OverrideEditor } from '@udecode/plate';

type NodeIdConfig = PluginConfig<'nodeId', {
    /**
     * By default, when a node inserted using editor.tf.insertNode(s) has an id,
     * it will be used instead of the id generator, except if it already exists
     * in the document. Set this option to true to disable this behavior.
     */
    disableInsertOverrides?: boolean;
    /**
     * Filter inline `Element` nodes.
     *
     * @default true
     */
    filterInline?: boolean;
    /**
     * Filter `Text` nodes.
     *
     * @default true
     */
    filterText?: boolean;
    /**
     * Node key to store the id.
     *
     * @default 'id'
     */
    idKey?: string;
    /**
     * Normalize initial value. If false, normalize only the first and last node
     * are missing id. To disable this behavior, use `NodeIdPlugin.configure({
     * normalizeInitialValue: null })`.
     *
     * @default false
     */
    normalizeInitialValue?: boolean;
    /**
     * Reuse ids on undo/redo and copy/pasting if not existing in the document.
     * This is disabled by default to avoid duplicate ids across documents.
     *
     * @default false
     */
    reuseId?: boolean;
    /**
     * ID factory, e.g. `uuid`
     *
     * @default () => Date.now()
     */
    idCreator?: () => any;
} & QueryNodeOptions>;
/** @see {@link withNodeId} */
declare const NodeIdPlugin: _udecode_plate_core.SlatePlugin<NodeIdConfig>;

/** Enables support for inserting nodes with an id key. */
declare const withNodeId: OverrideEditor<NodeIdConfig>;

export { type NodeIdConfig, NodeIdPlugin, withNodeId };
