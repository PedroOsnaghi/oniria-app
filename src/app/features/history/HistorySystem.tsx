import { useEngineStore } from "@/engine";
import { useEngineAPI } from "@/engine/core/context/EngineApiProvider";
import { useEffect } from "react";
import HistoryMenu from "./HistoryMenu";

export default function HistorySystem() {
    const {
        historyPanel,
        openHistoryPanel,
        closeHistoryPanel,
        setHistoryPanelActive,
    } = useEngineStore();
    const engine = useEngineAPI();

    useEffect(() => {
        // Suscribirse al evento cuando la cámara cambie a vista de nodos
        const unsubscribe = engine.camera.onViewNodes(() => {
            console.log("[HistorySystem] Opening history panel");
            openHistoryPanel();
            setHistoryPanelActive(true);
            // Deshabilitar interacciones cuando se abre el historial
            engine.interactions.setEnabled(false);
        });

        return () => {
            // Cleanup: desuscribirse del evento
            unsubscribe();
        };
    }, [engine, openHistoryPanel, setHistoryPanelActive]);

    const handleCloseHistory = () => {
        console.log("[HistorySystem] Closing history panel");
        closeHistoryPanel();
        setHistoryPanelActive(false);
        // Resetear la cámara a la vista por defecto
        engine.camera.viewReset();
        // Habilitar interacciones cuando se cierra el historial
        engine.interactions.setEnabled(true);
    };

    return (
        <>
            {/* Mostrar HistoryMenu si el panel está abierto */}
            {historyPanel.isOpen && (
                <HistoryMenu
                    onClose={handleCloseHistory}
                    isClosing={historyPanel.isClosing}
                />
            )}
        </>
    );
}