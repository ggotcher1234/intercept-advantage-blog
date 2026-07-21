// src/lib/withTriggerCombobox.ts
var withTriggerCombobox = ({ editor, getOptions, tf: { insertText }, type }) => {
  const matchesTrigger = (text) => {
    const { trigger } = getOptions();
    if (trigger instanceof RegExp) {
      return trigger.test(text);
    }
    if (Array.isArray(trigger)) {
      return trigger.includes(text);
    }
    return text === trigger;
  };
  return {
    transforms: {
      insertText(text, options) {
        const {
          createComboboxInput,
          triggerPreviousCharPattern,
          triggerQuery
        } = getOptions();
        if (options?.at || !editor.selection || !matchesTrigger(text) || triggerQuery && !triggerQuery(editor)) {
          return insertText(text, options);
        }
        const previousChar = editor.api.string(
          editor.api.range("before", editor.selection)
        );
        const matchesPreviousCharPattern = triggerPreviousCharPattern?.test(previousChar);
        if (matchesPreviousCharPattern) {
          const inputNode = createComboboxInput ? createComboboxInput(text) : { children: [{ text: "" }], type };
          return editor.tf.insertNodes(inputNode, options);
        }
        return insertText(text, options);
      }
    }
  };
};

// src/lib/utils/filterWords.ts
var filterWords = (haystack, needle, {
  prefixMode = "last-word",
  wordBoundary = /\s+/,
  wordQuantifier = "match-all"
} = {}) => {
  const haystackWords = haystack.trim().split(wordBoundary);
  const needleWords = needle.trim().split(wordBoundary);
  const quantifier = wordQuantifier === "match-all" ? "every" : "some";
  return needleWords[quantifier]((needleWord, i) => {
    const allowPrefix = (() => {
      switch (prefixMode) {
        case "all-words": {
          return true;
        }
        case "last-word": {
          return i === needleWords.length - 1;
        }
        case "none": {
          return false;
        }
      }
    })();
    return haystackWords.some((unslicedHaystackWord) => {
      const haystackWord = allowPrefix ? unslicedHaystackWord.slice(0, needleWord.length) : unslicedHaystackWord;
      return haystackWord.localeCompare(needleWord, void 0, {
        sensitivity: "base",
        usage: "search"
      }) === 0;
    });
  });
};
export {
  filterWords,
  withTriggerCombobox
};
//# sourceMappingURL=index.mjs.map