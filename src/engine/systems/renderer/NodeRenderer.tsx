import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { Float } from "@react-three/drei";

import { useEngineCore } from "@engine/core";
import { useEngineStore } from "@engine/core";
import { EngineState } from "@engine/core";

interface NodeRendererProps {
  ref: React.Ref<THREE.Group<THREE.Object3DEventMap> | null>;
  scale?: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
}

/**
 * Renderer para nodos 3D con efectos de plasma y vidrio.
 * Gestiona la renderización de nodos especiales con shaders avanzados.
 */
export function NodeRenderer({
  ref,
  position = [-1.1, 2.85, -6.4],
}: NodeRendererProps) {
  const { loopService, engineState, getMaterialService } = useEngineCore();
  // Obtener uniforms del store para sincronización con debug
  const { nodeUniforms } = useEngineStore();

  // Solo funcionar cuando el engine está listo
  const isEngineReady = engineState === EngineState.READY;

  // Referencia al nodo
  const nodeRef = useRef<THREE.Group<THREE.Object3DEventMap> | null>(null);
  // Referencia al material para actualizaciones eficientes
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  // Crear uniforms de Three.js basados en el store + tiempo y resolución
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      // Uniforms sincronizados con el debug store (existentes)
      uPlasmaStrength: { value: nodeUniforms.uPlasmaStrength },
      uGlassStrength: { value: nodeUniforms.uGlassStrength },
      uPlasmaRadius: { value: nodeUniforms.uPlasmaRadius },
      uFresnelWidth: { value: nodeUniforms.uFresnelWidth },
      uFresnelIntensity: { value: nodeUniforms.uFresnelIntensity },
      uOnlyMask: { value: nodeUniforms.uOnlyMask },
      uFresnelBright: { value: nodeUniforms.uFresnelBright },
      uFresnelBrightWidth: { value: nodeUniforms.uFresnelBrightWidth },

      // Nuevos uniforms de dirección del humo/flujo
      uSmokeTurbulence: { value: nodeUniforms.uSmokeTurbulence },
      uSmokeDirectionOffset: { value: nodeUniforms.uSmokeDirectionOffset },

      // Nuevos uniforms de color del blob
      uPlasmaColor: { value: new THREE.Vector3(...nodeUniforms.uPlasmaColor) },
      uPlasmaColorIntensity: { value: nodeUniforms.uPlasmaColorIntensity },
      uPlasmaColorMap: {
        value: new THREE.Vector4(...nodeUniforms.uPlasmaColorMap),
      },
      // Paleta procedural del plasma (nuevos)
      uPlasmaOffset: {
        value: new THREE.Vector3(...nodeUniforms.uPlasmaOffset),
      },
      uPlasmaAmplitude: {
        value: new THREE.Vector3(...nodeUniforms.uPlasmaAmplitude),
      },
      uPlasmaFrequency: {
        value: new THREE.Vector3(...nodeUniforms.uPlasmaFrequency),
      },
      uPlasmaPhase: { value: new THREE.Vector3(...nodeUniforms.uPlasmaPhase) },

      uGlassColorBase: {
        value: new THREE.Vector3(...nodeUniforms.uGlassColorBase),
      },
      uGlassOffset: { value: new THREE.Vector3(...nodeUniforms.uGlassOffset) },
      uGlassAmplitude: {
        value: new THREE.Vector3(...nodeUniforms.uGlassAmplitude),
      },
      uGlassFrequency: {
        value: new THREE.Vector3(...nodeUniforms.uGlassFrequency),
      },
      uGlassPhase: { value: new THREE.Vector3(...nodeUniforms.uGlassPhase) },
      uGlassTint: { value: new THREE.Vector3(...nodeUniforms.uGlassTint) },
      uGammaCorrection: { value: nodeUniforms.uGammaCorrection },

      // Uniforms fijos para mask
      uMaskRadius: { value: 1.02 },
      uMaskEdgeSmooth: { value: 0.0 },
    }),
    [nodeUniforms]
  );

  // Actualizar uniforms cuando cambien los valores del store
  useEffect(() => {
    if (!uniforms) return;
    // Actualizar material directamente si existe
    if (materialRef.current && materialRef.current.uniforms) {
      // Uniforms existentes
      materialRef.current.uniforms.uPlasmaStrength.value =
        nodeUniforms.uPlasmaStrength;
      materialRef.current.uniforms.uGlassStrength.value =
        nodeUniforms.uGlassStrength;
      materialRef.current.uniforms.uPlasmaRadius.value =
        nodeUniforms.uPlasmaRadius;
      materialRef.current.uniforms.uFresnelWidth.value =
        nodeUniforms.uFresnelWidth;
      materialRef.current.uniforms.uFresnelIntensity.value =
        nodeUniforms.uFresnelIntensity;
      materialRef.current.uniforms.uOnlyMask.value = nodeUniforms.uOnlyMask;
      materialRef.current.uniforms.uFresnelBright.value =
        nodeUniforms.uFresnelBright;
      materialRef.current.uniforms.uFresnelBrightWidth.value =
        nodeUniforms.uFresnelBrightWidth;

      // Nuevos uniforms de dirección del humo/flujo
      materialRef.current.uniforms.uSmokeTurbulence.value =
        nodeUniforms.uSmokeTurbulence;
      materialRef.current.uniforms.uSmokeDirectionOffset.value =
        nodeUniforms.uSmokeDirectionOffset;

      // Nuevos uniforms de color
      materialRef.current.uniforms.uPlasmaColor.value.set(
        ...nodeUniforms.uPlasmaColor
      );
      materialRef.current.uniforms.uPlasmaColorIntensity.value =
        nodeUniforms.uPlasmaColorIntensity;
      materialRef.current.uniforms.uPlasmaColorMap.value.set(
        ...nodeUniforms.uPlasmaColorMap
      );
      // Paleta procedural del plasma (nuevos)
      materialRef.current.uniforms.uPlasmaOffset.value.set(
        ...nodeUniforms.uPlasmaOffset
      );
      materialRef.current.uniforms.uPlasmaAmplitude.value.set(
        ...nodeUniforms.uPlasmaAmplitude
      );
      materialRef.current.uniforms.uPlasmaFrequency.value.set(
        ...nodeUniforms.uPlasmaFrequency
      );
      materialRef.current.uniforms.uPlasmaPhase.value.set(
        ...nodeUniforms.uPlasmaPhase
      );
      materialRef.current.uniforms.uGlassColorBase.value.set(
        ...nodeUniforms.uGlassColorBase
      );
      materialRef.current.uniforms.uGlassOffset.value.set(
        ...nodeUniforms.uGlassOffset
      );
      materialRef.current.uniforms.uGlassAmplitude.value.set(
        ...nodeUniforms.uGlassAmplitude
      );
      materialRef.current.uniforms.uGlassFrequency.value.set(
        ...nodeUniforms.uGlassFrequency
      );
      materialRef.current.uniforms.uGlassPhase.value.set(
        ...nodeUniforms.uGlassPhase
      );
      materialRef.current.uniforms.uGlassTint.value.set(
        ...nodeUniforms.uGlassTint
      );
      materialRef.current.uniforms.uGammaCorrection.value =
        nodeUniforms.uGammaCorrection;
    }
  }, [nodeUniforms, uniforms]);

  // Aplicar material al nodo cuando esté listo
  useEffect(() => {
    if (!isEngineReady || !nodeRef.current || !getMaterialService) return;

    console.log("aplicando material al nodo");
    const materialService = getMaterialService();
    // Obtener la referencia al material principal
    const material = materialService.applyMaterialsToNodes(
      nodeRef.current,
      uniforms
    );

    // Guardar la referencia para updates posteriores
    materialRef.current = material;

    return () => {
      materialRef.current = null;
    };
  }, [isEngineReady, getMaterialService]);

  // Loop para actualizar uniforms
  useEffect(() => {
    if (!isEngineReady) return;

    const renderBackgroundShader = (_: unknown, deltaTime: number) => {
      if (materialRef.current?.uniforms?.uTime) {
        materialRef.current.uniforms.uTime.value += deltaTime;
      }
    };

    loopService.subscribe(renderBackgroundShader);
    return () => loopService.unsubscribe(renderBackgroundShader);
  }, [isEngineReady, loopService]);

  return (
    <>
      <Float
        speed={7}
        floatingRange={[-0.05, 0]}
        rotationIntensity={0.01}
        floatIntensity={0.6}
      >
        <group
          name="Node"
          ref={ref}
          scale={2}
          rotation={[0, 0, 0]}
          position={position}
        >
          <group ref={nodeRef}>
            <mesh name="blob">
              <planeGeometry args={[2, 2]} />
            </mesh>
            <mesh name="mask">
              <planeGeometry args={[2, 2]} />
            </mesh>
          </group>
        </group>
      </Float>
    </>
  );
}
