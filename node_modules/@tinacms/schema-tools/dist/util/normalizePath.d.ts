export declare const normalizePath: (filepath: string) => string;
/**
 * Returns the given path such that:
 * - The path separator is converted from '\' to '/' if necessary.
 * - Duplicate '/' are removed
 * - Leading and trailing '/' are cleared
 * @param filepath Filepath to convert to its canonical form
 */
export declare const canonicalPath: (filepath: string) => string;
