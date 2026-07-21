"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BaseBulletedListPlugin: () => BaseBulletedListPlugin,
  BaseListItemContentPlugin: () => BaseListItemContentPlugin,
  BaseListItemPlugin: () => BaseListItemPlugin,
  BaseListPlugin: () => BaseListPlugin,
  BaseNumberedListPlugin: () => BaseNumberedListPlugin,
  BaseTodoListPlugin: () => BaseTodoListPlugin,
  getDeepInlineChildren: () => getDeepInlineChildren,
  getHighestEmptyList: () => getHighestEmptyList,
  getListItemEntry: () => getListItemEntry,
  getListRoot: () => getListRoot,
  getListTypes: () => getListTypes,
  getTodoListItemEntry: () => getTodoListItemEntry,
  hasListChild: () => hasListChild,
  indentListItems: () => indentListItems,
  insertListItem: () => insertListItem,
  insertTodoListItem: () => insertTodoListItem,
  isAcrossListItems: () => isAcrossListItems,
  isListNested: () => isListNested,
  isListRoot: () => isListRoot,
  moveListItemDown: () => moveListItemDown,
  moveListItemSublistItemsToListItemSublist: () => moveListItemSublistItemsToListItemSublist,
  moveListItemUp: () => moveListItemUp,
  moveListItems: () => moveListItems,
  moveListItemsToList: () => moveListItemsToList,
  moveListSiblingsAfterCursor: () => moveListSiblingsAfterCursor,
  normalizeListItem: () => normalizeListItem,
  normalizeNestedList: () => normalizeNestedList,
  removeFirstListItem: () => removeFirstListItem,
  removeListItem: () => removeListItem,
  someList: () => someList,
  toggleBulletedList: () => toggleBulletedList,
  toggleList: () => toggleList,
  toggleNumberedList: () => toggleNumberedList,
  unindentListItems: () => unindentListItems,
  unwrapList: () => unwrapList,
  withDeleteForwardList: () => withDeleteForwardList,
  withDeleteFragmentList: () => withDeleteFragmentList,
  withInsertFragmentList: () => withInsertFragmentList,
  withNormalizeList: () => withNormalizeList,
  withTodoList: () => withTodoList
});
module.exports = __toCommonJS(index_exports);

// src/lib/BaseListPlugin.ts
var import_plate19 = require("@udecode/plate");

// src/lib/transforms/moveListItems.ts
var import_plate12 = require("@udecode/plate");

// src/lib/queries/isListNested.ts
var isListNested = (editor, listPath) => {
  const listParentNode = editor.api.parent(listPath)?.[0];
  return listParentNode?.type === editor.getType(BaseListItemPlugin);
};

// src/lib/transforms/moveListItemDown.ts
var import_plate8 = require("@udecode/plate");

// src/lib/queries/getHighestEmptyList.ts
var import_plate = require("@udecode/plate");

// src/lib/queries/getListTypes.ts
var getListTypes = (editor) => {
  return [
    editor.getType(BaseNumberedListPlugin),
    editor.getType(BaseBulletedListPlugin)
  ];
};

// src/lib/queries/getHighestEmptyList.ts
var getHighestEmptyList = (editor, {
  diffListPath,
  liPath
}) => {
  const list = editor.api.above({
    at: liPath,
    match: { type: getListTypes(editor) }
  });
  if (!list) return;
  const [listNode, listPath] = list;
  if (!diffListPath || !import_plate.PathApi.equals(listPath, diffListPath)) {
    if (listNode.children.length < 2) {
      const liParent = editor.api.above({
        at: listPath,
        match: { type: editor.getType(BaseListItemPlugin) }
      });
      if (liParent) {
        return getHighestEmptyList(editor, { diffListPath, liPath: liParent[1] }) || listPath;
      }
    }
    return liPath;
  }
};

// src/lib/queries/getListItemEntry.ts
var import_plate2 = require("@udecode/plate");
var getListItemEntry = (editor, { at = editor.selection } = {}) => {
  const liType = editor.getType(BaseListItemPlugin);
  let _at;
  if (import_plate2.RangeApi.isRange(at) && !import_plate2.RangeApi.isCollapsed(at)) {
    _at = at.focus.path;
  } else if (import_plate2.RangeApi.isRange(at)) {
    _at = at.anchor.path;
  } else {
    _at = at;
  }
  if (_at) {
    const node = import_plate2.NodeApi.get(editor, _at);
    if (node) {
      const listItem = editor.api.above({
        at: _at,
        match: { type: liType }
      });
      if (listItem) {
        const list = editor.api.parent(listItem[1]);
        return { list, listItem };
      }
    }
  }
};

// src/lib/queries/getListRoot.ts
var getListRoot = (editor, at = editor.selection) => {
  if (!at) return;
  const parentList = editor.api.above({
    at,
    match: {
      type: [
        editor.getType(BaseBulletedListPlugin),
        editor.getType(BaseNumberedListPlugin)
      ]
    }
  });
  if (parentList) {
    const [, parentListPath] = parentList;
    return getListRoot(editor, parentListPath) ?? parentList;
  }
};

// src/lib/queries/getTodoListItemEntry.ts
var import_plate4 = require("@udecode/plate");

// src/lib/BaseTodoListPlugin.ts
var import_plate3 = require("@udecode/plate");

// src/lib/withTodoList.ts
var withTodoList = ({
  editor,
  getOptions,
  tf: { insertBreak }
}) => ({
  transforms: {
    insertBreak() {
      const insertBreakTodoList = () => {
        if (!editor.selection) return;
        const res = getTodoListItemEntry(editor);
        if (res) {
          const inserted = insertTodoListItem(editor, getOptions());
          if (inserted) return true;
        }
      };
      if (insertBreakTodoList()) return;
      insertBreak();
    }
  }
});

// src/lib/BaseTodoListPlugin.ts
var BaseTodoListPlugin = (0, import_plate3.createTSlatePlugin)({
  key: "action_item",
  node: { isElement: true }
}).overrideEditor(withTodoList);

// src/lib/queries/getTodoListItemEntry.ts
var getTodoListItemEntry = (editor, { at = editor.selection } = {}) => {
  const todoType = editor.getType(BaseTodoListPlugin);
  let _at;
  if (import_plate4.RangeApi.isRange(at) && !import_plate4.RangeApi.isCollapsed(at)) {
    _at = at.focus.path;
  } else if (import_plate4.RangeApi.isRange(at)) {
    _at = at.anchor.path;
  } else {
    _at = at;
  }
  if (_at) {
    const node = import_plate4.NodeApi.get(editor, _at);
    if (node) {
      const listItem = editor.api.above({
        at: _at,
        match: { type: todoType }
      });
      if (listItem) {
        const list = editor.api.parent(listItem[1]);
        return { list, listItem };
      }
    }
  }
};

// src/lib/queries/hasListChild.ts
var import_plate5 = require("@udecode/plate");
var hasListChild = (editor, node) => node.children.some((n) => (0, import_plate5.match)(n, [], { type: getListTypes(editor) }));

// src/lib/queries/isAcrossListItems.ts
var import_plate6 = require("@udecode/plate");
var isAcrossListItems = (editor, at = editor.selection) => {
  if (!at || import_plate6.RangeApi.isCollapsed(at)) {
    return false;
  }
  const isAcrossBlocks = editor.api.isAt({ at, blocks: true });
  if (!isAcrossBlocks) return false;
  return editor.api.some({
    at,
    match: { type: editor.getType(BaseListItemPlugin) }
  });
};

// src/lib/queries/isListRoot.ts
var import_plate7 = require("@udecode/plate");
var isListRoot = (editor, node) => import_plate7.ElementApi.isElement(node) && getListTypes(editor).includes(node.type);

// src/lib/queries/someList.ts
var someList = (editor, type) => {
  return getListItemEntry(editor)?.list?.[0].type === type;
};

// src/lib/transforms/moveListItemDown.ts
var moveListItemDown = (editor, { list, listItem }) => {
  let moved = false;
  const [listNode] = list;
  const [, listItemPath] = listItem;
  const previousListItemPath = import_plate8.PathApi.previous(listItemPath);
  if (!previousListItemPath) {
    return;
  }
  const previousSiblingItem = editor.api.node(previousListItemPath);
  if (previousSiblingItem) {
    const [previousNode, previousPath] = previousSiblingItem;
    const sublist = previousNode.children.find(
      (n) => (0, import_plate8.match)(n, [], { type: getListTypes(editor) })
    );
    const newPath = previousPath.concat(
      sublist ? [1, sublist.children.length] : [1]
    );
    editor.tf.withoutNormalizing(() => {
      if (!sublist) {
        editor.tf.wrapNodes(
          { children: [], type: listNode.type },
          { at: listItemPath }
        );
      }
      editor.tf.moveNodes({
        at: listItemPath,
        to: newPath
      });
      moved = true;
    });
  }
  return moved;
};

// src/lib/transforms/moveListItemUp.ts
var import_plate11 = require("@udecode/plate");

// src/lib/transforms/moveListItemsToList.ts
var import_plate9 = require("@udecode/plate");
var moveListItemsToList = (editor, {
  deleteFromList = true,
  fromList,
  fromListItem,
  fromStartIndex,
  to: _to,
  toList,
  toListIndex = null
}) => {
  let fromListPath;
  let moved = false;
  editor.tf.withoutNormalizing(() => {
    if (fromListItem) {
      const fromListItemSublist = editor.api.descendant({
        at: fromListItem[1],
        match: {
          type: getListTypes(editor)
        }
      });
      if (!fromListItemSublist) return;
      fromListPath = fromListItemSublist?.[1];
    } else if (fromList) {
      fromListPath = fromList[1];
    } else {
      return;
    }
    let to = null;
    if (_to) to = _to;
    if (toList) {
      if (toListIndex === null) {
        const lastChildPath = import_plate9.NodeApi.lastChild(editor, toList[1])?.[1];
        to = lastChildPath ? import_plate9.PathApi.next(lastChildPath) : toList[1].concat([0]);
      } else {
        to = toList[1].concat([toListIndex]);
      }
    }
    if (!to) return;
    moved = editor.tf.moveNodes({
      at: fromListPath,
      children: true,
      fromIndex: fromStartIndex,
      to
    });
    if (deleteFromList) {
      editor.tf.delete({ at: fromListPath });
    }
  });
  return moved;
};

// src/lib/transforms/unwrapList.ts
var import_plate10 = require("@udecode/plate");
var unwrapList = (editor, { at } = {}) => {
  const ancestorListTypeCheck = () => {
    if (editor.api.above({ at, match: { type: getListTypes(editor) } })) {
      return true;
    }
    if (!at && editor.selection) {
      const commonNode = import_plate10.NodeApi.common(
        editor,
        editor.selection.anchor.path,
        editor.selection.focus.path
      );
      if (import_plate10.ElementApi.isElement(commonNode[0]) && getListTypes(editor).includes(commonNode[0].type)) {
        return true;
      }
    }
    return false;
  };
  editor.tf.withoutNormalizing(() => {
    do {
      editor.tf.unwrapNodes({
        at,
        match: { type: editor.getType(BaseListItemPlugin) },
        split: true
      });
      editor.tf.unwrapNodes({
        at,
        match: {
          type: [
            editor.getType(BaseBulletedListPlugin),
            editor.getType(BaseNumberedListPlugin)
          ]
        },
        split: true
      });
    } while (ancestorListTypeCheck());
  });
};

// src/lib/transforms/moveListItemUp.ts
var moveListItemUp = (editor, { list, listItem }) => {
  const move = () => {
    const [listNode, listPath] = list;
    const [liNode, liPath] = listItem;
    const liParent = editor.api.above({
      at: listPath,
      match: { type: editor.getType(BaseListItemPlugin) }
    });
    if (!liParent) {
      let toListPath2;
      try {
        toListPath2 = import_plate11.PathApi.next(listPath);
      } catch (error) {
        return;
      }
      const condA = hasListChild(editor, liNode);
      const condB = !import_plate11.NodeApi.isLastChild(editor, liPath);
      if (condA || condB) {
        editor.tf.insertNodes(
          {
            children: [],
            type: listNode.type
          },
          { at: toListPath2 }
        );
      }
      if (condA) {
        const toListNode = import_plate11.NodeApi.get(editor, toListPath2);
        if (!toListNode) return;
        moveListItemsToList(editor, {
          fromListItem: listItem,
          toList: [toListNode, toListPath2]
        });
      }
      if (condB) {
        const toListNode = import_plate11.NodeApi.get(editor, toListPath2);
        if (!toListNode) return;
        moveListItemsToList(editor, {
          deleteFromList: false,
          fromList: list,
          fromStartIndex: liPath.at(-1) + 1,
          toList: [toListNode, toListPath2]
        });
      }
      unwrapList(editor, { at: liPath.concat(0) });
      return true;
    }
    const [, liParentPath] = liParent;
    const toListPath = liPath.concat([1]);
    if (!import_plate11.NodeApi.isLastChild(editor, liPath)) {
      if (!hasListChild(editor, liNode)) {
        editor.tf.insertNodes(
          {
            children: [],
            type: listNode.type
          },
          { at: toListPath }
        );
      }
      const toListNode = import_plate11.NodeApi.get(editor, toListPath);
      if (!toListNode) return;
      moveListItemsToList(editor, {
        deleteFromList: false,
        fromListItem: liParent,
        fromStartIndex: liPath.at(-1) + 1,
        toList: [toListNode, toListPath]
      });
    }
    const movedUpLiPath = import_plate11.PathApi.next(liParentPath);
    editor.tf.moveNodes({
      at: liPath,
      to: movedUpLiPath
    });
    return true;
  };
  let moved = false;
  editor.tf.withoutNormalizing(() => {
    moved = move();
  });
  return moved;
};

// src/lib/transforms/removeFirstListItem.ts
var removeFirstListItem = (editor, {
  list,
  listItem
}) => {
  const [, listPath] = list;
  if (!isListNested(editor, listPath)) {
    moveListItemUp(editor, { list, listItem });
    return true;
  }
  return false;
};

// src/lib/transforms/moveListItems.ts
var moveListItems = (editor, {
  at = editor.selection ?? void 0,
  enableResetOnShiftTab,
  increase = true
} = {}) => {
  const _nodes = editor.api.nodes({
    at,
    match: {
      type: editor.getType(BaseListItemContentPlugin)
    }
  });
  const lics = Array.from(_nodes);
  if (lics.length === 0) return;
  const highestLicPaths = [];
  const highestLicPathRefs = [];
  lics.forEach((lic) => {
    const licPath = lic[1];
    const liPath = import_plate12.PathApi.parent(licPath);
    const isAncestor = highestLicPaths.some((path) => {
      const highestLiPath = import_plate12.PathApi.parent(path);
      return import_plate12.PathApi.isAncestor(highestLiPath, liPath);
    });
    if (!isAncestor) {
      highestLicPaths.push(licPath);
      highestLicPathRefs.push(editor.api.pathRef(licPath));
    }
  });
  const licPathRefsToMove = increase ? highestLicPathRefs : highestLicPathRefs.reverse();
  return editor.tf.withoutNormalizing(() => {
    let moved = false;
    licPathRefsToMove.forEach((licPathRef) => {
      const licPath = licPathRef.unref();
      if (!licPath) return;
      const listItem = editor.api.parent(licPath);
      if (!listItem) return;
      const parentList = editor.api.parent(listItem[1]);
      if (!parentList) return;
      let _moved;
      if (increase) {
        _moved = moveListItemDown(editor, {
          list: parentList,
          listItem
        });
      } else if (isListNested(editor, parentList[1])) {
        _moved = moveListItemUp(editor, {
          list: parentList,
          listItem
        });
      } else if (enableResetOnShiftTab) {
        _moved = removeFirstListItem(editor, {
          list: parentList,
          listItem
        });
      }
      moved = _moved || moved;
    });
    return moved;
  });
};

// src/lib/transforms/indentListItems.ts
var indentListItems = (editor) => {
  moveListItems(editor, { increase: true });
};

// src/lib/transforms/insertListItem.ts
var import_plate13 = require("@udecode/plate");
var insertListItem = (editor) => {
  const liType = editor.getType(BaseListItemPlugin);
  const licType = editor.getType(BaseListItemContentPlugin);
  if (!editor.selection) {
    return false;
  }
  const licEntry = editor.api.above({ match: { type: licType } });
  if (!licEntry) return false;
  const [, paragraphPath] = licEntry;
  const listItemEntry = editor.api.parent(paragraphPath);
  if (!listItemEntry) return false;
  const [listItemNode, listItemPath] = listItemEntry;
  if (listItemNode.type !== liType) return false;
  let success = false;
  editor.tf.withoutNormalizing(() => {
    if (!editor.api.isCollapsed()) {
      editor.tf.delete();
    }
    const isStart = editor.api.isStart(editor.selection.focus, paragraphPath);
    const isEnd = editor.api.isEmpty(editor.selection, { after: true });
    const nextParagraphPath = import_plate13.PathApi.next(paragraphPath);
    const nextListItemPath = import_plate13.PathApi.next(listItemPath);
    if (isStart) {
      editor.tf.insertNodes(
        {
          children: [{ children: [{ text: "" }], type: licType }],
          type: liType
        },
        { at: listItemPath }
      );
      success = true;
      return;
    }
    if (isEnd) {
      const marks = editor.api.marks() || {};
      editor.tf.insertNodes(
        {
          children: [{ children: [{ text: "", ...marks }], type: licType }],
          type: liType
        },
        { at: nextListItemPath }
      );
      editor.tf.select(nextListItemPath);
    } else {
      editor.tf.withoutNormalizing(() => {
        editor.tf.splitNodes();
        editor.tf.wrapNodes(
          {
            children: [],
            type: liType
          },
          { at: nextParagraphPath }
        );
        editor.tf.moveNodes({
          at: nextParagraphPath,
          to: nextListItemPath
        });
        editor.tf.select(nextListItemPath);
        editor.tf.collapse({
          edge: "start"
        });
      });
    }
    if (listItemNode.children.length > 1) {
      editor.tf.moveNodes({
        at: nextParagraphPath,
        to: nextListItemPath.concat(1)
      });
    }
    success = true;
  });
  return success;
};

// src/lib/transforms/insertTodoListItem.ts
var import_plate14 = require("@udecode/plate");
var insertTodoListItem = (editor, {
  inheritCheckStateOnLineEndBreak = false,
  inheritCheckStateOnLineStartBreak = false
}) => {
  const todoType = editor.getType(BaseTodoListPlugin);
  if (!editor.selection) {
    return false;
  }
  const todoEntry = editor.api.above({ match: { type: todoType } });
  if (!todoEntry) return false;
  const [todo, paragraphPath] = todoEntry;
  let success = false;
  editor.tf.withoutNormalizing(() => {
    if (!editor.api.isCollapsed()) {
      editor.tf.delete();
    }
    const isStart = editor.api.isStart(editor.selection.focus, paragraphPath);
    const isEnd = editor.api.isEmpty(editor.selection, { after: true });
    const nextParagraphPath = import_plate14.PathApi.next(paragraphPath);
    if (isStart) {
      editor.tf.insertNodes(
        {
          checked: inheritCheckStateOnLineStartBreak ? todo.checked : false,
          children: [{ text: "" }],
          type: todoType
        },
        { at: paragraphPath }
      );
      success = true;
      return;
    }
    if (isEnd) {
      const marks = editor.api.marks() || {};
      editor.tf.insertNodes(
        {
          checked: inheritCheckStateOnLineEndBreak ? todo.checked : false,
          children: [{ text: "", ...marks }],
          type: todoType
        },
        { at: nextParagraphPath }
      );
      editor.tf.select(nextParagraphPath);
    } else {
      editor.tf.withoutNormalizing(() => {
        editor.tf.splitNodes();
      });
    }
    success = true;
  });
  return success;
};

// src/lib/transforms/moveListItemSublistItemsToListItemSublist.ts
var import_plate15 = require("@udecode/plate");
var moveListItemSublistItemsToListItemSublist = (editor, {
  fromListItem,
  start,
  toListItem
}) => {
  const [, fromListItemPath] = fromListItem;
  const [, toListItemPath] = toListItem;
  let moved = false;
  editor.tf.withoutNormalizing(() => {
    const fromListItemSublist = editor.api.descendant({
      at: fromListItemPath,
      match: {
        type: getListTypes(editor)
      }
    });
    if (!fromListItemSublist) return;
    const [, fromListItemSublistPath] = fromListItemSublist;
    const toListItemSublist = editor.api.descendant({
      at: toListItemPath,
      match: {
        type: getListTypes(editor)
      }
    });
    let to;
    if (!toListItemSublist) {
      const fromList = editor.api.parent(fromListItemPath);
      if (!fromList) return;
      const [fromListNode] = fromList;
      const fromListType = fromListNode.type;
      const toListItemSublistPath = toListItemPath.concat([1]);
      editor.tf.insertNodes(
        { children: [], type: fromListType },
        { at: toListItemSublistPath }
      );
      to = toListItemSublistPath.concat([0]);
    } else if (start) {
      const [, toListItemSublistPath] = toListItemSublist;
      to = toListItemSublistPath.concat([0]);
    } else {
      to = import_plate15.PathApi.next(import_plate15.NodeApi.lastChild(editor, toListItemSublist[1])[1]);
    }
    moved = editor.tf.moveNodes({
      at: fromListItemSublistPath,
      children: true,
      to
    });
    editor.tf.delete({ at: fromListItemSublistPath });
  });
  return moved;
};

// src/lib/transforms/moveListSiblingsAfterCursor.ts
var import_plate16 = require("@udecode/plate");
var moveListSiblingsAfterCursor = (editor, {
  at,
  to
}) => {
  const offset = at.at(-1);
  at = import_plate16.PathApi.parent(at);
  const listNode = import_plate16.NodeApi.get(editor, at);
  const listEntry = [listNode, at];
  if (!(0, import_plate16.match)(listNode, [], { type: getListTypes(editor) }) || import_plate16.PathApi.isParent(at, to)) {
    return false;
  }
  return editor.tf.moveNodes({
    at: listEntry[1],
    children: true,
    fromIndex: offset + 1,
    to
  });
};

// src/lib/transforms/removeListItem.ts
var import_plate17 = require("@udecode/plate");
var removeListItem = (editor, { list, listItem, reverse = true }) => {
  const [liNode, liPath] = listItem;
  if (editor.api.isExpanded() || !hasListChild(editor, liNode)) {
    return false;
  }
  const previousLiPath = import_plate17.PathApi.previous(liPath);
  let success = false;
  editor.tf.withoutNormalizing(() => {
    if (previousLiPath) {
      const previousLi = editor.api.node(previousLiPath);
      if (!previousLi) return;
      let tempLiPath = import_plate17.PathApi.next(liPath);
      editor.tf.insertNodes(
        {
          children: [
            {
              children: [{ text: "" }],
              type: editor.getType(BaseListItemContentPlugin)
            }
          ],
          type: editor.getType(BaseListItemPlugin)
        },
        { at: tempLiPath }
      );
      const tempLi = editor.api.node(tempLiPath);
      if (!tempLi) return;
      const tempLiPathRef = editor.api.pathRef(tempLi[1]);
      moveListItemSublistItemsToListItemSublist(editor, {
        fromListItem: listItem,
        toListItem: tempLi
      });
      (0, import_plate17.deleteMerge)(editor, {
        reverse
      });
      tempLiPath = tempLiPathRef.unref();
      moveListItemSublistItemsToListItemSublist(editor, {
        fromListItem: [tempLi[0], tempLiPath],
        toListItem: previousLi
      });
      editor.tf.removeNodes({ at: tempLiPath });
      success = true;
      return;
    }
    moveListItemsToList(editor, {
      fromListItem: listItem,
      toList: list,
      toListIndex: 1
    });
  });
  return success;
};

// src/lib/transforms/toggleList.ts
var import_plate18 = require("@udecode/plate");
var toggleList = (editor, { type }) => editor.tf.withoutNormalizing(() => {
  if (!editor.selection) {
    return;
  }
  const { validLiChildrenTypes } = editor.getOptions(BaseListPlugin);
  if (editor.api.isCollapsed() || !editor.api.isAt({ blocks: true })) {
    const res = getListItemEntry(editor);
    if (res) {
      const { list } = res;
      if (list[0].type === type) {
        unwrapList(editor);
      } else {
        editor.tf.setNodes(
          { type },
          {
            at: editor.selection,
            mode: "lowest",
            match: (n) => import_plate18.ElementApi.isElement(n) && getListTypes(editor).includes(n.type)
          }
        );
      }
    } else {
      const list = { children: [], type };
      editor.tf.wrapNodes(list);
      const _nodes = editor.api.nodes({
        match: { type: editor.getType(import_plate18.BaseParagraphPlugin) }
      });
      const nodes = Array.from(_nodes);
      const blockAbove = editor.api.block({
        match: { type: validLiChildrenTypes }
      });
      if (!blockAbove) {
        editor.tf.setNodes({
          type: editor.getType(BaseListItemContentPlugin)
        });
      }
      const listItem = {
        children: [],
        type: editor.getType(BaseListItemPlugin)
      };
      for (const [, path] of nodes) {
        editor.tf.wrapNodes(listItem, {
          at: path
        });
      }
    }
  } else {
    const [startPoint, endPoint] = import_plate18.RangeApi.edges(editor.selection);
    const commonEntry = import_plate18.NodeApi.common(
      editor,
      startPoint.path,
      endPoint.path
    );
    if (getListTypes(editor).includes(commonEntry[0].type) || commonEntry[0].type === editor.getType(BaseListItemPlugin)) {
      if (commonEntry[0].type === type) {
        unwrapList(editor);
      } else {
        const startList = editor.api.node({
          at: import_plate18.RangeApi.start(editor.selection),
          match: { type: getListTypes(editor) },
          mode: "lowest"
        });
        const endList = editor.api.node({
          at: import_plate18.RangeApi.end(editor.selection),
          match: { type: getListTypes(editor) },
          mode: "lowest"
        });
        const rangeLength = Math.min(
          startList[1].length,
          endList[1].length
        );
        editor.tf.setNodes(
          { type },
          {
            at: editor.selection,
            mode: "all",
            match: (n, path) => import_plate18.ElementApi.isElement(n) && getListTypes(editor).includes(n.type) && path.length >= rangeLength
          }
        );
      }
    } else {
      const rootPathLength = commonEntry[1].length;
      const _nodes = editor.api.nodes({
        mode: "all"
      });
      const nodes = Array.from(_nodes).filter(
        ([, path]) => path.length === rootPathLength + 1
      );
      nodes.forEach((n) => {
        if (getListTypes(editor).includes(n[0].type)) {
          editor.tf.setNodes(
            { type },
            {
              at: n[1],
              mode: "all",
              match: (_n) => import_plate18.ElementApi.isElement(_n) && getListTypes(editor).includes(_n.type)
            }
          );
        } else {
          if (!validLiChildrenTypes?.includes(n[0].type)) {
            editor.tf.setNodes(
              { type: editor.getType(BaseListItemContentPlugin) },
              { at: n[1] }
            );
          }
          const listItem = {
            children: [],
            type: editor.getType(BaseListItemPlugin)
          };
          editor.tf.wrapNodes(listItem, {
            at: n[1]
          });
          const list = { children: [], type };
          editor.tf.wrapNodes(list, { at: n[1] });
        }
      });
    }
  }
});
var toggleBulletedList = (editor) => toggleList(editor, { type: editor.getType(BaseBulletedListPlugin) });
var toggleNumberedList = (editor) => toggleList(editor, { type: editor.getType(BaseNumberedListPlugin) });

// src/lib/transforms/unindentListItems.ts
var unindentListItems = (editor, options = {}) => moveListItems(editor, { ...options, increase: false });

// src/lib/BaseListPlugin.ts
var BaseBulletedListPlugin = (0, import_plate19.createSlatePlugin)({
  key: "ul",
  node: { isElement: true },
  parsers: {
    html: {
      deserializer: {
        rules: [
          {
            validNodeName: "UL"
          }
        ]
      }
    }
  }
});
var BaseNumberedListPlugin = (0, import_plate19.createSlatePlugin)({
  key: "ol",
  node: { isElement: true },
  parsers: { html: { deserializer: { rules: [{ validNodeName: "OL" }] } } }
});
var BaseListItemPlugin = (0, import_plate19.createSlatePlugin)({
  key: "li",
  inject: {
    plugins: {
      [import_plate19.HtmlPlugin.key]: {
        parser: {
          preInsert: ({ editor, type }) => {
            return editor.api.some({ match: { type } });
          }
        }
      }
    }
  },
  node: { isElement: true },
  parsers: { html: { deserializer: { rules: [{ validNodeName: "LI" }] } } }
});
var BaseListItemContentPlugin = (0, import_plate19.createSlatePlugin)({
  key: "lic",
  node: { isElement: true }
});
var BaseListPlugin = (0, import_plate19.createTSlatePlugin)({
  key: "list",
  // TODO react
  // extendEditor: withList,
  plugins: [
    BaseBulletedListPlugin,
    BaseNumberedListPlugin,
    BaseListItemPlugin,
    BaseListItemContentPlugin
  ]
}).extendEditorTransforms(({ editor }) => ({
  toggle: {
    bulletedList: (0, import_plate19.bindFirst)(toggleBulletedList, editor),
    list: (0, import_plate19.bindFirst)(toggleList, editor),
    numberedList: (0, import_plate19.bindFirst)(toggleNumberedList, editor)
  }
}));

// src/lib/withDeleteForwardList.ts
var import_plate20 = require("@udecode/plate");
var selectionIsNotInAListHandler = (editor) => {
  const pointAfterSelection = editor.api.after(editor.selection.focus);
  if (pointAfterSelection) {
    const nextSiblingListRes = getListItemEntry(editor, {
      at: pointAfterSelection
    });
    if (nextSiblingListRes) {
      const { listItem } = nextSiblingListRes;
      const parentBlockEntity = editor.api.block({
        at: editor.selection.anchor
      });
      if (!editor.api.string(parentBlockEntity[1])) {
        editor.tf.removeNodes();
        return true;
      }
      if (hasListChild(editor, listItem[0])) {
        const sublistRes = getListItemEntry(editor, {
          at: [...listItem[1], 1, 0, 0]
        });
        moveListItemUp(editor, sublistRes);
      }
    }
  }
  return false;
};
var selectionIsInAListHandler = (editor, res, defaultDelete, unit = "character") => {
  const { listItem } = res;
  if (!hasListChild(editor, listItem[0])) {
    const liType = editor.getType(BaseListItemPlugin);
    const _nodes = editor.api.nodes({
      at: listItem[1],
      mode: "lowest",
      match: (node, path) => {
        if (path.length === 0) {
          return false;
        }
        const isNodeLi = node.type === liType;
        const isSiblingOfNodeLi = import_plate20.NodeApi.get(editor, import_plate20.PathApi.next(path))?.type === liType;
        return isNodeLi && isSiblingOfNodeLi;
      }
    });
    const liWithSiblings = Array.from(_nodes, (entry) => entry[1])[0];
    if (!liWithSiblings) {
      const pointAfterListItem2 = editor.api.after(listItem[1]);
      if (pointAfterListItem2) {
        const nextSiblingListRes = getListItemEntry(editor, {
          at: pointAfterListItem2
        });
        if (nextSiblingListRes) {
          const listRoot = getListRoot(editor, listItem[1]);
          moveListItemsToList(editor, {
            deleteFromList: true,
            fromList: nextSiblingListRes.list,
            toList: listRoot
          });
          return true;
        }
      }
      return false;
    }
    const siblingListItem = editor.api.node(
      import_plate20.PathApi.next(liWithSiblings)
    );
    if (!siblingListItem) return false;
    const siblingList = editor.api.parent(siblingListItem[1]);
    if (siblingList && removeListItem(editor, {
      list: siblingList,
      listItem: siblingListItem,
      reverse: false
    })) {
      return true;
    }
    const pointAfterListItem = editor.api.after(editor.selection.focus);
    if (!pointAfterListItem || !isAcrossListItems(editor, {
      anchor: editor.selection.anchor,
      focus: pointAfterListItem
    })) {
      return false;
    }
    const licType = editor.getType(BaseListItemContentPlugin);
    const _licNodes = editor.api.nodes({
      at: pointAfterListItem.path,
      mode: "lowest",
      match: (node) => node.type === licType
    });
    const nextSelectableLic = [..._licNodes][0];
    if (nextSelectableLic[0].children.length < 2) return false;
    defaultDelete(unit);
    const leftoverListItem = editor.api.node(
      import_plate20.PathApi.parent(nextSelectableLic[1])
    );
    if (leftoverListItem && leftoverListItem[0].children.length === 0) {
      editor.tf.removeNodes({ at: leftoverListItem[1] });
    }
    return true;
  }
  const nestedList = editor.api.node(
    import_plate20.PathApi.next([...listItem[1], 0])
  );
  if (!nestedList) return false;
  const nestedListItem = Array.from(
    import_plate20.NodeApi.children(editor, nestedList[1])
  )[0];
  if (removeFirstListItem(editor, {
    list: nestedList,
    listItem: nestedListItem
  })) {
    return true;
  }
  if (removeListItem(editor, {
    list: nestedList,
    listItem: nestedListItem
  })) {
    return true;
  }
  return false;
};
var withDeleteForwardList = ({
  editor,
  tf: { deleteForward }
}) => ({
  transforms: {
    deleteForward(unit) {
      const deleteForwardList = () => {
        let skipDefaultDelete = false;
        if (!editor?.selection) {
          return skipDefaultDelete;
        }
        if (!editor.api.isAt({ end: true })) {
          return skipDefaultDelete;
        }
        editor.tf.withoutNormalizing(() => {
          const res = getListItemEntry(editor, {});
          if (!res) {
            skipDefaultDelete = selectionIsNotInAListHandler(editor);
            return;
          }
          skipDefaultDelete = selectionIsInAListHandler(
            editor,
            res,
            deleteForward,
            unit
          );
        });
        return skipDefaultDelete;
      };
      if (deleteForwardList()) return;
      deleteForward(unit);
    }
  }
});

// src/lib/withDeleteFragmentList.ts
var import_plate21 = require("@udecode/plate");
var getLiStart = (editor) => {
  const start = editor.api.start(editor.selection);
  return editor.api.above({
    at: start,
    match: { type: editor.getType(BaseListItemPlugin) }
  });
};
var withDeleteFragmentList = ({
  editor,
  tf: { deleteFragment }
}) => ({
  transforms: {
    deleteFragment(direction) {
      const deleteFragmentList = () => {
        let deleted = false;
        editor.tf.withoutNormalizing(() => {
          if (!isAcrossListItems(editor)) return;
          const end = editor.api.end(editor.selection);
          const liEnd = editor.api.above({
            at: end,
            match: { type: editor.getType(BaseListItemPlugin) }
          });
          const liEndCanBeDeleted = liEnd && !hasListChild(editor, liEnd[0]);
          const liEndPathRef = liEndCanBeDeleted ? editor.api.pathRef(liEnd[1]) : void 0;
          if (!getLiStart(editor) || !liEnd) {
            deleted = false;
            return;
          }
          (0, import_plate21.deleteMerge)(editor);
          const liStart = getLiStart(editor);
          if (liEndPathRef) {
            const liEndPath = liEndPathRef.unref();
            const listStart = liStart && editor.api.parent(liStart[1]);
            const deletePath = getHighestEmptyList(editor, {
              diffListPath: listStart?.[1],
              liPath: liEndPath
            });
            if (deletePath) {
              editor.tf.removeNodes({ at: deletePath });
            }
            deleted = true;
          }
        });
        return deleted;
      };
      if (deleteFragmentList()) return;
      deleteFragment(direction);
    }
  }
});

// src/lib/withInsertFragmentList.ts
var import_plate22 = require("@udecode/plate");
var withInsertFragmentList = ({
  editor,
  tf: { insertFragment }
}) => {
  const listItemType = editor.getType(BaseListItemPlugin);
  const listItemContentType = editor.getType(BaseListItemContentPlugin);
  const getFirstAncestorOfType = (root, entry, type) => {
    let ancestor = import_plate22.PathApi.parent(entry[1]);
    while (import_plate22.NodeApi.get(root, ancestor).type !== type) {
      ancestor = import_plate22.PathApi.parent(ancestor);
    }
    return [import_plate22.NodeApi.get(root, ancestor), ancestor];
  };
  const findListItemsWithContent = (first) => {
    let prev = null;
    let node = first;
    while (isListRoot(editor, node) || node.type === listItemType && node.children[0].type !== listItemContentType) {
      prev = node;
      [node] = node.children;
    }
    return prev ? prev.children : [node];
  };
  const trimList = (listRoot) => {
    if (!isListRoot(editor, listRoot)) {
      return [listRoot];
    }
    const _texts = import_plate22.NodeApi.texts(listRoot);
    const textEntries = Array.from(_texts);
    const commonAncestorEntry = textEntries.reduce(
      (commonAncestor, textEntry) => import_plate22.PathApi.isAncestor(commonAncestor[1], textEntry[1]) ? commonAncestor : import_plate22.NodeApi.common(listRoot, textEntry[1], commonAncestor[1]),
      // any list item would do, we grab the first one
      getFirstAncestorOfType(listRoot, textEntries[0], listItemType)
    );
    const [first, ...rest] = isListRoot(
      editor,
      commonAncestorEntry[0]
    ) ? commonAncestorEntry[0].children : [commonAncestorEntry[0]];
    return [...findListItemsWithContent(first), ...rest];
  };
  const wrapNodeIntoListItem = (node) => {
    return node.type === listItemType ? node : {
      children: [node],
      type: listItemType
    };
  };
  const isSingleLic = (fragment) => {
    const isFragmentOnlyListRoot = fragment.length === 1 && isListRoot(editor, fragment[0]);
    return isFragmentOnlyListRoot && [...import_plate22.NodeApi.nodes({ children: fragment })].filter(
      (entry) => import_plate22.ElementApi.isElement(entry[0])
    ).filter(([node]) => node.type === listItemContentType).length === 1;
  };
  const getTextAndListItemNodes = (fragment, liEntry, licEntry) => {
    const [, liPath] = liEntry;
    const [licNode, licPath] = licEntry;
    const isEmptyNode = !import_plate22.NodeApi.string(licNode);
    const [first, ...rest] = fragment.flatMap(trimList).map(wrapNodeIntoListItem);
    let textNode;
    let listItemNodes;
    if (isListRoot(editor, fragment[0])) {
      if (isSingleLic(fragment)) {
        textNode = first;
        listItemNodes = rest;
      } else if (isEmptyNode) {
        const li = import_plate22.NodeApi.get(editor, liPath);
        const [, ...currentSublists] = li.children;
        const [newLic, ...newSublists] = first.children;
        editor.tf.insertNodes(newLic, {
          at: import_plate22.PathApi.next(licPath),
          select: true
        });
        editor.tf.removeNodes({
          at: licPath
        });
        if (newSublists?.length) {
          if (currentSublists?.length) {
            const path = [...liPath, 1, 0];
            editor.tf.insertNodes(newSublists[0].children, {
              at: path,
              select: true
            });
          } else {
            editor.tf.insertNodes(newSublists, {
              at: import_plate22.PathApi.next(licPath),
              select: true
            });
          }
        }
        textNode = { text: "" };
        listItemNodes = rest;
      } else {
        textNode = { text: "" };
        listItemNodes = [first, ...rest];
      }
    } else {
      textNode = first;
      listItemNodes = rest;
    }
    return { listItemNodes, textNode };
  };
  return {
    transforms: {
      insertFragment(fragment) {
        let liEntry = editor.api.node({
          match: { type: listItemType },
          mode: "lowest"
        });
        if (!liEntry) {
          return insertFragment(
            isListRoot(editor, fragment[0]) ? [{ text: "" }, ...fragment] : fragment
          );
        }
        insertFragment([{ text: "" }]);
        liEntry = editor.api.node({
          match: { type: listItemType },
          mode: "lowest"
        });
        if (!liEntry) {
          return insertFragment(
            isListRoot(editor, fragment[0]) ? [{ text: "" }, ...fragment] : fragment
          );
        }
        const licEntry = editor.api.node({
          match: { type: listItemContentType },
          mode: "lowest"
        });
        if (!licEntry) {
          return insertFragment(
            isListRoot(editor, fragment[0]) ? [{ text: "" }, ...fragment] : fragment
          );
        }
        const { listItemNodes, textNode } = getTextAndListItemNodes(
          fragment,
          liEntry,
          licEntry
        );
        insertFragment([textNode]);
        const [, liPath] = liEntry;
        return editor.tf.insertNodes(listItemNodes, {
          at: import_plate22.PathApi.next(liPath),
          select: true
        });
      }
    }
  };
};

// src/lib/withNormalizeList.ts
var import_plate25 = require("@udecode/plate");

// src/lib/normalizers/normalizeListItem.ts
var import_plate23 = require("@udecode/plate");
var getDeepInlineChildren = (editor, {
  children
}) => {
  const inlineChildren = [];
  for (const child of children) {
    if (editor.api.isBlock(child[0])) {
      inlineChildren.push(
        ...getDeepInlineChildren(editor, {
          children: Array.from(import_plate23.NodeApi.children(editor, child[1]))
        })
      );
    } else {
      inlineChildren.push(child);
    }
  }
  return inlineChildren;
};
var normalizeListItem = (editor, {
  listItem,
  validLiChildrenTypes = []
}) => {
  let changed = false;
  const allValidLiChildrenTypes = /* @__PURE__ */ new Set([
    editor.getType(BaseBulletedListPlugin),
    editor.getType(BaseListItemContentPlugin),
    editor.getType(BaseNumberedListPlugin),
    ...validLiChildrenTypes
  ]);
  const [, liPath] = listItem;
  const liChildren = Array.from(
    import_plate23.NodeApi.children(editor, listItem[1])
  );
  const invalidLiChildrenPathRefs = liChildren.filter(([child]) => !allValidLiChildrenTypes.has(child.type)).map(([, childPath]) => editor.api.pathRef(childPath));
  const firstLiChild = liChildren[0];
  const [firstLiChildNode, firstLiChildPath] = firstLiChild ?? [];
  if (!firstLiChild || !editor.api.isBlock(firstLiChildNode)) {
    editor.tf.insertNodes(
      editor.api.create.block({
        type: editor.getType(BaseListItemContentPlugin)
      }),
      {
        at: liPath.concat([0])
      }
    );
    return true;
  }
  if (editor.api.isBlock(firstLiChildNode) && !(0, import_plate23.match)(firstLiChildNode, [], {
    type: editor.getType(BaseListItemContentPlugin)
  })) {
    if ((0, import_plate23.match)(firstLiChildNode, [], {
      type: getListTypes(editor)
    })) {
      const parent = editor.api.parent(listItem[1]);
      const sublist = firstLiChild;
      const children = Array.from(
        import_plate23.NodeApi.children(editor, firstLiChild[1])
      ).reverse();
      children.forEach((c) => {
        moveListItemUp(editor, {
          list: sublist,
          listItem: c
        });
      });
      editor.tf.removeNodes({ at: [...parent[1], 0] });
      return true;
    }
    if (validLiChildrenTypes.includes(firstLiChildNode.type)) {
      return true;
    }
    editor.tf.setNodes(
      {
        type: editor.getType(BaseListItemContentPlugin)
      },
      {
        at: firstLiChildPath
      }
    );
    changed = true;
  }
  const licChildren = Array.from(import_plate23.NodeApi.children(editor, firstLiChild[1]));
  if (licChildren.length > 0) {
    const blockPathRefs = [];
    const inlineChildren = [];
    for (const licChild of licChildren) {
      if (!editor.api.isBlock(licChild[0])) {
        break;
      }
      blockPathRefs.push(editor.api.pathRef(licChild[1]));
      inlineChildren.push(
        ...getDeepInlineChildren(editor, {
          children: Array.from(import_plate23.NodeApi.children(editor, licChild[1]))
        })
      );
    }
    const to = import_plate23.PathApi.next(licChildren.at(-1)[1]);
    inlineChildren.reverse().forEach(([, path]) => {
      editor.tf.moveNodes({
        at: path,
        to
      });
    });
    blockPathRefs.forEach((pathRef) => {
      const path = pathRef.unref();
      path && editor.tf.removeNodes({
        at: path
      });
    });
    if (blockPathRefs.length > 0) {
      changed = true;
    }
  }
  if (changed) return true;
  invalidLiChildrenPathRefs.reverse().forEach((ref) => {
    const path = ref.unref();
    path && editor.tf.moveNodes({
      at: path,
      to: firstLiChildPath.concat([0])
    });
  });
  return invalidLiChildrenPathRefs.length > 0;
};

// src/lib/normalizers/normalizeNestedList.ts
var import_plate24 = require("@udecode/plate");
var normalizeNestedList = (editor, { nestedListItem }) => {
  const [, path] = nestedListItem;
  const parentNode = editor.api.parent(path);
  const hasParentList = parentNode && (0, import_plate24.match)(parentNode[0], [], { type: getListTypes(editor) });
  if (!hasParentList) {
    return false;
  }
  const previousListItemPath = import_plate24.PathApi.previous(path);
  if (!previousListItemPath) {
    return false;
  }
  const previousSiblingItem = editor.api.node(previousListItemPath);
  if (previousSiblingItem) {
    const [, previousPath] = previousSiblingItem;
    const newPath = previousPath.concat([1]);
    editor.tf.moveNodes({
      at: path,
      to: newPath
    });
    return true;
  }
};

// src/lib/withNormalizeList.ts
var withNormalizeList = ({
  editor,
  getOptions,
  tf: { normalizeNode }
}) => ({
  transforms: {
    normalizeNode([node, path]) {
      const liType = editor.getType(BaseListItemPlugin);
      const licType = editor.getType(BaseListItemContentPlugin);
      const defaultType = editor.getType(import_plate25.BaseParagraphPlugin);
      if (!import_plate25.ElementApi.isElement(node)) {
        return normalizeNode([node, path]);
      }
      if (isListRoot(editor, node)) {
        const nonLiChild = Array.from(import_plate25.NodeApi.children(editor, path)).find(
          ([child]) => child.type !== liType
        );
        if (nonLiChild) {
          return editor.tf.wrapNodes(
            { children: [], type: liType },
            { at: nonLiChild[1] }
          );
        }
      }
      if ((0, import_plate25.match)(node, [], { type: getListTypes(editor) })) {
        if (node.children.length === 0 || !node.children.some((item) => item.type === liType)) {
          return editor.tf.removeNodes({ at: path });
        }
        const nextPath = import_plate25.PathApi.next(path);
        const nextNode = import_plate25.NodeApi.get(editor, nextPath);
        if (nextNode?.type === node.type) {
          moveListItemsToList(editor, {
            deleteFromList: true,
            fromList: [nextNode, nextPath],
            toList: [node, path]
          });
        }
        const prevPath = import_plate25.PathApi.previous(path);
        const prevNode = import_plate25.NodeApi.get(editor, prevPath);
        if (prevNode?.type === node.type) {
          editor.tf.normalizeNode([prevNode, prevPath]);
          return;
        }
        if (normalizeNestedList(editor, { nestedListItem: [node, path] })) {
          return;
        }
      }
      if (node.type === editor.getType(BaseListItemPlugin) && normalizeListItem(editor, {
        listItem: [node, path],
        validLiChildrenTypes: getOptions().validLiChildrenTypes
      })) {
        return;
      }
      if (node.type === licType && licType !== defaultType && editor.api.parent(path)?.[0].type !== liType) {
        editor.tf.setNodes({ type: defaultType }, { at: path });
        return;
      }
      normalizeNode([node, path]);
    }
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseBulletedListPlugin,
  BaseListItemContentPlugin,
  BaseListItemPlugin,
  BaseListPlugin,
  BaseNumberedListPlugin,
  BaseTodoListPlugin,
  getDeepInlineChildren,
  getHighestEmptyList,
  getListItemEntry,
  getListRoot,
  getListTypes,
  getTodoListItemEntry,
  hasListChild,
  indentListItems,
  insertListItem,
  insertTodoListItem,
  isAcrossListItems,
  isListNested,
  isListRoot,
  moveListItemDown,
  moveListItemSublistItemsToListItemSublist,
  moveListItemUp,
  moveListItems,
  moveListItemsToList,
  moveListSiblingsAfterCursor,
  normalizeListItem,
  normalizeNestedList,
  removeFirstListItem,
  removeListItem,
  someList,
  toggleBulletedList,
  toggleList,
  toggleNumberedList,
  unindentListItems,
  unwrapList,
  withDeleteForwardList,
  withDeleteFragmentList,
  withInsertFragmentList,
  withNormalizeList,
  withTodoList
});
//# sourceMappingURL=index.js.map