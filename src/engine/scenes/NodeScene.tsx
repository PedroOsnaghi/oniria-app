import * as THREE from "three";
import { useRef, useEffect, useCallback } from "react";

import { NodeRenderer } from "../systems/renderer/NodeRenderer";
import { useEngineCore } from "@engine/core";
import { useTransitions } from "../hooks";

interface NodeSceneProps {
  position?: [number, number, number];
}

/**
 * Escena para renderizar nodos 3D.
 * Gestiona la renderización de nodos especiales en la escena.
 */
export default function NodeScene({
  position = [-1.1, 2.85, -6.4],
}: NodeSceneProps) {
  const nodeRef = useRef<THREE.Group<THREE.Object3DEventMap> | null>(null);
  const core = useEngineCore();
  const { viewNodes } = useTransitions();

  // Función personalizada para reposicionar la cámara hacia el nodo
  const viewNode = useCallback(() => {
    const cameraService = core.getCameraService();
    if (!cameraService || !nodeRef.current) return;

    // Crear target basado en la posición del nodo
    const nodePosition = new THREE.Vector3(...position);
    const cameraTarget = nodePosition.clone();
    const cameraPosition = nodePosition.clone().add(new THREE.Vector3(0, 0, 3));

    const onRest = () => {
      cameraService.removeEventListener("rest", onRest);
    };

    cameraService.addEventListener("rest", onRest);
    cameraService.setRestThreshold(0.8);
    cameraService.setLookAt(cameraPosition, cameraTarget, true);
  }, [core.getCameraService, position]);

  // Decidir qué función usar según el contexto
  const handleControlEnd = useCallback(() => {
    // Intentar usar viewNodes primero (para contexto de portal)
    // Si no funciona, usar nuestra función personalizada
    const { activeRoom } = core;
    if (activeRoom && activeRoom.getPortal()) {
      viewNodes();
    } else {
      viewNode();
    }
  }, [core, viewNodes, viewNode]);

  // Registrar el nodo cuando la referencia esté disponible
  useEffect(() => {
    if (nodeRef.current) {
      // Registrar el nodo con un ID por defecto o dinámico
      //despues lo vemos despues
      core.registerNode("default-node", nodeRef.current);
    }
  }, [core, nodeRef]);

  /**
   * useEffect separado para manejar la configuración de cámara específica para nodos
   * Esta configuración se aplica cuando se monta NodeScene y se mantiene
   * hasta que el componente se desmonte
   */
  useEffect(() => {
    const cameraService = core.getCameraService();
    if (!cameraService) return;

    // Aplicar configuración específica para nodos
    // Configuración muy restrictiva para mantener el nodo siempre de frente
    cameraService.setDraggingSmoothTime(0.7);

    // Cambiar comportamiento del mouse izquierdo a paneo en lugar de orbitar
    cameraService.setLeftMouseAction("pan");

    // Ángulos polares: limitar movimiento vertical (arriba/abajo)
    // Valores cercanos para permitir solo pequeños ajustes verticales
    cameraService.setMaxPolarAngle(Math.PI / 2 + 0.2); // ~110° - ligeramente hacia abajo
    cameraService.setMinPolarAngle(Math.PI / 2 - 0.2); // ~70° - ligeramente hacia arriba

    // Ángulos azimut: limitar movimiento horizontal (izquierda/derecha)
    // Permitir solo pequeños giros laterales (±15° aproximadamente)
    cameraService.setAzimuthMaxAngle(0.26); // ~15° hacia la derecha
    cameraService.setAzimuthMinAngle(-0.26); // ~15° hacia la izquierda

    cameraService.setEnableZoom(false);
    cameraService.setEnablePan(true); // Habilitar paneo para el botón derecho también    // Agregar listener para el evento controlend
    cameraService.addEventListener("controlend", handleControlEnd);

    // Cleanup: restaurar configuración por defecto y remover listener
    return () => {
      cameraService.removeEventListener("controlend", handleControlEnd);

      // Restaurar comportamiento del mouse izquierdo a orbitar
      cameraService.setLeftMouseAction("rotate");

      // Restaurar configuración por defecto al desmontar NodeScene
      // Usar la misma lógica que PortalRenderer para configuración por defecto
      const defaultConfig = cameraService.getDefaultConfig();
      if (defaultConfig) {
        cameraService.setMaxPolarAngle(defaultConfig.maxPolarAngle || Math.PI);
        cameraService.setMinPolarAngle(defaultConfig.minPolarAngle || 0);
        cameraService.setAzimuthMaxAngle(
          defaultConfig.maxAzimuthAngle || Infinity
        );
        cameraService.setAzimuthMinAngle(
          defaultConfig.minAzimuthAngle || -Infinity
        );
        cameraService.setEnablePan(!!defaultConfig.enablePan);
      }
      // Restaurar valores por defecto para propiedades no en defaultConfig
      cameraService.setDraggingSmoothTime(0.1);
      cameraService.setEnableZoom(true);
    };
  }, [core.getCameraService, handleControlEnd]);

  return (
    <>
      <NodeRenderer ref={nodeRef} position={position} />
    </>
  );
}
