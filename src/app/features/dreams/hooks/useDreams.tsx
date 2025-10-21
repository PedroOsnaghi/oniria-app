import { useState } from "react";
import {
  DreamsService,
  type DreamAPIResponse,
} from "../services/dreams.service";
import type { Dream } from "@/engine/core/store/engineStore";
import { useAuth } from "../../auth/hooks/useAuth";

export default function useDreams() {
  const [dreams, setDreams] = useState<DreamAPIResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const fetchDreams = async (description: string) => {
    setLoading(true);
    setError(null);

    try {
      const service = new DreamsService();
      const response = await service.fetchDreamInterpretation(description);
      setDreams([response]);

      return response;
    } catch (err: any) {
      setError("Failed to fetch dream interpretation: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveDream = async (dream: Dream) => {
    try {
      const service = new DreamsService();
      await service.saveDream(session, dream);
    } catch (err: any) {
      setError("Failed to save dream: " + err.message);
    }
  };

  return { dreams, loading, error, fetchDreams, saveDream };
}
