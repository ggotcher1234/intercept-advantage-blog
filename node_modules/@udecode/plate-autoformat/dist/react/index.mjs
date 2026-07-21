// src/react/AutoformatPlugin.tsx
import { toPlatePlugin } from "@udecode/plate/react";

// src/lib/BaseAutoformatPlugin.ts
import { createTSlatePlugin } from "@udecode/plate";

// src/lib/transforms/autoformatBlock.ts
import {
  BaseParagraphPlugin,
  ElementApi
} from "@udecode/plate";
import castArray2 from "lodash/castArray.js";

// src/lib/utils/getMatchRange.ts
import castArray from "lodash/castArray.js";
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
  const triggers = trigger ? castArray(trigger) : [end.slice(-1)];
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
  type = BaseParagraphPlugin.key
}) => {
  const matches = castArray2(_match);
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
        match: (n) => ElementApi.isElement(n) && editor.api.isVoid(n)
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
import castArray3 from "lodash/castArray.js";

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
  const matches = castArray3(_match);
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
    const marks = castArray3(type);
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
import castArray4 from "lodash/castArray.js";
var autoformatText = (editor, { format, match: _match, text, trigger }) => {
  const selection = editor.selection;
  const matches = castArray4(_match);
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
var BaseAutoformatPlugin = createTSlatePlugin({
  key: "autoformat",
  options: {
    rules: []
  }
}).overrideEditor(withAutoformat);

// src/react/onKeyDownAutoformat.ts
import { isHotkey, RangeApi } from "@udecode/plate";
var onKeyDownAutoformat = ({
  editor,
  event,
  getOptions
}) => {
  const { enableUndoOnDelete, rules } = getOptions();
  if (event.defaultPrevented) return false;
  if (!isHotkey("backspace", { byKey: true }, event)) return false;
  if (!rules) return false;
  if (!enableUndoOnDelete) return false;
  const { selection } = editor;
  if (!selection || !editor.api.isCollapsed()) return;
  const [start, end] = RangeApi.edges(selection);
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
var AutoformatPlugin = toPlatePlugin(BaseAutoformatPlugin, {
  handlers: {
    onKeyDown: onKeyDownAutoformat
  }
});
export {
  AutoformatPlugin,
  onKeyDownAutoformat
};
//# sourceMappingURL=index.mjs.map