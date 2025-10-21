import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Cubo violeta girando que indica que el motor está funcionando.
 * Se muestra por defecto cuando no hay contenido específico.
 */
export function DefaultEngineIndicator() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animación de rotación
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#9333ea" /> {/* Violeta */}
      {/* Luz ambiente para iluminar el cubo */}
      <ambientLight intensity={0.7} />
      <pointLight position={[1, 3, 2]} intensity={8} />
    </mesh>
  );
}
