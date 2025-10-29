import Card from "@/app/shared/components/Card";
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
    <Card className="col-span-12 md:col-span-8 xl:col-span-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 md:p-6">
      <div className="mb-3 flex items-center justify-between">
        {loading && <span className="text-sm text-white/70">Cargando…</span>}
        {error && <span className="text-sm text-red-300">{error}</span>}
      </div>

      {!loading && !error && timeline.length === 0 && (
        <div className="text-white/60 text-sm">
          No hay sueños guardados todavía.
        </div>
      )}
    </Card>
  );
}
