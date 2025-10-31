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
    selectedId?: string;
    onSelect: (_id: string) => void;
    listRef: RefObject<HTMLUListElement | null>;
    itemRefs: MutableRefObject<Map<string, HTMLLIElement>>;
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
        <div className="relative w-full h-full flex flex-col">

            {/* Scrollable list */}
            <ul
                ref={listRef}
                className="flex-1 overflow-y-auto overflow-x-hidden pr-2 pb-4"
                style={{
                    scrollBehavior: "smooth",
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255, 255, 255, 0.1) transparent",
                    maxHeight: "100%"
                }}
            >
                <style>{`
                    ul::-webkit-scrollbar {
                        width: 4px;
                    }
                    
                    ul::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    
                    ul::-webkit-scrollbar-thumb {
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 2px;
                        transition: background 0.2s ease;
                    }
                `}</style>

                {items.map((item, index) => (
                    <TimelineItem
                        key={item.id ?? index}
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
        </div>
    );
}