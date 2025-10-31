export function TimelinePoint({
    isActive,
    onSelect,
}: {
    isActive: boolean;
    onSelect: () => void;
}) {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("TimelinePoint clicked");
        onSelect();
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="relative shrink-0 z-10 cursor-pointer mt-7"
            aria-label="Seleccionar este punto en la línea de tiempo"
            style={{ pointerEvents: 'auto' }}
        >
            <div
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300
          ${isActive
                        ? "border-violet-400 bg-violet-500 shadow-[0_0_16px_rgba(139,92,246,0.8)]"
                        : "border-white/30 bg-white/10 hover:border-violet-400/60 hover:bg-violet-500/30 hover:scale-110"
                    }
        `}
            />
            {isActive && (
                <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white animate-pulse" />
            )}
        </button>
    );
}