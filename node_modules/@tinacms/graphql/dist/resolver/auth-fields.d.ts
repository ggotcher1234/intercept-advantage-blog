import type { TinaSchema } from '@tinacms/schema-tools';
import type { GraphQLResolveInfo } from 'graphql';
import type { Resolver } from './index';
export declare function handleAuthenticate({ tinaSchema, resolver, sub, password, ctxUser, }: {
    tinaSchema: TinaSchema;
    resolver: Resolver;
    sub?: string;
    password: string;
    info: GraphQLResolveInfo;
    ctxUser?: {
        sub?: string;
    };
}): Promise<any>;
export declare function handleAuthorize({ tinaSchema, resolver, sub, ctxUser, }: {
    tinaSchema: TinaSchema;
    resolver: Resolver;
    sub?: string;
    info: GraphQLResolveInfo;
    ctxUser?: {
        sub?: string;
    };
}): Promise<any>;
export declare function handleUpdatePassword({ tinaSchema, resolver, password, ctxUser, }: {
    tinaSchema: TinaSchema;
    resolver: Resolver;
    password: string;
    info: GraphQLResolveInfo;
    ctxUser?: {
        sub?: string;
    };
}): Promise<boolean>;
