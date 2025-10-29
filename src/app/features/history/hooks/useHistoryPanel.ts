import { useCallback, useMemo, useRef, useState } from "react";
import { useTimelineProgress } from "../timeLine/hooks/useTimelineProgress";
import { useTimelineScroll } from "../timeLine/hooks/useTimelineScroll";
import { useTimelineKeyboard } from "../timeLine/hooks/useTimelineKeyboard";
import type { TimelineItem } from "../model/TimelineItem";

interface UseHistoryPanelProps {
    timeline: TimelineItem[];
    initialSelectedId?: number;
    onSelectItem?: (_item: TimelineItem) => void;
    onCta?: (_item: TimelineItem) => void;
    ctaDisabled?: boolean;
}

export function useHistoryPanel({
    timeline,
    initialSelectedId,
    onSelectItem,
    onCta,
    ctaDisabled = false,
}: UseHistoryPanelProps) {
    const initialSelected =
        initialSelectedId ??
        timeline.find((t) => t.active)?.id ??
        (timeline.length ? timeline[0].id : undefined);

    const [selectedId, setSelectedId] = useState<number | undefined>(initialSelected);
    const [ctaPressed, setCtaPressed] = useState(false);

    const listRef = useRef<HTMLUListElement>(null);
    const itemRefs = useRef<Map<number, HTMLLIElement>>(new Map());

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
        (id: number) => {
            setSelectedId(id);
            const found = timeline.find((t) => t.id === id);
            if (found && onSelectItem) onSelectItem(found);
        },
        [timeline, onSelectItem]
    );

    const handleCTA = useCallback(async () => {
        if (!selectedItem || ctaDisabled) return;
        setCtaPressed(true);
        try {
            await onCta?.(selectedItem);
        } finally {
            setTimeout(() => setCtaPressed(false), 400);
        }
    }, [onCta, selectedItem, ctaDisabled]);

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

    useTimelineKeyboard({
        listRef,
        items,
        selectedIndex,
        onSelect: handleSelect,
    });

    return {
        selectedId,
        items,
        selectedItem,
        handleSelect,
        handleCTA,
        ctaPressed,
        listRef,
        itemRefs,
        progress,
        barHeight,
    };
}