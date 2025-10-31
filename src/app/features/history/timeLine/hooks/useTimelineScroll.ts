import { useEffect, type MutableRefObject, type RefObject } from "react";

type UseTimelineScrollProps = {
    selectedId?: string;
    itemRefs: MutableRefObject<Map<string, HTMLLIElement>>;
    listRef: RefObject<HTMLUListElement | null>;
};

export function useTimelineScroll({ selectedId, itemRefs, listRef }: UseTimelineScrollProps) {
    useEffect(() => {
        if (selectedId === undefined) return;

        const itemElement = itemRefs.current.get(selectedId);
        const listElement = listRef.current;
        if (!itemElement || !listElement) return;

        const itemRect = itemElement.getBoundingClientRect();
        const listRect = listElement.getBoundingClientRect();

        const isAboveView = itemRect.top < listRect.top;
        const isBelowView = itemRect.bottom > listRect.bottom;

        if (isAboveView || isBelowView) {
            itemElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [selectedId, itemRefs, listRef]);
}