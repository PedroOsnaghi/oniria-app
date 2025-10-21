import {
  useMemo,
  useState,
  useCallback,
  useEffect,
  type PropsWithChildren,
  Children,
} from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";

import { Room } from "@engine/entities/Room";
import { Skin } from "@engine/entities/Skin";
import { Node } from "@engine/entities/Node";
import {
  AnimationService,
  CameraService,
  InteractionService,
  LoopService,
  MaterialService,
} from "../../services";
import { EngineState } from "../types/engine.types";
import {
  EngineCoreContext,
  RoomVersionContext,
} from "../context/EngineContext";
import { useEngineAPI } from "../context/EngineApiProvider";
import { DefaultEngineIndicator } from "./DefaultEngineIndicator";

type EngineCoreProps = PropsWithChildren;

/**
 * Núcleo del motor 3D que gestiona servicios, entidades y el ciclo de vida del engine
 *
 * @param children - Sistemas y componentes del motor a renderizar
 */
export function EngineCore({ children }: EngineCoreProps) {
  const [services, setServices] = useState<Record<string, unknown>>({});
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [activeSkin, setActiveSkin] = useState<Skin | null>(null);
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [servicesState, setServicesState] = useState<EngineState>(
    EngineState.INITIALIZING
  );
  const [roomVersion, setRoomVersion] = useState<number>(0);
  const [apiActions, setApiActions] = useState<Record<string, any>>({});

  const { scene, camera, gl, size, clock } = useThree();
  const engineAPI = useEngineAPI();

  // LoopService se inicializa inmediatamente y vive durante toda la sesión
  const loopService = useMemo(() => new LoopService(), []);

  useFrame((state, delta) => {
    loopService.tick(state, delta);
  });

  /**
   * Establece el estado actual del motor
   * @param state - Nuevo estado del motor
   */
  const setEngineState = useCallback((state: EngineState) => {
    setServicesState(state);
  }, []);

  /**
   * Registra un servicio en el motor
   * @param name - Nombre único del servicio
   * @param service - Instancia del servicio
   */
  const registerService = useCallback((name: string, service: unknown) => {
    setServices((prev) => ({ ...prev, [name]: service }));
  }, []);

  /**
   * Desregistra un servicio del motor
   * @param name - Nombre del servicio a eliminar
   */
  const unregisterService = useCallback((name: string) => {
    setServices((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  }, []);

  /**
   * Registra una nueva acción en la API del motor
   * @param actionName - Nombre de la acción (ej: 'viewNodes', 'node')
   * @param actionHandler - Función que ejecutará la acción o objeto con funciones
   */
  const registerApiAction = useCallback(
    (actionName: string, actionHandler: any) => {
      setApiActions((prev) => {
        // Si ya existe la clave y ambos valores son objetos, hacer merge
        if (
          prev[actionName] &&
          typeof prev[actionName] === "object" &&
          typeof actionHandler === "object"
        ) {
          return {
            ...prev,
            [actionName]: { ...prev[actionName], ...actionHandler },
          };
        }
        // Si no existe o no son objetos, reemplazar
        return { ...prev, [actionName]: actionHandler };
      });
    },
    []
  );

  /**
   * Desregistra una acción de la API del motor
   * @param actionName - Nombre de la acción a eliminar
   */
  const unregisterApiAction = useCallback((actionName: string) => {
    setApiActions((prev) => {
      const newActions = { ...prev };
      delete newActions[actionName];
      return newActions;
    });
  }, []);

  /**
   * Registra una nueva room y skin en el motor
   * @param roomId - ID único de la room
   * @param skinId - ID único del skin a aplicar
   */
  const registerRoom = useCallback((roomId: string, skinId: string): void => {
    try {
      if (!roomId?.trim()) {
        throw new Error("Room ID cannot be empty");
      }
      if (!skinId?.trim()) {
        throw new Error("Skin ID cannot be empty");
      }

      const skin = new Skin(skinId);
      setActiveSkin(skin);

      const room = new Room(roomId, skin);
      setActiveRoom(room);
    } catch (error) {
      console.error("Failed to register room:", error);
      setActiveRoom(null);
      setActiveSkin(null);
      throw error;
    }
  }, []);

  /**
   * Registra un nuevo skin en el motor
   * @param skinId - ID único del skin
   */
  const registerSkin = useCallback(
    (skinId: string): void => {
      try {
        if (!skinId?.trim()) {
          throw new Error("Skin ID cannot be empty");
        }

        const skin = new Skin(skinId);
        setActiveSkin(skin);

        // Si hay una room activa, actualizar su skin
        if (activeRoom) {
          activeRoom.setSkin(skin);
        }
      } catch (error) {
        console.error("Failed to register skin:", error);
        throw error;
      }
    },
    [activeRoom]
  );

  // Registro de Node
  const registerNode = useCallback(
    (nodeId: string, nodeRef: THREE.Group<THREE.Object3DEventMap>): void => {
      try {
        if (!nodeId?.trim()) {
          throw new Error("El ID del nodo no puede estar vacío");
        }
        if (!nodeRef) {
          throw new Error("La referencia al Nodo no puede ser nula");
        }

        // Verificar si ya existe un nodo con el mismo ID y referencia
        if (
          activeNode &&
          activeNode.id === nodeId &&
          activeNode.getGroup() === nodeRef
        ) {
          console.log(
            `Nodo ${nodeId} ya está registrado, omitiendo re-registro`
          );
          return;
        }

        // Crear o actualizar el nodo activo
        let node = activeNode;
        if (!node || node.id !== nodeId) {
          node = new Node(nodeId);
          setActiveNode(node);
        }

        // Establecer la referencia del grupo
        node.setGroup(nodeRef);

        // Obtener el API actual del nodo para preservar funciones existentes
        const currentNodeAPI = engineAPI.node || {};

        // Publicar el objeto node en la API del motor, preservando funciones existentes
        const nodeAPI = {
          ...currentNodeAPI, // Preservar funciones existentes como idle, rest
          next: () => {
            node.next();
          },
          prev: () => {
            node.prev();
          },
          // Crear un método para que otros sistemas puedan extender la API
          _extend: (extensions: Record<string, any>) => {
            const currentAPI = engineAPI.node || {};
            const mergedAPI = { ...currentAPI, ...extensions };
            engineAPI._setAPI("node", mergedAPI);
          },
        };

        engineAPI._setAPI("node", nodeAPI);
      } catch (error) {
        console.error("Error al publicar Nodo:", error);
        setActiveNode(null);
        throw error;
      }
    },
    [activeNode, engineAPI]
  );

  // Factories internas  - lazy creation pero controlado
  const getAnimationService = useCallback(() => {
    let service = services["animationService"] as AnimationService;
    if (!service) {
      if (!scene) throw new Error("Scene no inicializada");
      service = new AnimationService(scene as any);

      setTimeout(() => {
        registerService("animationService", service);
      }, 0);

      //registrarlo en la API del motor
      engineAPI._setAPI("animation", service);

      return service;
    }
    return service;
  }, [services, scene, registerService]);

  const getCameraService = useCallback(() => {
    let service = services["cameraService"] as CameraService;
    if (!service) {
      if (!camera || !gl) throw new Error("Camera/GL no inicializados");
      service = new CameraService(camera as any, gl.domElement);
      setTimeout(() => {
        registerService("cameraService", service);
      }, 0);
      //registrarlo en la API del motor
      return service;
    }
    return service;
  }, [services, camera, gl, registerService]);

  const getInteractionService = useCallback(() => {
    let service = services["interactionService"] as InteractionService;
    if (!service) {
      if (!camera || !gl) throw new Error("Scene/Camera/GL no inicializados");
      service = new InteractionService(camera as THREE.Camera, gl.domElement);
      setTimeout(() => {
        registerService("interactionService", service);
      }, 0);
      return service;
    }
    return service;
  }, [services, camera, gl, registerService]);

  const getMaterialService = useCallback(() => {
    let service = services["materialService"] as MaterialService;
    if (!service) {
      service = new MaterialService();
      setTimeout(() => {
        registerService("materialService", service);
      }, 0);
      return service;
    }
    return service;
  }, [services, registerService]);

  const updateActiveRoom = useCallback(() => {
    setRoomVersion((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (activeRoom) {
      // Escuchar todos los eventos de cambio de Room
      const handleRoomChange = () => {
        updateActiveRoom();
      };

      activeRoom.on("change", handleRoomChange);

      // Cleanup al desmontarse o cambiar de room
      return () => {
        activeRoom.off("change");
      };
    } else {
      setEngineState(EngineState.READY);
    }
  }, [activeRoom, updateActiveRoom]); // Solo depende de activeRoom

  // Sincronizar las acciones con la API del motor (solo cuando hay cambios reales)
  useEffect(() => {
    // Solo actualizar si hay acciones registradas o si se eliminaron todas
    if (Object.keys(apiActions).length > 0) {
      engineAPI._setAPI("actions", apiActions);
    }
  }, [apiActions]);

  const value = useMemo(
    () => ({
      scene,
      camera,
      gl,
      size,
      clock,
      activeRoom,
      activeSkin,
      activeNode,
      loopService,
      engineState: servicesState,
      updateActiveRoom,
      setEngineState,
      unregisterService,
      registerService,
      registerApiAction,
      unregisterApiAction,
      registerRoom,
      registerSkin,
      registerNode,
      getAnimationService,
      getCameraService,
      getInteractionService,
      getMaterialService,
    }),
    [
      scene,
      camera,
      gl,
      size,
      clock,
      activeRoom,
      activeSkin,
      activeNode,
      loopService,
      servicesState,
      updateActiveRoom,
      setEngineState,
      unregisterService,
      registerService,
      registerApiAction,
      unregisterApiAction,
      registerRoom,
      registerSkin,
      registerNode,
      getAnimationService,
      getCameraService,
      getInteractionService,
      getMaterialService,
    ]
  );

  // Verificar si hay contenido para renderizar
  const hasChildren = Children.count(children) > 0;

  return (
    <RoomVersionContext.Provider value={roomVersion}>
      <EngineCoreContext.Provider value={value}>
        {hasChildren ? children : <DefaultEngineIndicator />}
      </EngineCoreContext.Provider>
    </RoomVersionContext.Provider>
  );
}

EngineCore.displayName = "Engine.Core";
