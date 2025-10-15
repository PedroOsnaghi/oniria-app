import Starfield from "@shared/components/Starfield";
import { useTranslation } from "react-i18next";
import HeaderContainer from "@/shared/components/users/HeaderContainer";
import UnifiedSidePanel from "../home/components/Panel";
import { useTimelineData } from "@/app/features/history/hooks/useTimelineData";
import type { HistoryFilters } from "@/app/features/history/model/types";
import { useCallback, useState } from "react";
import { Engine } from "@/engine/core/namespace/EngineNamespace";
import Card from "@/shared/components/Card";
import NodeScene from "@/engine/scenes/NodeScene";
import { CameraSystem, InteractionSystem } from "@/engine";
import * as THREE from "three";

export default function History() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<HistoryFilters>({});
  const { timeline, loading } = useTimelineData(filters);

  const handleChangeFilters = useCallback((newFilters: HistoryFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="h-screen w-full bg-[radial-gradient(60%_80%_at_50%_0%,#1b0f2a_0%,#0b0810_55%,#06050b_100%)] text-white overflow-hidden flex flex-col">
      <Starfield />
      <HeaderContainer />

      <main className="container relative z-0 mx-auto grid grid-cols-12 gap-4 flex-1 min-h-0 pb-4">
        <UnifiedSidePanel
          variant="history"
          title={t("historial.title")}
          description={t("historial.description")}
          ctaText={t("historial.oniriaPro")}
          timeline={timeline}
          loading={loading}
          onChangeFilters={handleChangeFilters}
        />
        <Card.Container className="col-span-12 sm:col-span-9 rounded-2xl border backdrop-blur-md p-5 md:p-4 overflow-hidden relative">
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
