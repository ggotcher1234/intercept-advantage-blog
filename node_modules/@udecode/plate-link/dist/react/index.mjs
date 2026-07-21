// src/react/LinkPlugin.tsx
import { bindFirst } from "@udecode/plate";
import { toTPlatePlugin } from "@udecode/plate/react";

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

// src/react/LinkPlugin.tsx
var LinkPlugin = toTPlatePlugin(BaseLinkPlugin, {
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
    getAttributes: bindFirst(getLinkAttributes, editor)
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
import { useEditorRef } from "@udecode/plate/react";
var useLink = ({ element }) => {
  const editor = useEditorRef();
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
import { useEditorRef as useEditorRef2, useEditorSelector } from "@udecode/plate/react";
var useLinkToolbarButtonState = () => {
  const pressed = useEditorSelector(
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
  const editor = useEditorRef2();
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
import React from "react";
import {
  createPrimitiveComponent,
  useEditorPlugin,
  usePluginOption
} from "@udecode/plate/react";
var useFloatingLinkNewTabInputState = () => {
  const { getOptions } = useEditorPlugin(LinkPlugin);
  const updated = usePluginOption(LinkPlugin, "updated");
  const ref = React.useRef(null);
  const [checked, setChecked] = React.useState(getOptions().newTab);
  React.useEffect(() => {
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
  const { setOption } = useEditorPlugin(LinkPlugin);
  const onChange = React.useCallback(
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
var FloatingLinkNewTabInput = createPrimitiveComponent("input")({
  propsHook: useFloatingLinkNewTabInput,
  stateHook: useFloatingLinkNewTabInputState
});

// src/react/components/FloatingLink/FloatingLinkUrlInput.tsx
import React2 from "react";
import {
  createPrimitiveComponent as createPrimitiveComponent2,
  useEditorPlugin as useEditorPlugin2,
  usePluginOption as usePluginOption2
} from "@udecode/plate/react";
var useFloatingLinkUrlInputState = () => {
  const { getOptions } = useEditorPlugin2(LinkPlugin);
  const updated = usePluginOption2(LinkPlugin, "updated");
  const ref = React2.useRef(null);
  const focused = React2.useRef(false);
  React2.useEffect(() => {
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
  const { getOptions, setOption } = useEditorPlugin2(LinkPlugin);
  const onChange = React2.useCallback(
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
var FloatingLinkUrlInput = createPrimitiveComponent2("input")({
  propsHook: useFloatingLinkUrlInput,
  stateHook: useFloatingLinkUrlInputState
});

// src/react/components/FloatingLink/LinkOpenButton.tsx
import React3 from "react";
import {
  createPrimitiveComponent as createPrimitiveComponent3,
  useEditorRef as useEditorRef3,
  useEditorSelection
} from "@udecode/plate/react";
var useLinkOpenButtonState = () => {
  const editor = useEditorRef3();
  const selection = useEditorSelection();
  const entry = React3.useMemo(
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
  const editor = useEditorRef3();
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
var LinkOpenButton = createPrimitiveComponent3("a")({
  propsHook: useLinkOpenButton,
  stateHook: useLinkOpenButtonState
});

// src/react/components/FloatingLink/useFloatingLinkEdit.ts
import React4 from "react";
import {
  getDOMSelectionBoundingClientRect,
  getRangeBoundingClientRect
} from "@udecode/plate-floating";
import {
  useComposedRef,
  useEditorPlugin as useEditorPlugin5,
  useEditorReadOnly,
  useEditorVersion,
  useHotkeys as useHotkeys3,
  useOnClickOutside,
  usePluginOption as usePluginOption5
} from "@udecode/plate/react";

// src/react/utils/triggerFloatingLinkEdit.ts
import { getEditorPlugin as getEditorPlugin2 } from "@udecode/plate";
var triggerFloatingLinkEdit = (editor) => {
  const { setOption } = getEditorPlugin2(editor, LinkPlugin);
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
import {
  useEditorRef as useEditorRef4,
  useHotkeys,
  usePluginOption as usePluginOption3
} from "@udecode/plate/react";

// src/react/transforms/submitFloatingLink.ts
import { getEditorPlugin as getEditorPlugin3 } from "@udecode/plate";
var submitFloatingLink = (editor) => {
  if (!editor.selection) return;
  const { api, getOptions } = getEditorPlugin3(editor, LinkPlugin);
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
  const editor = useEditorRef4();
  const open = usePluginOption3(LinkPlugin, "isOpen", editor.id);
  useHotkeys(
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
import {
  useEditorPlugin as useEditorPlugin3,
  useHotkeys as useHotkeys2,
  usePluginOption as usePluginOption4
} from "@udecode/plate/react";
var useFloatingLinkEscape = () => {
  const { api, editor, getOptions } = useEditorPlugin3(LinkPlugin);
  const open = usePluginOption4(LinkPlugin, "isOpen", editor.id);
  useHotkeys2(
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
import {
  useVirtualFloating
} from "@udecode/plate-floating";
import { useEditorPlugin as useEditorPlugin4 } from "@udecode/plate/react";
var useVirtualFloatingLink = ({
  editorId,
  ...floatingOptions
}) => {
  const { setOption } = useEditorPlugin4(LinkPlugin);
  return useVirtualFloating({
    onOpenChange: (open) => setOption("openEditorId", open ? editorId : null),
    ...floatingOptions
  });
};

// src/react/components/FloatingLink/useFloatingLinkEdit.ts
var useFloatingLinkEditState = ({
  floatingOptions
} = {}) => {
  const { editor, getOptions, type } = useEditorPlugin5(LinkPlugin);
  const { triggerFloatingLinkHotkeys } = getOptions();
  const readOnly = useEditorReadOnly();
  const isEditing = usePluginOption5(LinkPlugin, "isEditing");
  const version = useEditorVersion();
  const mode = usePluginOption5(LinkPlugin, "mode");
  const open = usePluginOption5(LinkPlugin, "isOpen", editor.id);
  const getBoundingClientRect = React4.useCallback(() => {
    const entry = editor.api.above({
      match: { type }
    });
    if (entry) {
      const [, path] = entry;
      return getRangeBoundingClientRect(editor, {
        anchor: editor.api.start(path),
        focus: editor.api.end(path)
      });
    }
    return getDOMSelectionBoundingClientRect();
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
  const { api, getOptions } = useEditorPlugin5(LinkPlugin);
  React4.useEffect(() => {
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
  useHotkeys3(
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
  const clickOutsideRef = useOnClickOutside(() => {
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
    ref: useComposedRef(
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
import React5 from "react";
import {
  getDOMSelectionBoundingClientRect as getDOMSelectionBoundingClientRect2
} from "@udecode/plate-floating";
import {
  useComposedRef as useComposedRef2,
  useEditorPlugin as useEditorPlugin6,
  useEditorReadOnly as useEditorReadOnly2,
  useFocused,
  useHotkeys as useHotkeys4,
  useOnClickOutside as useOnClickOutside2,
  usePluginOption as usePluginOption6
} from "@udecode/plate/react";

// src/react/utils/triggerFloatingLinkInsert.ts
import { getEditorPlugin as getEditorPlugin4 } from "@udecode/plate";
var triggerFloatingLinkInsert = (editor, {
  focused
} = {}) => {
  const { api, getOptions, setOption, type } = getEditorPlugin4(
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
  const { editor, getOptions } = useEditorPlugin6(LinkPlugin);
  const { triggerFloatingLinkHotkeys } = getOptions();
  const readOnly = useEditorReadOnly2();
  const focused = useFocused();
  const mode = usePluginOption6(LinkPlugin, "mode");
  const isOpen = usePluginOption6(LinkPlugin, "isOpen", editor.id);
  const floating = useVirtualFloatingLink({
    editorId: editor.id,
    getBoundingClientRect: getDOMSelectionBoundingClientRect2,
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
  const { api, editor, getOptions, setOption } = useEditorPlugin6(LinkPlugin);
  const onChange = React5.useCallback(
    (e) => {
      setOption("text", e.target.value);
    },
    [setOption]
  );
  const ref = useOnClickOutside2(
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
  React5.useEffect(() => {
    if (isOpen) {
      floating.update();
      setOption("updated", true);
    } else {
      setOption("updated", false);
    }
  }, [isOpen, floating.update]);
  useHotkeys4(
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
  const updatedValue = React5.useCallback(
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
    ref: useComposedRef2(floating.refs.setFloating, ref),
    textInputProps: {
      defaultValue: text,
      ref: updatedValue,
      onChange
    }
  };
};

// src/react/utils/triggerFloatingLink.ts
import { getEditorPlugin as getEditorPlugin5 } from "@udecode/plate";
var triggerFloatingLink = (editor, {
  focused
} = {}) => {
  const { getOptions } = getEditorPlugin5(editor, LinkPlugin);
  if (getOptions().mode === "edit") {
    triggerFloatingLinkEdit(editor);
    return;
  }
  triggerFloatingLinkInsert(editor, {
    focused
  });
};
export {
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
};
//# sourceMappingURL=index.mjs.map