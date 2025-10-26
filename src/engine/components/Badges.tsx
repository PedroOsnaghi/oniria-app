import React, { useState, useEffect, useCallback } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useEngineCore } from "@engine/core";
import { useEngineStore } from "@engine/core/store/engineStore";
import type { ObjectEventArray } from "@engine/config/room.type";
import {
  useObjectsDescriptions,
  type BadgeData,
} from "@/app/features/hud/components/badges/badgeStore";

interface EventArgs<T = any, D = any> {
  target: T;
  data: D;
}

// Props que el badge personalizado recibirá obligatoriamente
export interface BadgeComponentProps {
  object: BadgeData | null;
  position?: [number, number, number];
}

interface BadgesProps {
  badgeComponent?: React.ComponentType<BadgeComponentProps>;
  badgeComponentProps?: Record<string, any>;
}

/**
 * Componente que escucha eventos de interacción y renderiza badges HTML
 * en la posición 3D del objeto interceptable.
 * Los badges se ocultan automáticamente cuando hay un menú activo.
 */
export function Badges({ badgeComponent, badgeComponentProps }: BadgesProps) {
  const core = useEngineCore();
  const { activeMenu } = useEngineStore();
  const [object, setObject] = useState<BadgeData | null>(null);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [visible, setVisible] = useState(false);
  const objectsDescriptions = useObjectsDescriptions();

  const handleBadgeClick = useCallback(() => {
    console.log("[Badge] Clicked");
  }, []);

  useEffect(() => {
    // Suscribirse a eventos del core
    const handleObjectEnter = (args: EventArgs<string, ObjectEventArray>) => {
      const currentRoom = core.getCurrentRoom();
      if (!currentRoom) return;

      const obj = currentRoom.getObjectByName(args.target);
      if (!obj) return;

      const badgeData =
        objectsDescriptions.find((desc) => desc.name === args.target) || null;

      const worldPos = new THREE.Vector3();
      obj.getWorldPosition(worldPos);

      setObject(badgeData);
      setPosition([worldPos.x, worldPos.y, worldPos.z]);
      setVisible(true);
    };

    const handleObjectLeave = () => {
      setVisible(false);
      setObject(null);
    };

    const handleObjectClick = () => {
      handleBadgeClick();
    };

    core.on("objectEnter", handleObjectEnter);
    core.on("objectLeave", handleObjectLeave);
    core.on("objectClick", handleObjectClick);

    return () => {
      core.off("objectEnter");
      core.off("objectLeave");
      core.off("objectClick");
    };
  }, [core, handleBadgeClick]);

  // No mostrar badges si hay un menú activo
  if (!visible || !object || activeMenu) return null;

  // Offset vertical para que el badge quede arriba del objeto
  const offsetPosition: [number, number, number] = [
    position[0] + object.xOffset,
    position[1] + object.yOffset,
    position[2] + object.zOffset,
  ];

  const Badge = badgeComponent || DefaultComponent;

  return (
    <Html
      position={offsetPosition}
      center
      transform={false} // Desactiva la transformación 3D para mantener tamaño fijo
      sprite // Hace que siempre mire a la cámara
      zIndexRange={[100, 0]}
      style={{
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <Badge object={object} {...badgeComponentProps} />
    </Html>
  );
}

function DefaultComponent({ object }: BadgeComponentProps) {
  return (
    <div
      style={{
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "8px 16px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
        whiteSpace: "nowrap",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      {object?.name}
    </div>
  );
}

Badges.displayName = "Engine.Badges";
