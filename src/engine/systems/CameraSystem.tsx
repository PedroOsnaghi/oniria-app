import * as THREE from "three";
import { useEffect } from "react";

import { useEngineCore } from "@engine/core";
import { EngineState } from "@engine/core/";
import { useTransitions } from "@engine/hooks/useTransitions";

import { type CameraConfig } from "@engine/services/CameraService";

export interface CameraSystemProps {
  config?: CameraConfig;
  onCameraMove?: (position: THREE.Vector3, target: THREE.Vector3) => void;
  onCameraStop?: () => void;
  onZoomChange?: (distance: number) => void;
  enableControls?: boolean;
  autoConfigureForRoom?: boolean;
}

/**
 * Sistema de cámara del motor 3D.
 * Gestiona la configuración y controles de la cámara para la exploración de la escena.
 *
 * @param config Configuración inicial de la cámara
 * @param onCameraMove Callback cuando la cámara se mueve
 * @param onCameraStop Callback cuando la cámara deja de moverse
 * @param onZoomChange Callback cuando cambia el zoom (distancia)
 * @param enableControls Habilita o deshabilita los controles de la cámara
 * @param autoConfigureForRoom Si es true, configura automáticamente la cámara para la sala activa
 * @returns Componente React que no renderiza nada pero gestiona la cámara
 */
export default function CameraSystem({
  config,
  onCameraMove,
  onCameraStop,
  onZoomChange,
  enableControls = true,
  autoConfigureForRoom = true,
}: CameraSystemProps) {
  const core = useEngineCore();
  const {
    loopService,
    activeRoom,
    engineState,
    registerApiAction,
    unregisterApiAction,
  } = core;
  const cameraService = core.getCameraService();
  const { viewNodes, viewReset } = useTransitions();

  // Solo funcionar cuando el engine esté listo
  const isEngineReady = engineState === EngineState.READY;

  // Registrar acciones en la API del motor
  useEffect(() => {
    if (!isEngineReady) return;

    // Registrar la acción viewNodes
    registerApiAction("viewNodes", viewNodes);

    // Registrar la acción viewReset
    registerApiAction("viewReset", viewReset);

    // Cleanup al desmontar
    return () => {
      unregisterApiAction("viewNodes");
      unregisterApiAction("viewReset");
    };
  }, [
    isEngineReady,
    registerApiAction,
    unregisterApiAction,
    viewNodes,
    viewReset,
  ]);

  // Suscripción al loop para updates
  useEffect(() => {
    if (!isEngineReady || !loopService || !cameraService || !enableControls) {
      return;
    }

    const cb = (_: unknown, dt: number) => {
      cameraService?.update(dt);
    };

    loopService.subscribe(cb);
    return () => loopService.unsubscribe(cb);
  }, [loopService, cameraService, enableControls, isEngineReady]);

  // Configuración de eventos de la cámara
  useEffect(() => {
    if (!isEngineReady || !cameraService) return;

    const handleCameraMove = () => {
      if (onCameraMove) {
        const position = cameraService.getPosition();
        const target = cameraService.getTarget();
        onCameraMove(position, target);
      }
    };

    const handleCameraControl = () => {
      if (onZoomChange) {
        const distance = cameraService.getDistance();
        onZoomChange(distance);
      }
    };

    const handleCameraStop = () => {
      onCameraStop?.();
    };

    // Agregar event listeners
    cameraService.addEventListener("controlstart", handleCameraMove);
    cameraService.addEventListener("control", handleCameraControl);
    cameraService.addEventListener("controlend", handleCameraStop);

    return () => {
      cameraService.removeEventListener("controlstart", handleCameraMove);
      cameraService.removeEventListener("control", handleCameraControl);
      cameraService.removeEventListener("controlend", handleCameraStop);
    };
  }, [cameraService, onCameraMove, onCameraStop, onZoomChange, isEngineReady]);

  // Configuración automática para la room activa
  useEffect(() => {
    if (!isEngineReady || !cameraService || !autoConfigureForRoom) return;

    // Configuración por defecto (puede ser sobrescrita por props)
    const defaultConfig: CameraConfig = {
      minDistance: 3,
      maxDistance: 6,
      position: new THREE.Vector3(-4, 3, 4),
      target: new THREE.Vector3(0, 1.8, 0),
      smoothTime: 0.5,
      maxPolarAngle: Math.PI / 2,
      minPolarAngle: Math.PI / 3,
      maxAzimuthAngle: 0,
      minAzimuthAngle: -Math.PI / 2.5,
      boundaryEnclosesCamera: true,
      enablePan: false,
    };

    // Fusionar configuración por defecto con props
    const finalConfig = { ...defaultConfig, ...config };

    // Aplicar configuración
    cameraService.setConfig(finalConfig);
  }, [cameraService, activeRoom, config, autoConfigureForRoom, isEngineReady]);

  return null;
}
