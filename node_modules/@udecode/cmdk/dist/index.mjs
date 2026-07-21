// src/cmdk.tsx
import * as RadixDialog from "@radix-ui/react-dialog";
import { useId } from "@radix-ui/react-id";
import { Primitive } from "@radix-ui/react-primitive";
import * as React from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim/index.js";

// src/internal/command-score.ts
var PENALTY_CASE_MISMATCH = 0.9999;
var PENALTY_NOT_COMPLETE = 0.99;
var PENALTY_SKIPPED = 0.999;
var SCORE_CHARACTER_JUMP = 0.17;
var SCORE_CONTINUE_MATCH = 1;
var SCORE_NON_SPACE_WORD_JUMP = 0.8;
var SCORE_SPACE_WORD_JUMP = 0.9;
var SCORE_TRANSPOSITION = 0.1;
var COUNT_GAPS_REGEXP = /["#&(+./@[\\_{]/g;
var COUNT_SPACE_REGEXP = /[\s-]/g;
var IS_GAP_REGEXP = /["#&(+./@[\\_{]/;
var IS_SPACE_REGEXP = /[\s-]/;
function commandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, stringIndex, abbreviationIndex, memoizedResults) {
  if (abbreviationIndex === abbreviation.length) {
    if (stringIndex === string.length) {
      return SCORE_CONTINUE_MATCH;
    }
    return PENALTY_NOT_COMPLETE;
  }
  const memoizeKey = `${stringIndex},${abbreviationIndex}`;
  if (memoizedResults[memoizeKey] !== void 0) {
    return memoizedResults[memoizeKey];
  }
  const abbreviationChar = lowerAbbreviation.charAt(abbreviationIndex);
  let index = lowerString.indexOf(abbreviationChar, stringIndex);
  let highScore = 0;
  let score, spaceBreaks, transposedScore, wordBreaks;
  while (index >= 0) {
    score = commandScoreInner(
      string,
      abbreviation,
      lowerString,
      lowerAbbreviation,
      index + 1,
      abbreviationIndex + 1,
      memoizedResults
    );
    if (score > highScore) {
      if (index === stringIndex) {
        score *= SCORE_CONTINUE_MATCH;
      } else if (IS_GAP_REGEXP.test(string.charAt(index - 1))) {
        score *= SCORE_NON_SPACE_WORD_JUMP;
        wordBreaks = string.slice(stringIndex, index - 1).match(COUNT_GAPS_REGEXP);
        if (wordBreaks && stringIndex > 0) {
          score *= PENALTY_SKIPPED ** wordBreaks.length;
        }
      } else if (IS_SPACE_REGEXP.test(string.charAt(index - 1))) {
        score *= SCORE_SPACE_WORD_JUMP;
        spaceBreaks = string.slice(stringIndex, index - 1).match(COUNT_SPACE_REGEXP);
        if (spaceBreaks && stringIndex > 0) {
          score *= PENALTY_SKIPPED ** spaceBreaks.length;
        }
      } else {
        score *= SCORE_CHARACTER_JUMP;
        if (stringIndex > 0) {
          score *= PENALTY_SKIPPED ** (index - stringIndex);
        }
      }
      if (string.charAt(index) !== abbreviation.charAt(abbreviationIndex)) {
        score *= PENALTY_CASE_MISMATCH;
      }
    }
    if (score < SCORE_TRANSPOSITION && lowerString.charAt(index - 1) === lowerAbbreviation.charAt(abbreviationIndex + 1) || lowerAbbreviation.charAt(abbreviationIndex + 1) === lowerAbbreviation.charAt(abbreviationIndex) && // allow duplicate letters. Ref #7428
    lowerString.charAt(index - 1) !== lowerAbbreviation.charAt(abbreviationIndex)) {
      transposedScore = commandScoreInner(
        string,
        abbreviation,
        lowerString,
        lowerAbbreviation,
        index + 1,
        abbreviationIndex + 2,
        memoizedResults
      );
      if (transposedScore * SCORE_TRANSPOSITION > score) {
        score = transposedScore * SCORE_TRANSPOSITION;
      }
    }
    if (score > highScore) {
      highScore = score;
    }
    index = lowerString.indexOf(abbreviationChar, index + 1);
  }
  memoizedResults[memoizeKey] = highScore;
  return highScore;
}
function formatInput(string) {
  return string.toLowerCase().replaceAll(COUNT_SPACE_REGEXP, " ");
}
function commandScore(string, abbreviation, aliases) {
  const searchString = aliases && aliases.length > 0 ? `${string} ${aliases.join(" ")}` : string;
  return commandScoreInner(
    searchString,
    abbreviation,
    formatInput(searchString),
    formatInput(abbreviation),
    0,
    0,
    {}
  );
}

// src/cmdk.tsx
var GROUP_SELECTOR = `[cmdk-group=""]`;
var GROUP_ITEMS_SELECTOR = `[cmdk-group-items=""]`;
var GROUP_HEADING_SELECTOR = `[cmdk-group-heading=""]`;
var ITEM_SELECTOR = `[cmdk-item=""]`;
var VALID_ITEM_SELECTOR = `${ITEM_SELECTOR}:not([aria-disabled="true"])`;
var SELECT_EVENT = "cmdk-item-select";
var VALUE_ATTR = "data-value";
var defaultFilter = (value, search, keywords) => commandScore(value, search, keywords);
var CommandContext = React.createContext(void 0);
var useCommand = () => React.useContext(CommandContext);
var StoreContext = React.createContext(void 0);
var ActionsContext = React.createContext(void 0);
var useStore = () => React.useContext(StoreContext);
var useCommandActions = () => {
  const context = React.useContext(ActionsContext);
  if (context === void 0) {
    throw new Error(
      "useCommandActions must be used within a Command component"
    );
  }
  return context;
};
var GroupContext = React.createContext(void 0);
var Command = React.forwardRef(
  (props, forwardedRef) => {
    const state = useLazyRef(() => ({
      filtered: {
        /** The count of all visible items. */
        count: 0,
        /** Set of groups with at least one visible item. */
        groups: /* @__PURE__ */ new Set(),
        /** Map from visible item id to its search score. */
        items: /* @__PURE__ */ new Map()
      },
      /** Value of the search query. */
      search: "",
      /** Currently selected item value. */
      value: props.value ?? props.defaultValue ?? ""
    }));
    const allItems = useLazyRef(() => /* @__PURE__ */ new Set());
    const allGroups = useLazyRef(() => /* @__PURE__ */ new Map());
    const ids = useLazyRef(
      () => /* @__PURE__ */ new Map()
    );
    const listeners = useLazyRef(() => /* @__PURE__ */ new Set());
    const propsRef = useAsRef(props);
    const {
      children,
      filter,
      label,
      loop,
      shouldFilter,
      value,
      vimBindings = true,
      onValueChange,
      ...etc
    } = props;
    const listId = useId();
    const labelId = useId();
    const inputId = useId();
    const listInnerRef = React.useRef(null);
    const schedule = useScheduleLayoutEffect();
    useLayoutEffect2(() => {
      if (value !== void 0) {
        const v = value.trim();
        state.current.value = v;
        store.emit();
      }
    }, [value]);
    useLayoutEffect2(() => {
      schedule(6, scrollSelectedIntoView);
    }, []);
    const store = React.useMemo(() => {
      return {
        emit: () => {
          for (const l of listeners.current) {
            l();
          }
        },
        setState: (key, value2, opts) => {
          if (Object.is(state.current[key], value2)) return;
          state.current[key] = value2;
          if (key === "search") {
            filterItems();
            sort();
            schedule(1, selectFirstItem);
          } else if (key === "value") {
            if (!opts) {
              schedule(5, scrollSelectedIntoView);
            }
            if (propsRef.current?.value !== void 0) {
              const newValue = value2 ?? "";
              propsRef.current.onValueChange?.(newValue);
              return;
            }
          }
          store.emit();
        },
        snapshot: () => state.current,
        subscribe: (cb) => {
          listeners.current.add(cb);
          return () => listeners.current.delete(cb);
        }
      };
    }, []);
    const context = React.useMemo(
      () => ({
        inputId,
        label: label ?? props["aria-label"],
        labelId,
        listId,
        listInnerRef,
        filter: () => propsRef.current.shouldFilter,
        getDisablePointerSelection: () => propsRef.current.disablePointerSelection,
        // Track group lifecycle (mount, unmount)
        group: (id) => {
          if (!allGroups.current.has(id)) {
            allGroups.current.set(id, /* @__PURE__ */ new Set());
          }
          return () => {
            ids.current.delete(id);
            allGroups.current.delete(id);
          };
        },
        // Track item lifecycle (mount, unmount)
        item: (id, groupId) => {
          allItems.current.add(id);
          if (groupId) {
            if (allGroups.current.has(groupId)) {
              allGroups.current.get(groupId).add(id);
            } else {
              allGroups.current.set(groupId, /* @__PURE__ */ new Set([id]));
            }
          }
          schedule(3, () => {
            filterItems();
            sort();
            if (!state.current.value) {
              selectFirstItem();
            }
            store.emit();
          });
          return () => {
            ids.current.delete(id);
            allItems.current.delete(id);
            state.current.filtered.items.delete(id);
            const selectedItem = getSelectedItem();
            schedule(4, () => {
              filterItems();
              if (selectedItem?.getAttribute("id") === id) selectFirstItem();
              store.emit();
            });
          };
        },
        // Keep id → {value, keywords} mapping up-to-date
        value: (id, value2, keywords) => {
          if (value2 !== ids.current.get(id)?.value) {
            ids.current.set(id, { keywords, value: value2 });
            state.current.filtered.items.set(id, score(value2, keywords));
            schedule(2, () => {
              sort();
              store.emit();
            });
          }
        }
      }),
      []
    );
    function score(value2, keywords) {
      const filter2 = propsRef.current?.filter ?? defaultFilter;
      return value2 ? filter2?.(value2, state.current.search, keywords) : 0;
    }
    function sort() {
      if (!state.current.search || // Explicitly false, because true | undefined is the default
      propsRef.current.shouldFilter === false) {
        return;
      }
      const scores = state.current.filtered.items;
      const groups = [];
      state.current.filtered.groups.forEach((value2) => {
        const items = allGroups.current.get(value2);
        let max = 0;
        items?.forEach((item) => {
          const score2 = scores.get(item);
          max = Math.max(score2, max);
        });
        groups.push([value2, max]);
      });
      const listInsertionElement = listInnerRef.current;
      getValidItems().sort((a, b) => {
        const valueA = a.getAttribute("id");
        const valueB = b.getAttribute("id");
        return (scores.get(valueB) ?? 0) - (scores.get(valueA) ?? 0);
      }).forEach((item) => {
        const group = item.closest(GROUP_ITEMS_SELECTOR);
        if (group) {
          group.append(
            item.parentElement === group ? item : item.closest(`${GROUP_ITEMS_SELECTOR} > *`)
          );
        } else {
          listInsertionElement.append(
            item.parentElement === listInsertionElement ? item : item.closest(`${GROUP_ITEMS_SELECTOR} > *`)
          );
        }
      });
      groups.sort((a, b) => b[1] - a[1]).forEach((group) => {
        const element = listInnerRef.current?.querySelector(
          `${GROUP_SELECTOR}[${VALUE_ATTR}="${encodeURIComponent(group[0])}"]`
        );
        element?.parentElement?.append(element);
      });
    }
    function selectFirstItem() {
      const item = getValidItems().find(
        (item2) => item2.getAttribute("aria-disabled") !== "true"
      );
      const value2 = item?.getAttribute(VALUE_ATTR);
      store.setState("value", value2 ?? void 0);
    }
    function filterItems() {
      if (!state.current.search || // Explicitly false, because true | undefined is the default
      propsRef.current.shouldFilter === false) {
        state.current.filtered.count = allItems.current.size;
        return;
      }
      state.current.filtered.groups = /* @__PURE__ */ new Set();
      let itemCount = 0;
      for (const id of allItems.current) {
        const value2 = ids.current.get(id)?.value ?? "";
        const keywords = ids.current.get(id)?.keywords ?? [];
        const rank = score(value2, keywords);
        state.current.filtered.items.set(id, rank);
        if (rank > 0) itemCount++;
      }
      for (const [groupId, group] of allGroups.current) {
        for (const itemId of group) {
          if (state.current.filtered.items.get(itemId) > 0) {
            state.current.filtered.groups.add(groupId);
            break;
          }
        }
      }
      state.current.filtered.count = itemCount;
    }
    function scrollSelectedIntoView() {
      const item = getSelectedItem();
      if (item) {
        if (item.parentElement?.firstChild === item) {
          item.closest(GROUP_SELECTOR)?.querySelector(GROUP_HEADING_SELECTOR)?.scrollIntoView({ block: "nearest" });
        }
        item.scrollIntoView({ block: "nearest" });
      }
    }
    function getSelectedItem() {
      return listInnerRef.current?.querySelector(
        `${ITEM_SELECTOR}[aria-selected="true"]`
      );
    }
    function getValidItems() {
      return Array.from(
        listInnerRef.current?.querySelectorAll(VALID_ITEM_SELECTOR) || []
      );
    }
    function updateSelectedToIndex(index) {
      const items = getValidItems();
      const item = items[index];
      if (item) store.setState("value", item.getAttribute(VALUE_ATTR));
    }
    function updateSelectedByItem(change) {
      const selected = getSelectedItem();
      const items = getValidItems();
      const index = items.indexOf(selected);
      let newSelected = items[index + change];
      if (propsRef.current?.loop) {
        newSelected = index + change < 0 ? items.at(-1) : index + change === items.length ? items[0] : items[index + change];
      }
      if (newSelected)
        store.setState("value", newSelected.getAttribute(VALUE_ATTR));
    }
    function updateSelectedByGroup(change) {
      const selected = getSelectedItem();
      let group = selected?.closest(GROUP_SELECTOR);
      let item;
      while (group && !item) {
        group = change > 0 ? findNextSibling(group, GROUP_SELECTOR) : findPreviousSibling(group, GROUP_SELECTOR);
        item = group.querySelector(VALID_ITEM_SELECTOR);
      }
      if (item) {
        store.setState("value", item.getAttribute(VALUE_ATTR));
      } else {
        updateSelectedByItem(change);
      }
    }
    const last = () => updateSelectedToIndex(getValidItems().length - 1);
    const next = (e) => {
      e.preventDefault();
      if (e.metaKey) {
        last();
      } else if (e.altKey) {
        updateSelectedByGroup(1);
      } else {
        updateSelectedByItem(1);
      }
    };
    const prev = (e) => {
      e.preventDefault();
      if (e.metaKey) {
        updateSelectedToIndex(0);
      } else if (e.altKey) {
        updateSelectedByGroup(-1);
      } else {
        updateSelectedByItem(-1);
      }
    };
    const selectItem = () => {
      const item = getSelectedItem();
      if (item) {
        const event = new Event(SELECT_EVENT);
        item.dispatchEvent(event);
      }
    };
    const setSearch = (search) => {
      store.setState("search", search);
    };
    const actions = React.useMemo(
      () => ({
        selectCurrentItem: selectItem,
        selectFirstItem,
        selectItem: updateSelectedToIndex,
        selectLastItem: last,
        selectNextItem: next,
        selectPrevItem: prev,
        setSearch,
        selectNextGroup: () => updateSelectedByGroup(1),
        selectPrevGroup: () => updateSelectedByGroup(-1)
      }),
      []
    );
    return /* @__PURE__ */ React.createElement(
      Primitive.div,
      {
        ref: forwardedRef,
        tabIndex: -1,
        ...etc,
        "cmdk-root": "",
        onKeyDown: (e) => {
          etc.onKeyDown?.(e);
          if (!e.defaultPrevented) {
            switch (e.key) {
              case "ArrowDown": {
                next(e);
                break;
              }
              case "ArrowUp": {
                prev(e);
                break;
              }
              case "End": {
                e.preventDefault();
                last();
                break;
              }
              case "Enter": {
                if (!e.nativeEvent.isComposing && e.keyCode !== 229) {
                  e.preventDefault();
                  const item = getSelectedItem();
                  if (item) {
                    const event = new Event(SELECT_EVENT);
                    item.dispatchEvent(event);
                  }
                }
                break;
              }
              case "Home": {
                e.preventDefault();
                updateSelectedToIndex(0);
                break;
              }
              case "j":
              case "n": {
                if (vimBindings && e.ctrlKey) {
                  next(e);
                }
                break;
              }
              case "k":
              case "p": {
                if (vimBindings && e.ctrlKey) {
                  prev(e);
                }
                break;
              }
            }
          }
        }
      },
      /* @__PURE__ */ React.createElement(
        "label",
        {
          "cmdk-label": "",
          htmlFor: context.inputId,
          id: context.labelId,
          style: srOnlyStyles
        },
        label
      ),
      SlottableWithNestedChildren(props, (child) => /* @__PURE__ */ React.createElement(StoreContext.Provider, { value: store }, /* @__PURE__ */ React.createElement(ActionsContext.Provider, { value: actions }, /* @__PURE__ */ React.createElement(CommandContext.Provider, { value: context }, child))))
    );
  }
);
var Item = React.forwardRef(
  (props, forwardedRef) => {
    const id = useId();
    const ref = React.useRef(null);
    const groupContext = React.useContext(GroupContext);
    const context = useCommand();
    const propsRef = useAsRef(props);
    const forceMount = propsRef.current?.forceMount ?? groupContext?.forceMount;
    useLayoutEffect2(() => {
      if (!forceMount) {
        return context.item(id, groupContext?.id);
      }
    }, [forceMount]);
    const value = useValue(id, ref, [props.value, props.children, ref]);
    const store = useStore();
    const selected = useCmdk(
      (state) => state.value && state.value === value.current
    );
    const render = useCmdk(
      (state) => forceMount ? true : context.filter() === false ? true : state.search ? state.filtered.items.get(id) > 0 : true
    );
    React.useEffect(() => {
      const element = ref.current;
      if (!element || props.disabled) return;
      element.addEventListener(SELECT_EVENT, onSelect);
      return () => element.removeEventListener(SELECT_EVENT, onSelect);
    }, [render, props.onSelect, props.disabled]);
    function onSelect() {
      select();
      propsRef.current.onSelect?.(value.current);
    }
    function select() {
      store.setState("value", value.current, true);
    }
    if (!render) return null;
    const {
      disabled,
      forceMount: ___,
      keywords: ____,
      value: _,
      onSelect: __,
      ...etc
    } = props;
    return /* @__PURE__ */ React.createElement(
      Primitive.div,
      {
        ref: mergeRefs([ref, forwardedRef]),
        ...etc,
        "aria-disabled": Boolean(disabled),
        "aria-selected": Boolean(selected),
        "cmdk-item": "",
        "data-disabled": Boolean(disabled),
        "data-selected": Boolean(selected),
        id,
        onClick: disabled ? void 0 : onSelect,
        onPointerMove: disabled || context.getDisablePointerSelection() ? void 0 : select,
        role: "option"
      },
      props.children
    );
  }
);
var Group = React.forwardRef(
  (props, forwardedRef) => {
    const { children, forceMount, heading, ...etc } = props;
    const id = useId();
    const ref = React.useRef(null);
    const headingRef = React.useRef(null);
    const headingId = useId();
    const context = useCommand();
    const render = useCmdk(
      (state) => forceMount ? true : context.filter() === false ? true : state.search ? state.filtered.groups.has(id) : true
    );
    useLayoutEffect2(() => context.group(id), []);
    useValue(id, ref, [props.value, props.heading, headingRef]);
    const contextValue = React.useMemo(
      () => ({ id, forceMount }),
      [forceMount]
    );
    return /* @__PURE__ */ React.createElement(
      Primitive.div,
      {
        ref: mergeRefs([ref, forwardedRef]),
        ...etc,
        "cmdk-group": "",
        hidden: render ? void 0 : true,
        role: "presentation"
      },
      heading && /* @__PURE__ */ React.createElement(
        "div",
        {
          "aria-hidden": true,
          "cmdk-group-heading": "",
          id: headingId,
          ref: headingRef
        },
        heading
      ),
      SlottableWithNestedChildren(props, (child) => /* @__PURE__ */ React.createElement(
        "div",
        {
          "aria-labelledby": heading ? headingId : void 0,
          "cmdk-group-items": "",
          role: "group"
        },
        /* @__PURE__ */ React.createElement(GroupContext.Provider, { value: contextValue }, child)
      ))
    );
  }
);
var Separator = React.forwardRef(
  (props, forwardedRef) => {
    const { alwaysRender, ...etc } = props;
    const ref = React.useRef(null);
    const render = useCmdk((state) => !state.search);
    if (!alwaysRender && !render) return null;
    return /* @__PURE__ */ React.createElement(
      Primitive.div,
      {
        ref: mergeRefs([ref, forwardedRef]),
        ...etc,
        "cmdk-separator": "",
        role: "separator"
      }
    );
  }
);
var Input = React.forwardRef(
  (props, forwardedRef) => {
    const { onValueChange, ...etc } = props;
    const isControlled = props.value != null;
    const store = useStore();
    const search = useCmdk((state) => state.search);
    const value = useCmdk((state) => state.value);
    const context = useCommand();
    const selectedItemId = React.useMemo(() => {
      const item = context.listInnerRef.current?.querySelector(
        `${ITEM_SELECTOR}[${VALUE_ATTR}="${encodeURIComponent(value)}"]`
      );
      return item?.getAttribute("id");
    }, []);
    React.useEffect(() => {
      if (props.value != null) {
        store.setState("search", props.value);
      }
    }, [props.value]);
    return /* @__PURE__ */ React.createElement(
      Primitive.input,
      {
        ref: forwardedRef,
        ...etc,
        "aria-activedescendant": selectedItemId,
        "aria-autocomplete": "list",
        "aria-controls": context.listId,
        "aria-expanded": true,
        "aria-labelledby": context.labelId,
        autoComplete: "off",
        autoCorrect: "off",
        "cmdk-input": "",
        id: context.inputId,
        onChange: (e) => {
          if (!isControlled) {
            store.setState("search", e.target.value);
          }
          onValueChange?.(e.target.value);
        },
        role: "combobox",
        spellCheck: false,
        type: "text",
        value: isControlled ? props.value : search
      }
    );
  }
);
var List = React.forwardRef(
  (props, forwardedRef) => {
    const { children, label = "Suggestions", ...etc } = props;
    const ref = React.useRef(null);
    const height = React.useRef(null);
    const context = useCommand();
    React.useEffect(() => {
      if (height.current && ref.current) {
        const el = height.current;
        const wrapper = ref.current;
        let animationFrame;
        const observer = new ResizeObserver(() => {
          animationFrame = requestAnimationFrame(() => {
            const height2 = el.offsetHeight;
            wrapper.style.setProperty(
              "--cmdk-list-height",
              `${height2.toFixed(1)}px`
            );
          });
        });
        observer.observe(el);
        return () => {
          cancelAnimationFrame(animationFrame);
          observer.unobserve(el);
        };
      }
    }, []);
    return /* @__PURE__ */ React.createElement(
      Primitive.div,
      {
        ref: mergeRefs([ref, forwardedRef]),
        ...etc,
        "aria-label": label,
        "cmdk-list": "",
        id: context.listId,
        role: "listbox"
      },
      SlottableWithNestedChildren(props, (child) => /* @__PURE__ */ React.createElement(
        "div",
        {
          "cmdk-list-sizer": "",
          ref: mergeRefs([height, context.listInnerRef])
        },
        child
      ))
    );
  }
);
var Dialog = React.forwardRef(
  (props, forwardedRef) => {
    const {
      container,
      contentClassName,
      open,
      overlayClassName,
      onOpenChange,
      ...etc
    } = props;
    return /* @__PURE__ */ React.createElement(RadixDialog.Root, { onOpenChange, open }, /* @__PURE__ */ React.createElement(RadixDialog.Portal, { container }, /* @__PURE__ */ React.createElement(RadixDialog.Overlay, { className: overlayClassName, "cmdk-overlay": "" }), /* @__PURE__ */ React.createElement(
      RadixDialog.Content,
      {
        "aria-label": props.label,
        className: contentClassName,
        "cmdk-dialog": ""
      },
      /* @__PURE__ */ React.createElement(Command, { ref: forwardedRef, ...etc })
    )));
  }
);
var Empty = React.forwardRef(
  (props, forwardedRef) => {
    const render = useCmdk((state) => state.filtered.count === 0);
    if (!render) return null;
    return /* @__PURE__ */ React.createElement(
      Primitive.div,
      {
        ref: forwardedRef,
        ...props,
        "cmdk-empty": "",
        role: "presentation"
      }
    );
  }
);
var Loading = React.forwardRef(
  (props, forwardedRef) => {
    const { children, label = "Loading...", progress, ...etc } = props;
    return /* @__PURE__ */ React.createElement(
      Primitive.div,
      {
        ref: forwardedRef,
        ...etc,
        "aria-label": label,
        "aria-valuemax": 100,
        "aria-valuemin": 0,
        "aria-valuenow": progress,
        "cmdk-loading": "",
        role: "progressbar"
      },
      SlottableWithNestedChildren(props, (child) => /* @__PURE__ */ React.createElement("div", { "aria-hidden": true }, child))
    );
  }
);
var pkg = Object.assign(Command, {
  Dialog,
  Empty,
  Group,
  Input,
  Item,
  List,
  Loading,
  Separator
});
function findNextSibling(el, selector) {
  let sibling = el.nextElementSibling;
  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.nextElementSibling;
  }
}
function findPreviousSibling(el, selector) {
  let sibling = el.previousElementSibling;
  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.previousElementSibling;
  }
}
function useAsRef(data) {
  const ref = React.useRef(data);
  useLayoutEffect2(() => {
    ref.current = data;
  });
  return ref;
}
var useLayoutEffect2 = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
function useLazyRef(fn) {
  const ref = React.useRef(void 0);
  if (ref.current === void 0) {
    ref.current = fn();
  }
  return ref;
}
function mergeRefs(refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}
function useCmdk(selector) {
  const store = useStore();
  const cb = () => selector(store.snapshot());
  return useSyncExternalStore(store.subscribe, cb, cb);
}
function useValue(id, ref, deps, aliases = []) {
  const valueRef = React.useRef(void 0);
  const context = useCommand();
  useLayoutEffect2(() => {
    const value = (() => {
      for (const part of deps) {
        if (typeof part === "string") {
          return part.trim();
        }
        if (typeof part === "object" && "current" in part) {
          if (part.current) {
            return part.current.textContent?.trim();
          }
          return valueRef.current;
        }
      }
    })();
    const keywords = aliases.map((alias) => alias.trim());
    context.value(id, value, keywords);
    ref.current?.setAttribute(VALUE_ATTR, value);
    valueRef.current = value;
  });
  return valueRef;
}
var useScheduleLayoutEffect = () => {
  const [s, ss] = React.useState();
  const fns = useLazyRef(() => /* @__PURE__ */ new Map());
  useLayoutEffect2(() => {
    for (const f of fns.current.values()) {
      f();
    }
    fns.current = /* @__PURE__ */ new Map();
  }, [s]);
  return (id, cb) => {
    fns.current.set(id, cb);
    ss({});
  };
};
function renderChildren(children) {
  const childrenType = children.type;
  if (typeof childrenType === "function") return childrenType(children.props);
  if ("render" in childrenType) return childrenType.render(children.props);
  return children;
}
function SlottableWithNestedChildren({ asChild, children }, render) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      renderChildren(children),
      { ref: children.ref },
      render(children.props.children)
    );
  }
  return render(children);
}
var srOnlyStyles = {
  borderWidth: "0",
  clip: "rect(0, 0, 0, 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: "0",
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px"
};
export {
  pkg as Command,
  Dialog as CommandDialog,
  Empty as CommandEmpty,
  Group as CommandGroup,
  Input as CommandInput,
  Item as CommandItem,
  List as CommandList,
  Loading as CommandLoading,
  Command as CommandRoot,
  Separator as CommandSeparator,
  defaultFilter,
  useCommandActions,
  useCmdk as useCommandState
};
//# sourceMappingURL=index.mjs.map