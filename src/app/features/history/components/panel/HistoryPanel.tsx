import HudMenu from "@/app/shared/components/menu/CardMenu";
import { useTranslation } from "react-i18next";
import HistoryContent from "../../HistoryContent";
import type { TimelineItem } from "../../model/TimelineItem";
import { HistoryCard } from "../card/HistoryCard";

interface HistoryPanelProps {
    timeline?: TimelineItem[];
    loading?: boolean;
    error?: string | null;
    isClosing?: boolean;
    onClose?: () => void;
    title?: string;
    description?: string;
}

export default function HistoryPanel({
    loading,
    error,
    timeline,
    isClosing = false,
    onClose,
    title,
    description,
}: HistoryPanelProps) {
    const { t } = useTranslation();
    const displayTitle = title || "HISTORIA ONÍRICA";
    const displayDescription =
        description ||
        "Aquí puedes explorar todos tus sueños pasados y sus interpretaciones. Cada nodo representa un viaje a tu subconsciente, conectado con símbolos y emociones únicas de tu historia onírica.";

    const handleClose = () => {
        onClose?.();
    };
    return (
        <HudMenu.Root className="flex items-start h-fit gap-3" isClosing={isClosing}>
            <HudMenu.Container className="w-[500px] max-w-full flex pb-5 flex-col gap-4 mt-20 ml-20 max-h-[85vh]">
                <HudMenu.Header>
                    <div className="flex items-center justify-between w-full">
                        <h2 className="text-xl font-semibold font-orbitron text-primary">
                            {displayTitle}
                        </h2>
                        <HudMenu.CloseButton onClick={handleClose} />
                    </div>
                </HudMenu.Header>

                <HudMenu.Body>
                    <HistoryCard
                        title={t("historial.title")}
                        description={t("historial.description")}
                        timeline={timeline ?? []}
                        loading={loading}
                    />

                    <HistoryContent timeline={timeline ?? []} loading={loading ?? false} error={error ?? null} />
                </HudMenu.Body>
            </HudMenu.Container>

            <HudMenu.Description className="text-sm max-w-sm mt-20">
                {displayDescription}
            </HudMenu.Description>
        </HudMenu.Root>
    );
}