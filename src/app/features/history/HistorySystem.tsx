import { useEngineStore } from "@/engine";
import { useEngineAPI } from "@/engine/core/context/EngineApiProvider";
import HistoryMenu from "./HistoryMenu";

export default function HistorySystem() {
  const { historyPanel, closeHistoryPanel, setHistoryPanelActive } =
    useEngineStore();
  const engine = useEngineAPI();

  const handleCloseHistory = () => {
    console.log("[HistorySystem] Closing history panel");
    closeHistoryPanel();

    // Esperar a que termine la animación antes de desactivar
    setTimeout(() => {
      setHistoryPanelActive(false);
    }, 300); // Duración de la animación

    // Resetear la cámara a la vista por defecto
    engine.camera.viewReset();
    // Habilitar interacciones cuando se cierra el historial
    engine.interactions.setEnabled(true);
  };

  return (
    <HistoryMenu
      onClose={handleCloseHistory}
      isClosing={historyPanel.isClosing}
    />
  );
}
