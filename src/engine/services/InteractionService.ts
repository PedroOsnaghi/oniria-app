import * as THREE from "three";

import { Room } from "@engine/entities/Room";
import { Node } from "@engine/entities/Node";
import type { ObjectEventArray } from "../config/room.type";
import { EventEmitter } from "../utils/EventEmitter";

/**
 * Tipos para argumentos de eventos
 */
export type EventArgs<T = any, D = any> = {
    target: T;
    data: D;
}

/**
 * Mapa de tipos de eventos para inferencia automática de TypeScript
 */
export interface InteractionEventMap extends Record<string, unknown> {
    // Eventos de Room
    objectEnter: EventArgs<string, ObjectEventArray>;
    objectLeave: EventArgs<string, ObjectEventArray>;
    objectClick: EventArgs<string, ObjectEventArray>;

    // Eventos de Node
    nodeEnter: EventArgs<Node, { distance: number; position: THREE.Vector3 }>;
    nodeLeave: EventArgs<Node, { distance: number; position: THREE.Vector3 }>;
    nodeMove: EventArgs<Node, { distance: number; position: THREE.Vector3 }>;
    nodeClick: EventArgs<Node, { distance: number; position: THREE.Vector3 }>;
}

type InteractionCallback = (_args: EventArgs<string, ObjectEventArray>) => void;
type NodeInteractionCallback = (_args: EventArgs<Node, { distance: number; position: THREE.Vector3 }>) => void;
interface RoomInteractionConfig {
    interceptableObjects: Record<string, ObjectEventArray>;
}

interface NodeInteractionConfig {
    radius: number;
}

// Tipos de entidad para el genérico
type InteractionConfig<T> = T extends Room ? RoomInteractionConfig : T extends Node ? NodeInteractionConfig : never;

/**
 * Servicio para gestionar interacciones con objetos 3D mediante raycasting
 */
export class InteractionService extends EventEmitter<InteractionEventMap> {
    private raycaster = new THREE.Raycaster();

    private mouse = new THREE.Vector2();

    private prevHovered = new Set<string>();

    private interactableCache: Record<string, ObjectEventArray> = {};

    private currentNodeDistance: number = Infinity;

    private isWithinNodeRadius: boolean = false;

    private currentNode: Node | null = null;

    // Callbacks personalizados para Room
    private onObjectEnterCallback?: InteractionCallback;

    private onObjectLeaveCallback?: InteractionCallback;

    private onObjectClickCallback?: InteractionCallback;

    // Callbacks personalizados para Node
    private onNodeEnterCallback?: NodeInteractionCallback;

    private onNodeLeaveCallback?: NodeInteractionCallback;

    private onNodeMoveCallback?: NodeInteractionCallback;

    private onNodeClickCallback?: NodeInteractionCallback;


    constructor(
        // eslint-disable-next-line no-unused-vars
        private camera: THREE.Camera,
        // eslint-disable-next-line no-unused-vars
        private domElement: HTMLElement,
    ) {
        super();
        this.domElement.addEventListener("mousemove", this.onMouseMove);
        this.domElement.addEventListener("click", this.onClick);
        console.log("nueva instancia de InteractionService");
    }

    dispose() {
        this.domElement.removeEventListener("mousemove", this.onMouseMove);
        this.domElement.removeEventListener("click", this.onClick);
    }

    // Métodos para configurar callbacks personalizados de Room
    setOnObjectEnter(callback?: InteractionCallback) {
        this.onObjectEnterCallback = callback;
    }

    setOnObjectLeave(callback?: InteractionCallback) {
        this.onObjectLeaveCallback = callback;
    }

    setOnObjectClick(callback?: InteractionCallback) {
        this.onObjectClickCallback = callback;
    }

    // Métodos para configurar callbacks personalizados de Node
    setOnNodeEnter(callback?: NodeInteractionCallback) {
        this.onNodeEnterCallback = callback;
    }

    setOnNodeLeave(callback?: NodeInteractionCallback) {
        this.onNodeLeaveCallback = callback;
    }

    setOnNodeMove(callback?: NodeInteractionCallback) {
        this.onNodeMoveCallback = callback;
    }

    setOnNodeClick(callback?: NodeInteractionCallback) {
        this.onNodeClickCallback = callback;
    }

    private onMouseMove = (event: MouseEvent) => {
        const rect = this.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    private onClick = () => {
        // Verificar click en Node usando el flag isWithinNodeRadius
        if (this.isWithinNodeRadius && this.currentNode) {
            this.handleNodeEvent('click', this.currentNodeDistance, new THREE.Vector3());
            return;
        }

        // Si no es Node, verificar clicks en Room
        if (!this.prevHovered.size) return;
        const name = Array.from(this.prevHovered)[0];
        this.handleRoomEvent("objectClick", name, this.interactableCache?.[name]);
    };

    /**
     * Método genérico de actualización que maneja tanto Room como Node
     */
    update<T extends Room | Node>(entity: T, config: InteractionConfig<T>) {
        // Verificar el tipo de entidad y llamar al método específico
        if (entity instanceof Room) {
            this.rayCastRoom(entity, (config as RoomInteractionConfig).interceptableObjects);
        } else if (entity instanceof Node) {
            this.rayCastNode(entity, (config as NodeInteractionConfig).radius);
        } else {
            console.warn("Tipo de entidad no reconocido para InteractionService");
        }
    }

    /**
     * Método específico para Room (mantiene compatibilidad con código existente)
     */
    private rayCastRoom(room: Room, interactableObjects: Record<string, ObjectEventArray>) {
        const scene = room.getScene();
        if (!scene) return;

        this.interactableCache = interactableObjects; // guardar copia fresca

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(scene.children, true);

        // nombres actuales intersectados
        const current = new Set(
            intersects
                .map(i => i.object.name)
                .filter(name => interactableObjects && name in interactableObjects)
        );

        // detectar nuevos (enter)
        current.forEach(name => {
            if (!this.prevHovered.has(name)) {
                this.handleRoomEvent("objectEnter", name, interactableObjects[name]);
            }
        });

        // detectar salidos (leave)
        this.prevHovered.forEach(name => {
            if (!current.has(name)) {
                this.handleRoomEvent("objectLeave", name, interactableObjects[name]);
            }
        });

        // actualizar
        this.prevHovered = current;
    }

    /**
     * Método específico para Node con detección de radio
     */
    private rayCastNode(node: Node, radius: number) {
        this.currentNode = node; // Guardar referencia al nodo actual
        const group = node.getGroup();
        if (!group || !group.children.length) return;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Obtener la posición del centro del nodo
        const nodePlane = group.children[0].children[0] as THREE.Mesh;
        const nodePosition = nodePlane.getWorldPosition(new THREE.Vector3());

        // Calcular intersección del rayo con el plano del nodo
        const hasIntersection = this.raycaster.intersectObject(nodePlane, true);

        if (hasIntersection !== undefined && hasIntersection.length > 0) {

            const intersectionPoint = hasIntersection[0]?.point;
            // Calcular distancia desde el centro del nodo
            const distance = nodePosition.distanceTo(intersectionPoint);
            this.currentNodeDistance = distance;

            const isNowWithinRadius = distance <= radius;

            // Detectar entrada al radio
            if (isNowWithinRadius && !this.isWithinNodeRadius) {
                this.currentNode = node; // Asegurar que currentNode está asignado
                this.isWithinNodeRadius = true;
                this.handleNodeEvent("enter", distance, intersectionPoint);
            }
            // Detectar salida del radio
            else if (!isNowWithinRadius && this.isWithinNodeRadius) {
                this.currentNode = null;
                this.isWithinNodeRadius = false;
                this.handleNodeEvent("leave", distance, intersectionPoint);
            }
            // Detectar movimiento dentro del radio
            // else if (isNowWithinRadius) {
            //     this.currentNode = node; // Asegurar que currentNode está asignado
            //     this.handleNodeEvent("move", distance, intersectionPoint);
            // }
        } else if (this.isWithinNodeRadius) {
            // Si no hay intersección pero estábamos dentro, significa que salimos
            this.currentNode = null;
            this.isWithinNodeRadius = false;
            this.handleNodeEvent("leave", Infinity, new THREE.Vector3());
        }
    }

    /**
     * Maneja eventos de Room (método original renombrado)
     */
    private handleRoomEvent(phase: "objectEnter" | "objectLeave" | "objectClick", objectName: string, events: ObjectEventArray) {
        if (!events) return;

        const eventArgs: EventArgs<string, ObjectEventArray> = {
            target: objectName,
            data: events
        };

        // Ejecutar el sistema de eventos (EventEmitter)
        this.trigger(phase, [eventArgs]);

        // Ejecutar callbacks personalizados si existen
        switch (phase) {
            case "objectEnter":
                this.onObjectEnterCallback?.(eventArgs);
                break;
            case "objectLeave":
                this.onObjectLeaveCallback?.(eventArgs);
                break;
            case "objectClick":
                this.onObjectClickCallback?.(eventArgs);
                break;
        }
    }

    /**
     * Maneja eventos de Node
     */
    private handleNodeEvent(phase: "enter" | "leave" | "move" | "click", distance: number, position: THREE.Vector3) {

        if (!this.currentNode) return;

        const eventArgs: EventArgs<Node, { distance: number; position: THREE.Vector3 }> = {
            target: this.currentNode,
            data: { distance, position }
        };

        // Ejecutar el sistema de eventos (EventEmitter) para Node
        this.trigger(`node${phase.charAt(0).toUpperCase() + phase.slice(1)}`, [eventArgs]);

        // Ejecutar callbacks personalizados si existen
        switch (phase) {
            case "enter":
                this.onNodeEnterCallback?.(eventArgs);
                break;
            case "leave":
                this.onNodeLeaveCallback?.(eventArgs);
                break;
            case "move":
                this.onNodeMoveCallback?.(eventArgs);
                break;
            case "click":
                this.onNodeClickCallback?.(eventArgs);
                break;
        }
    }    /**
     * Método legacy para compatibilidad con código existente
     * @deprecated Usa update<Room>(room, { interceptableObjects }) en su lugar
     */

    updateRoom(room: Room, interactableObjects: Record<string, ObjectEventArray>) {
        this.update(room, { interceptableObjects: interactableObjects });
    }

    /**
     * Método de conveniencia para actualizar Node
     */
    updateNode(node: Node, radius: number) {
        this.update(node, { radius });
    }
}
