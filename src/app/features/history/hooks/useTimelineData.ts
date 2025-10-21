import { useState, useEffect, useMemo } from "react";
import type { TimelineItem } from "../model/TimelineItem";
import useHistory from "./useHistory";
import { mapHistoryToTimeline } from "./utils/mapHistoryToTimeline";
import type { HistoryApiResponse, HistoryFilters, HistoryPagination } from "../model/types";

export function useTimelineData(filters?: HistoryFilters, pagination?: HistoryPagination) {
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { fetchHistory } = useHistory();

    const stableFilters = useMemo(() => filters, [JSON.stringify(filters),]);
    const stablePagination = useMemo(() => pagination, [JSON.stringify(pagination)]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const resp = await fetchHistory({ filters: stableFilters, pagination: stablePagination });
                if (!mounted) return;
                setTimeline(mapHistoryToTimeline(resp as HistoryApiResponse));
            } catch (e: any) {
                if (mounted) setError(e?.message ?? "Error cargando historial");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [stableFilters, stablePagination, fetchHistory]);

    return { timeline, loading, error };
}