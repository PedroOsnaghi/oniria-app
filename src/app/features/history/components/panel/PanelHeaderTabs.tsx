import HudMenu from "@/app/shared/components/menu/CardMenu";
import { useMemo, useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TimelineItem } from "../../model/TimelineItem";
import StatisticCard from "./tabs/StatisticCard";
import StatsCard from "./tabs/StatsCard";

type TabKey = "Estadisticas" | "Interpretación" | "Imagen" | "Stats";

export function PanelHeaderTabs({
    active = "Estadisticas",
    onChange,
    className = "",
    selectedDream,
}: {
    active?: TabKey;
    onChange?: (tab: TabKey) => void;
    className?: string;
    timeline?: TimelineItem[];
    selectedDream?: TimelineItem | null;
}) {
    const { t } = useTranslation();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });

    const tabs = useMemo(
        () => [
            { key: "Estadisticas" as const, label: t("historial.panel.panelEstadisticas.tabEstadisticas") },
            { key: "Interpretación" as const, label: t("historial.panel.panelEstadisticas.tabInterpretacion") },
            { key: "Imagen" as const, label: t("historial.panel.panelEstadisticas.tabImagen") },
            { key: "Stats" as const, label: t("historial.panel.panelEstadisticas.tabStats") },
        ],
        [t]
    );

    useEffect(() => {
        const activeTab = tabRefs.current.get(active);
        if (activeTab && scrollContainerRef.current) {
            const container = scrollContainerRef.current;

            // underline
            setUnderlineStyle({
                width: activeTab.offsetWidth,
                left: activeTab.offsetLeft,
            });

            // auto-scroll al centro
            const containerWidth = container.offsetWidth;
            const tabLeft = activeTab.offsetLeft;
            const tabWidth = activeTab.offsetWidth;
            const scrollTo = tabLeft - containerWidth / 2 + tabWidth / 2;

            container.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    }, [active]);

    return (
        <HudMenu.Root className="flex items-start h-full gap-3 shrink-0">
            <HudMenu.Container className="w-120 max-w-full h-full flex pb-5 flex-col gap-4">
                {/* TODO EL CONTENIDO VA EN EL HEADER */}
                <HudMenu.Header>
                    <div className={`relative w-full ${className}`}>
                        {/* Mostrar info del sueño seleccionado */}
                        {selectedDream && (
                            <div className="mb-4 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                                <h3 className="text-base font-semibold text-white mb-1">
                                    {selectedDream.title}
                                </h3>
                                <time className="text-xs text-white/50">
                                    {new Date(selectedDream.date).toLocaleDateString("es-ES", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </time>
                            </div>
                        )}
                        <div
                            ref={scrollContainerRef}
                            role="tablist"
                            aria-label="Menú del panel de historial"
                            className="relative flex w-full rounded-2xl bg-zinc-900/70 ring-1 ring-white/8 backdrop-blur px-2 py-2 select-none overflow-x-auto scrollbar-hide"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            <div className="flex min-w-max relative">
                                <div
                                    className="absolute bottom-1 h-1 rounded-full bg-fuchsia-500 transition-all duration-200 ease-out"
                                    style={{
                                        width: `${underlineStyle.width}px`,
                                        transform: `translateX(${underlineStyle.left}px)`,
                                    }}
                                    aria-hidden
                                />
                                {tabs.map((tab) => {
                                    const isActive = tab.key === active;
                                    return (
                                        <button
                                            key={tab.key}
                                            ref={(el) => {
                                                if (el) tabRefs.current.set(tab.key, el);
                                            }}
                                            role="tab"
                                            aria-selected={isActive}
                                            onClick={() => onChange?.(tab.key)}
                                            className={[
                                                "relative z-10 h-10 rounded-xl transition-colors px-6 whitespace-nowrap",
                                                "text-sm font-medium tracking-wide font-orbitron",
                                                isActive ? "text-white" : "text-zinc-300/80 hover:text-white",
                                            ].join(" ")}
                                        >
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <style>{`
              .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
                    </div>
                </HudMenu.Header>

                <HudMenu.Body>
                    {!selectedDream ? (
                        <div className="flex items-center justify-center h-32 text-white/40 text-sm">
                            {t("historial.panel.panelEstadisticas.seleccionaSueño")}
                        </div>
                    ) : (
                        <>
                            {active === "Estadisticas" && (
                                <StatisticCard
                                    metrics={[
                                        { label: "interpretaciones", value: 25, sub: "S/ Logro: 45" },
                                        { label: "Esta semana", value: 2 },
                                        { label: "Compartidos", value: 16 },
                                    ]}
                                    stats={[
                                        { title: "Estadística Tipo 1 / Stats", label: "Estadística", hint: "Cantidad del valor medido / Total", percent: 80 },
                                        { title: "Estadística Tipo 1 / Stats", label: "Estadística", hint: "Cantidad del valor medido / Total", percent: 42 },
                                        { title: "Estadística Tipo 1 / Stats", label: "Estadística", hint: "Cantidad del valor medido / Total", percent: 80 },
                                    ]}
                                />
                            )}
                            {active === "Interpretación" && (
                                <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                                    <h4 className="text-sm font-medium text-white/90 mb-2">{t("historial.panel.panelEstadisticas.interpretacion")}</h4>
                                    <p className="text-sm text-white/70 leading-relaxed">
                                        {selectedDream.interpretation || t("historial.panel.panelEstadisticas.noInterpretacion")}
                                    </p>
                                </div>
                            )}
                            {active === "Imagen" && (
                                <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                                    {selectedDream.imageUrl ? (
                                        <img
                                            src={selectedDream.imageUrl}
                                            alt={selectedDream.title}
                                            className="w-full h-auto rounded-lg"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-48 text-white/40 text-sm">
                                            {t("historial.panel.panelEstadisticas.noImage")}
                                        </div>
                                    )}
                                </div>
                            )}
                            {active === "Stats" && (
                                <div className="space-y-4">
                                    <StatsCard
                                        emotions={[
                                            { name: "Alegría", value: 65 },
                                            { name: "Tristeza", value: 32 },
                                            { name: "Calma", value: 24 },
                                        ]}
                                        classes={["Normal", "Lúcido", "Pesadilla", "Simbólico"]}
                                        typeProb={52}
                                        entities={["Bosque", "Niño", "Escuela"]}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </HudMenu.Body>
            </HudMenu.Container>
        </HudMenu.Root>
    );
}
