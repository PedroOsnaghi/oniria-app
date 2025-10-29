import type { TimelineItem } from "./model/TimelineItem";

interface HistoryContentProps {
  timeline: TimelineItem[];
  loading: boolean;
  error: string | null;
}

export default function HistoryContent({
  timeline,
  loading,
  error,
}: HistoryContentProps) {

  return (
    <div className="w-full mt-4">
      <div className="flex items-center justify-between">
        {loading && <span className="text-sm text-white/70">Cargando…</span>}
        {error && <span className="text-sm text-red-300">{error}</span>}
      </div>

      {!loading && !error && timeline.length === 0 && (
        <div className="text-white/60 text-sm">
          No hay sueños guardados todavía.
        </div>
      )}
    </div>
  );
}
