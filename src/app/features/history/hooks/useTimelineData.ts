import { useState, useEffect, useRef } from "react";
import type { TimelineItem } from "../model/TimelineItem";
import useHistory from "./useHistory";

export function useTimelineData() {
    const [timeline, setTimeline] = useState<TimelineItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { fetchHistory } = useHistory();
    const didFetchRef = useRef(false);

    useEffect(() => {
        let mounted = true;

        const loadHistory = async () => {
            if (didFetchRef.current) return;
            didFetchRef.current = true;

            try {
                const response = await fetchHistory();
                console.log("Fetched timeline data:", response);

                if (mounted && response.data) {
                    const mappedTimeline: TimelineItem[] = response.data.map((item) => ({
                        id: item.id,
                        date: item.creationDate,
                        title: item.title,
                        interpretation: item.interpretation,
                        imageUrl: item.imageUrl ?? undefined,
                    }));

                    setTimeline(mappedTimeline);
                }
            } catch (e: any) {
                if (mounted) {
                    setError(e?.message ?? "Error cargando historial");
                    setTimeline([]);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadHistory();

        return () => {
            mounted = false;
        };
    }, [fetchHistory]);

    return { timeline, loading, error };
}