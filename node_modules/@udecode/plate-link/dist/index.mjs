// src/lib/BaseLinkPlugin.ts
import {
  createTSlatePlugin,
  getEditorPlugin,
  isUrl
} from "@udecode/plate";
import {
  RemoveEmptyNodesPlugin,
  withRemoveEmptyNodes
} from "@udecode/plate-normalizers";

// src/lib/utils/getLinkAttributes.ts
import { sanitizeUrl } from "@udecode/plate";
var getLinkAttributes = (editor, link) => {
  const { allowedSchemes, dangerouslySkipSanitization, defaultLinkAttributes } = editor.getOptions({ key: "a" });
  const attributes = { ...defaultLinkAttributes };
  const href = dangerouslySkipSanitization ? link.url : sanitizeUrl(link.url, { allowedSchemes }) || void 0;
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
import { sanitizeUrl as sanitizeUrl2 } from "@udecode/plate";
var validateUrl = (editor, url) => {
  const { allowedSchemes, dangerouslySkipSanitization, isUrl: isUrl2 } = editor.getOptions(BaseLinkPlugin);
  if (url.startsWith("/") || url.startsWith("#")) {
    return true;
  }
  if (isUrl2 && !isUrl2(url)) return false;
  if (!dangerouslySkipSanitization && !sanitizeUrl2(url, {
    allowedSchemes,
    permitInvalid: true
  }))
    return false;
  return true;
};

// src/lib/withLink.ts
import {
  PathApi,
  RangeApi as RangeApi2
} from "@udecode/plate";

// src/lib/transforms/insertLink.ts
var insertLink = (editor, createLinkNodeOptions, options) => {
  editor.tf.insertNodes(
    [createLinkNode(editor, createLinkNodeOptions)],
    options
  );
};

// src/lib/transforms/unwrapLink.ts
import {
  ElementApi
} from "@udecode/plate";
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
          match: (n) => ElementApi.isElement(n) && n.type === editor.getType(BaseLinkPlugin)
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
          match: (n) => ElementApi.isElement(n) && n.type === editor.getType(BaseLinkPlugin)
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
import {
  isDefined,
  NodeApi,
  RangeApi
} from "@udecode/plate";

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
  if (isDefined(text) && text.length === 0) {
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
  if (RangeApi.isExpanded(at)) {
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
  const props = NodeApi.extractProps(linkNode ?? {});
  const path = editor.selection?.focus.path;
  if (!path) return;
  const leaf = NodeApi.leaf(editor, path);
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
          if (range?.focus && range.anchor && RangeApi2.isCollapsed(range)) {
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
              const nextPath = PathApi.next(path);
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
var BaseLinkPlugin = createTSlatePlugin({
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
    isUrl,
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
  ({ editor, type }) => withRemoveEmptyNodes(
    getEditorPlugin(
      editor,
      RemoveEmptyNodesPlugin.configure({
        options: { types: type }
      })
    )
  )
);
export {
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
};
//# sourceMappingURL=index.mjs.map