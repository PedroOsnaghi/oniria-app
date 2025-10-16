export function TimelineItemContent({
  creationDate,
  title,
  isActive,
  onSelect,
}: {
  creationDate: string;
  title: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="text-left group w-full transition cursor-pointer"
    >
      <div className="text-[11px] text-[var(--color-text-muted)] group-hover:text-[var(--color-text-hover)] ">
        {creationDate}
      </div>
      <div
        className={[
          "truncate",
          isActive
            ? "font-semibold text-[var(--color-text-primary)]"
            : "text-[var(--color-text-secondary)] opacity-60 group-hover:opacity-90 focus:opacity-90",
        ].join(" ")}
      >
        {title}
      </div>
      {isActive && (
        <div className="h-[2px] w-10 mt-1 rounded bg-[var(--color-active-bar)]" />
      )}
    </button>
  );
}
