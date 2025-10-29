import {
  Engine,
  RoomScene,
  DebugSystem,
  Systems,
  LoaderSystem,
  useEngineStore,
} from "@/engine";
import { useEffect, useRef } from "react";
//import useDreams from "@/app/features/dreams/hooks/useDreams";
import { useEngineAPI } from "@/engine/core/context/EngineApiProvider";
//import type { Dream } from "@/engine/core/store/engineStore";
import HudSystem from "@/app/features/hud/components/Hudsystem";
import UserActions from "@/app/features/hud/components/topBar/UserActions";
import HeaderLogo from "@/app/features/logo/HeaderLogo";
import BadgeCard from "@/app/features/badges/BadgeCard";
import useHudHandler from "@/app/features/hud/hooks/useHudHandler";
import MenuSystem from "@/app/features/menuSystem/MenuSystem";
import DreamSystem from "@/app/features/dreams/DreamSystem";
import { useUserSettings } from "@/app/features/userSettings";
import { initThemeService } from "@/app/features/dark-mode/services/themeService";
import HistorySystem from "@/app/features/history/HistorySystem";

export default function MainLayout() {
  //const { t } = useTranslation();
  // const { fetchDreams } = useDreams();
  const { isDreamSystemActive, isHistoryPanelActive } = useEngineStore();
  const handler = useHudHandler();
  const engine = useEngineAPI();

  // Obtener configuración del usuario (skinId base sin tema)
  const { roomId, skinId, loading } = useUserSettings();

  // Ref para saber si ya se cargó la sala inicial
  const initialRoomLoaded = useRef(false);

  // Ref para saber si ya se inicializó el themeService
  const themeServiceInitialized = useRef(false);

  // Inicializar el themeService con el engine (solo una vez)
  useEffect(() => {
    if (!themeServiceInitialized.current) {
      initThemeService(engine);
      themeServiceInitialized.current = true;
    }
  }, [engine]);

  // Cargar sala inicial (solo una vez)
  useEffect(() => {
    if (!roomId || !skinId || loading || initialRoomLoaded.current) return;

    console.log("[MainLayout] Carga inicial - setRoom:", roomId, skinId);
    // setRoom aplicará el tema del store automáticamente
    engine.setRoom(roomId, skinId);
    initialRoomLoaded.current = true;
  }, [roomId, skinId, loading, engine]);

  return (
    <main className="relative w-full h-dvh ">
      <HudSystem.Container>
        <HudSystem.TopBar>
          <HeaderLogo text={"Oniria"} />
          <UserActions />
        </HudSystem.TopBar>
        <HudSystem.Body footerHeight="h-24">
          <MenuSystem />
          {isDreamSystemActive && <DreamSystem />}
          {isHistoryPanelActive && <HistorySystem />}
        </HudSystem.Body>
        {/* Footer reservado para futuras cards o controles */}
        <HudSystem.Footer height="h-24" className="pointer-events-none">
          {/* Aquí puedes agregar cards adicionales en el futuro */}
        </HudSystem.Footer>
      </HudSystem.Container>
      <LoaderSystem />

      {roomId && skinId && (
        <Engine.Canvas
          engineSettings={{
            backgroundColor: "#000000",
            cameraPosition: [-5, 4, 4],
          }}
        >
          <Engine.Core>
            <DebugSystem enabled={false} />
            <Systems.Interaction
              config={{
                callbacks: {
                  objects: {
                    onClick: handler.objectClickHandler,
                    onHover: handler.objectEnterHandler,
                    onHoverLeave: handler.objectLeaveHandler,
                  },
                },
              }}
            />
            <Systems.Badges badgeComponent={BadgeCard} />
            <Systems.Animation
              config={{
                autoPlay: true,
                playOnMount: true,
              }}
              enableAnimations={true}
              autoConfigureForRoom={true}
            />
            <Systems.Camera config={{}} />
            <RoomScene />
          </Engine.Core>
        </Engine.Canvas>
      )}
    </main>
  );
}
