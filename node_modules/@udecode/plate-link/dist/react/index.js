"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/react/index.ts
var react_exports = {};
__export(react_exports, {
  FloatingLinkNewTabInput: () => FloatingLinkNewTabInput,
  FloatingLinkUrlInput: () => FloatingLinkUrlInput,
  LinkOpenButton: () => LinkOpenButton,
  LinkPlugin: () => LinkPlugin,
  submitFloatingLink: () => submitFloatingLink,
  triggerFloatingLink: () => triggerFloatingLink,
  triggerFloatingLinkEdit: () => triggerFloatingLinkEdit,
  triggerFloatingLinkInsert: () => triggerFloatingLinkInsert,
  useFloatingLinkEdit: () => useFloatingLinkEdit,
  useFloatingLinkEditState: () => useFloatingLinkEditState,
  useFloatingLinkEnter: () => useFloatingLinkEnter,
  useFloatingLinkEscape: () => useFloatingLinkEscape,
  useFloatingLinkInsert: () => useFloatingLinkInsert,
  useFloatingLinkInsertState: () => useFloatingLinkInsertState,
  useFloatingLinkNewTabInput: () => useFloatingLinkNewTabInput,
  useFloatingLinkNewTabInputState: () => useFloatingLinkNewTabInputState,
  useFloatingLinkUrlInput: () => useFloatingLinkUrlInput,
  useFloatingLinkUrlInputState: () => useFloatingLinkUrlInputState,
  useLink: () => useLink,
  useLinkOpenButton: () => useLinkOpenButton,
  useLinkOpenButtonState: () => useLinkOpenButtonState,
  useLinkToolbarButton: () => useLinkToolbarButton,
  useLinkToolbarButtonState: () => useLinkToolbarButtonState,
  useVirtualFloatingLink: () => useVirtualFloatingLink
});
module.exports = __toCommonJS(react_exports);

// src/react/LinkPlugin.tsx
var import_plate7 = require("@udecode/plate");
var import_react = require("@udecode/plate/react");

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

// src/react/LinkPlugin.tsx
var LinkPlugin = (0, import_react.toTPlatePlugin)(BaseLinkPlugin, {
  options: {
    isEditing: false,
    mode: "",
    mouseDown: false,
    newTab: false,
    openEditorId: null,
    text: "",
    triggerFloatingLinkHotkeys: "meta+k, ctrl+k",
    updated: false,
    url: ""
  }
}).extendEditorApi(({ editor }) => ({
  link: {
    getAttributes: (0, import_plate7.bindFirst)(getLinkAttributes, editor)
  }
})).extendEditorApi(({ setOptions }) => ({
  floatingLink: {
    hide: () => {
      setOptions({
        isEditing: false,
        mode: "",
        mouseDown: false,
        newTab: false,
        openEditorId: null,
        text: "",
        updated: false,
        url: ""
      });
    },
    reset: () => {
      setOptions({
        isEditing: false,
        mode: "",
        mouseDown: false,
        newTab: false,
        text: "",
        updated: false,
        url: ""
      });
    },
    show: (mode, editorId) => {
      setOptions({
        isEditing: false,
        mode,
        openEditorId: editorId
      });
    }
  }
})).extendSelectors(({ getOptions }) => ({
  isOpen: (editorId) => getOptions().openEditorId === editorId
}));

// src/react/components/useLink.ts
var import_react2 = require("@udecode/plate/react");
var useLink = ({ element }) => {
  const editor = (0, import_react2.useEditorRef)();
  return {
    props: {
      ...getLinkAttributes(editor, element),
      // quick fix: hovering <a> with href loses the editor focus
      onMouseOver: (e) => {
        e.stopPropagation();
      }
    }
  };
};

// src/react/components/useLinkToolbarButton.ts
var import_react3 = require("@udecode/plate/react");
var useLinkToolbarButtonState = () => {
  const pressed = (0, import_react3.useEditorSelector)(
    (editor) => !!editor?.selection && editor.api.some({
      match: { type: editor.getType(LinkPlugin) }
    }),
    []
  );
  return {
    pressed
  };
};
var useLinkToolbarButton = (state) => {
  const editor = (0, import_react3.useEditorRef)();
  return {
    props: {
      pressed: state.pressed,
      onClick: () => {
        editor.tf.focus();
        triggerFloatingLink(editor, { focused: true });
      },
      onMouseDown: (e) => {
        e.preventDefault();
      }
    }
  };
};

// src/react/components/FloatingLink/FloatingLinkNewTabInput.tsx
var import_react4 = __toESM(require("react"));
var import_react5 = require("@udecode/plate/react");
var useFloatingLinkNewTabInputState = () => {
  const { getOptions } = (0, import_react5.useEditorPlugin)(LinkPlugin);
  const updated = (0, import_react5.usePluginOption)(LinkPlugin, "updated");
  const ref = import_react4.default.useRef(null);
  const [checked, setChecked] = import_react4.default.useState(getOptions().newTab);
  import_react4.default.useEffect(() => {
    if (ref.current && updated) {
      setTimeout(() => {
        ref.current?.focus();
      }, 0);
    }
  }, [updated]);
  return {
    checked,
    ref,
    setChecked
  };
};
var useFloatingLinkNewTabInput = ({
  checked,
  ref,
  setChecked
}) => {
  const { setOption } = (0, import_react5.useEditorPlugin)(LinkPlugin);
  const onChange = import_react4.default.useCallback(
    (e) => {
      setChecked(e.target.checked);
      setOption("newTab", e.target.checked);
    },
    [setOption, setChecked]
  );
  return {
    props: {
      checked,
      type: "checkbox",
      onChange
    },
    ref
  };
};
var FloatingLinkNewTabInput = (0, import_react5.createPrimitiveComponent)("input")({
  propsHook: useFloatingLinkNewTabInput,
  stateHook: useFloatingLinkNewTabInputState
});

// src/react/components/FloatingLink/FloatingLinkUrlInput.tsx
var import_react6 = __toESM(require("react"));
var import_react7 = require("@udecode/plate/react");
var useFloatingLinkUrlInputState = () => {
  const { getOptions } = (0, import_react7.useEditorPlugin)(LinkPlugin);
  const updated = (0, import_react7.usePluginOption)(LinkPlugin, "updated");
  const ref = import_react6.default.useRef(null);
  const focused = import_react6.default.useRef(false);
  import_react6.default.useEffect(() => {
    if (ref.current && updated) {
      setTimeout(() => {
        const input = ref.current;
        if (!input) return;
        if (focused.current) return;
        focused.current = true;
        const url = getOptions().url;
        input.focus();
        input.value = url ? safeDecodeUrl(url) : "";
      }, 0);
    }
  }, [getOptions, updated]);
  return {
    ref
  };
};
var useFloatingLinkUrlInput = (state) => {
  const { getOptions, setOption } = (0, import_react7.useEditorPlugin)(LinkPlugin);
  const onChange = import_react6.default.useCallback(
    (e) => {
      const url = encodeUrlIfNeeded(e.target.value);
      setOption("url", url);
    },
    [setOption]
  );
  return {
    props: {
      defaultValue: getOptions().url,
      onChange
    },
    ref: state.ref
  };
};
var FloatingLinkUrlInput = (0, import_react7.createPrimitiveComponent)("input")({
  propsHook: useFloatingLinkUrlInput,
  stateHook: useFloatingLinkUrlInputState
});

// src/react/components/FloatingLink/LinkOpenButton.tsx
var import_react8 = __toESM(require("react"));
var import_react9 = require("@udecode/plate/react");
var useLinkOpenButtonState = () => {
  const editor = (0, import_react9.useEditorRef)();
  const selection = (0, import_react9.useEditorSelection)();
  const entry = import_react8.default.useMemo(
    () => editor.api.node({
      match: { type: editor.getType(LinkPlugin) }
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, selection]
  );
  if (!entry) {
    return {};
  }
  const [element] = entry;
  return {
    element
  };
};
var useLinkOpenButton = ({ element }) => {
  const editor = (0, import_react9.useEditorRef)();
  if (!element) {
    return {
      props: {}
    };
  }
  const linkAttributes = getLinkAttributes(editor, element);
  return {
    props: {
      ...linkAttributes,
      "aria-label": "Open link in a new tab",
      target: "_blank",
      onMouseOver: (e) => {
        e.stopPropagation();
      }
    }
  };
};
var LinkOpenButton = (0, import_react9.createPrimitiveComponent)("a")({
  propsHook: useLinkOpenButton,
  stateHook: useLinkOpenButtonState
});

// src/react/components/FloatingLink/useFloatingLinkEdit.ts
var import_react13 = __toESM(require("react"));
var import_plate_floating2 = require("@udecode/plate-floating");
var import_react14 = require("@udecode/plate/react");

// src/react/utils/triggerFloatingLinkEdit.ts
var import_plate8 = require("@udecode/plate");
var triggerFloatingLinkEdit = (editor) => {
  const { setOption } = (0, import_plate8.getEditorPlugin)(editor, LinkPlugin);
  const entry = editor.api.node({
    match: { type: editor.getType(LinkPlugin) }
  });
  if (!entry) return;
  const [link, path] = entry;
  let text = editor.api.string(path);
  setOption("url", link.url);
  setOption("newTab", link.target === "_blank");
  if (text === link.url) {
    text = "";
  }
  setOption("text", text);
  setOption("isEditing", true);
  return true;
};

// src/react/components/FloatingLink/useFloatingLinkEnter.ts
var import_react10 = require("@udecode/plate/react");

// src/react/transforms/submitFloatingLink.ts
var import_plate9 = require("@udecode/plate");
var submitFloatingLink = (editor) => {
  if (!editor.selection) return;
  const { api, getOptions } = (0, import_plate9.getEditorPlugin)(editor, LinkPlugin);
  const {
    forceSubmit,
    newTab,
    text,
    transformInput,
    url: inputUrl
  } = getOptions();
  const url = transformInput ? transformInput(inputUrl) ?? "" : inputUrl;
  if (!forceSubmit && !validateUrl(editor, url)) return;
  const target = newTab ? "_blank" : void 0;
  api.floatingLink.hide();
  upsertLink(editor, {
    skipValidation: true,
    target,
    text,
    url
  });
  setTimeout(() => {
    editor.tf.focus({ at: editor.selection });
  }, 0);
  return true;
};

// src/react/components/FloatingLink/useFloatingLinkEnter.ts
var useFloatingLinkEnter = () => {
  const editor = (0, import_react10.useEditorRef)();
  const open = (0, import_react10.usePluginOption)(LinkPlugin, "isOpen", editor.id);
  (0, import_react10.useHotkeys)(
    "*",
    (e) => {
      if (e.key !== "Enter") return;
      if (submitFloatingLink(editor)) {
        e.preventDefault();
      }
    },
    {
      enabled: open,
      enableOnFormTags: ["INPUT"]
    },
    []
  );
};

// src/react/components/FloatingLink/useFloatingLinkEscape.ts
var import_react11 = require("@udecode/plate/react");
var useFloatingLinkEscape = () => {
  const { api, editor, getOptions } = (0, import_react11.useEditorPlugin)(LinkPlugin);
  const open = (0, import_react11.usePluginOption)(LinkPlugin, "isOpen", editor.id);
  (0, import_react11.useHotkeys)(
    "escape",
    (e) => {
      const { isEditing, mode } = getOptions();
      if (!mode) return;
      e.preventDefault();
      if (mode === "edit" && isEditing) {
        api.floatingLink.show("edit", editor.id);
        editor.tf.focus({ at: editor.selection });
        return;
      }
      if (mode === "insert") {
        editor.tf.focus({ at: editor.selection });
      }
      api.floatingLink.hide();
    },
    {
      enabled: open,
      enableOnContentEditable: true,
      enableOnFormTags: ["INPUT"]
    },
    []
  );
};

// src/react/components/FloatingLink/useVirtualFloatingLink.ts
var import_plate_floating = require("@udecode/plate-floating");
var import_react12 = require("@udecode/plate/react");
var useVirtualFloatingLink = ({
  editorId,
  ...floatingOptions
}) => {
  const { setOption } = (0, import_react12.useEditorPlugin)(LinkPlugin);
  return (0, import_plate_floating.useVirtualFloating)({
    onOpenChange: (open) => setOption("openEditorId", open ? editorId : null),
    ...floatingOptions
  });
};

// src/react/components/FloatingLink/useFloatingLinkEdit.ts
var useFloatingLinkEditState = ({
  floatingOptions
} = {}) => {
  const { editor, getOptions, type } = (0, import_react14.useEditorPlugin)(LinkPlugin);
  const { triggerFloatingLinkHotkeys } = getOptions();
  const readOnly = (0, import_react14.useEditorReadOnly)();
  const isEditing = (0, import_react14.usePluginOption)(LinkPlugin, "isEditing");
  const version = (0, import_react14.useEditorVersion)();
  const mode = (0, import_react14.usePluginOption)(LinkPlugin, "mode");
  const open = (0, import_react14.usePluginOption)(LinkPlugin, "isOpen", editor.id);
  const getBoundingClientRect = import_react13.default.useCallback(() => {
    const entry = editor.api.above({
      match: { type }
    });
    if (entry) {
      const [, path] = entry;
      return (0, import_plate_floating2.getRangeBoundingClientRect)(editor, {
        anchor: editor.api.start(path),
        focus: editor.api.end(path)
      });
    }
    return (0, import_plate_floating2.getDOMSelectionBoundingClientRect)();
  }, [editor, type]);
  const isOpen = open && mode === "edit";
  const floating = useVirtualFloatingLink({
    editorId: editor.id,
    getBoundingClientRect,
    open: isOpen,
    ...floatingOptions
  });
  return {
    editor,
    floating,
    isEditing,
    isOpen,
    readOnly,
    triggerFloatingLinkHotkeys,
    versionEditor: version
  };
};
var useFloatingLinkEdit = ({
  editor,
  floating,
  triggerFloatingLinkHotkeys,
  versionEditor
}) => {
  const { api, getOptions } = (0, import_react14.useEditorPlugin)(LinkPlugin);
  import_react13.default.useEffect(() => {
    if (editor.selection && editor.api.some({
      match: { type: editor.getType(LinkPlugin) }
    })) {
      api.floatingLink.show("edit", editor.id);
      floating.update();
      return;
    }
    if (getOptions().mode === "edit") {
      api.floatingLink.hide();
    }
  }, [editor, versionEditor, floating.update]);
  (0, import_react14.useHotkeys)(
    triggerFloatingLinkHotkeys,
    (e) => {
      if (getOptions().mode === "edit" && triggerFloatingLinkEdit(editor)) {
        e.preventDefault();
      }
    },
    {
      enableOnContentEditable: true
    },
    []
  );
  useFloatingLinkEnter();
  useFloatingLinkEscape();
  const clickOutsideRef = (0, import_react14.useOnClickOutside)(() => {
    if (!getOptions().isEditing) return;
    api.floatingLink.hide();
  });
  return {
    editButtonProps: {
      onClick: () => {
        triggerFloatingLinkEdit(editor);
      }
    },
    props: {
      style: {
        ...floating.style,
        zIndex: 50
      }
    },
    ref: (0, import_react14.useComposedRef)(
      floating.refs.setFloating,
      clickOutsideRef
    ),
    unlinkButtonProps: {
      onClick: () => {
        unwrapLink(editor);
      },
      onMouseDown: (e) => {
        e.preventDefault();
      }
    }
  };
};

// src/react/components/FloatingLink/useFloatingLinkInsert.ts
var import_react15 = __toESM(require("react"));
var import_plate_floating3 = require("@udecode/plate-floating");
var import_react16 = require("@udecode/plate/react");

// src/react/utils/triggerFloatingLinkInsert.ts
var import_plate10 = require("@udecode/plate");
var triggerFloatingLinkInsert = (editor, {
  focused
} = {}) => {
  const { api, getOptions, setOption, type } = (0, import_plate10.getEditorPlugin)(
    editor,
    LinkPlugin
  );
  const { mode } = getOptions();
  if (mode) return;
  if (!focused) return;
  if (editor.api.isAt({ blocks: true })) return;
  const hasLink = editor.api.some({
    match: { type }
  });
  if (hasLink) return;
  setOption("text", editor.api.string(editor.selection));
  api.floatingLink.show("insert", editor.id);
  return true;
};

// src/react/components/FloatingLink/useFloatingLinkInsert.ts
var useFloatingLinkInsertState = ({
  floatingOptions
} = {}) => {
  const { editor, getOptions } = (0, import_react16.useEditorPlugin)(LinkPlugin);
  const { triggerFloatingLinkHotkeys } = getOptions();
  const readOnly = (0, import_react16.useEditorReadOnly)();
  const focused = (0, import_react16.useFocused)();
  const mode = (0, import_react16.usePluginOption)(LinkPlugin, "mode");
  const isOpen = (0, import_react16.usePluginOption)(LinkPlugin, "isOpen", editor.id);
  const floating = useVirtualFloatingLink({
    editorId: editor.id,
    getBoundingClientRect: import_plate_floating3.getDOMSelectionBoundingClientRect,
    open: isOpen && mode === "insert",
    whileElementsMounted: () => () => {
    },
    ...floatingOptions
  });
  return {
    floating,
    focused,
    isOpen,
    readOnly,
    triggerFloatingLinkHotkeys
  };
};
var useFloatingLinkInsert = ({
  floating,
  focused,
  isOpen,
  readOnly,
  triggerFloatingLinkHotkeys
}) => {
  const { api, editor, getOptions, setOption } = (0, import_react16.useEditorPlugin)(LinkPlugin);
  const onChange = import_react15.default.useCallback(
    (e) => {
      setOption("text", e.target.value);
    },
    [setOption]
  );
  const ref = (0, import_react16.useOnClickOutside)(
    () => {
      if (getOptions().mode === "insert") {
        api.floatingLink.hide();
        editor.tf.focus({ at: editor.selection });
      }
    },
    {
      disabled: !isOpen
    }
  );
  import_react15.default.useEffect(() => {
    if (isOpen) {
      floating.update();
      setOption("updated", true);
    } else {
      setOption("updated", false);
    }
  }, [isOpen, floating.update]);
  (0, import_react16.useHotkeys)(
    triggerFloatingLinkHotkeys,
    (e) => {
      if (triggerFloatingLinkInsert(editor, { focused })) {
        e.preventDefault();
      }
    },
    {
      enableOnContentEditable: true
    },
    [focused]
  );
  useFloatingLinkEscape();
  const { text, updated } = getOptions();
  const updatedValue = import_react15.default.useCallback(
    (el) => {
      if (el && updated) {
        el.value = getOptions().text;
      }
    },
    [getOptions, updated]
  );
  return {
    hidden: readOnly || !isOpen,
    props: {
      style: {
        ...floating.style,
        zIndex: 50
      }
    },
    ref: (0, import_react16.useComposedRef)(floating.refs.setFloating, ref),
    textInputProps: {
      defaultValue: text,
      ref: updatedValue,
      onChange
    }
  };
};

// src/react/utils/triggerFloatingLink.ts
var import_plate11 = require("@udecode/plate");
var triggerFloatingLink = (editor, {
  focused
} = {}) => {
  const { getOptions } = (0, import_plate11.getEditorPlugin)(editor, LinkPlugin);
  if (getOptions().mode === "edit") {
    triggerFloatingLinkEdit(editor);
    return;
  }
  triggerFloatingLinkInsert(editor, {
    focused
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FloatingLinkNewTabInput,
  FloatingLinkUrlInput,
  LinkOpenButton,
  LinkPlugin,
  submitFloatingLink,
  triggerFloatingLink,
  triggerFloatingLinkEdit,
  triggerFloatingLinkInsert,
  useFloatingLinkEdit,
  useFloatingLinkEditState,
  useFloatingLinkEnter,
  useFloatingLinkEscape,
  useFloatingLinkInsert,
  useFloatingLinkInsertState,
  useFloatingLinkNewTabInput,
  useFloatingLinkNewTabInputState,
  useFloatingLinkUrlInput,
  useFloatingLinkUrlInputState,
  useLink,
  useLinkOpenButton,
  useLinkOpenButtonState,
  useLinkToolbarButton,
  useLinkToolbarButtonState,
  useVirtualFloatingLink
});
//# sourceMappingURL=index.js.map