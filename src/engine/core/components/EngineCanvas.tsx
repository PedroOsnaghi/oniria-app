import type { PropsWithChildren } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";

import type { EngineSettings } from "../types/engine.types";

interface EngineCanvasProps extends PropsWithChildren {
  engineSettings: EngineSettings;
  className?: string;
}

/**
 * Canvas principal del motor 3D que envuelve React Three Fiber
 *
 * @param engineSettings - Configuración del motor (color de fondo, etc.)
 * @param children - Componentes hijos a renderizar dentro del canvas
 * @param className - Clase CSS adicional opcional
 */
export function EngineCanvas({
  engineSettings = {
    backgroundColor: "#000000",
    cameraInitialPosition: [-5, 4, 4],
    cameraRotation: [0, 0, 0],
    cameraFOV: 45,
  },
  children,
  className,
}: EngineCanvasProps) {
  return (
    <Canvas
      className={`canvas-webgl ${className}`}
      gl={{
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.NoToneMapping,
      }}
      camera={{
        fov: engineSettings.cameraFOV || 45,
        position: engineSettings.cameraInitialPosition || [-4, 4, 3],
        rotation: engineSettings.cameraRotation || [0, 0, 0],
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
      <color attach="background" args={[engineSettings.backgroundColor]} />
    </Canvas>
  );
}

EngineCanvas.displayName = "Engine.Canvas";
