"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BaseLinkPlugin: () => BaseLinkPlugin,
  createLinkNode: () => createLinkNode,
  encodeUrlIfNeeded: () => encodeUrlIfNeeded,
  getLinkAttributes: () => getLinkAttributes,
  insertLink: () => insertLink,
  safeDecodeUrl: () => safeDecodeUrl,
  unwrapLink: () => unwrapLink,
  upsertLink: () => upsertLink,
  upsertLinkText: () => upsertLinkText,
  validateUrl: () => validateUrl,
  withLink: () => withLink,
  wrapLink: () => wrapLink
});
module.exports = __toCommonJS(index_exports);

// src/lib/BaseLinkPlugin.ts
var import_plate6 = require("@udecode/plate");
var import_plate_normalizers = require("@udecode/plate-normalizers");

// src/lib/utils/getLinkAttributes.ts
var import_plate = require("@udecode/plate");
var getLinkAttributes = (editor, link) => {
  const { allowedSchemes, dangerouslySkipSanitization, defaultLinkAttributes } = editor.getOptions({ key: "a" });
  const attributes = { ...defaultLinkAttributes };
  const href = dangerouslySkipSanitization ? link.url : (0, import_plate.sanitizeUrl)(link.url, { allowedSchemes }) || void 0;
  if (href !== void 0) {
    attributes.href = href;
  }
  if ("target" in link && link.target !== void 0) {
    attributes.target = link.target;
  }
  return attributes;
};

// src/lib/utils/createLinkNode.ts
var createLinkNode = (editor, { children, target, text = "", url }) => {
  const type = editor.getType(BaseLinkPlugin);
  return {
    children: children ?? [{ text }],
    target,
    type,
    url
  };
};

// src/lib/utils/encodeUrlIfNeeded.ts
var encodeUrlIfNeeded = (url) => {
  try {
    const isEncoded = url !== decodeURIComponent(url);
    return isEncoded ? url : encodeURI(url);
  } catch (error) {
    if (error instanceof URIError) {
      return url;
    }
    throw error;
  }
};

// src/lib/utils/safeDecodeUrl.ts
var safeDecodeUrl = (url) => {
  try {
    return decodeURI(url);
  } catch (error) {
    if (error instanceof URIError) {
      return url;
    }
    throw error;
  }
};

// src/lib/utils/validateUrl.ts
var import_plate2 = require("@udecode/plate");
var validateUrl = (editor, url) => {
  const { allowedSchemes, dangerouslySkipSanitization, isUrl: isUrl2 } = editor.getOptions(BaseLinkPlugin);
  if (url.startsWith("/") || url.startsWith("#")) {
    return true;
  }
  if (isUrl2 && !isUrl2(url)) return false;
  if (!dangerouslySkipSanitization && !(0, import_plate2.sanitizeUrl)(url, {
    allowedSchemes,
    permitInvalid: true
  }))
    return false;
  return true;
};

// src/lib/withLink.ts
var import_plate5 = require("@udecode/plate");

// src/lib/transforms/insertLink.ts
var insertLink = (editor, createLinkNodeOptions, options) => {
  editor.tf.insertNodes(
    [createLinkNode(editor, createLinkNodeOptions)],
    options
  );
};

// src/lib/transforms/unwrapLink.ts
var import_plate3 = require("@udecode/plate");
var unwrapLink = (editor, options) => {
  return editor.tf.withoutNormalizing(() => {
    if (options?.split) {
      const linkAboveAnchor = editor.api.above({
        at: editor.selection?.anchor,
        match: { type: editor.getType(BaseLinkPlugin) }
      });
      if (linkAboveAnchor) {
        editor.tf.splitNodes({
          at: editor.selection?.anchor,
          match: (n) => import_plate3.ElementApi.isElement(n) && n.type === editor.getType(BaseLinkPlugin)
        });
        unwrapLink(editor, {
          at: editor.selection?.anchor
        });
        return true;
      }
      const linkAboveFocus = editor.api.above({
        at: editor.selection?.focus,
        match: { type: editor.getType(BaseLinkPlugin) }
      });
      if (linkAboveFocus) {
        editor.tf.splitNodes({
          at: editor.selection?.focus,
          match: (n) => import_plate3.ElementApi.isElement(n) && n.type === editor.getType(BaseLinkPlugin)
        });
        unwrapLink(editor, {
          at: editor.selection?.focus
        });
        return true;
      }
    }
    editor.tf.unwrapNodes({
      match: { type: editor.getType(BaseLinkPlugin) },
      ...options
    });
  });
};

// src/lib/transforms/upsertLink.ts
var import_plate4 = require("@udecode/plate");

// src/lib/transforms/upsertLinkText.ts
var upsertLinkText = (editor, { text }) => {
  const newLink = editor.api.above({
    match: { type: editor.getType(BaseLinkPlugin) }
  });
  if (newLink) {
    const [newLinkNode, newLinkPath] = newLink;
    if (text?.length && text !== editor.api.string(newLinkPath)) {
      const firstText = newLinkNode.children[0];
      editor.tf.replaceNodes(
        { ...firstText, text },
        {
          at: newLinkPath,
          children: true,
          select: true
        }
      );
    }
  }
};

// src/lib/transforms/wrapLink.ts
var wrapLink = (editor, { target, url, ...options }) => {
  editor.tf.wrapNodes(
    {
      children: [],
      target,
      type: editor.getType(BaseLinkPlugin),
      url
    },
    { split: true, ...options }
  );
};

// src/lib/transforms/upsertLink.ts
var upsertLink = (editor, {
  insertNodesOptions,
  insertTextInLink,
  skipValidation = false,
  target,
  text,
  url
}) => {
  const at = editor.selection;
  if (!at) return;
  const linkAbove = editor.api.above({
    at,
    match: { type: editor.getType(BaseLinkPlugin) }
  });
  if (insertTextInLink && linkAbove) {
    editor.tf.insertText(url);
    return true;
  }
  if (!skipValidation && !validateUrl(editor, url)) return;
  if ((0, import_plate4.isDefined)(text) && text.length === 0) {
    text = url;
  }
  if (linkAbove) {
    if (url !== linkAbove[0]?.url || target !== linkAbove[0]?.target) {
      editor.tf.setNodes(
        { target, url },
        {
          at: linkAbove[1]
        }
      );
    }
    upsertLinkText(editor, { target, text, url });
    return true;
  }
  const linkEntry = editor.api.node({
    at,
    match: { type: editor.getType(BaseLinkPlugin) }
  });
  const [linkNode, linkPath] = linkEntry ?? [];
  let shouldReplaceText = false;
  if (linkPath && text?.length) {
    const linkText = editor.api.string(linkPath);
    if (text !== linkText) {
      shouldReplaceText = true;
    }
  }
  if (import_plate4.RangeApi.isExpanded(at)) {
    if (linkAbove) {
      unwrapLink(editor, {
        at: linkAbove[1]
      });
    } else {
      unwrapLink(editor, {
        split: true
      });
    }
    wrapLink(editor, {
      target,
      url
    });
    upsertLinkText(editor, { target, text, url });
    return true;
  }
  if (shouldReplaceText) {
    editor.tf.removeNodes({
      at: linkPath
    });
  }
  const props = import_plate4.NodeApi.extractProps(linkNode ?? {});
  const path = editor.selection?.focus.path;
  if (!path) return;
  const leaf = import_plate4.NodeApi.leaf(editor, path);
  if (!text?.length) {
    text = url;
  }
  insertLink(
    editor,
    {
      ...props,
      children: [
        {
          ...leaf,
          text
        }
      ],
      target,
      url
    },
    insertNodesOptions
  );
  return true;
};

// src/lib/withLink.ts
var withLink = ({
  editor,
  getOptions,
  tf: { apply, insertBreak, insertData, insertText, normalizeNode },
  type
}) => {
  const wrapLink2 = () => {
    const { getUrlHref, isUrl: isUrl2, rangeBeforeOptions } = getOptions();
    editor.tf.withoutNormalizing(() => {
      const selection = editor.selection;
      let beforeWordRange = editor.api.range("before", selection, {
        before: rangeBeforeOptions
      });
      if (!beforeWordRange) {
        beforeWordRange = editor.api.range("start", editor.selection);
      }
      if (!beforeWordRange) return;
      const hasLink = editor.api.some({
        at: beforeWordRange,
        match: { type }
      });
      if (hasLink) return;
      let beforeWordText = editor.api.string(beforeWordRange);
      beforeWordText = getUrlHref?.(beforeWordText) ?? beforeWordText;
      if (!isUrl2(beforeWordText)) return;
      editor.tf.select(beforeWordRange);
      upsertLink(editor, {
        url: beforeWordText
      });
      editor.tf.collapse({ edge: "end" });
    });
  };
  return {
    transforms: {
      apply(operation) {
        if (operation.type === "set_selection") {
          const range = operation.newProperties;
          if (range?.focus && range.anchor && import_plate5.RangeApi.isCollapsed(range)) {
            const entry = editor.api.above({
              at: range,
              match: { type }
            });
            if (entry) {
              const [, path] = entry;
              let newPoint;
              if (editor.api.isStart(range.focus, path)) {
                newPoint = editor.api.end(path, { previous: true });
              }
              if (editor.api.isEnd(range.focus, path)) {
                newPoint = editor.api.start(path, { next: true });
              }
              if (newPoint) {
                operation.newProperties = {
                  anchor: newPoint,
                  focus: newPoint
                };
              }
            }
          }
        }
        apply(operation);
      },
      insertBreak() {
        if (!editor.api.isCollapsed()) return insertBreak();
        wrapLink2();
        insertBreak();
      },
      insertData(data) {
        const { getUrlHref, keepSelectedTextOnPaste } = getOptions();
        const text = data.getData("text/plain");
        const textHref = getUrlHref?.(text);
        if (text) {
          const value = textHref || text;
          const inserted = upsertLink(editor, {
            insertTextInLink: true,
            text: keepSelectedTextOnPaste ? void 0 : value,
            url: value
          });
          if (inserted) return;
        }
        insertData(data);
      },
      insertText(text, options) {
        if (text === " " && editor.api.isCollapsed()) {
          wrapLink2();
        }
        insertText(text, options);
      },
      normalizeNode([node, path]) {
        if (node.type === type) {
          const range = editor.selection;
          if (range && editor.api.isCollapsed() && editor.api.isEnd(range.focus, path)) {
            const nextPoint = editor.api.start(path, { next: true });
            if (nextPoint) {
              editor.tf.select(nextPoint);
            } else {
              const nextPath = import_plate5.PathApi.next(path);
              editor.tf.insertNodes({ text: "" }, { at: nextPath });
              editor.tf.select(nextPath);
            }
          }
        }
        normalizeNode([node, path]);
      }
    }
  };
};

// src/lib/BaseLinkPlugin.ts
var BaseLinkPlugin = (0, import_plate6.createTSlatePlugin)({
  key: "a",
  node: {
    dangerouslyAllowAttributes: ["target"],
    isElement: true,
    isInline: true,
    props: ({ editor, element }) => getLinkAttributes(editor, element)
  },
  options: {
    allowedSchemes: ["http", "https", "mailto", "tel"],
    dangerouslySkipSanitization: false,
    defaultLinkAttributes: {},
    isUrl: import_plate6.isUrl,
    keepSelectedTextOnPaste: true,
    rangeBeforeOptions: {
      afterMatch: true,
      matchBlockStart: true,
      matchString: " ",
      skipInvalid: true
    }
  },
  parsers: {
    html: {
      deserializer: {
        rules: [
          {
            validNodeName: "A"
          }
        ],
        parse: ({ editor, element, type }) => {
          const url = element.getAttribute("href");
          if (url && validateUrl(editor, url)) {
            return {
              target: element.getAttribute("target") || "_blank",
              type,
              url
            };
          }
        }
      }
    }
  }
}).overrideEditor(withLink).overrideEditor(
  ({ editor, type }) => (0, import_plate_normalizers.withRemoveEmptyNodes)(
    (0, import_plate6.getEditorPlugin)(
      editor,
      import_plate_normalizers.RemoveEmptyNodesPlugin.configure({
        options: { types: type }
      })
    )
  )
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseLinkPlugin,
  createLinkNode,
  encodeUrlIfNeeded,
  getLinkAttributes,
  insertLink,
  safeDecodeUrl,
  unwrapLink,
  upsertLink,
  upsertLinkText,
  validateUrl,
  withLink,
  wrapLink
});
//# sourceMappingURL=index.js.map