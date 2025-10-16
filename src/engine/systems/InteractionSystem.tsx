import * as THREE from "three";
import { useEffect, useState, useRef } from "react";

import { useEngineCore, useRoomVersionFromEngine } from "@engine/core";
import { useHandlers } from "../hooks";
import type { ObjectEventArray } from "../config/room.type";
import { EngineState } from "@engine/core";
import { Node } from "../entities/Node";

// Tipos para EventArgs (importar o redefinir según la estructura)
interface EventArgs<T = any, D = any> {
  target: T;
  data: D;
}

export interface InteractionSystemProps {
  // Event callbacks actualizados para usar EventArgs
  onObjectHoverEnter?: (_args: EventArgs<string, ObjectEventArray>) => void;
  onObjectHoverLeave?: (_args: EventArgs<string, ObjectEventArray>) => void;
  onObjectClick?: (_args: EventArgs<string, ObjectEventArray>) => void;
  onInteractionStateChange?: (_hoveredObjects: string[]) => void;
  onNodeHoverEnter?: (
    _args: EventArgs<Node, { distance: number; position: THREE.Vector3 }>
  ) => void;
  onNodeHoverLeave?: (
    _args: EventArgs<Node, { distance: number; position: THREE.Vector3 }>
  ) => void;
  onNodeClick?: (
    _args: EventArgs<Node, { distance: number; position: THREE.Vector3 }>
  ) => void;

  // Configuration
  enableInteractions?: boolean;
}

/**
 * Sistema de interacciones del motor 3D.
 * Gestiona las interacciones con objetos y nodos en la escena mediante raycasting.
 */
export default function InteractionSystem({
  onObjectHoverEnter,
  onObjectHoverLeave,
  onObjectClick,
  onNodeHoverEnter,
  onNodeHoverLeave,
  onNodeClick,
  enableInteractions = true,
}: InteractionSystemProps = {}) {
  const core = useEngineCore();
  const { activeRoom, activeNode, loopService, engineState } = core;
  const interactionService = core.getInteractionService();
  const handlers = useHandlers();
  const roomVersion = useRoomVersionFromEngine();

  // Referencias para mantener valores actuales sin causar re-renders
  const activeRoomRef = useRef(activeRoom);
  const activeNodeRef = useRef(activeNode);

  // Actualizar referencias cuando cambien los valores
  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  useEffect(() => {
    activeNodeRef.current = activeNode;
  }, [activeNode]);

  // Estado para objetos interceptables
  const [interceptableObjects, setInterceptableObjects] = useState<
    Record<string, any>
  >({});

  // Solo funcionar cuando el engine esté listo
  const isEngineReady = engineState === EngineState.READY;

  // Cargar objetos interceptables de forma asíncrona (como AnimationSystem)
  useEffect(() => {
    if (!isEngineReady || !activeRoom || !activeRoom.hasScene()) {
      setInterceptableObjects({});
      return;
    }

    const loadInterceptables = async () => {
      try {
        // Usar método async como AnimationSystem
        const roomInterceptables = await activeRoom.getInteractableObjects();
        setInterceptableObjects(roomInterceptables || {});
      } catch (error) {
        console.error("Error cargando objetos interceptables:", error);
        setInterceptableObjects({});
      }
    };

    loadInterceptables();
  }, [activeRoom, isEngineReady, roomVersion]);

  // Configurar callbacks personalizados en el InteractionService
  useEffect(() => {
    if (!isEngineReady || !interactionService || !enableInteractions) return;

    // Configurar callbacks custom si se proporcionan
    if (onObjectHoverEnter) {
      interactionService.setOnObjectEnter(onObjectHoverEnter);
    }
    if (onObjectHoverLeave) {
      interactionService.setOnObjectLeave(onObjectHoverLeave);
    }
    if (onObjectClick) {
      interactionService.setOnObjectClick(onObjectClick);
    }
    if (onNodeHoverEnter) {
      interactionService.setOnNodeEnter(onNodeHoverEnter);
    }
    if (onNodeHoverLeave) {
      interactionService.setOnNodeLeave(onNodeHoverLeave);
    }
    if (onNodeClick) {
      interactionService.setOnNodeClick(onNodeClick);
    }

    return () => {
      interactionService.setOnObjectEnter(undefined);
      interactionService.setOnObjectLeave(undefined);
      interactionService.setOnObjectClick(undefined);
    };
  }, [
    interactionService,
    enableInteractions,
    onObjectHoverEnter,
    onObjectHoverLeave,
    onObjectClick,
    onNodeHoverEnter,
    onNodeHoverLeave,
    onNodeClick,
    isEngineReady,
  ]);

  // Configurar listeners de eventos internos
  useEffect(() => {
    if (!isEngineReady || !interactionService) return;

    // Configurar los handlers internos
    interactionService.on("objectEnter", handlers.onObjectsEnter);
    interactionService.on("objectLeave", handlers.onObjectsLeave);
    interactionService.on("objectClick", handlers.onObjectsClick);
    interactionService.on("nodeEnter", handlers.onNodeEnter);
    interactionService.on("nodeLeave", handlers.onNodeLeave);
    interactionService.on("nodeClick", handlers.onNodeClick);

    return () => {
      interactionService.off("objectEnter");
      interactionService.off("objectLeave");
      interactionService.off("objectClick");
      interactionService.off("nodeEnter");
      interactionService.off("nodeLeave");
      interactionService.off("nodeClick");
    };
  }, [interactionService, handlers, isEngineReady]);

  // Suscripción a eventos de navegación del nodo activo
  useEffect(() => {
    if (!isEngineReady || !activeNode) return;

    // Suscribirse a los eventos del nodo
    activeNode.on("onNextNode", handlers.handleNextNode);
    activeNode.on("onPrevNode", handlers.handlePrevNode);

    // Cleanup
    return () => {
      activeNode.off("onNextNode");
      activeNode.off("onPrevNode");
    };
  }, [
    isEngineReady,
    activeNode,
    handlers.handleNextNode,
    handlers.handlePrevNode,
  ]);

  // Actualizar interacciones en el loop
  useEffect(() => {
    if (!isEngineReady || !loopService || !interactionService) {
      return;
    }

    const updateInteractions = () => {
      // Usar las referencias actuales para evitar dependencias que cambien constantemente
      const currentActiveRoom = activeRoomRef.current;
      const currentActiveNode = activeNodeRef.current;

      // Actualizar interacciones de Room si hay room activa Y objetos interceptables
      if (currentActiveRoom && Object.keys(interceptableObjects).length > 0) {
        interactionService.update(currentActiveRoom, { interceptableObjects });
      }

      // Actualizar interacciones de Node si hay nodo activo (independiente de room)
      if (currentActiveNode) {
        interactionService.update(currentActiveNode, { radius: 1.0 });
      }
    };

    loopService.subscribe(updateInteractions);
    return () => loopService.unsubscribe(updateInteractions);
  }, [
    loopService,
    interactionService,
    isEngineReady,
    interceptableObjects,
    // Removemos activeRoom y activeNode de las dependencias para evitar re-suscripciones constantes
    // En su lugar, las funciones capturarán los valores actuales en tiempo de ejecución
  ]);

  return null;
}
