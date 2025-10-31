import { TimelineItemContent } from "./TimelineItemContent";
import { TimelinePoint } from "./TimelinePoint";

export type TimelineItemType = {
    id: string;
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
    onSelect: (_id: string) => void;
    itemRef: (_el: HTMLLIElement | null) => void;
    progress?: number;
}) {
    const handleClick = () => {
        console.log("TimelineItem clicked:", item.id);
        onSelect(item.id);
    };

    return (
        <li
            ref={itemRef}
            className="relative flex gap-4 last:mb-0 mb-6"
        >
            {/* Columna de la timeline */}
            <div className="relative flex flex-col items-center w-4 shrink-0">
                {/* Línea base - z-0 */}
                <div
                    className="absolute top-11 bottom-[-52px] left-1/2 -translate-x-1/2 w-[2px] bg-white/10 pointer-events-none z-0"
                />

                {/* Línea de progreso - z-1 */}
                {typeof progress === "number" && progress > 0 && (
                    <div
                        className="absolute top-11 bottom-[-52px] left-1/2 -translate-x-1/2 w-[2px]
                         rounded-full bg-violet-400/90 transition-all duration-500 pointer-events-none z-0"
                        style={{
                            height: `${Math.max(0, Math.min(1, progress)) * 56}px`,
                        }}
                    />
                )}

                {/* Botón punto - z-10 */}
                <TimelinePoint
                    isActive={isActive}
                    onSelect={handleClick}
                />
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
                <TimelineItemContent
                    date={item.date}
                    title={item.title}
                    imageUrl={item.imageUrl}
                    interpretation={item.interpretation}
                    isActive={isActive}
                    onSelect={handleClick}
                />
            </div>
        </li>
    );
}