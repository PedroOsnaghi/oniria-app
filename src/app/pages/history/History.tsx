import Starfield from "@shared/components/Starfield";
import { useTranslation } from "react-i18next";
import HeaderContainer from "@/shared/components/users/HeaderContainer";
import UnifiedSidePanel from "../home/components/Panel";
import { useTimelineData } from "@/app/features/history/hooks/useTimelineData";
import type { HistoryFilters } from "@/app/features/history/model/types";
import { useCallback, useState, useEffect } from "react";
import { Engine } from "@/engine/core/namespace/EngineNamespace";
import Card from "@/shared/components/Card";
import NodeScene from "@/engine/scenes/NodeScene";
import {
  CameraSystem,
  InteractionSystem,
  useEngine,
  useEngineStore,
} from "@/engine";
import * as THREE from "three";
import type { TimelineItem } from "@/app/features/history/model/TimelineItem";
import type { Dream } from "@/engine/core/store/engineStore";
import HudSystem from "@/engine/systems/hud/HudSystem";

export default function History() {
  const { t } = useTranslation();
  const engine = useEngine();
  const [filters, setFilters] = useState<HistoryFilters>({});
  const { timeline, loading } = useTimelineData(filters);
  const { dream, setDream } = useEngineStore();

  const handleChangeFilters = useCallback((newFilters: HistoryFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSelectItem = useCallback((item: TimelineItem) => {
    const dream: Dream = {
      title: item.title,
      interpretation: item.interpretation!,
    };
    setDream(dream);
    engine.node?.next?.();
    console.log("Selected item:", item);
  }, []);

  // Limpiar el dream del store al salir del History
  useEffect(() => {
    return () => {
      setDream(null);
    };
  }, [setDream]);

  return (
    <div
      className="w-full h-dvh text-[var(--color-text-primary)] overflow-hidden flex flex-col"
      style={{ background: "var(--app-bg)" }}
    >
      <Starfield />
      <HeaderContainer />

      <main className="container relative z-0 mx-auto grid grid-cols-12 gap-4 flex-1 min-h-0 pb-4">
        <UnifiedSidePanel
          variant="history"
          title={t("history.title")}
          description={t("history.description")}
          ctaText={t("history.oniriaPro")}
          timeline={timeline}
          loading={loading}
          onChangeFilters={handleChangeFilters}
          onSelectItem={handleSelectItem}
          scrollable
        />
        <Card.Container className="col-span-12 sm:col-span-9 rounded-2xl border backdrop-blur-md p-5 md:p-4 overflow-hidden relative">
          <HudSystem />
          <Engine.Canvas
            engineSettings={{
              backgroundColor: "#000000",
              cameraInitialPosition: [0, 0, 4],
            }}
          >
            <Engine.Core>
              <CameraSystem
                config={{
                  position: new THREE.Vector3(0, 0, 3),
                  target: new THREE.Vector3(0, 0, 0),
                }}
              />

              <InteractionSystem />
              <NodeScene position={[0, 0, 0]} />
            </Engine.Core>
          </Engine.Canvas>
        </Card.Container>
      </main>
    </div>
  );
}
