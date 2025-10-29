import type { MutableRefObject, RefObject } from "react";
import { TimelineItem, type TimelineItemType } from "./TimelineItem";

export function TimelineList({
    items,
    selectedId,
    onSelect,
    listRef,
    itemRefs,
    progress,
}: {
    items: TimelineItemType[];
    selectedId?: number;
    onSelect: (_id: number) => void;
    listRef: RefObject<HTMLUListElement | null>;
    itemRefs: MutableRefObject<Map<number, HTMLLIElement>>;
    progress?: number;
}) {
    if (!items || items.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-white/40 text-sm">
                No hay elementos en el historial
            </div>
        );
    }

    // Calcular el progreso individual de cada item basado en su índice
    const getItemProgress = (index: number) => {
        if (typeof progress !== 'number') return undefined;
        const itemProgress = progress * items.length;
        const currentItemProgress = itemProgress - index;
        return Math.max(0, Math.min(1, currentItemProgress));
    };

    return (
        <ul
            ref={listRef}
            className=""
            style={{ scrollBehavior: "smooth" }}
        >
            {items.map((item, index) => (
                <TimelineItem
                    key={item.id}
                    item={item}
                    isActive={item.id === selectedId}
                    onSelect={onSelect}
                    itemRef={(el) => {
                        if (el) {
                            itemRefs.current.set(item.id, el);
                        } else {
                            itemRefs.current.delete(item.id);
                        }
                    }}
                    progress={getItemProgress(index)}
                />
            ))}
        </ul>
    );
}