import { useTranslation } from "react-i18next";
import { useTimelineData } from "@/app/features/history/hooks/useTimelineData";
import { useEffect } from "react";
import { useEngineStore } from "@/engine";
import HistoryPanel from "./components/panel/HistoryPanel";

interface HistoryMenuProps {
  onClose?: () => void;
  isClosing?: boolean;
}

export default function HistoryMenu({ onClose, isClosing = false }: HistoryMenuProps) {
  const { t } = useTranslation();
  const { timeline, loading, error } = useTimelineData();

  // Manejar el fin de la animación de cierre
  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        useEngineStore.setState((state) => ({
          historyPanel: { isOpen: false, isClosing: false }
        }));
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  const handleClose = () => {
    onClose?.();
  };

  return (
    <HistoryPanel
      timeline={timeline}
      loading={loading}
      error={error}
      isClosing={isClosing}
      onClose={handleClose}
    />
  );
}