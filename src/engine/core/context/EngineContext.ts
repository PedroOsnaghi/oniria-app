import { createContext } from "react";
import * as THREE from "three";

import type { Room } from "@engine/entities/Room";
import type { Skin } from "@engine/entities/Skin";
import type { Node } from "@engine/entities/Node";
import type { EngineState } from "@engine/core/types/engine.types";
import type { LoopService, AnimationService, CameraService, InteractionService, MaterialService } from "../../services";

/**
 * Interfaz que define la API completa del núcleo del motor
 */
export interface EngineCoreAPI {
  // Fundamentos de Three.js
  scene: THREE.Scene | null;
  camera: THREE.Camera | null;
  gl: THREE.WebGLRenderer | null;
  size: { width: number; height: number };
  clock: THREE.Clock;

  // Entidades activas
  activeRoom: Room | null;
  activeSkin: Skin | null;
  activeNode: Node | null;
  loopService: LoopService;
  engineState: EngineState;

  // Métodos principales
  updateActiveRoom: () => void;
  setEngineState: (_state: EngineState) => void;
  unregisterService: (_name: string) => void;
  registerService: (_name: string, _service: unknown) => void;
  registerApiAction: (_actionName: string, _actionHandler: any) => void;
  unregisterApiAction: (_actionName: string) => void;
  registerRoom: (_roomId: string, _skinId: string) => void;
  registerNode: (
    _nodeId: string,
    _nodeRef: THREE.Group<THREE.Object3DEventMap>
  ) => void;
  registerSkin: (_skinId: string) => void;

  // Getters de servicios
  getAnimationService: () => AnimationService;
  getCameraService: () => CameraService;
  getInteractionService: () => InteractionService;
  getMaterialService: () => MaterialService;
}

/**
 * Contexto principal del núcleo del motor
 */
export const EngineCoreContext = createContext<EngineCoreAPI | null>(null);

/**
 * Contexto separado para versiones de sala para evitar re-renders innecesarios
 */
export const RoomVersionContext = createContext<number>(0);