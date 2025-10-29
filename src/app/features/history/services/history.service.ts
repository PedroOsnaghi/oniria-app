import type { Session } from "@supabase/supabase-js";

export type HistoryApiResponse = {
    id: string;
    date: string;
    title: string;
}

export class HistoryService {

    async fetchHistory(session: Session | null): Promise<HistoryApiResponse[]> {
        if (!session?.access_token) {
            throw new Error("No authentication token available");
        }

        const response = await fetch('http://localhost:3000/api/dreams/history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching history: ${response.statusText}`);
        }

        const data: HistoryApiResponse[] = await response.json();
        return data;
    }
}