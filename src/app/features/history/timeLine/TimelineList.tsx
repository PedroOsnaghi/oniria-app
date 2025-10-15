import type { MutableRefObject, RefObject } from "react";
import { TimelineItem, type TimelineItemType } from "./TimelineItem";

export function TimelineList({
    items,
    selectedId,
    onSelect,
    listRef,
    itemRefs,
}: {
    items: TimelineItemType[];
    selectedId?: number;
    onSelect: (_id: number) => void;
    listRef: RefObject<HTMLUListElement | null>;
    itemRefs: MutableRefObject<Map<number, HTMLLIElement>>;
}) {
    return (
        <ul
            ref={listRef}
            tabIndex={0}
            className="space-y-8 pl-12 pr-4 outline-none"
            aria-label="Línea de tiempo"
        >
            {items.map((item) => (
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
                />
            ))}
        </ul>
    );
}