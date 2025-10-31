import { useTimelineData } from "@/app/features/history/hooks/useTimelineData";
import { useEffect, useState } from "react";
import { useEngineStore } from "@/engine";
import HistoryPanel from "./components/panel/HistoryPanel";
import type { TimelineItem } from "./model/TimelineItem";

interface HistoryMenuProps {
  onClose?: () => void;
  isClosing?: boolean;
}

export default function HistoryMenu({ onClose, isClosing = false }: HistoryMenuProps) {
  const { timeline, loading, error } = useTimelineData();
  const [selectedDream, setSelectedDream] = useState<TimelineItem | null>(null);

  // Manejar el fin de la animación de cierre
  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        useEngineStore.setState(() => ({
          historyPanel: { isOpen: false, isClosing: false }
        }));
        setSelectedDream(null);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  const handleClose = () => {
    onClose?.();
  };

  const handleSelectItem = (item: TimelineItem) => {
    console.log("[HistoryMenu] Dream selected:", item);
    setSelectedDream(item);
  };

  return (
    <HistoryPanel
      timeline={timeline}
      loading={loading}
      error={error}
      isClosing={isClosing}
      onClose={handleClose}
      onSelectItem={handleSelectItem}
      selectedDream={selectedDream}
    />
  );
}