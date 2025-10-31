import { DreamsService, type DreamAPIResponse } from "@/app/features/dreams/services/dreams.service";
import { useState } from "react";
import { useEngineStore, type Dream } from "@/engine/core/store/engineStore";
import { useAuth } from "@/app/features/auth/hooks/useAuth";

// Adaptador: convierte DreamAPIResponse a Dream
function adaptDreamResponse(response: DreamAPIResponse): Dream {
    return {
        title: response.title,
        description: response.description,
        interpretation: response.interpretation,
        emotion: response.emotion,
        imageUrl: response.imageUrl || null,
    };
}

export default function useDreamService() {
    const [dreams, setDreams] = useState<DreamAPIResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { session } = useAuth();
    // Obtener setDream del store
    const setDream = useEngineStore((state) => state.setDream);

    const fetchDreams = async (description: string) => {
        setLoading(true);
        setError(null);

        try {
            const service = new DreamsService();
            const response = await service.fetchDreamInterpretation(session, description);
            setDreams([response]);

            // Adaptar y guardar en el store
            const dreamData = adaptDreamResponse(response);
            setDream(dreamData);

            return dreamData;
        } catch (err: any) {
            setError("Failed to fetch dream interpretation: " + err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const saveDream = async (dream: Dream) => {
        try {
            console.log("Intentando guardar sueno", dream)
            const service = new DreamsService();
            const response = await service.saveDream(session, dream);
            console.log("[Fream Guardado]: con respuesta:", response)
        } catch (error) {
            console.error("[useDreamService] Error al guardar Nodo:", error);
        }
    }

    const handleInterpret = async (dreamText: string) => {
        // Lógica para interpretar el sueño
        const response = await fetchDreams(dreamText);
        console.log("[useDreamService] Dream saved to store:", response);
        return response;
    }

    return { handleInterpret, dreams, loading, error, fetchDreams, saveDream };
}
