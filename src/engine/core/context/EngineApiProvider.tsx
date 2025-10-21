import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
} from "react";

import { useEngineStore, type Dream } from "../store/engineStore";
import { AnimationService } from "@/engine/services";

// Definir el tipo del objeto node que se expondrá en la API
type NodeAPI = {
  next: () => void;
  prev: () => void;
  idle: () => void;
  rest: () => void;
};

type EngineContextAPI = {
  setRoom: (roomId: string, skinId: string) => void;
  setDream: (dream: Dream) => void;
  dream: Dream | null;
  roomId?: string | null;
  skinId?: string | null;
  node?: NodeAPI;
  animation?: AnimationService;
  actions?: Record<string, any>;
  // Método interno para que el core publique APIs
  _setAPI: (key: string, api: unknown) => void;
};

const EngineAPIContext = createContext<EngineContextAPI | null>(null);

/**
 * Provider que expone la API pública del motor para configurar salas y skins
 *
 * @param children - Componentes hijos que tendrán acceso a la API del motor
 */
export function EngineApiProvider({ children }: React.PropsWithChildren) {
  const roomId = useEngineStore((s) => s.roomId);
  const skinId = useEngineStore((s) => s.skinId);
  const setRoomId = useEngineStore((s) => s.setRoomId);
  const setSkinId = useEngineStore((s) => s.setSkinId);
  const setDreamStore = useEngineStore((s) => s.setDream);
  const dream = useEngineStore((s) => s.dream);

  // Estado para APIs dinámicas
  const [dynamicAPIs, setDynamicAPIs] = useState<Record<string, unknown>>({});

  /**
   * Configura una nueva sala y skin en el motor
   *
   * @param rId - ID de la sala
   * @param sId - ID del skin
   */
  const setRoom = useCallback(
    (rId: string, sId: string) => {
      setRoomId(rId);
      setSkinId(sId);
    },
    [setRoomId, setSkinId]
  );

  /**
   * Configura un nuevo sueño en el motor
   *
   * @param dream - Objeto Dream con los datos del sueño
   */
  const setDream = useCallback(
    (dream: Dream) => {
      console.log("EngineApiProvider - setDream llamado con:", dream);
      setDreamStore(dream);
      console.log("EngineApiProvider - setDreamStore ejecutado");
    },
    [setDreamStore]
  );

  /**
   * Método interno para que el core publique APIs dinámicamente
   *
   * @param key - Clave de la API (ej: 'node')
   * @param api - Objeto API a publicar
   */
  const _setAPI = useCallback((key: string, api: unknown) => {
    setDynamicAPIs((prev) => ({ ...prev, [key]: api }));
  }, []);

  const value = useMemo(
    () => ({
      setRoom,
      setDream,
      dream,
      roomId,
      skinId,
      node: dynamicAPIs.node as NodeAPI,
      animation: dynamicAPIs.animation as AnimationService | undefined,
      actions: dynamicAPIs.actions as Record<string, any> | undefined,
      _setAPI,
    }),
    [setRoom, setDream, roomId, skinId, dynamicAPIs, _setAPI]
  );

  return (
    <EngineAPIContext.Provider value={value}>
      {children}
    </EngineAPIContext.Provider>
  );
}

/**
 * Hook para acceder a la API pública del motor
 *
 * @returns API del motor con métodos para configurar salas y skins
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useEngineAPI() {
  const ctx = useContext(EngineAPIContext);
  if (!ctx)
    throw new Error("useEngineAPI debe usarse dentro de EngineApiProvider");
  return ctx;
}
