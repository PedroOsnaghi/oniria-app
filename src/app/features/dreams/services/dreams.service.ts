import type { Dream } from "@/engine/core/store/engineStore";
import type { Session } from "@supabase/supabase-js";

export type DreamAPIResponse = {
    title: string;
    description: string;
    interpretation: string;
    emotion: string;
    imageUrl?: string;
};

export class DreamsService {

    async fetchDreamInterpretation(session: Session | null, description: string): Promise<DreamAPIResponse> {
        if (!session?.access_token) {
            throw new Error("No authentication token available");
        }
        const response = await fetch('http://localhost:3000/api/dreams/interpret', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ description }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching dream interpretation: ${response.statusText}`);
        }


        const data: DreamAPIResponse = await response.json();
        console.log("[InterpretacionCompleta]", data)
        return data;
    }

    async saveDream(session: Session | null, dream: Dream): Promise<void> {
        if (!session?.access_token) {
            throw new Error("No authentication token available");
        }
        console.log("Dream desde el servicio:", dream);
        const response = await fetch('http://localhost:3000/api/dreams/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,

            },
            body: JSON.stringify(dream),
        });

        if (!response.ok) {
            throw new Error(`Error saving dream: ${response.statusText}`);
        }

        console.log(response.json())

        return response.json();
    }


}