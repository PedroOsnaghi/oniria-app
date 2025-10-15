import { useEngine, useEngineStore } from "@/engine/core";
import DreamCardModal from "./components/DreamCardModal";
import { useCallback, useEffect, useState } from "react";
import useDreams from "@/app/features/dreams/hooks/useDreams";

export default function HudSystem() {
  const [visible, setVisible] = useState(false);
  // Acceder al dream directamente desde el store
  const { dream, setDream } = useEngineStore();
  const engine = useEngine();
  const { saveDream } = useDreams();

  useEffect(() => {
    setVisible(!!dream);
  }, [dream]);

  // Función para cerrar el modal
  const handleDreamModalClose = useCallback(() => {
    // Opcionalmente limpiar el dream del store
    // setDream(null);
    setVisible(false);
    setDream?.(null);
    engine.node?.rest?.();
    console.log(engine);
    console.log("rest position");
  }, [engine, visible, dream, setDream]);

  const handleSave = useCallback(() => {
    if (dream) {
      saveDream(dream);
    }
  }, [dream, saveDream]);

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center z-50 p-4 ${
        dream ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Overlay de fondo cuando el modal está visible */}
      {visible && dream && (
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
          onClick={handleDreamModalClose}
        />
      )}

      <DreamCardModal
        visibility={!!dream}
        title={dream?.title || "Tu sueño"}
        text={dream?.interpretation || "Descripción del sueño..."}
        typingSpeed={80}
        onClose={handleDreamModalClose}
        onSave={handleSave}
        onReinterpret={() => console.log("Reinterpretar")}
      />
    </div>
  );
}
