// src/react/IndentListPlugin.tsx
import { toPlatePlugin } from "@udecode/plate/react";

// src/lib/BaseIndentListPlugin.ts
import {
  BaseParagraphPlugin,
  createTSlatePlugin,
  HtmlPlugin,
  isHtmlBlockElement,
  postCleanHtml,
  traverseHtmlElements
} from "@udecode/plate";

// src/lib/renderIndentListBelowNodes.tsx
import React from "react";
import { clsx } from "clsx";

// src/lib/types.ts
var ULIST_STYLE_TYPES = [
  "disc" /* Disc */,
  "circle" /* Circle */,
  "square" /* Square */,
  "disclosure-open" /* DisclosureOpen */,
  "disclosure-closed" /* DisclosureClosed */
];

// src/lib/renderIndentListBelowNodes.tsx
var renderIndentListBelowNodes = (injectProps) => {
  const { element } = injectProps;
  const listStyleType = element[BaseIndentListPlugin.key];
  const listStart = element[INDENT_LIST_KEYS.listStart];
  if (listStyleType) {
    let className = clsx(`slate-${BaseIndentListPlugin.key}-${listStyleType}`);
    const style = {
      listStyleType,
      margin: 0,
      padding: 0,
      position: "relative"
    };
    return ({ children, ...props }) => {
      const { editor } = props;
      const { listStyleTypes = {} } = editor.getOptions(BaseIndentListPlugin);
      let listOptions = listStyleTypes[listStyleType];
      let isOrdered = true;
      if (listOptions) {
        isOrdered = !!listOptions.isOrdered;
      } else {
        if (ULIST_STYLE_TYPES.includes(listStyleType)) {
          isOrdered = false;
        }
        listOptions = {};
      }
      className = isOrdered ? clsx(className, "slate-ol") : clsx(className, "slate-ul");
      const List = isOrdered ? "ol" : "ul";
      const { liComponent: Li, markerComponent: Marker = () => null } = listOptions;
      return /* @__PURE__ */ React.createElement(List, { className, style, start: listStart }, /* @__PURE__ */ React.createElement(Marker, { ...props }), Li ? /* @__PURE__ */ React.createElement(Li, { ...props }, children) : /* @__PURE__ */ React.createElement("li", null, children));
    };
  }
};

// src/lib/withIndentList.ts
import {
  PathApi as PathApi3
} from "@udecode/plate";

// src/lib/normalizers/normalizeIndentListNotIndented.ts
import { isDefined } from "@udecode/plate";
import { BaseIndentPlugin } from "@udecode/plate-indent";
var normalizeIndentListNotIndented = (editor, [node, path]) => {
  if (!isDefined(node[BaseIndentPlugin.key]) && (node[BaseIndentListPlugin.key] || node[INDENT_LIST_KEYS.listStart])) {
    editor.tf.unsetNodes(
      [BaseIndentListPlugin.key, INDENT_LIST_KEYS.listStart],
      {
        at: path
      }
    );
    return true;
  }
};

// src/lib/normalizers/normalizeIndentListStart.ts
import {
  isDefined as isDefined3
} from "@udecode/plate";

// src/lib/queries/getPreviousIndentList.ts
import {
  NodeApi,
  PathApi
} from "@udecode/plate";

// src/lib/queries/getSiblingIndentList.ts
import {
  isDefined as isDefined2
} from "@udecode/plate";
import { BaseIndentPlugin as BaseIndentPlugin2 } from "@udecode/plate-indent";
var getSiblingIndentList = (editor, [node, path], {
  breakOnEqIndentNeqListStyleType = true,
  breakOnListRestart = false,
  breakOnLowerIndent = true,
  breakQuery,
  eqIndent = true,
  getNextEntry,
  getPreviousEntry,
  query
}) => {
  if (!getPreviousEntry && !getNextEntry) return;
  const getSiblingEntry = getNextEntry ?? getPreviousEntry;
  let nextEntry = getSiblingEntry([node, path]);
  while (true) {
    if (!nextEntry) return;
    const [nextNode, nextPath] = nextEntry;
    const indent = node[BaseIndentPlugin2.key];
    const nextIndent = nextNode[BaseIndentPlugin2.key];
    if (breakQuery?.(nextNode, node)) return;
    if (!isDefined2(nextIndent)) return;
    if (breakOnListRestart) {
      if (getPreviousEntry && node[INDENT_LIST_KEYS.listRestart]) {
        return;
      }
      if (getNextEntry && nextNode[INDENT_LIST_KEYS.listRestart]) {
        return;
      }
    }
    if (breakOnLowerIndent && nextIndent < indent) return;
    if (breakOnEqIndentNeqListStyleType && nextIndent === indent && nextNode[BaseIndentListPlugin.key] !== node[BaseIndentListPlugin.key])
      return;
    let valid = !query || query(nextNode, node);
    if (valid) {
      valid = !eqIndent || nextIndent === indent;
      if (valid) return [nextNode, nextPath];
    }
    nextEntry = getSiblingEntry(nextEntry);
  }
};

// src/lib/queries/getPreviousIndentList.ts
var getPreviousIndentList = (editor, entry, options) => {
  return getSiblingIndentList(editor, entry, {
    getPreviousEntry: ([, currPath]) => {
      const prevPath = PathApi.previous(currPath);
      if (!prevPath) return;
      const prevNode = NodeApi.get(editor, prevPath);
      if (!prevNode) return;
      return [prevNode, prevPath];
    },
    ...options,
    getNextEntry: void 0
  });
};

// src/lib/normalizers/normalizeIndentListStart.ts
var getIndentListExpectedListStart = (entry, prevEntry) => {
  const [node] = entry;
  const [prevNode] = prevEntry ?? [null];
  const restart = node[INDENT_LIST_KEYS.listRestart] ?? null;
  const restartPolite = node[INDENT_LIST_KEYS.listRestartPolite] ?? null;
  if (restart) {
    return restart;
  }
  if (restartPolite && !prevNode) {
    return restartPolite;
  }
  if (prevNode) {
    const prevListStart = prevNode[INDENT_LIST_KEYS.listStart] ?? 1;
    return prevListStart + 1;
  }
  return 1;
};
var normalizeIndentListStart = (editor, entry, options) => {
  return editor.tf.withoutNormalizing(() => {
    const [node, path] = entry;
    const listStyleType = node[BaseIndentListPlugin.key];
    const listStart = node[INDENT_LIST_KEYS.listStart];
    if (!listStyleType) return;
    const prevEntry = getPreviousIndentList(editor, entry, options);
    const expectedListStart = getIndentListExpectedListStart(entry, prevEntry);
    if (isDefined3(listStart) && expectedListStart === 1) {
      editor.tf.unsetNodes(INDENT_LIST_KEYS.listStart, { at: path });
      return true;
    }
    if (listStart !== expectedListStart && expectedListStart > 1) {
      editor.tf.setNodes(
        { [INDENT_LIST_KEYS.listStart]: expectedListStart },
        { at: path }
      );
      return true;
    }
    return false;
  });
};

// src/lib/normalizers/withDeleteBackwardIndentList.ts
import { isDefined as isDefined5, NodeApi as NodeApi3 } from "@udecode/plate";

// src/lib/transforms/indentList.ts
import { setIndent } from "@udecode/plate-indent";
var indentList = (editor, { listStyleType = "disc" /* Disc */, ...options } = {}) => {
  setIndent(editor, {
    offset: 1,
    setNodesProps: () => ({
      [BaseIndentListPlugin.key]: listStyleType
    }),
    ...options
  });
};
var indentTodo = (editor, { listStyleType = "disc" /* Disc */, ...options } = {}) => {
  setIndent(editor, {
    offset: 1,
    setNodesProps: () => ({
      [BaseIndentListPlugin.key]: listStyleType,
      [INDENT_LIST_KEYS.checked]: false
    }),
    ...options
  });
};

// src/lib/transforms/outdentList.ts
import { setIndent as setIndent2 } from "@udecode/plate-indent";
var outdentList = (editor, options = {}) => {
  setIndent2(editor, {
    offset: -1,
    unsetNodesProps: [BaseIndentListPlugin.key, INDENT_LIST_KEYS.checked],
    ...options
  });
};

// src/lib/transforms/setIndentListNode.ts
import { BaseIndentPlugin as BaseIndentPlugin3 } from "@udecode/plate-indent";
var setIndentListNode = (editor, {
  at,
  indent = 0,
  listStyleType = "disc" /* Disc */
}) => {
  const newIndent = indent || indent + 1;
  editor.tf.setNodes(
    {
      [BaseIndentListPlugin.key]: listStyleType,
      [BaseIndentPlugin3.key]: newIndent
    },
    { at }
  );
};
var setIndentTodoNode = (editor, {
  at,
  indent = 0,
  listStyleType = INDENT_LIST_KEYS.todo
}) => {
  const newIndent = indent || indent + 1;
  editor.tf.setNodes(
    {
      [BaseIndentListPlugin.key]: listStyleType,
      [BaseIndentPlugin3.key]: newIndent,
      [INDENT_LIST_KEYS.checked]: false
    },
    { at }
  );
};

// src/lib/transforms/setIndentListNodes.ts
import { BaseIndentPlugin as BaseIndentPlugin4 } from "@udecode/plate-indent";
var setIndentListNodes = (editor, entries, {
  listStyleType = "disc" /* Disc */
}) => {
  editor.tf.withoutNormalizing(() => {
    entries.forEach((entry) => {
      const [node, path] = entry;
      let indent = node[BaseIndentPlugin4.key] ?? 0;
      indent = node[BaseIndentListPlugin.key] || node.hasOwnProperty(INDENT_LIST_KEYS.checked) ? indent : indent + 1;
      if (listStyleType === "todo") {
        editor.tf.unsetNodes(BaseIndentListPlugin.key, { at: path });
        setIndentTodoNode(editor, {
          at: path,
          indent,
          listStyleType
        });
        return;
      }
      editor.tf.unsetNodes(INDENT_LIST_KEYS.checked, { at: path });
      setIndentListNode(editor, {
        at: path,
        indent,
        listStyleType
      });
    });
  });
};

// src/lib/transforms/setIndentListSiblingNodes.ts
import { BaseIndentPlugin as BaseIndentPlugin5 } from "@udecode/plate-indent";

// src/lib/queries/getNextIndentList.ts
import {
  NodeApi as NodeApi2,
  PathApi as PathApi2
} from "@udecode/plate";
var getNextIndentList = (editor, entry, options) => {
  return getSiblingIndentList(editor, entry, {
    getNextEntry: ([, currPath]) => {
      const nextPath = PathApi2.next(currPath);
      const nextNode = NodeApi2.get(editor, nextPath);
      if (!nextNode) return;
      return [nextNode, nextPath];
    },
    ...options,
    getPreviousEntry: void 0
  });
};

// src/lib/queries/getIndentListSiblings.ts
var getIndentListSiblings = (editor, entry, {
  current = true,
  next = true,
  previous = true,
  ...options
} = {}) => {
  const siblings = [];
  const node = entry[0];
  if (!node[BaseIndentListPlugin.key] && !node.hasOwnProperty(INDENT_LIST_KEYS.checked)) {
    return siblings;
  }
  let iterEntry = entry;
  if (previous) {
    while (true) {
      const prevEntry = getPreviousIndentList(editor, iterEntry, options);
      if (!prevEntry) break;
      siblings.push(prevEntry);
      iterEntry = prevEntry;
    }
  }
  if (current) {
    siblings.push(entry);
  }
  if (next) {
    iterEntry = entry;
    while (true) {
      const nextEntry = getNextIndentList(editor, iterEntry, options);
      if (!nextEntry) break;
      siblings.push(nextEntry);
      iterEntry = nextEntry;
    }
  }
  return siblings;
};

// src/lib/transforms/setIndentListSiblingNodes.ts
var setIndentListSiblingNodes = (editor, entry, {
  getSiblingIndentListOptions,
  listStyleType = "disc" /* Disc */
}) => {
  editor.tf.withoutNormalizing(() => {
    const siblings = getIndentListSiblings(
      editor,
      entry,
      getSiblingIndentListOptions
    );
    siblings.forEach(([node, path]) => {
      if (listStyleType === INDENT_LIST_KEYS.todo) {
        editor.tf.unsetNodes(BaseIndentListPlugin.key, { at: path });
        setIndentTodoNode(editor, {
          at: path,
          indent: node[BaseIndentPlugin5.key],
          listStyleType
        });
      } else {
        editor.tf.unsetNodes(INDENT_LIST_KEYS.checked, { at: path });
        setIndentListNode(editor, {
          at: path,
          indent: node[BaseIndentPlugin5.key],
          listStyleType
        });
      }
    });
  });
};

// src/lib/transforms/toggleIndentList.ts
import { BaseIndentPlugin as BaseIndentPlugin6 } from "@udecode/plate-indent";

// src/lib/queries/areEqListStyleType.ts
var areEqListStyleType = (editor, entries, {
  listStyleType = "disc" /* Disc */
}) => {
  let eqListStyleType = true;
  for (const entry of entries) {
    const [block] = entry;
    if (listStyleType === INDENT_LIST_KEYS.todo) {
      if (!block.hasOwnProperty(INDENT_LIST_KEYS.checked)) {
        eqListStyleType = false;
        break;
      }
      continue;
    }
    if (!block[BaseIndentListPlugin.key] || block[BaseIndentListPlugin.key] !== listStyleType) {
      eqListStyleType = false;
      break;
    }
  }
  return eqListStyleType;
};

// src/lib/queries/getIndentListAbove.ts
import {
  isDefined as isDefined4
} from "@udecode/plate";
var getIndentListAbove = (editor, options) => {
  return editor.api.above({
    ...options,
    match: (node) => isDefined4(node[BaseIndentListPlugin.key])
  });
};

// src/lib/queries/someIndentList.ts
var someIndentList = (editor, type) => {
  return !!editor.selection && editor.api.some({
    match: (n) => {
      const isHasProperty = n.hasOwnProperty(INDENT_LIST_KEYS.checked);
      if (isHasProperty) {
        return false;
      }
      const list = n[BaseIndentListPlugin.key];
      return Array.isArray(type) ? type.includes(list) : list === type;
    }
  });
};

// src/lib/queries/someIndentTodo.ts
var someIndentTodo = (editor) => {
  return editor.api.some({
    at: editor.selection,
    match: (n) => {
      const list = n[BaseIndentListPlugin.key];
      const isHasProperty = n.hasOwnProperty(INDENT_LIST_KEYS.checked);
      return n.type === "p" && isHasProperty && list === INDENT_LIST_KEYS.todo;
    }
  });
};

// src/lib/transforms/toggleIndentListSet.ts
var toggleIndentListSet = (editor, [node, _path], { listStyleType = "disc" /* Disc */, ...options }) => {
  if (node.hasOwnProperty(INDENT_LIST_KEYS.checked) || node[BaseIndentListPlugin.key])
    return;
  if (listStyleType === "todo") {
    indentTodo(editor, {
      listStyleType,
      ...options
    });
  } else {
    indentList(editor, {
      listStyleType,
      ...options
    });
  }
  return true;
};

// src/lib/transforms/toggleIndentListUnset.ts
var toggleIndentListUnset = (editor, [node, path], {
  listStyleType = "disc" /* Disc */
}) => {
  if (listStyleType === INDENT_LIST_KEYS.todo && node.hasOwnProperty(INDENT_LIST_KEYS.checked)) {
    editor.tf.unsetNodes(INDENT_LIST_KEYS.checked, { at: path });
    outdentList(editor, { listStyleType });
    return true;
  }
  if (listStyleType === node[BaseIndentListPlugin.key]) {
    editor.tf.unsetNodes([BaseIndentListPlugin.key], {
      at: path
    });
    outdentList(editor, { listStyleType });
    return true;
  }
};

// src/lib/transforms/toggleIndentList.ts
var toggleIndentList = (editor, options, getSiblingIndentListOptions) => {
  const { listRestart, listRestartPolite, listStyleType } = options;
  const setIndentList = (() => {
    const { getSiblingIndentListOptions: _getSiblingIndentListOptions } = editor.getOptions(BaseIndentListPlugin);
    if (editor.api.isCollapsed()) {
      const entry = editor.api.block();
      if (!entry) return null;
      if (toggleIndentListSet(editor, entry, options)) {
        return true;
      }
      if (toggleIndentListUnset(editor, entry, { listStyleType })) {
        return false;
      }
      setIndentListSiblingNodes(editor, entry, {
        getSiblingIndentListOptions: {
          ..._getSiblingIndentListOptions,
          ...getSiblingIndentListOptions
        },
        listStyleType
      });
      return true;
    }
    if (editor.api.isExpanded()) {
      const _entries = editor.api.nodes({ block: true });
      const entries = [..._entries];
      const eqListStyleType = areEqListStyleType(editor, entries, {
        listStyleType
      });
      if (eqListStyleType) {
        editor.tf.withoutNormalizing(() => {
          entries.forEach((entry) => {
            const [node, path] = entry;
            const indent = node[BaseIndentPlugin6.key];
            editor.tf.unsetNodes(BaseIndentListPlugin.key, { at: path });
            if (indent > 1) {
              editor.tf.setNodes(
                { [BaseIndentPlugin6.key]: indent - 1 },
                { at: path }
              );
            } else {
              editor.tf.unsetNodes(
                [BaseIndentPlugin6.key, INDENT_LIST_KEYS.checked],
                {
                  at: path
                }
              );
            }
          });
        });
        return false;
      }
      setIndentListNodes(editor, entries, { listStyleType });
      return true;
    }
    return null;
  })();
  const restartValue = listRestart || listRestartPolite;
  const isRestart = !!listRestart;
  if (setIndentList && restartValue) {
    const atStart = editor.api.start(editor.selection);
    const entry = getIndentListAbove(editor, { at: atStart });
    if (!entry) return;
    const isFirst = !getPreviousIndentList(editor, entry);
    if (!isRestart && (!isFirst || restartValue <= 0)) return;
    if (isRestart && restartValue === 1 && isFirst) return;
    const prop = isRestart ? INDENT_LIST_KEYS.listRestart : INDENT_LIST_KEYS.listRestartPolite;
    editor.tf.setNodes({ [prop]: restartValue }, { at: entry[1] });
  }
};

// src/lib/normalizers/withDeleteBackwardIndentList.ts
var withDeleteBackwardIndentList = ({ editor, tf: { deleteBackward } }) => {
  return {
    transforms: {
      deleteBackward(unit) {
        const nodeEntry = editor.api.above();
        if (!nodeEntry) return deleteBackward(unit);
        const listNode = nodeEntry[0];
        if (editor.api.isCollapsed() && NodeApi3.string(listNode))
          return deleteBackward(unit);
        if (isDefined5(listNode[BaseIndentListPlugin.key])) {
          return outdentList(editor);
        }
        return deleteBackward(unit);
      }
    }
  };
};

// src/lib/normalizers/withInsertBreakIndentList.ts
import { isDefined as isDefined6 } from "@udecode/plate";
var withInsertBreakIndentList = ({ editor, tf: { insertBreak } }) => {
  return {
    transforms: {
      insertBreak() {
        const nodeEntry = editor.api.above();
        if (!nodeEntry) return insertBreak();
        const [node, path] = nodeEntry;
        if (!isDefined6(node[BaseIndentListPlugin.key]) || node[BaseIndentListPlugin.key] !== INDENT_LIST_KEYS.todo || editor.api.isExpanded() || !editor.api.isEnd(editor.selection?.focus, path)) {
          return insertBreak();
        }
        editor.tf.withoutNormalizing(() => {
          insertBreak();
          const newEntry = editor.api.above();
          if (newEntry) {
            editor.tf.setNodes(
              {
                checked: false
              },
              { at: newEntry[1] }
            );
          }
        });
      }
    }
  };
};

// src/lib/withNormalizeIndentList.ts
var withNormalizeIndentList = ({
  editor,
  getOptions,
  tf: { normalizeNode }
}) => {
  return {
    transforms: {
      normalizeNode([node, path]) {
        const normalized = editor.tf.withoutNormalizing(() => {
          if (normalizeIndentListNotIndented(editor, [node, path])) return true;
          if (normalizeIndentListStart(
            editor,
            [node, path],
            getOptions().getSiblingIndentListOptions
          ))
            return true;
        });
        if (normalized) return;
        return normalizeNode([node, path]);
      }
    }
  };
};

// src/lib/withIndentList.ts
var withIndentList = (ctx) => {
  const {
    editor,
    getOptions,
    tf: { apply }
  } = ctx;
  return {
    transforms: {
      ...withNormalizeIndentList(ctx).transforms,
      ...withDeleteBackwardIndentList(ctx).transforms,
      ...withInsertBreakIndentList(ctx).transforms,
      apply(operation) {
        const { getSiblingIndentListOptions } = getOptions();
        if (operation.type === "insert_node") {
          const listStyleType = operation.node[BaseIndentListPlugin.key];
          if (listStyleType && ["lower-roman", "upper-roman"].includes(
            listStyleType
          )) {
            const prevNodeEntry = getPreviousIndentList(
              editor,
              [operation.node, operation.path],
              {
                breakOnEqIndentNeqListStyleType: false,
                eqIndent: false,
                ...getSiblingIndentListOptions
              }
            );
            if (prevNodeEntry) {
              const prevListStyleType = prevNodeEntry[0][BaseIndentListPlugin.key];
              if (prevListStyleType === "lower-alpha" /* LowerAlpha */ && listStyleType === "lower-roman" /* LowerRoman */) {
                operation.node[BaseIndentListPlugin.key] = "lower-alpha" /* LowerAlpha */;
              } else if (prevListStyleType === "upper-alpha" /* UpperAlpha */ && listStyleType === "upper-roman" /* UpperRoman */) {
                operation.node[BaseIndentListPlugin.key] = "upper-alpha" /* UpperAlpha */;
              }
            }
          }
        }
        if (operation.type === "split_node" && operation.properties[BaseIndentListPlugin.key]) {
          operation.properties[INDENT_LIST_KEYS.listRestart] = void 0;
          operation.properties[INDENT_LIST_KEYS.listRestartPolite] = void 0;
        }
        apply(operation);
        const affectedPaths = [];
        switch (operation.type) {
          case "insert_node":
          case "remove_node":
          case "set_node": {
            affectedPaths.push(operation.path);
            break;
          }
          case "merge_node": {
            affectedPaths.push(PathApi3.previous(operation.path));
            break;
          }
          case "move_node": {
            affectedPaths.push(operation.path, operation.newPath);
            break;
          }
          case "split_node": {
            affectedPaths.push(operation.path, PathApi3.next(operation.path));
            break;
          }
        }
        const isIndentListItem = (node) => BaseIndentListPlugin.key in node;
        affectedPaths.forEach((affectedPath) => {
          let entry = editor.api.node(affectedPath);
          if (!entry) return;
          if (!isIndentListItem(entry[0])) {
            entry = editor.api.node(PathApi3.next(affectedPath));
          }
          while (entry && isIndentListItem(entry[0])) {
            const normalized = normalizeIndentListStart(
              editor,
              entry,
              getSiblingIndentListOptions
            );
            if (normalized) break;
            entry = getNextIndentList(
              editor,
              entry,
              {
                ...getSiblingIndentListOptions,
                breakOnEqIndentNeqListStyleType: false,
                breakOnLowerIndent: false,
                eqIndent: false
              }
            );
          }
        });
      }
    }
  };
};

// src/lib/BaseIndentListPlugin.ts
var INDENT_LIST_KEYS = {
  checked: "checked",
  listRestart: "listRestart",
  listRestartPolite: "listRestartPolite",
  listStart: "listStart",
  todo: "todo"
};
var BaseIndentListPlugin = createTSlatePlugin({
  key: "listStyleType",
  inject: {
    plugins: {
      [HtmlPlugin.key]: {
        parser: {
          transformData: ({ data }) => {
            const document = new DOMParser().parseFromString(data, "text/html");
            const { body } = document;
            traverseHtmlElements(body, (element) => {
              if (element.tagName === "LI") {
                const { childNodes } = element;
                const liChildren = [];
                childNodes.forEach((child) => {
                  if (isHtmlBlockElement(child)) {
                    liChildren.push(...child.childNodes);
                  } else {
                    liChildren.push(child);
                  }
                });
                element.replaceChildren(...liChildren);
                return false;
              }
              return true;
            });
            return postCleanHtml(body.innerHTML);
          }
        }
      }
    }
  },
  options: {
    getListStyleType: (element) => element.style.listStyleType
  },
  parsers: {
    html: {
      deserializer: {
        isElement: true,
        rules: [
          {
            validNodeName: "LI"
          }
        ],
        parse: ({ editor, element, getOptions }) => {
          return {
            // gdoc uses aria-level attribute
            indent: Number(element.getAttribute("aria-level")),
            listStyleType: getOptions().getListStyleType?.(element),
            type: editor.getType(BaseParagraphPlugin)
          };
        }
      }
    }
  },
  render: {
    belowNodes: renderIndentListBelowNodes
  }
}).overrideEditor(withIndentList);

// src/react/onKeyDownIndentList.ts
import { isHotkey } from "@udecode/plate";
var onKeyDownIndentList = ({
  editor,
  event
}) => {
  if (event.defaultPrevented) return;
  if (!editor.selection) return;
  const entry = editor.api.block();
  if (!entry) return;
  const node = entry[0];
  const listStyleType = node[IndentListPlugin.key];
  if (!listStyleType) return;
  if (isHotkey("Enter", event) && editor.api.isEmpty(editor.selection, { block: true }) && node.indent) {
    outdentList(editor);
    event.stopPropagation();
    event.preventDefault();
  }
};

// src/react/IndentListPlugin.tsx
var IndentListPlugin = toPlatePlugin(BaseIndentListPlugin, {
  handlers: {
    onKeyDown: onKeyDownIndentList
  }
});

// src/react/hooks/useIndentListToolbarButton.ts
import { useEditorRef, useEditorSelector } from "@udecode/plate/react";
var useIndentListToolbarButtonState = ({
  nodeType = "disc" /* Disc */
} = {}) => {
  const pressed = useEditorSelector(
    (editor) => someIndentList(editor, nodeType),
    [nodeType]
  );
  return {
    nodeType,
    pressed
  };
};
var useIndentListToolbarButton = ({
  nodeType,
  pressed
}) => {
  const editor = useEditorRef();
  return {
    props: {
      pressed,
      onClick: () => {
        toggleIndentList(editor, {
          listStyleType: nodeType
        });
      },
      onMouseDown: (e) => {
        e.preventDefault();
      }
    }
  };
};

// src/react/hooks/useIndentTodoListElement.ts
import { useEditorRef as useEditorRef2, useReadOnly } from "@udecode/plate/react";
var useIndentTodoListElementState = ({
  element
}) => {
  const editor = useEditorRef2();
  const { checked } = element;
  const readOnly = useReadOnly();
  return {
    checked,
    editor,
    element,
    readOnly
  };
};
var useIndentTodoListElement = (state) => {
  const { checked, editor, element, readOnly } = state;
  return {
    checkboxProps: {
      checked: !!checked,
      onCheckedChange: (value) => {
        if (readOnly) return;
        const path = editor.api.findPath(element);
        if (!path) return;
        editor.tf.setNodes({ checked: value }, { at: path });
      },
      onMouseDown: (e) => {
        e.preventDefault();
      }
    }
  };
};

// src/react/hooks/useIndentTodoToolbarButton.ts
import { useEditorRef as useEditorRef3, useEditorSelector as useEditorSelector2 } from "@udecode/plate/react";
var useIndentTodoToolBarButtonState = ({
  nodeType = "disc" /* Disc */
} = {}) => {
  const pressed = useEditorSelector2(
    (editor) => someIndentTodo(editor),
    [nodeType]
  );
  return {
    nodeType,
    pressed
  };
};
var useIndentTodoToolBarButton = ({
  nodeType,
  pressed
}) => {
  const editor = useEditorRef3();
  return {
    props: {
      pressed,
      onClick: () => {
        toggleIndentList(editor, {
          listStyleType: nodeType
        });
      },
      onMouseDown: (e) => {
        e.preventDefault();
      }
    }
  };
};
export {
  IndentListPlugin,
  onKeyDownIndentList,
  useIndentListToolbarButton,
  useIndentListToolbarButtonState,
  useIndentTodoListElement,
  useIndentTodoListElementState,
  useIndentTodoToolBarButton,
  useIndentTodoToolBarButtonState
};
//# sourceMappingURL=index.mjs.map