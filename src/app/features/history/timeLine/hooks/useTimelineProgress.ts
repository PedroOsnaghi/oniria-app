import { useEffect, useState, type MutableRefObject, type RefObject } from "react";
import type { TimelineItemType } from "../TimelineItem";

type UseTimelineProgressProps = {
    listRef: RefObject<HTMLUListElement | null>;
    itemRefs: MutableRefObject<Map<number, HTMLLIElement>>;
    items: TimelineItemType[];
    selectedId?: number;
};

export function useTimelineProgress({ listRef, itemRefs, items, selectedId }: UseTimelineProgressProps) {
    const [progress, setProgress] = useState(0);
    const [barHeight, setBarHeight] = useState(0);

    useEffect(() => {
        const list = listRef.current;
        if (!list || items.length === 0) return;

        const updateProgress = () => {
            const firstItem = itemRefs.current.get(items[0].id);
            const lastItem = itemRefs.current.get(items[items.length - 1].id);

            if (!firstItem || !lastItem) return;

            const firstRect = firstItem.getBoundingClientRect();
            const lastRect = lastItem.getBoundingClientRect();
            //const listRect = list.getBoundingClientRect();

            // Calcular altura total de la barra
            const totalHeight = lastRect.top - firstRect.top + 20;
            setBarHeight(totalHeight);

            // Calcular progreso basado en item seleccionado
            if (selectedId !== undefined) {
                const selectedItem = itemRefs.current.get(selectedId);
                if (selectedItem) {
                    const selectedRect = selectedItem.getBoundingClientRect();
                    const progressDistance = selectedRect.top - firstRect.top + 20;
                    const progressPercent = Math.max(0, Math.min(1, progressDistance / totalHeight));
                    setProgress(progressPercent);
                }
            }
        };

        updateProgress();
        list.addEventListener("scroll", updateProgress);
        window.addEventListener("resize", updateProgress);

        return () => {
            list.removeEventListener("scroll", updateProgress);
            window.removeEventListener("resize", updateProgress);
        };
    }, [listRef, itemRefs, items, selectedId]);

    return { progress, barHeight };
}