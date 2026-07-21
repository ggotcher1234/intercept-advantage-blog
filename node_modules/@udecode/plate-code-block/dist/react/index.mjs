// src/react/CodeBlockPlugin.tsx
import { Key, toPlatePlugin } from "@udecode/plate/react";

// src/lib/BaseCodeBlockPlugin.ts
import {
  createSlatePlugin,
  createTSlatePlugin,
  HtmlPlugin
} from "@udecode/plate";

// src/lib/deserializer/htmlDeserializerCodeBlock.ts
var htmlDeserializerCodeBlock = {
  rules: [
    {
      validNodeName: "PRE"
    },
    {
      validNodeName: "P",
      validStyle: {
        fontFamily: "Consolas"
      }
    }
  ],
  parse: ({ element }) => {
    const languageSelectorText = [...element.childNodes].find(
      (node) => node.nodeName === "SELECT"
    )?.textContent || "";
    const textContent = element.textContent?.replace(languageSelectorText, "") || "";
    let lines = textContent.split("\n");
    if (!lines?.length) {
      lines = [textContent];
    }
    const codeLines = lines.map((line) => ({
      children: [{ text: line }],
      type: BaseCodeLinePlugin.key
    }));
    return {
      children: codeLines,
      type: BaseCodeBlockPlugin.key
    };
  }
};

// src/lib/setCodeBlockToDecorations.ts
import {
  NodeApi
} from "@udecode/plate";
var CODE_LINE_TO_DECORATIONS = /* @__PURE__ */ new WeakMap();
function getHighlightNodes(result) {
  return result.value || result.children || [];
}
function parseNodes(nodes, className = []) {
  return nodes.flatMap((node) => {
    const classes = [
      ...className,
      ...node.properties ? node.properties.className : []
    ];
    if (node.children) {
      return parseNodes(node.children, classes);
    }
    return { classes, text: node.value };
  });
}
function normalizeTokens(tokens) {
  const lines = [[]];
  let currentLine = lines[0];
  for (const token of tokens) {
    const tokenLines = token.text.split("\n");
    for (let i = 0; i < tokenLines.length; i++) {
      const content = tokenLines[i];
      if (content) {
        currentLine.push({ classes: token.classes, content });
      }
      if (i < tokenLines.length - 1) {
        lines.push([]);
        currentLine = lines.at(-1);
      }
    }
  }
  return lines;
}
function codeBlockToDecorations(editor, [block, blockPath]) {
  const { defaultLanguage, ...options } = editor.getOptions(BaseCodeBlockPlugin);
  const lowlight = options.lowlight;
  const text = block.children.map((line) => NodeApi.string(line)).join("\n");
  const language = block.lang;
  const effectiveLanguage = language || defaultLanguage;
  let highlighted;
  try {
    if (!effectiveLanguage || effectiveLanguage === "plaintext") {
      highlighted = { value: [] };
    } else if (effectiveLanguage === "auto") {
      highlighted = lowlight.highlightAuto(text);
    } else {
      highlighted = lowlight.highlight(effectiveLanguage, text);
    }
  } catch (error) {
    const availableLanguages = lowlight.listLanguages();
    const isLanguageRegistered = effectiveLanguage && availableLanguages.includes(effectiveLanguage);
    if (isLanguageRegistered) {
      editor.api.debug.error(error, "CODE_HIGHLIGHT");
      highlighted = { value: [] };
    } else {
      editor.api.debug.warn(
        `Language "${effectiveLanguage}" is not registered. Falling back to plaintext`
      );
      highlighted = { value: [] };
    }
  }
  const tokens = parseNodes(getHighlightNodes(highlighted));
  const normalizedTokens = normalizeTokens(tokens);
  const blockChildren = block.children;
  const nodeToDecorations = /* @__PURE__ */ new Map();
  const numLines = Math.min(normalizedTokens.length, blockChildren.length);
  for (let index = 0; index < numLines; index++) {
    const lineTokens = normalizedTokens[index];
    const element = blockChildren[index];
    if (!nodeToDecorations.has(element)) {
      nodeToDecorations.set(element, []);
    }
    let start = 0;
    for (const token of lineTokens) {
      const length = token.content.length;
      if (!length) continue;
      const end = start + length;
      const decoration = {
        anchor: {
          offset: start,
          path: [...blockPath, index, 0]
        },
        [BaseCodeSyntaxPlugin.key]: true,
        className: token.classes.join(" "),
        focus: {
          offset: end,
          path: [...blockPath, index, 0]
        }
      };
      nodeToDecorations.get(element).push(decoration);
      start = end;
    }
  }
  return nodeToDecorations;
}
function setCodeBlockToDecorations(editor, [block, blockPath]) {
  const decorations = codeBlockToDecorations(editor, [block, blockPath]);
  for (const [node, decs] of decorations.entries()) {
    CODE_LINE_TO_DECORATIONS.set(node, decs);
  }
}
function resetCodeBlockDecorations(codeBlock) {
  codeBlock.children.forEach((line) => {
    CODE_LINE_TO_DECORATIONS.delete(line);
  });
}

// src/lib/queries/getCodeLineEntry.ts
import {
  ElementApi
} from "@udecode/plate";
var getCodeLineEntry = (editor, { at = editor.selection } = {}) => {
  if (at && editor.api.some({
    at,
    match: { type: editor.getType(BaseCodeLinePlugin) }
  })) {
    const selectionParent = editor.api.parent(at);
    if (!selectionParent) return;
    const [, parentPath] = selectionParent;
    const codeLine = editor.api.above({
      at,
      match: { type: editor.getType(BaseCodeLinePlugin) }
    }) || editor.api.parent(parentPath);
    if (!codeLine) return;
    const [codeLineNode, codeLinePath] = codeLine;
    if (ElementApi.isElement(codeLineNode) && codeLineNode.type !== editor.getType(BaseCodeLinePlugin))
      return;
    const codeBlock = editor.api.parent(codeLinePath);
    if (!codeBlock) return;
    return {
      codeBlock,
      codeLine
    };
  }
};

// src/lib/queries/getIndentDepth.ts
var getIndentDepth = (editor, { codeLine }) => {
  const [, codeLinePath] = codeLine;
  const text = editor.api.string(codeLinePath);
  return text.search(/\S|$/);
};

// src/lib/transforms/deleteStartSpace.ts
var deleteStartSpace = (editor, { codeLine }) => {
  const [, codeLinePath] = codeLine;
  const codeLineStart = editor.api.start(codeLinePath);
  const codeLineEnd = codeLineStart && editor.api.after(codeLineStart);
  const spaceRange = codeLineEnd && editor.api.range(codeLineStart, codeLineEnd);
  const spaceText = editor.api.string(spaceRange);
  if (/\s/.test(spaceText)) {
    editor.tf.delete({ at: spaceRange });
    return true;
  }
  return false;
};

// src/lib/transforms/indentCodeLine.ts
var indentCodeLine = (editor, { codeLine, indentDepth = 2 }) => {
  const [, codeLinePath] = codeLine;
  const codeLineStart = editor.api.start(codeLinePath);
  const indent = " ".repeat(indentDepth);
  if (!editor.api.isExpanded()) {
    const cursor = editor.selection?.anchor;
    const range = editor.api.range(codeLineStart, cursor);
    const text = editor.api.string(range);
    if (/\S/.test(text)) {
      editor.tf.insertText(indent, { at: editor.selection });
      return;
    }
  }
  editor.tf.insertText(indent, { at: codeLineStart });
};

// src/lib/transforms/outdentCodeLine.ts
var outdentCodeLine = (editor, { codeBlock, codeLine }) => {
  const deleted = deleteStartSpace(editor, { codeBlock, codeLine });
  deleted && deleteStartSpace(editor, { codeBlock, codeLine });
};

// src/lib/withInsertDataCodeBlock.ts
var withInsertDataCodeBlock = ({
  editor,
  tf: { insertData },
  type: codeBlockType
}) => ({
  transforms: {
    insertData(data) {
      const text = data.getData("text/plain");
      const vscodeDataString = data.getData("vscode-editor-data");
      const codeLineType = editor.getType(BaseCodeLinePlugin);
      if (vscodeDataString) {
        try {
          const vscodeData = JSON.parse(vscodeDataString);
          const lines = text.split("\n");
          const [blockAbove2] = editor.api.block() ?? [];
          const isInCodeBlock = blockAbove2 && [codeBlockType, codeLineType].includes(blockAbove2?.type);
          if (isInCodeBlock) {
            if (lines[0]) {
              editor.tf.insertText(lines[0]);
            }
            if (lines.length > 1) {
              const nodes = lines.slice(1).map((line) => ({
                children: [{ text: line }],
                type: codeLineType
              }));
              editor.tf.insertNodes(nodes);
            }
          } else {
            const node = {
              children: lines.map((line) => ({
                children: [{ text: line }],
                type: codeLineType
              })),
              lang: vscodeData?.mode,
              type: codeBlockType
            };
            editor.tf.insertNodes(node, {
              select: true
            });
          }
          return;
        } catch (error) {
        }
      }
      const [blockAbove] = editor.api.block() ?? [];
      if (blockAbove && [codeBlockType, codeLineType].includes(blockAbove?.type) && text?.includes("\n")) {
        const lines = text.split("\n");
        if (lines[0]) {
          editor.tf.insertText(lines[0]);
        }
        if (lines.length > 1) {
          const nodes = lines.slice(1).map((line) => ({
            children: [{ text: line }],
            type: codeLineType
          }));
          editor.tf.insertNodes(nodes);
        }
        return;
      }
      insertData(data);
    }
  }
});

// src/lib/withInsertFragmentCodeBlock.ts
import { NodeApi as NodeApi2 } from "@udecode/plate";
function extractCodeLinesFromCodeBlock(node) {
  return node.children;
}
var withInsertFragmentCodeBlock = ({
  editor,
  tf: { insertFragment },
  type: codeBlockType
}) => ({
  transforms: {
    insertFragment(fragment) {
      const [blockAbove] = editor.api.block() ?? [];
      const codeLineType = editor.getType(BaseCodeLinePlugin);
      function convertNodeToCodeLine(node) {
        return {
          children: [{ text: NodeApi2.string(node) }],
          type: codeLineType
        };
      }
      if (blockAbove && [codeBlockType, codeLineType].includes(blockAbove?.type)) {
        return insertFragment(
          fragment.flatMap((node) => {
            const element = node;
            return element.type === codeBlockType ? extractCodeLinesFromCodeBlock(element) : convertNodeToCodeLine(element);
          })
        );
      }
      return insertFragment(fragment);
    }
  }
});

// src/lib/withNormalizeCodeBlock.tsx
import { ElementApi as ElementApi2, NodeApi as NodeApi3 } from "@udecode/plate";
var withNormalizeCodeBlock = ({
  editor,
  tf: { normalizeNode }
}) => ({
  transforms: {
    normalizeNode([node, path]) {
      normalizeNode([node, path]);
      if (!ElementApi2.isElement(node)) {
        return;
      }
      const codeBlockType = editor.getType(BaseCodeBlockPlugin);
      const codeLineType = editor.getType(BaseCodeLinePlugin);
      const isCodeBlockRoot = node.type === codeBlockType;
      if (isCodeBlockRoot) {
        const nonCodeLine = Array.from(NodeApi3.children(editor, path)).find(
          ([child]) => child.type !== codeLineType
        );
        if (nonCodeLine) {
          editor.tf.setNodes({ type: codeLineType }, { at: nonCodeLine[1] });
        }
      }
    }
  }
});

// src/lib/withCodeBlock.ts
var withCodeBlock = (ctx) => {
  const {
    editor,
    tf: { insertBreak }
  } = ctx;
  const insertBreakCodeBlock = () => {
    if (!editor.selection) return;
    const res = getCodeLineEntry(editor, {});
    if (!res) return;
    const { codeBlock, codeLine } = res;
    const indentDepth = getIndentDepth(editor, {
      codeBlock,
      codeLine
    });
    insertBreak();
    indentCodeLine(editor, {
      codeBlock,
      codeLine,
      indentDepth
    });
    return true;
  };
  return {
    transforms: {
      insertBreak() {
        if (insertBreakCodeBlock()) return;
        insertBreak();
      },
      ...withInsertDataCodeBlock(ctx).transforms,
      ...withInsertFragmentCodeBlock(ctx).transforms,
      ...withNormalizeCodeBlock(ctx).transforms
    }
  };
};

// src/lib/BaseCodeBlockPlugin.ts
var BaseCodeLinePlugin = createTSlatePlugin({
  key: "code_line",
  node: { isElement: true }
});
var BaseCodeSyntaxPlugin = createSlatePlugin({
  key: "code_syntax",
  node: { isLeaf: true }
});
var BaseCodeBlockPlugin = createTSlatePlugin({
  key: "code_block",
  inject: {
    plugins: {
      [HtmlPlugin.key]: {
        parser: {
          query: ({ editor }) => !editor.api.some({
            match: { type: editor.getType(BaseCodeLinePlugin) }
          })
        }
      }
    }
  },
  node: { isElement: true },
  options: {
    defaultLanguage: null,
    lowlight: null
  },
  parsers: { html: { deserializer: htmlDeserializerCodeBlock } },
  plugins: [BaseCodeLinePlugin, BaseCodeSyntaxPlugin],
  decorate: ({ editor, entry: [node, path], getOptions, type }) => {
    if (!getOptions().lowlight) return [];
    const codeLineType = editor.getType(BaseCodeLinePlugin);
    if (node.type === type && !CODE_LINE_TO_DECORATIONS.get(node.children[0])) {
      setCodeBlockToDecorations(editor, [node, path]);
    }
    if (node.type === codeLineType) {
      return CODE_LINE_TO_DECORATIONS.get(node) || [];
    }
    return [];
  }
}).overrideEditor(
  ({ editor, getOptions, tf: { apply, normalizeNode }, type }) => ({
    transforms: {
      apply(operation) {
        if (getOptions().lowlight && operation.type === "set_node") {
          const entry = editor.api.node(operation.path);
          if (entry?.[0].type === type && operation.newProperties?.lang) {
            resetCodeBlockDecorations(entry[0]);
          }
        }
        apply(operation);
      },
      normalizeNode(entry, options) {
        const [node] = entry;
        if (getOptions().lowlight && node.type === type) {
          setCodeBlockToDecorations(
            editor,
            entry
          );
        }
        normalizeNode(entry, options);
      }
    }
  })
).overrideEditor(withCodeBlock);

// src/react/onKeyDownCodeBlock.ts
import { Hotkeys, isHotkey } from "@udecode/plate";
var onKeyDownCodeBlock = ({ editor, event }) => {
  if (event.defaultPrevented) return;
  const isTab = Hotkeys.isTab(editor, event);
  const isUntab = Hotkeys.isUntab(editor, event);
  if (isTab || isUntab) {
    const _codeLines = editor.api.nodes({
      match: { type: editor.getType(BaseCodeLinePlugin) }
    });
    const codeLines = Array.from(_codeLines);
    if (codeLines.length > 0) {
      event.preventDefault();
      const [, firstLinePath] = codeLines[0];
      const codeBlock = editor.api.parent(firstLinePath);
      if (!codeBlock) return;
      editor.tf.withoutNormalizing(() => {
        for (const codeLine of codeLines) {
          if (isUntab) {
            outdentCodeLine(editor, { codeBlock, codeLine });
          }
          if (isTab) {
            indentCodeLine(editor, { codeBlock, codeLine });
          }
        }
      });
    }
  }
  if (isHotkey("mod+a", event)) {
    const res = getCodeLineEntry(editor, {});
    if (!res) return;
    const { codeBlock } = res;
    const [, codeBlockPath] = codeBlock;
    if (editor.api.isAt({ end: true }) && editor.api.isAt({ start: true }))
      return;
    editor.tf.select(codeBlockPath);
    event.preventDefault();
    event.stopPropagation();
  }
};

// src/react/CodeBlockPlugin.tsx
var CodeSyntaxPlugin = toPlatePlugin(BaseCodeSyntaxPlugin);
var CodeLinePlugin = toPlatePlugin(BaseCodeLinePlugin);
var CodeBlockPlugin = toPlatePlugin(BaseCodeBlockPlugin, {
  handlers: {
    onKeyDown: onKeyDownCodeBlock
  },
  plugins: [CodeLinePlugin, CodeSyntaxPlugin]
}).extend(({ editor, plugin }) => ({
  shortcuts: {
    toggleCodeBlock: {
      keys: [[Key.Mod, Key.Alt, "8"]],
      preventDefault: true,
      handler: () => {
        editor.tf.toggleBlock(editor.getType(plugin));
      }
    }
  }
}));
export {
  CodeBlockPlugin,
  CodeLinePlugin,
  CodeSyntaxPlugin,
  onKeyDownCodeBlock
};
//# sourceMappingURL=index.mjs.map