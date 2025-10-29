export function TimelinePoint({
    isActive,
    onSelect
}: {
    isActive: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className="relative shrink-0 mt-1 group/point"
            aria-label="Seleccionar este punto en la línea de tiempo"
        >
            {/* Punto exterior */}
            <div
                className={`
          w-4 h-4 rounded-full border-2 transition-all duration-300
          ${isActive
                        ? 'border-violet-400 bg-violet-500 shadow-[0_0_16px_rgba(139,92,246,0.8)]'
                        : 'border-white/30 bg-white/10 group-hover/point:border-violet-400/60 group-hover/point:bg-violet-500/30'
                    }
        `}
            />

            {/* Punto interior (solo cuando está activo) */}
            {isActive && (
                <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white animate-pulse" />
            )}
        </button>
    );
}