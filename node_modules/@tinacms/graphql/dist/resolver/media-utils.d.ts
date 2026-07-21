/**

*/
import type { Schema } from '@tinacms/schema-tools';
import type { GraphQLConfig } from '../types';
/**
 * Strips away the TinaCloud Asset URL from an `image` value
 *
 * @param {string | string[]} value
 * @param {GraphQLConfig} config
 * @returns {string}
 */
export declare const resolveMediaCloudToRelative: (value: string | string[], config: GraphQLConfig, schema: Schema<true>) => string | string[];
/**
 * Adds TinaCloud Asset URL to an `image` value
 *
 * @param {string | string[]} value
 * @param {GraphQLConfig} config
 * @returns {string}
 */
export declare const resolveMediaRelativeToCloud: (value: string | string[], config: GraphQLConfig, schema: Schema<true>) => string | string[];
