import HudMenu from "@/app/shared/components/menu/CardMenu";
import { useTranslation } from "react-i18next";
import HistoryContent from "../../HistoryContent";
import type { TimelineItem } from "../../model/TimelineItem";
import { HistoryCard } from "../card/HistoryCard";
import { useState } from "react";
import { PanelHeaderTabs } from "./PanelHeaderTabs";

interface HistoryPanelProps {
    timeline?: TimelineItem[];
    loading?: boolean;
    error?: string | null;
    isClosing?: boolean;
    onClose?: () => void;
    title?: string;
    description?: string;
    onTabChange?: (tab: "Estadisticas" | "Interpretación" | "Imagen" | "Stats") => void;
}

export default function HistoryPanel({
    loading,
    error,
    timeline,
    isClosing = false,
    onClose,
    title,
    description,
    onTabChange,
}: HistoryPanelProps) {
    const { t } = useTranslation();
    const displayTitle = title || t("historial.panel.titlePanel");
    const displayDescription =
        description || t("historial.panel.description");

    const [activeTab, setActiveTab] = useState<"Estadisticas" | "Interpretación" | "Imagen" | "Stats">("Stats");

    const handleClose = () => {
        onClose?.();
    };

    const handleChangeTab = (tab: "Estadisticas" | "Interpretación" | "Imagen" | "Stats") => {
        setActiveTab(tab);
        onTabChange?.(tab);
    };

    return (
        <div className="flex items-start justify-between h-full w-full gap-6">
            {/* COLUMNA IZQUIERDA (panel) */}
            <HudMenu.Root className="flex items-start h-full gap-3 shrink-0">
                <HudMenu.Container className="w-96 max-w-full h-full flex flex-col gap-4">
                    <HudMenu.Header>
                        <div className="flex items-center justify-between w-full">
                            <h2 className="text-xl font-semibold font-orbitron text-primary">
                                {displayTitle}
                            </h2>
                            <HudMenu.CloseButton onClick={handleClose} />
                        </div>
                    </HudMenu.Header>

                    <HudMenu.Body className="flex-1 min-h-0">
                        <HistoryCard
                            title={t("historial.title")}
                            description={t("historial.description")}
                            timeline={timeline ?? []}
                            loading={loading}
                        />
                        <HistoryContent
                            timeline={timeline ?? []}
                            loading={loading ?? false}
                            error={error ?? null}
                        />
                    </HudMenu.Body>
                </HudMenu.Container>
                <HudMenu.Description className="text-sm max-w-sm">
                    {displayDescription}
                </HudMenu.Description>
            </HudMenu.Root>

            {/* COLUMNA DERECHA (tabs + descripción) */}
            <div className="flex flex-col gap-4 items-start">
                <PanelHeaderTabs
                    active={activeTab}
                    onChange={handleChangeTab}
                    timeline={timeline}
                />
            </div>
        </div>
    );
}