export function TimelineProgressBar({
  progress,
  height,
}: {
  progress: number;
  height: number;
}) {
  return (
    <>
      {/* Barra base */}
      <div
        className="absolute left-3 w-[3px] rounded top-[5px]"
        style={{
          height: `${height}px`,
          backgroundColor: "var(--color-timeline-base)",
        }}
      />

      {/* Barra de progreso */}
      <div
        className="absolute left-3 w-[3px] rounded transition-all duration-500 ease-out top-[5px]"
        style={{
          height: `${height * progress}px`,
          background: `linear-gradient(
                        to bottom,
                        var(--color-timeline-progress-from),
                        var(--color-timeline-active-bg),
                        var(--color-timeline-progress-to)
                    )`,
          boxShadow: "var(--color-timeline-progress-shadow)",
        }}
      />
    </>
  );
}
