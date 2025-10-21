import { useEffect, useState } from "react";
import type { AnimationAction } from "../config/room.type";
import { useEngineCore } from "@engine/core";
import { EngineState } from "@engine/core";
import { useEngineStore } from "@engine/core";
import { useNodeAnimation } from "../hooks/useNodeAnimation";
import { useEngineAPI } from "../core/context/EngineApiProvider";

export type AnimationConfig = {
  animations?: Record<string, AnimationAction>;
  autoPlay?: boolean;
  playOnMount?: boolean;
};

export interface AnimationSystemProps {
  config?: AnimationConfig;
  onAnimationStart?: (targetName: string, animationType: string) => void;
  onAnimationComplete?: (targetName: string, animationType: string) => void;
  onAnimationUpdate?: (targetName: string, progress: number) => void;
  enableAnimations?: boolean;
  autoConfigureForRoom?: boolean;
}

/**
 * Sistema de animaciones del motor 3D.
 * Gestiona la reproducción automática y manual de animaciones en objetos de la escena.
 */
export default function AnimationSystem({
  config = {},
  onAnimationStart,
  onAnimationComplete,
  onAnimationUpdate,
  enableAnimations = true,
  autoConfigureForRoom = true,
}: AnimationSystemProps) {
  const core = useEngineCore();
  const { activeRoom, engineState, activeNode } = core;
  const activeScene = activeRoom?.getScene();
  const animationService = core.getAnimationService();
  const { idle, rest } = useNodeAnimation();
  const engineAPI = useEngineAPI();

  // Acceder al dream directamente desde el store
  const dream = useEngineStore((s) => s.dream);

  const [animatables, setAnimatables] = useState<
    Record<string, AnimationAction>
  >({});

  // Solo funcionar cuando el engine esté listo
  const isEngineReady = engineState === EngineState.READY;

  // Configurar objetos animatables desde la habitación o props
  useEffect(() => {
    if (!isEngineReady || !enableAnimations) return;

    const loadAnimatables = async () => {
      let newAnimatables: Record<string, AnimationAction> = {};

      // Cargar animatables desde la room si está configurado
      if (autoConfigureForRoom && activeRoom) {
        const roomAnimatables = await activeRoom.getAnimatableObjects();
        newAnimatables = { ...roomAnimatables };
      }

      // Agregar/sobrescribir con animaciones de configuración
      if (config.animations) {
        newAnimatables = { ...newAnimatables, ...config.animations };
      }

      setAnimatables(newAnimatables);
    };

    loadAnimatables();
  }, [
    activeScene,
    config.animations,
    autoConfigureForRoom,
    enableAnimations,
    isEngineReady,
    activeRoom,
  ]);

  // Configurar callbacks de eventos en el servicio
  useEffect(() => {
    if (!isEngineReady || !animationService) return;

    animationService.setOnAnimationStart(onAnimationStart);
    animationService.setOnAnimationComplete(onAnimationComplete);
    animationService.setOnAnimationUpdate(onAnimationUpdate);

    return () => {
      animationService.setOnAnimationStart(undefined);
      animationService.setOnAnimationComplete(undefined);
      animationService.setOnAnimationUpdate(undefined);
    };
  }, [
    animationService,
    onAnimationStart,
    onAnimationComplete,
    onAnimationUpdate,
    isEngineReady,
  ]);

  // Ejecutar animaciones automáticas
  useEffect(() => {
    if (
      !isEngineReady ||
      !animationService ||
      !activeScene ||
      !enableAnimations
    )
      return;

    const shouldAutoPlay =
      config.autoPlay !== false && config.playOnMount !== false;

    if (shouldAutoPlay && Object.keys(animatables).length > 0) {
      Object.values(animatables).forEach((animationConfig) => {
        animationService.play(animationConfig);
      });
    }

    return () => {
      animationService.stopAll();
    };
  }, [
    animationService,
    animatables,
    activeScene,
    enableAnimations,
    config.autoPlay,
    config.playOnMount,
    isEngineReady,
  ]);

  // Registrar acciones de nodo en la API del motor
  useEffect(() => {
    if (!isEngineReady || !activeNode) {
      return;
    }

    // Crear objeto node con las acciones disponibles
    const nodeActions = {
      idle: idle,
      rest: rest,
    };

    // Verificar si el node API ya está disponible y tiene el método _extend
    if (
      engineAPI.node &&
      typeof (engineAPI.node as any)._extend === "function"
    ) {
      (engineAPI.node as any)._extend(nodeActions);
    } else {
      // Fallback: registrar directamente si el EngineCore aún no ha registrado
      engineAPI._setAPI("node", nodeActions);
    }

    // No necesitamos cleanup automático porque queremos mantener
    // las funciones disponibles durante toda la vida del nodo
  }, [isEngineReady, activeNode, idle, rest]);

  // Reaccionar cuando el dream cambia en el store para ejecutar animación idle
  useEffect(() => {
    if (dream && isEngineReady && animationService && activeNode) {
      idle();
    }
  }, [isEngineReady, dream, animationService, activeNode]);

  return null;
}
