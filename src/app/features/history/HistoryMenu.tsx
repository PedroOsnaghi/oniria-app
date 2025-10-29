import HudMenu from "@/app/shared/components/menu/CardMenu";
import { useTranslation } from "react-i18next";
import { useTimelineData } from "@/app/features/history/hooks/useTimelineData";
import { HistoryCard } from "./HistoryCard";
import HistoryContent from "./HistoryContent";
import { useEffect } from "react";
import { useEngineStore } from "@/engine";

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
    <HudMenu.Root className="flex items-start h-fit gap-3" isClosing={isClosing}>
      <HudMenu.Container className="w-[500px] max-w-full flex pb-5 flex-col gap-4 mt-20 ml-20 max-h-[85vh]">
        <HudMenu.Header>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-xl font-semibold font-orbitron text-primary">
              HISTORIA ONÍRICA
            </h2>
            <HudMenu.CloseButton onClick={handleClose} />
          </div>
        </HudMenu.Header>

        <HudMenu.Body className="overflow-hidden">
          <HistoryCard
            variant="history"
            title={t("historial.title")}
            description={t("historial.description")}
            ctaText={t("historial.oniriaPro")}
            timeline={timeline}
            loading={loading}
          />

          <HistoryContent timeline={timeline} loading={loading} error={error} />
        </HudMenu.Body>
      </HudMenu.Container>

      <HudMenu.Description className="text-sm max-w-sm mt-20">
        Aquí puedes explorar todos tus sueños pasados y sus interpretaciones.
        Cada nodo representa un viaje a tu subconsciente, conectado con símbolos
        y emociones únicas de tu historia onírica.
      </HudMenu.Description>
    </HudMenu.Root>
  );
}