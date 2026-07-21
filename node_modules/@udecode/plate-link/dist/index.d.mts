import { B as BaseLinkConfig, T as TLinkElement } from './getLinkAttributes-C_6iMzzo.mjs';
export { a as BaseLinkPlugin, g as getLinkAttributes } from './getLinkAttributes-C_6iMzzo.mjs';
import { OverrideEditor, TText, SlateEditor, InsertNodesOptions, UnwrapNodesOptions, WrapNodesOptions } from '@udecode/plate';
import '@udecode/plate-core';
import 'react';

/**
 * Insert space after a url to wrap a link. Lookup from the block start to the
 * cursor to check if there is an url. If not found, lookup before the cursor
 * for a space character to check the url.
 *
 * On insert data: Paste a string inside a link element will edit its children
 * text but not its url.
 */
declare const withLink: OverrideEditor<BaseLinkConfig>;

interface CreateLinkNodeOptions {
    url: string;
    children?: TText[];
    target?: string;
    text?: string;
}
declare const createLinkNode: (editor: SlateEditor, { children, target, text, url }: CreateLinkNodeOptions) => TLinkElement;

/**
 * If a URL has not already been encoded and contains characters that require
 * encoding, encode the URL.
 *
 * @param url URL to encode
 */
declare const encodeUrlIfNeeded: (url: string) => string;

declare const safeDecodeUrl: (url: string) => string;

declare const validateUrl: (editor: SlateEditor, url: string) => boolean;

/** Insert a link node. */
declare const insertLink: (editor: SlateEditor, createLinkNodeOptions: CreateLinkNodeOptions, options?: InsertNodesOptions) => void;

/** Unwrap link node. */
declare const unwrapLink: (editor: SlateEditor, options?: {
    split?: boolean;
} & UnwrapNodesOptions) => boolean;

type UpsertLinkOptions = {
    insertNodesOptions?: InsertNodesOptions;
    /** If true, insert text when selection is in url. */
    insertTextInLink?: boolean;
    skipValidation?: boolean;
    unwrapNodesOptions?: UnwrapNodesOptions;
    wrapNodesOptions?: WrapNodesOptions;
} & CreateLinkNodeOptions;
/**
 * If selection in a link or is not url:
 *
 * - Insert text with url, exit If selection is expanded or `update` in a link:
 * - Remove link node, get link text Then:
 * - Insert link node
 */
declare const upsertLink: (editor: SlateEditor, { insertNodesOptions, insertTextInLink, skipValidation, target, text, url, }: UpsertLinkOptions) => true | undefined;

/**
 * If the text is different than the link above text, replace link children by a
 * new text. The new text has the same marks than the first text replaced.
 */
declare const upsertLinkText: (editor: SlateEditor, { text }: UpsertLinkOptions) => void;

interface WrapLinkOptions extends WrapNodesOptions {
    url: string;
    target?: string;
}
/** Wrap a link node with split. */
declare const wrapLink: (editor: SlateEditor, { target, url, ...options }: WrapLinkOptions) => void;

export { BaseLinkConfig, type CreateLinkNodeOptions, TLinkElement, type UpsertLinkOptions, type WrapLinkOptions, createLinkNode, encodeUrlIfNeeded, insertLink, safeDecodeUrl, unwrapLink, upsertLink, upsertLinkText, validateUrl, withLink, wrapLink };
