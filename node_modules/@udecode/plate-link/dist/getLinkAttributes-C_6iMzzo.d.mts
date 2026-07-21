import * as _udecode_plate_core from '@udecode/plate-core';
import { PluginConfig, EditorBeforeOptions, TElement, SlateEditor } from '@udecode/plate';
import * as React$1 from 'react';

type BaseLinkConfig = PluginConfig<'a', {
    /**
     * List of allowed URL schemes.
     *
     * @default ['http', 'https', 'mailto', 'tel']
     */
    allowedSchemes?: string[];
    /**
     * Skips sanitation of links.
     *
     * @default false
     */
    dangerouslySkipSanitization?: boolean;
    defaultLinkAttributes?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
    forceSubmit?: boolean;
    /**
     * Keeps selected text on pasting links by default.
     *
     * @default true
     */
    keepSelectedTextOnPaste?: boolean;
    /**
     * Allow custom config for rangeBeforeOptions.
     *
     * @example
     *   {
     *     "matchString": " ",
     *     "skipInvalid": true,
     *     "afterMatch": true
     *   }
     */
    rangeBeforeOptions?: EditorBeforeOptions;
    /**
     * Hotkeys to trigger floating link.
     *
     * @default 'meta+k, ctrl+k'
     */
    triggerFloatingLinkHotkeys?: string[] | string;
    /**
     * On keyboard shortcut or toolbar mousedown, get the link url by calling
     * this promise. The default behavior is to use the browser's native
     * `prompt`.
     */
    getLinkUrl?: (prevUrl: string | null) => Promise<string | null>;
    /**
     * Callback to optionally get the href for a url
     *
     * @returns Href: an optional link to be used that is different from the
     *   text content (example https://google.com for google.com)
     */
    getUrlHref?: (url: string) => string | undefined;
    /**
     * Callback to validate an url.
     *
     * @default isUrl
     */
    isUrl?: (text: string) => boolean;
    /**
     * Transform the content of the URL input before validating it. Useful for
     * adding a protocol to a URL. E.g. `google.com` -> `https://google.com`
     *
     * Similar to `getUrlHref` but is used on URL inputs. Whereas that is used
     * on any entered text.
     *
     * @returns The transformed URL.
     */
    transformInput?: (url: string) => string | undefined;
}>;
/** Enables support for hyperlinks. */
declare const BaseLinkPlugin: _udecode_plate_core.SlatePlugin<BaseLinkConfig>;

interface TLinkElement extends TElement {
    url: string;
    target?: string;
}

declare const getLinkAttributes: (editor: SlateEditor, link: TLinkElement) => {
    download?: any;
    href?: string | undefined;
    hrefLang?: string | undefined;
    media?: string | undefined;
    ping?: string | undefined;
    target?: React$1.HTMLAttributeAnchorTarget | undefined;
    type?: string | undefined;
    referrerPolicy?: React$1.HTMLAttributeReferrerPolicy | undefined;
    defaultChecked?: boolean | undefined;
    defaultValue?: string | number | readonly string[] | undefined;
    suppressContentEditableWarning?: boolean | undefined;
    suppressHydrationWarning?: boolean | undefined;
    accessKey?: string | undefined;
    autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters" | undefined | (string & {});
    autoFocus?: boolean | undefined;
    className?: string | undefined;
    contentEditable?: (boolean | "true" | "false") | "inherit" | "plaintext-only" | undefined;
    contextMenu?: string | undefined;
    dir?: string | undefined;
    draggable?: (boolean | "true" | "false") | undefined;
    enterKeyHint?: "enter" | "done" | "go" | "next" | "previous" | "search" | "send" | undefined;
    hidden?: boolean | undefined;
    id?: string | undefined;
    lang?: string | undefined;
    nonce?: string | undefined;
    slot?: string | undefined;
    spellCheck?: (boolean | "true" | "false") | undefined;
    style?: React$1.CSSProperties | undefined;
    tabIndex?: number | undefined;
    title?: string | undefined;
    translate?: "yes" | "no" | undefined;
    radioGroup?: string | undefined;
    role?: React$1.AriaRole | undefined;
    about?: string | undefined;
    content?: string | undefined;
    datatype?: string | undefined;
    inlist?: any;
    prefix?: string | undefined;
    property?: string | undefined;
    rel?: string | undefined;
    resource?: string | undefined;
    rev?: string | undefined;
    typeof?: string | undefined;
    vocab?: string | undefined;
    autoCorrect?: string | undefined;
    autoSave?: string | undefined;
    color?: string | undefined;
    itemProp?: string | undefined;
    itemScope?: boolean | undefined;
    itemType?: string | undefined;
    itemID?: string | undefined;
    itemRef?: string | undefined;
    results?: number | undefined;
    security?: string | undefined;
    unselectable?: "on" | "off" | undefined;
    popover?: "" | "auto" | "manual" | undefined;
    popoverTargetAction?: "toggle" | "show" | "hide" | undefined;
    popoverTarget?: string | undefined;
    inert?: boolean | undefined;
    inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search" | undefined;
    is?: string | undefined;
    exportparts?: string | undefined;
    part?: string | undefined;
    "aria-activedescendant"?: string | undefined;
    "aria-atomic"?: (boolean | "true" | "false") | undefined;
    "aria-autocomplete"?: "none" | "inline" | "list" | "both" | undefined;
    "aria-braillelabel"?: string | undefined;
    "aria-brailleroledescription"?: string | undefined;
    "aria-busy"?: (boolean | "true" | "false") | undefined;
    "aria-checked"?: boolean | "false" | "mixed" | "true" | undefined;
    "aria-colcount"?: number | undefined;
    "aria-colindex"?: number | undefined;
    "aria-colindextext"?: string | undefined;
    "aria-colspan"?: number | undefined;
    "aria-controls"?: string | undefined;
    "aria-current"?: boolean | "false" | "true" | "page" | "step" | "location" | "date" | "time" | undefined;
    "aria-describedby"?: string | undefined;
    "aria-description"?: string | undefined;
    "aria-details"?: string | undefined;
    "aria-disabled"?: (boolean | "true" | "false") | undefined;
    "aria-dropeffect"?: "none" | "copy" | "execute" | "link" | "move" | "popup" | undefined;
    "aria-errormessage"?: string | undefined;
    "aria-expanded"?: (boolean | "true" | "false") | undefined;
    "aria-flowto"?: string | undefined;
    "aria-grabbed"?: (boolean | "true" | "false") | undefined;
    "aria-haspopup"?: boolean | "false" | "true" | "menu" | "listbox" | "tree" | "grid" | "dialog" | undefined;
    "aria-hidden"?: (boolean | "true" | "false") | undefined;
    "aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling" | undefined;
    "aria-keyshortcuts"?: string | undefined;
    "aria-label"?: string | undefined;
    "aria-labelledby"?: string | undefined;
    "aria-level"?: number | undefined;
    "aria-live"?: "off" | "assertive" | "polite" | undefined;
    "aria-modal"?: (boolean | "true" | "false") | undefined;
    "aria-multiline"?: (boolean | "true" | "false") | undefined;
    "aria-multiselectable"?: (boolean | "true" | "false") | undefined;
    "aria-orientation"?: "horizontal" | "vertical" | undefined;
    "aria-owns"?: string | undefined;
    "aria-placeholder"?: string | undefined;
    "aria-posinset"?: number | undefined;
    "aria-pressed"?: boolean | "false" | "mixed" | "true" | undefined;
    "aria-readonly"?: (boolean | "true" | "false") | undefined;
    "aria-relevant"?: "additions" | "additions removals" | "additions text" | "all" | "removals" | "removals additions" | "removals text" | "text" | "text additions" | "text removals" | undefined;
    "aria-required"?: (boolean | "true" | "false") | undefined;
    "aria-roledescription"?: string | undefined;
    "aria-rowcount"?: number | undefined;
    "aria-rowindex"?: number | undefined;
    "aria-rowindextext"?: string | undefined;
    "aria-rowspan"?: number | undefined;
    "aria-selected"?: (boolean | "true" | "false") | undefined;
    "aria-setsize"?: number | undefined;
    "aria-sort"?: "none" | "ascending" | "descending" | "other" | undefined;
    "aria-valuemax"?: number | undefined;
    "aria-valuemin"?: number | undefined;
    "aria-valuenow"?: number | undefined;
    "aria-valuetext"?: string | undefined;
    children?: React$1.ReactNode | undefined;
    dangerouslySetInnerHTML?: {
        __html: string | TrustedHTML;
    } | undefined;
    onCopy?: React$1.ClipboardEventHandler<HTMLAnchorElement> | undefined;
    onCopyCapture?: React$1.ClipboardEventHandler<HTMLAnchorElement> | undefined;
    onCut?: React$1.ClipboardEventHandler<HTMLAnchorElement> | undefined;
    onCutCapture?: React$1.ClipboardEventHandler<HTMLAnchorElement> | undefined;
    onPaste?: React$1.ClipboardEventHandler<HTMLAnchorElement> | undefined;
    onPasteCapture?: React$1.ClipboardEventHandler<HTMLAnchorElement> | undefined;
    onCompositionEnd?: React$1.CompositionEventHandler<HTMLAnchorElement> | undefined;
    onCompositionEndCapture?: React$1.CompositionEventHandler<HTMLAnchorElement> | undefined;
    onCompositionStart?: React$1.CompositionEventHandler<HTMLAnchorElement> | undefined;
    onCompositionStartCapture?: React$1.CompositionEventHandler<HTMLAnchorElement> | undefined;
    onCompositionUpdate?: React$1.CompositionEventHandler<HTMLAnchorElement> | undefined;
    onCompositionUpdateCapture?: React$1.CompositionEventHandler<HTMLAnchorElement> | undefined;
    onFocus?: React$1.FocusEventHandler<HTMLAnchorElement> | undefined;
    onFocusCapture?: React$1.FocusEventHandler<HTMLAnchorElement> | undefined;
    onBlur?: React$1.FocusEventHandler<HTMLAnchorElement> | undefined;
    onBlurCapture?: React$1.FocusEventHandler<HTMLAnchorElement> | undefined;
    onChange?: React$1.FormEventHandler<HTMLAnchorElement> | undefined;
    onChangeCapture?: React$1.FormEventHandler<HTMLAnchorElement> | undefined;
    onBeforeInput?: React$1.FormEventHandler<HTMLAnchorElement> | undefined;
    onBeforeInputCapture?: React$1.FormEventHandler<HTMLAnchorElement> | undefined;
    onInput?: React$1.FormEventHandler<HTMLAnchorElement> | undefined;
    onInputCapture?: React$1.FormEventHandler<HTMLAnchorElement> | undefined;
    onReset?: React$1.FormEventHandler<HTMLAnchorElement> | undefined;
    onResetCapture?: React$1.FormEventHandler<HTMLAnchorElement> | undefined;
    onSubmit?: React$1.FormEventHandler<HTMLAnchorElement> | undefined;
    onSubmitCapture?: React$1.FormEventHandler<HTMLAnchorElement> | undefined;
    onInvalid?: React$1.FormEventHandler<HTMLAnchorElement> | undefined;
    onInvalidCapture?: React$1.FormEventHandler<HTMLAnchorElement> | undefined;
    onLoad?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onLoadCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onError?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onErrorCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onKeyDown?: React$1.KeyboardEventHandler<HTMLAnchorElement> | undefined;
    onKeyDownCapture?: React$1.KeyboardEventHandler<HTMLAnchorElement> | undefined;
    onKeyPress?: React$1.KeyboardEventHandler<HTMLAnchorElement> | undefined;
    onKeyPressCapture?: React$1.KeyboardEventHandler<HTMLAnchorElement> | undefined;
    onKeyUp?: React$1.KeyboardEventHandler<HTMLAnchorElement> | undefined;
    onKeyUpCapture?: React$1.KeyboardEventHandler<HTMLAnchorElement> | undefined;
    onAbort?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onAbortCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onCanPlay?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onCanPlayCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onCanPlayThrough?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onCanPlayThroughCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onDurationChange?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onDurationChangeCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onEmptied?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onEmptiedCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onEncrypted?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onEncryptedCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onEnded?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onEndedCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onLoadedData?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onLoadedDataCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onLoadedMetadata?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onLoadedMetadataCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onLoadStart?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onLoadStartCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onPause?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onPauseCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onPlay?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onPlayCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onPlaying?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onPlayingCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onProgress?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onProgressCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onRateChange?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onRateChangeCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onResize?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onResizeCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onSeeked?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onSeekedCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onSeeking?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onSeekingCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onStalled?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onStalledCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onSuspend?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onSuspendCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onTimeUpdate?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onTimeUpdateCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onVolumeChange?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onVolumeChangeCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onWaiting?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onWaitingCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onAuxClick?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onAuxClickCapture?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onClick?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onClickCapture?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onContextMenu?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onContextMenuCapture?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onDoubleClick?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onDoubleClickCapture?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onDrag?: React$1.DragEventHandler<HTMLAnchorElement> | undefined;
    onDragCapture?: React$1.DragEventHandler<HTMLAnchorElement> | undefined;
    onDragEnd?: React$1.DragEventHandler<HTMLAnchorElement> | undefined;
    onDragEndCapture?: React$1.DragEventHandler<HTMLAnchorElement> | undefined;
    onDragEnter?: React$1.DragEventHandler<HTMLAnchorElement> | undefined;
    onDragEnterCapture?: React$1.DragEventHandler<HTMLAnchorElement> | undefined;
    onDragExit?: React$1.DragEventHandler<HTMLAnchorElement> | undefined;
    onDragExitCapture?: React$1.DragEventHandler<HTMLAnchorElement> | undefined;
    onDragLeave?: React$1.DragEventHandler<HTMLAnchorElement> | undefined;
    onDragLeaveCapture?: React$1.DragEventHandler<HTMLAnchorElement> | undefined;
    onDragOver?: React$1.DragEventHandler<HTMLAnchorElement> | undefined;
    onDragOverCapture?: React$1.DragEventHandler<HTMLAnchorElement> | undefined;
    onDragStart?: React$1.DragEventHandler<HTMLAnchorElement> | undefined;
    onDragStartCapture?: React$1.DragEventHandler<HTMLAnchorElement> | undefined;
    onDrop?: React$1.DragEventHandler<HTMLAnchorElement> | undefined;
    onDropCapture?: React$1.DragEventHandler<HTMLAnchorElement> | undefined;
    onMouseDown?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onMouseDownCapture?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onMouseEnter?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onMouseLeave?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onMouseMove?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onMouseMoveCapture?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onMouseOut?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onMouseOutCapture?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onMouseOver?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onMouseOverCapture?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onMouseUp?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onMouseUpCapture?: React$1.MouseEventHandler<HTMLAnchorElement> | undefined;
    onSelect?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onSelectCapture?: React$1.ReactEventHandler<HTMLAnchorElement> | undefined;
    onTouchCancel?: React$1.TouchEventHandler<HTMLAnchorElement> | undefined;
    onTouchCancelCapture?: React$1.TouchEventHandler<HTMLAnchorElement> | undefined;
    onTouchEnd?: React$1.TouchEventHandler<HTMLAnchorElement> | undefined;
    onTouchEndCapture?: React$1.TouchEventHandler<HTMLAnchorElement> | undefined;
    onTouchMove?: React$1.TouchEventHandler<HTMLAnchorElement> | undefined;
    onTouchMoveCapture?: React$1.TouchEventHandler<HTMLAnchorElement> | undefined;
    onTouchStart?: React$1.TouchEventHandler<HTMLAnchorElement> | undefined;
    onTouchStartCapture?: React$1.TouchEventHandler<HTMLAnchorElement> | undefined;
    onPointerDown?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onPointerDownCapture?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onPointerMove?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onPointerMoveCapture?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onPointerUp?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onPointerUpCapture?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onPointerCancel?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onPointerCancelCapture?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onPointerEnter?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onPointerLeave?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onPointerOver?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onPointerOverCapture?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onPointerOut?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onPointerOutCapture?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onGotPointerCapture?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onGotPointerCaptureCapture?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onLostPointerCapture?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onLostPointerCaptureCapture?: React$1.PointerEventHandler<HTMLAnchorElement> | undefined;
    onScroll?: React$1.UIEventHandler<HTMLAnchorElement> | undefined;
    onScrollCapture?: React$1.UIEventHandler<HTMLAnchorElement> | undefined;
    onScrollEnd?: React$1.UIEventHandler<HTMLAnchorElement> | undefined;
    onScrollEndCapture?: React$1.UIEventHandler<HTMLAnchorElement> | undefined;
    onWheel?: React$1.WheelEventHandler<HTMLAnchorElement> | undefined;
    onWheelCapture?: React$1.WheelEventHandler<HTMLAnchorElement> | undefined;
    onAnimationStart?: React$1.AnimationEventHandler<HTMLAnchorElement> | undefined;
    onAnimationStartCapture?: React$1.AnimationEventHandler<HTMLAnchorElement> | undefined;
    onAnimationEnd?: React$1.AnimationEventHandler<HTMLAnchorElement> | undefined;
    onAnimationEndCapture?: React$1.AnimationEventHandler<HTMLAnchorElement> | undefined;
    onAnimationIteration?: React$1.AnimationEventHandler<HTMLAnchorElement> | undefined;
    onAnimationIterationCapture?: React$1.AnimationEventHandler<HTMLAnchorElement> | undefined;
    onToggle?: React$1.ToggleEventHandler<HTMLAnchorElement> | undefined;
    onBeforeToggle?: React$1.ToggleEventHandler<HTMLAnchorElement> | undefined;
    onTransitionCancel?: React$1.TransitionEventHandler<HTMLAnchorElement> | undefined;
    onTransitionCancelCapture?: React$1.TransitionEventHandler<HTMLAnchorElement> | undefined;
    onTransitionEnd?: React$1.TransitionEventHandler<HTMLAnchorElement> | undefined;
    onTransitionEndCapture?: React$1.TransitionEventHandler<HTMLAnchorElement> | undefined;
    onTransitionRun?: React$1.TransitionEventHandler<HTMLAnchorElement> | undefined;
    onTransitionRunCapture?: React$1.TransitionEventHandler<HTMLAnchorElement> | undefined;
    onTransitionStart?: React$1.TransitionEventHandler<HTMLAnchorElement> | undefined;
    onTransitionStartCapture?: React$1.TransitionEventHandler<HTMLAnchorElement> | undefined;
};

export { type BaseLinkConfig as B, type TLinkElement as T, BaseLinkPlugin as a, getLinkAttributes as g };
