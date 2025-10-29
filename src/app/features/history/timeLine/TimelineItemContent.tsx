import { TimelineProgressBar } from "./TimelineProgressBar";

export function TimelineItemContent({
    date,
    title,
    imageUrl,
    interpretation,
    isActive,
    onSelect,
    progress,
}: {
    date: string;
    title: string;
    imageUrl?: string;
    interpretation?: string;
    isActive: boolean;
    onSelect: () => void;
    progress?: number;
}) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className="flex-1 text-left group/content w-full py-1"
        >
            {/* Fecha */}
            <time
                className={`
                    block text-[10px] font-medium tracking-wide uppercase mb-2
                    transition-colors duration-200
                    ${isActive
                        ? 'text-violet-400/90'
                        : 'text-white/30 group-hover/content:text-white/50'
                    }
                `}
            >
                {new Date(date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                })}
            </time>

            {/* Título */}
            <h3
                className={`
                    text-base leading-tight mb-2 transition-all duration-200
                    ${isActive
                        ? 'font-semibold text-white'
                        : 'font-medium text-white/70 group-hover/content:text-white/90'
                    }
                `}
            >
                {title}
            </h3>

            {/* Barra de progreso horizontal */}
            {typeof progress === 'number' && (
                <TimelineProgressBar progress={progress} />
            )}

            {/* Interpretación (opcional) */}
            {isActive && interpretation && (
                <p className="mt-2 text-xs text-white/60 leading-relaxed line-clamp-3">
                    {interpretation}
                </p>
            )}
        </button>
    );
}