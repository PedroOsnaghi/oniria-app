import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

import { useEngineCore } from "@engine/core";
import { EngineState } from "@engine/core";
import NodeScene from "@/engine/scenes/NodeScene";
import { Sparkles } from "@react-three/drei";

interface PortalRendererProps {
  portal?: THREE.Object3D;
}

/**
 * Renderer para portales con efectos de shader animados.
 * Gestiona la renderización de portales con efectos visuales especiales.
 */
export const PortalRenderer = ({ portal }: PortalRendererProps) => {
  const core = useEngineCore();
  const { loopService, engineState, getCameraService } = core;
  const materialService = core.getMaterialService();
  const portalMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const [showNodes, setShowNodes] = useState(false);

  const isEngineReady = engineState === EngineState.READY;

  // Configuración de uniforms del Portal
  const portalUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPortalAlpha: { value: 1.0 },
      uDensity: { value: 4.5 },
      uRadius: { value: 1.2 },
      uAngle: { value: 3.2 },
      uHue: { value: 0.74 },
      uSaturation: { value: 0.58 },
      uRadiusFactor: { value: 1.5 },
      uGainOffset: { value: 0.5 },
      uGainScale: { value: 3.0 },
    }),
    []
  );

  // Aplicar material y configurar animación del portal
  useEffect(() => {
    if (!isEngineReady || !portal || !materialService || !loopService) {
      return;
    }

    // Aplicar el material del portal
    materialService.applyMaterialsToPortal(portal, portalUniforms);

    // Guardar referencia al material
    const portalMesh = portal as THREE.Mesh;
    if (portalMesh.material && "uniforms" in portalMesh.material) {
      portalMaterialRef.current = portalMesh.material as THREE.ShaderMaterial;
    }

    // Configurar animación
    const animatePortal = (_: unknown, delta: number) => {
      if (portalMaterialRef.current?.uniforms?.uTime) {
        portalMaterialRef.current.uniforms.uTime.value += delta;
      }
    };

    loopService.subscribe(animatePortal);

    return () => {
      loopService.unsubscribe(animatePortal);
    };
  }, [isEngineReady, portal, materialService, loopService, portalUniforms]);

  // detectar cuando la camara entra al portal
  useEffect(() => {
    if (!isEngineReady || !portal) return;

    const cameraService = getCameraService();
    if (!cameraService) return;

    // Función para verificar si la cámara está dentro del portal
    // nos aseguramos de mostrar los nodos solo cuando la cámara está dentro del portal
    // y no en cualquiero otro lugar de la escena
    const checkCameraInPortal = () => {
      const cameraPos = cameraService.getPosition();
      const portalPos = new THREE.Vector3();
      portal.getWorldPosition(portalPos);
      const distance = cameraPos.distanceTo(portalPos);
      const threshold = 1.5; // distancia umbral para considerar que la cámara está "dentro" del portal

      // Ajustar controles de cámara según proximidad al portal
      // Solo aplicar configuraciones cuando NO hay NodeScene activa
      if (distance < threshold) {
        // La cámara está dentro del portal - mostrar nodos
        // NodeScene se encargará de su propia configuración de cámara
        setShowNodes(true);
      } else {
        // La cámara está fuera del portal - configuración para room
        if (!showNodes) {
          // Solo aplicar configuración de room si no hay nodos activos
          cameraService.setDraggingSmoothTime(0.1);
          const defaultConfig = cameraService.getDefaultConfig();
          if (defaultConfig) {
            cameraService.setMaxPolarAngle(defaultConfig.maxPolarAngle!);
            cameraService.setMinPolarAngle(defaultConfig.minPolarAngle!);
            cameraService.setAzimuthMaxAngle(defaultConfig.maxAzimuthAngle!);
            cameraService.setAzimuthMinAngle(defaultConfig.minAzimuthAngle!);
            cameraService.setEnableZoom(true);
            cameraService.setEnablePan(!!defaultConfig.enablePan);
          }
        }
        setShowNodes(false);
      }
    };

    cameraService.addEventListener("rest", checkCameraInPortal);

    //clean up
    return () => {
      cameraService.removeEventListener("rest", checkCameraInPortal);
    };
  }, [isEngineReady, portal, getCameraService, showNodes]);

  return (
    <>
      <Sparkles
        count={50}
        size={6}
        position={[-1.2, 3, -2.2]}
        scale={1.3}
        speed={0.4}
      />
      {showNodes && <NodeScene />}
    </>
  );
};
