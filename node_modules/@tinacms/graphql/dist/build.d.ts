/**

*/
import { type DocumentNode } from 'graphql';
import type { TinaSchema, Config } from '@tinacms/schema-tools';
export declare const buildDotTinaFiles: ({ config, flags, buildSDK, }: {
    config: Config;
    flags?: string[];
    buildSDK?: boolean;
}) => Promise<{
    graphQLSchema: DocumentNode;
    tinaSchema: TinaSchema;
    lookup: Record<string, import("./database").LookupMapType>;
    fragDoc: string;
    queryDoc: string;
}>;
