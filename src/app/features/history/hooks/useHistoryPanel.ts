import { useCallback, useMemo, useRef, useState } from "react";
import { useTimelineProgress } from "../timeLine/hooks/useTimelineProgress";
import { useTimelineScroll } from "../timeLine/hooks/useTimelineScroll";
import type { TimelineItem } from "../model/TimelineItem";

interface UseHistoryPanelProps {
    timeline: TimelineItem[];
    initialSelectedId?: string;
    onSelectItem?: (_item: TimelineItem) => void;
    onCta?: (_item: TimelineItem) => void;
    ctaDisabled?: boolean;
}

export function useHistoryPanel({
    timeline,
    initialSelectedId,
    onSelectItem,
}: UseHistoryPanelProps) {
    const initialSelected =
        initialSelectedId ??
        timeline.find((t) => t.active)?.id ??
        (timeline.length ? timeline[0].id : undefined);

    const [selectedId, setSelectedId] = useState<string | undefined>(initialSelected);
    const listRef = useRef<HTMLUListElement>(null);
    const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());

    const items = useMemo(
        () =>
            timeline.map((t) => ({
                ...t,
                active: t.id === selectedId,
            })),
        [timeline, selectedId]
    );

    const selectedIndex = useMemo(
        () => items.findIndex((i) => i.id === selectedId),
        [items, selectedId]
    );

    const selectedItem = useMemo(() => items[selectedIndex], [items, selectedIndex]);

    const handleSelect = useCallback(
        (id: string) => {
            console.log("Selected ID:", id);
            setSelectedId(id);
            const item = timeline.find((it) => it.id === id);
            if (item && onSelectItem) onSelectItem(item);
        },
        [timeline, onSelectItem]
    );

    const { progress, barHeight } = useTimelineProgress({
        listRef,
        itemRefs,
        items,
        selectedId,
    });

    useTimelineScroll({
        selectedId,
        itemRefs,
        listRef,
    });

    return {
        selectedId,
        items,
        selectedItem,
        handleSelect,
        listRef,
        itemRefs,
        progress,
        barHeight,
    };
}