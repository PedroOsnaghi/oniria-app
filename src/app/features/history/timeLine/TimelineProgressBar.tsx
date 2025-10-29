export function TimelineProgressBar({
    progress,
}: {
    progress: number;
}) {
    return (
        <div className="relative w-full h-[2px] mb-3">
            {/* Línea base */}
            <div className="absolute inset-0 w-full h-full rounded-full bg-white/10" />

            {/* Línea de progreso */}
            <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
                style={{
                    width: `${Math.max(0, Math.min(100, progress * 100))}%`,
                    background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.8) 0%, rgba(139, 92, 246, 0.4) 100%)',
                    boxShadow: '0 0 12px rgba(139, 92, 246, 0.6)',
                }}
            />
        </div>
    );
}