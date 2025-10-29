import { useState } from "react";
import { HistoryService, type HistoryApiResponse } from "../services/history.service";
import { useAuth } from "@/app/features/auth/hooks/useAuth";

export default function useHistory() {
    const [history, setHistory] = useState<HistoryApiResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { session } = useAuth();

    const fetchHistory = async () => {
        setLoading(true);
        setError(null);

        try {
            const service = new HistoryService();
            const response = await service.fetchHistory(session);
            setHistory(response);
            console.log(response);
            return response;
        } catch (err: any) {
            setError("Failed to fetch history: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return { history, loading, error, fetchHistory };
}