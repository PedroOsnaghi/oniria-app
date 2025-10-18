import * as THREE from "three";
import {
  Engine,
  useEngine,
  RoomScene,
  LoaderSystem,
  CameraSystem,
  AnimationSystem,
  InteractionSystem,
  DebugSystem,
} from "@/engine";

import Starfield from "../../../shared/components/Starfield";
import Card from "@/shared/components/Card";
import { useEffect } from "react";
import HeaderContainer from "@/shared/components/users/HeaderContainer";
import useDreams from "@/app/features/dreams/hooks/useDreams";
import UnifiedSidePanel from "./components/Panel";
import HudSystem from "@/engine/systems/hud/HudSystem";
import type { Dream } from "@/engine/core/store/engineStore";

export default function Home() {
  //const { t } = useTranslation();
  const { fetchDreams } = useDreams();

  const engine = useEngine();
  //algo asi seria la respuesta del backend
  //y se lo pasariamos al engine
  //para setear la room y skin
  //por ahora hardcodeado
  const backendSettings = { roomId: "oniria", skinId: "oniria" };
  const { roomId, skinId } = backendSettings;

  useEffect(() => {
    engine.setRoom(roomId, skinId);
  }, []);

  const handleBackHome = () => {
    engine.actions?.viewReset?.();
  };

  const hoverHandler = (args: any) => {
    console.log("hovered", args.objectName || args);
  };

  const handleInterpretar = async (dream: string) => {
    console.log("handleInterpretar iniciado con dream:", dream);
    engine.actions.viewNodes?.();

    setTimeout(async () => {
      const response = await fetchDreams(dream);
      engine.setDream(response as Dream);
    }, 500);

    //navegar a otra pagina con el resultado
    //navigate("/interpretacion");
  };

  return (
    <div
      className="w-full h-dvh text-[var(--color-text-primary)] overflow-hidden flex flex-col"
      style={{ background: "var(--app-bg)" }}
    >
      {/* fondo de estrellas */}
      <Starfield />

      {/* top bar */}
      <HeaderContainer />

      {/* layout principal - ocupa el resto del espacio disponible */}
      <main className="container relative z-0 mx-auto grid grid-cols-12 gap-4 flex-1 min-h-0 pb-4">
        <UnifiedSidePanel
          variant="home"
          onInterpretar={handleInterpretar}
          onBackHome={handleBackHome}
          scrollable
        />

        {/* Canvas 3d */}
        <Card.Container className="col-span-12 sm:col-span-9 rounded-2xl border backdrop-blur-md p-5 md:p-4 overflow-hidden relative">
          <HudSystem />
          <LoaderSystem />

          {roomId && skinId && (
            <Engine.Canvas
              engineSettings={{
                backgroundColor: "#000000",
                cameraInitialPosition: [-2, 8, 3],
              }}
            >
              <Engine.Core>
                <DebugSystem enabled={true} />
                <InteractionSystem onObjectHoverEnter={hoverHandler} />
                <AnimationSystem />
                <CameraSystem />
                <RoomScene />
              </Engine.Core>
            </Engine.Canvas>
          )}
        </Card.Container>
      </main>
    </div>
  );
}
