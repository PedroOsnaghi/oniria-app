export function TimelineItemContent({
    date,
    title,
    isActive,
    onSelect,
}: {
    date: string;
    title: string;
    imageUrl?: string;
    interpretation?: string;
    isActive: boolean;
    onSelect: () => void;
}) {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("TimelineItemContent clicked");
        onSelect();
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="flex-1 text-left group/content w-full py-0.6 cursor-pointer z-10 relative"
            style={{ pointerEvents: 'auto' }}
        >
            <time
                className={`
          block text-[10px] font-medium tracking-wide uppercase mb-2 transition-colors
          ${isActive ? "text-violet-400/90" : "text-white/30 group-hover/content:text-white/50"}
        `}
            >
                {new Date(date).toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })}
            </time>

            <h3
                className={`
          text-base leading-tight mb-1 transition-colors
          ${isActive ? "font-semibold text-white" : "font-medium text-white/70 group-hover/content:text-white/90"}
        `}
            >
                {title}
            </h3>
        </button>
    );
}