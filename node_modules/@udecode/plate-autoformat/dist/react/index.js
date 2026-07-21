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
  AutoformatPlugin: () => AutoformatPlugin,
  onKeyDownAutoformat: () => onKeyDownAutoformat
});
module.exports = __toCommonJS(react_exports);

// src/react/AutoformatPlugin.tsx
var import_react = require("@udecode/plate/react");

// src/lib/BaseAutoformatPlugin.ts
var import_plate2 = require("@udecode/plate");

// src/lib/transforms/autoformatBlock.ts
var import_plate = require("@udecode/plate");
var import_castArray2 = __toESM(require("lodash/castArray.js"));

// src/lib/utils/getMatchRange.ts
var import_castArray = __toESM(require("lodash/castArray.js"));
var getMatchRange = ({
  match,
  trigger
}) => {
  let start;
  let end;
  if (typeof match === "object") {
    start = match.start;
    end = match.end;
  } else {
    start = match;
    end = start.split("").reverse().join("");
  }
  const triggers = trigger ? (0, import_castArray.default)(trigger) : [end.slice(-1)];
  end = trigger ? end : end.slice(0, -1);
  return {
    end,
    start,
    triggers
  };
};

// src/lib/transforms/autoformatBlock.ts
var autoformatBlock = (editor, {
  allowSameTypeAbove = false,
  format,
  match: _match,
  matchByRegex = false,
  preFormat,
  text,
  trigger,
  triggerAtBlockStart = true,
  type = import_plate.BaseParagraphPlugin.key
}) => {
  const matches = (0, import_castArray2.default)(_match);
  for (const match of matches) {
    const { end, triggers } = getMatchRange({
      match: { end: match, start: "" },
      trigger
    });
    if (!triggers.includes(text)) continue;
    let matchRange;
    let textFromBlockStart = "";
    if (triggerAtBlockStart) {
      matchRange = editor.api.range("start", editor.selection);
      const hasVoidNode = editor.api.some({
        at: matchRange,
        match: (n) => import_plate.ElementApi.isElement(n) && editor.api.isVoid(n)
      });
      if (hasVoidNode) continue;
      textFromBlockStart = editor.api.string(matchRange);
      const isMatched = matchByRegex ? !!textFromBlockStart.match(end) : end === textFromBlockStart;
      if (!isMatched) continue;
    } else {
      matchRange = editor.api.range("before", editor.selection, {
        before: {
          matchByRegex,
          matchString: end
        }
      });
      if (!matchRange) continue;
      textFromBlockStart = editor.api.string(matchRange);
    }
    if (!allowSameTypeAbove) {
      const isBelowSameBlockType = editor.api.some({ match: { type } });
      if (isBelowSameBlockType) continue;
    }
    if (match.length > 1) {
      editor.tf.delete({
        at: matchRange
      });
    }
    if (preFormat) {
      preFormat(editor);
    }
    if (format) {
      format(editor, { matchString: textFromBlockStart });
    } else {
      editor.tf.setNodes(
        { type },
        {
          match: (n) => editor.api.isBlock(n)
        }
      );
    }
    return true;
  }
  return false;
};

// src/lib/transforms/autoformatMark.ts
var import_castArray3 = __toESM(require("lodash/castArray.js"));

// src/lib/utils/isPreviousCharacterEmpty.ts
var isPreviousCharacterEmpty = (editor, at) => {
  const range = editor.api.range("before", at);
  if (range) {
    const text = editor.api.string(range);
    if (text) {
      const noWhiteSpaceRegex = new RegExp(`\\S+`);
      return !noWhiteSpaceRegex.exec(text);
    }
  }
  return true;
};

// src/lib/utils/getMatchPoints.ts
var getMatchPoints = (editor, { end, start }) => {
  const selection = editor.selection;
  let beforeEndMatchPoint = selection.anchor;
  if (end) {
    beforeEndMatchPoint = editor.api.before(selection, {
      matchString: end
    });
    if (!beforeEndMatchPoint) return;
  }
  let afterStartMatchPoint;
  let beforeStartMatchPoint;
  if (start) {
    afterStartMatchPoint = editor.api.before(beforeEndMatchPoint, {
      afterMatch: true,
      matchString: start,
      skipInvalid: true
    });
    if (!afterStartMatchPoint) return;
    beforeStartMatchPoint = editor.api.before(beforeEndMatchPoint, {
      matchString: start,
      skipInvalid: true
    });
    if (!isPreviousCharacterEmpty(editor, beforeStartMatchPoint))
      return;
  }
  return {
    afterStartMatchPoint,
    beforeEndMatchPoint,
    beforeStartMatchPoint
  };
};

// src/lib/transforms/autoformatMark.ts
var autoformatMark = (editor, { ignoreTrim, match: _match, text, trigger, type }) => {
  if (!type) return false;
  const selection = editor.selection;
  const matches = (0, import_castArray3.default)(_match);
  for (const match of matches) {
    const { end, start, triggers } = getMatchRange({
      match,
      trigger
    });
    if (!triggers.includes(text)) continue;
    const matched = getMatchPoints(editor, { end, start });
    if (!matched) continue;
    const { afterStartMatchPoint, beforeEndMatchPoint, beforeStartMatchPoint } = matched;
    const matchRange = {
      anchor: afterStartMatchPoint,
      focus: beforeEndMatchPoint
    };
    if (!ignoreTrim) {
      const matchText = editor.api.string(matchRange);
      if (matchText.trim() !== matchText) continue;
    }
    if (end) {
      editor.tf.delete({
        at: {
          anchor: beforeEndMatchPoint,
          focus: selection.anchor
        }
      });
    }
    const marks = (0, import_castArray3.default)(type);
    editor.tf.select(matchRange);
    marks.forEach((mark) => {
      editor.tf.addMark(mark, true);
    });
    editor.tf.collapse({ edge: "end" });
    editor.tf.removeMarks(marks, { shouldChange: false });
    editor.tf.delete({
      at: {
        anchor: beforeStartMatchPoint,
        focus: afterStartMatchPoint
      }
    });
    return true;
  }
  return false;
};

// src/lib/transforms/autoformatText.ts
var import_castArray4 = __toESM(require("lodash/castArray.js"));
var autoformatText = (editor, { format, match: _match, text, trigger }) => {
  const selection = editor.selection;
  const matches = (0, import_castArray4.default)(_match);
  for (const match of matches) {
    const { end, start, triggers } = getMatchRange({
      match: Array.isArray(format) ? match : {
        end: match,
        start: ""
      },
      trigger
    });
    if (!triggers.includes(text)) continue;
    const matched = getMatchPoints(editor, { end, start });
    if (!matched) continue;
    const { afterStartMatchPoint, beforeEndMatchPoint, beforeStartMatchPoint } = matched;
    if (end) {
      editor.tf.delete({
        at: {
          anchor: beforeEndMatchPoint,
          focus: selection.anchor
        }
      });
    }
    if (typeof format === "function") {
      format(editor, matched);
    } else {
      const formatEnd = Array.isArray(format) ? format[1] : format;
      editor.tf.insertText(formatEnd);
      if (beforeStartMatchPoint) {
        const formatStart = Array.isArray(format) ? format[0] : format;
        editor.tf.delete({
          at: {
            anchor: beforeStartMatchPoint,
            focus: afterStartMatchPoint
          }
        });
        editor.tf.insertText(formatStart, {
          at: beforeStartMatchPoint
        });
      }
    }
    return true;
  }
  return false;
};

// src/lib/withAutoformat.ts
var withAutoformat = ({
  editor,
  getOptions,
  tf: { insertText }
}) => {
  return {
    transforms: {
      insertText(text, options) {
        if (!editor.api.isCollapsed()) return insertText(text, options);
        for (const rule of getOptions().rules) {
          const { insertTrigger, mode = "text", query } = rule;
          if (query && !query(editor, { ...rule, text })) continue;
          const autoformatter = {
            block: autoformatBlock,
            mark: autoformatMark,
            text: autoformatText
          };
          if (autoformatter[mode]?.(editor, {
            ...rule,
            text
          })) {
            return insertTrigger && insertText(text);
          }
        }
        insertText(text, options);
      }
    }
  };
};

// src/lib/BaseAutoformatPlugin.ts
var BaseAutoformatPlugin = (0, import_plate2.createTSlatePlugin)({
  key: "autoformat",
  options: {
    rules: []
  }
}).overrideEditor(withAutoformat);

// src/react/onKeyDownAutoformat.ts
var import_plate3 = require("@udecode/plate");
var onKeyDownAutoformat = ({
  editor,
  event,
  getOptions
}) => {
  const { enableUndoOnDelete, rules } = getOptions();
  if (event.defaultPrevented) return false;
  if (!(0, import_plate3.isHotkey)("backspace", { byKey: true }, event)) return false;
  if (!rules) return false;
  if (!enableUndoOnDelete) return false;
  const { selection } = editor;
  if (!selection || !editor.api.isCollapsed()) return;
  const [start, end] = import_plate3.RangeApi.edges(selection);
  const before = editor.api.before(end, {
    distance: 1,
    unit: "character"
  });
  if (!start) return false;
  if (!before) return false;
  const charRange = { anchor: before, focus: start };
  if (!charRange) return false;
  const char = editor.api.string(charRange);
  if (!char) return false;
  const matchers = [...rules].filter((rule2) => {
    const textRule = rule2;
    if (textRule) {
      return textRule.mode === "text" && textRule.format === char;
    }
    return false;
  });
  if (!matchers || matchers.length === 0) return false;
  event.preventDefault();
  editor.tf.deleteBackward();
  const rule = matchers[0];
  if (rule && typeof rule.match === "string") {
    editor.tf.insertText(rule.match);
  } else {
    const matchArray = rule.match;
    if (matchArray && matchArray.length > 0) {
      editor.tf.insertText(matchArray[0]);
    }
  }
  return true;
};

// src/react/AutoformatPlugin.tsx
var AutoformatPlugin = (0, import_react.toPlatePlugin)(BaseAutoformatPlugin, {
  handlers: {
    onKeyDown: onKeyDownAutoformat
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AutoformatPlugin,
  onKeyDownAutoformat
});
//# sourceMappingURL=index.js.map