import { PluginConfig, SlatePlugin, Path } from '@udecode/plate';

type HeadingConfig = PluginConfig<'heading', {
    /** Heading levels supported from 1 to `levels` */
    levels?: HeadingLevel | HeadingLevel[];
}>;
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
/** Enables support for headings with configurable levels (from 1 to 6). */
declare const BaseHeadingPlugin: SlatePlugin<PluginConfig<"heading", {
    /** Heading levels supported from 1 to `levels` */
    levels?: HeadingLevel | HeadingLevel[];
}, {}, {}, {}>>;

interface Heading {
    id: string;
    depth: number;
    path: Path;
    title: string;
    type: string;
}

export { BaseHeadingPlugin as B, type Heading as H, type HeadingConfig as a, type HeadingLevel as b };
