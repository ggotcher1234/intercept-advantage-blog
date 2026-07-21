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

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BaseAutoformatPlugin: () => BaseAutoformatPlugin,
  autoformatArrow: () => autoformatArrow,
  autoformatBlock: () => autoformatBlock,
  autoformatComparison: () => autoformatComparison,
  autoformatDivision: () => autoformatDivision,
  autoformatEquality: () => autoformatEquality,
  autoformatFraction: () => autoformatFraction,
  autoformatLegal: () => autoformatLegal,
  autoformatLegalHtml: () => autoformatLegalHtml,
  autoformatMark: () => autoformatMark,
  autoformatMath: () => autoformatMath,
  autoformatOperation: () => autoformatOperation,
  autoformatPunctuation: () => autoformatPunctuation,
  autoformatSmartQuotes: () => autoformatSmartQuotes,
  autoformatSubscriptNumbers: () => autoformatSubscriptNumbers,
  autoformatSubscriptSymbols: () => autoformatSubscriptSymbols,
  autoformatSuperscriptNumbers: () => autoformatSuperscriptNumbers,
  autoformatSuperscriptSymbols: () => autoformatSuperscriptSymbols,
  autoformatText: () => autoformatText,
  getMatchPoints: () => getMatchPoints,
  getMatchRange: () => getMatchRange,
  isPreviousCharacterEmpty: () => isPreviousCharacterEmpty,
  withAutoformat: () => withAutoformat
});
module.exports = __toCommonJS(index_exports);

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

// src/lib/rules/autoformatArrow.ts
var autoformatArrow = [
  {
    format: "\u2192",
    match: "->",
    mode: "text"
  },
  {
    format: "\u2190",
    match: "<-",
    mode: "text"
  },
  {
    format: "\u21D2",
    match: "=>",
    mode: "text"
  },
  {
    format: "\u21D0",
    match: ["<=", "\u2264="],
    mode: "text"
  }
];

// src/lib/rules/autoformatLegal.ts
var autoformatLegal = [
  {
    format: "\u2122",
    match: ["(tm)", "(TM)"],
    mode: "text"
  },
  {
    format: "\xAE",
    match: ["(r)", "(R)"],
    mode: "text"
  },
  {
    format: "\xA9",
    match: ["(c)", "(C)"],
    mode: "text"
  }
];
var autoformatLegalHtml = [
  {
    format: "\u2122",
    match: "&trade;",
    mode: "text"
  },
  {
    format: "\xAE",
    match: "&reg;",
    mode: "text"
  },
  {
    format: "\xA9",
    match: "&copy;",
    mode: "text"
  },
  {
    format: "\xA7",
    match: "&sect;",
    mode: "text"
  }
];

// src/lib/rules/autoformatPunctuation.ts
var autoformatPunctuation = [
  {
    format: "\u2014",
    match: "--",
    mode: "text"
  },
  {
    format: "\u2026",
    match: "...",
    mode: "text"
  },
  {
    format: "\xBB",
    match: ">>",
    mode: "text"
  },
  {
    format: "\xAB",
    match: "<<",
    mode: "text"
  }
];

// src/lib/rules/autoformatSmartQuotes.ts
var autoformatSmartQuotes = [
  {
    format: ["\u201C", "\u201D"],
    match: '"',
    mode: "text"
  },
  {
    format: ["\u2018", "\u2019"],
    match: "'",
    mode: "text"
  }
];

// src/lib/rules/math/autoformatComparison.ts
var autoformatComparison = [
  {
    format: "\u226F",
    match: "!>",
    mode: "text"
  },
  {
    format: "\u226E",
    match: "!<",
    mode: "text"
  },
  {
    format: "\u2265",
    match: ">=",
    mode: "text"
  },
  {
    format: "\u2264",
    match: "<=",
    mode: "text"
  },
  {
    format: "\u2271",
    match: "!>=",
    mode: "text"
  },
  {
    format: "\u2270",
    match: "!<=",
    mode: "text"
  }
];

// src/lib/rules/math/autoformatEquality.ts
var autoformatEquality = [
  {
    format: "\u2260",
    match: "!=",
    mode: "text"
  },
  {
    format: "\u2261",
    match: "==",
    mode: "text"
  },
  {
    format: "\u2262",
    match: ["!==", "\u2260="],
    mode: "text"
  },
  {
    format: "\u2248",
    match: "~=",
    mode: "text"
  },
  {
    format: "\u2249",
    match: "!~=",
    mode: "text"
  }
];

// src/lib/rules/math/autoformatFraction.ts
var autoformatFraction = [
  {
    format: "\xBD",
    match: "1/2",
    mode: "text"
  },
  {
    format: "\u2153",
    match: "1/3",
    mode: "text"
  },
  {
    format: "\xBC",
    match: "1/4",
    mode: "text"
  },
  {
    format: "\u2155",
    match: "1/5",
    mode: "text"
  },
  {
    format: "\u2159",
    match: "1/6",
    mode: "text"
  },
  {
    format: "\u2150",
    match: "1/7",
    mode: "text"
  },
  {
    format: "\u215B",
    match: "1/8",
    mode: "text"
  },
  {
    format: "\u2151",
    match: "1/9",
    mode: "text"
  },
  {
    format: "\u2152",
    match: "1/10",
    mode: "text"
  },
  {
    format: "\u2154",
    match: "2/3",
    mode: "text"
  },
  {
    format: "\u2156",
    match: "2/5",
    mode: "text"
  },
  {
    format: "\xBE",
    match: "3/4",
    mode: "text"
  },
  {
    format: "\u2157",
    match: "3/5",
    mode: "text"
  },
  {
    format: "\u215C",
    match: "3/8",
    mode: "text"
  },
  {
    format: "\u2158",
    match: "4/5",
    mode: "text"
  },
  {
    format: "\u215A",
    match: "5/6",
    mode: "text"
  },
  {
    format: "\u215D",
    match: "5/8",
    mode: "text"
  },
  {
    format: "\u215E",
    match: "7/8",
    mode: "text"
  }
];

// src/lib/rules/math/autoformatOperation.ts
var autoformatDivision = [
  {
    format: "\xF7",
    match: "//",
    mode: "text"
  }
];
var autoformatOperation = [
  {
    format: "\xB1",
    match: "+-",
    mode: "text"
  },
  {
    format: "\u2030",
    match: "%%",
    mode: "text"
  },
  {
    format: "\u2031",
    match: ["%%%", "\u2030%"],
    mode: "text"
  },
  ...autoformatDivision
];

// src/lib/rules/math/autoformatSubscript.ts
var autoformatSubscriptNumbers = [
  {
    format: "\u2080",
    match: "~0",
    mode: "text"
  },
  {
    format: "\u2081",
    match: "~1",
    mode: "text"
  },
  {
    format: "\u2082",
    match: "~2",
    mode: "text"
  },
  {
    format: "\u2083",
    match: "~3",
    mode: "text"
  },
  {
    format: "\u2084",
    match: "~4",
    mode: "text"
  },
  {
    format: "\u2085",
    match: "~5",
    mode: "text"
  },
  {
    format: "\u2086",
    match: "~6",
    mode: "text"
  },
  {
    format: "\u2087",
    match: "~7",
    mode: "text"
  },
  {
    format: "\u2088",
    match: "~8",
    mode: "text"
  },
  {
    format: "\u2089",
    match: "~9",
    mode: "text"
  }
];
var autoformatSubscriptSymbols = [
  {
    format: "\u208A",
    match: "~+",
    mode: "text"
  },
  {
    format: "\u208B",
    match: "~-",
    mode: "text"
  }
];

// src/lib/rules/math/autoformatSuperscript.ts
var autoformatSuperscriptNumbers = [
  {
    format: "\u2070",
    match: "^0",
    mode: "text"
  },
  {
    format: "\xB9",
    match: "^1",
    mode: "text"
  },
  {
    format: "\xB2",
    match: "^2",
    mode: "text"
  },
  {
    format: "\xB3",
    match: "^3",
    mode: "text"
  },
  {
    format: "\u2074",
    match: "^4",
    mode: "text"
  },
  {
    format: "\u2075",
    match: "^5",
    mode: "text"
  },
  {
    format: "\u2076",
    match: "^6",
    mode: "text"
  },
  {
    format: "\u2077",
    match: "^7",
    mode: "text"
  },
  {
    format: "\u2078",
    match: "^8",
    mode: "text"
  },
  {
    format: "\u2079",
    match: "^9",
    mode: "text"
  }
];
var autoformatSuperscriptSymbols = [
  {
    format: "\xB0",
    match: "^o",
    mode: "text"
  },
  {
    format: "\u207A",
    match: "^+",
    mode: "text"
  },
  {
    format: "\u207B",
    match: "^-",
    mode: "text"
  }
];

// src/lib/rules/math/autoformatMath.ts
var autoformatMath = [
  ...autoformatComparison,
  ...autoformatEquality,
  ...autoformatOperation,
  ...autoformatFraction,
  ...autoformatSuperscriptSymbols,
  ...autoformatSubscriptSymbols,
  ...autoformatSuperscriptNumbers,
  ...autoformatSubscriptNumbers
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseAutoformatPlugin,
  autoformatArrow,
  autoformatBlock,
  autoformatComparison,
  autoformatDivision,
  autoformatEquality,
  autoformatFraction,
  autoformatLegal,
  autoformatLegalHtml,
  autoformatMark,
  autoformatMath,
  autoformatOperation,
  autoformatPunctuation,
  autoformatSmartQuotes,
  autoformatSubscriptNumbers,
  autoformatSubscriptSymbols,
  autoformatSuperscriptNumbers,
  autoformatSuperscriptSymbols,
  autoformatText,
  getMatchPoints,
  getMatchRange,
  isPreviousCharacterEmpty,
  withAutoformat
});
//# sourceMappingURL=index.js.map