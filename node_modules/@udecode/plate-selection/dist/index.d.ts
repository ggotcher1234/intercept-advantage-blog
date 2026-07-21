import { PlateEditor } from '@udecode/plate/react';

declare const extractSelectableIds: (els: Element[]) => string[];
declare const extractSelectableId: (el: Element) => string | undefined;

declare const querySelectorSelectable: (id: string) => Element | null;
declare const querySelectorAllSelectable: () => NodeListOf<Element>;

declare const isSelecting: (editor: PlateEditor) => any;

export { extractSelectableId, extractSelectableIds, isSelecting, querySelectorAllSelectable, querySelectorSelectable };
