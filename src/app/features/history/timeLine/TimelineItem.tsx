import { TimelineItemContent } from "./TimelineItemContent";
import { TimelinePoint } from "./TimelinePoint";

export type TimelineItemType = {
    id: number;
    date: string;
    title: string;
    imageUrl?: string;
    interpretation?: string;
};

export function TimelineItem({
    item,
    isActive,
    onSelect,
    itemRef,
    progress,
}: {
    item: TimelineItemType;
    isActive: boolean;
    onSelect: (_id: number) => void;
    itemRef: (_el: HTMLLIElement | null) => void;
    progress?: number;
}) {
    return (
        <li
            ref={itemRef}
            className="relative flex items-start gap-4"
        >
            <TimelinePoint
                isActive={isActive}
                onSelect={() => onSelect(item.id)}
            />

            <div className="flex-1 min-w-0">
                <TimelineItemContent
                    date={item.date}
                    title={item.title}
                    imageUrl={item.imageUrl}
                    interpretation={item.interpretation}
                    isActive={isActive}
                    onSelect={() => onSelect(item.id)}
                    progress={progress}
                />
            </div>
        </li>
    );
}