import { useState, useCallback } from "react";
import { HistoryService, type HistoryApiResponse } from "../services/history.service";
import { useAuth } from "@/app/features/auth/hooks/useAuth";

export default function useHistory() {
    const [history, setHistory] = useState<HistoryApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { session } = useAuth();

    const fetchHistory = useCallback(async (): Promise<HistoryApiResponse> => {
        if (!session?.access_token) {
            const errorMsg = "No authentication token available";
            setError(errorMsg);
            throw new Error(errorMsg);
        }

        setLoading(true);
        setError(null);

        try {
            const service = new HistoryService();
            const response = await service.fetchHistory(session);
            setHistory(response);
            return response;
        } catch (err: any) {
            const msg = "Failed to fetch history: " + (err?.message ?? "unknown");
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [session?.access_token]);

    return { history, loading, error, fetchHistory };
}