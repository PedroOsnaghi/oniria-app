import * as THREE from 'three';

import type { RoomConfig, AnimationAction, ObjectEventArray } from '../config/room.type';
import { loadRoomConfig } from './ConfigLoader';

/**
 * Objetos procesados por el ConfigManager
 */
export interface ProcessedRoomObjects {
    lookAtable: Record<string, THREE.Vector3>;
    animatable: Record<string, AnimationAction>;
    interactable: Record<string, ObjectEventArray>;
    colorable: Record<string, string>;
}

/**
 * Gestor de configuraciones de habitaciones - carga bajo demanda.
 * Solo mantiene la configuración de la habitación activa.
 */
export class ConfigManager {
    private static instance: ConfigManager | null = null;

    private currentConfig: RoomConfig | null = null;

    private currentRoomId: string | null = null;

    private constructor() { }

    static getInstance(): ConfigManager {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    /**
     * Obtiene la configuración de una habitación.
     * @param roomId - ID de la habitación
     * @returns Configuración de la habitación
     */
    async getConfig(roomId: string): Promise<RoomConfig> {
        if (!roomId?.trim()) {
            throw new Error('El ID de la habitación no puede estar vacío');
        }

        // Si es la misma habitación que ya tenemos cargada, devolverla
        if (this.currentRoomId === roomId && this.currentConfig) {
            return this.currentConfig;
        }

        // Cargar nueva configuración
        try {
            this.currentConfig = await loadRoomConfig(roomId);
            this.currentRoomId = roomId;
            return this.currentConfig;
        } catch (error) {
            console.error(`Failed to load config for room ${roomId}:`, error);
            throw error;
        }
    }

    /**
     * Obtiene todos los objetos procesados para una habitación
     */
    async getProcessedObjects(roomId: string, scene?: THREE.Group<THREE.Object3DEventMap>): Promise<ProcessedRoomObjects> {
        const config = await this.getConfig(roomId);
        return {
            lookAtable: scene ? this.extractLookAtableObjects(config, scene) : {},
            animatable: this.extractAnimatableObjects(config),
            interactable: scene ? this.extractInteractableObjects(config, scene) : {},
            colorable: this.extractColorableObjects(config)
        };
    }

    /**
     * Obtiene objetos con lookAtOffset
     */
    async getLookAtableObjects(roomId: string, scene: THREE.Group<THREE.Object3DEventMap>): Promise<Record<string, THREE.Vector3>> {
        const config = await this.getConfig(roomId);
        return this.extractLookAtableObjects(config, scene);
    }

    /**
     * Obtiene objetos con lookAtOffset (versión síncrona - asume que la config ya está cargada)
     */
    getLookAtableObjectsSync(scene: THREE.Group<THREE.Object3DEventMap>): Record<string, THREE.Vector3> {
        if (!this.currentConfig) {
            console.warn('[ConfigManager] No config loaded, returning empty lookAtables');
            return {};
        }
        return this.extractLookAtableObjects(this.currentConfig, scene);
    }

    /**
     * Obtiene objetos animables
     */
    async getAnimatableObjects(roomId: string): Promise<Record<string, AnimationAction>> {
        const config = await this.getConfig(roomId);
        return this.extractAnimatableObjects(config);
    }

    /**
     * Obtiene objetos animables (versión síncrona - asume que la config ya está cargada)
     */
    getAnimatableObjectsSync(): Record<string, AnimationAction> {
        if (!this.currentConfig) {
            console.warn('[ConfigManager] No config loaded, returning empty animatables');
            return {};
        }
        return this.extractAnimatableObjects(this.currentConfig);
    }

    /**
     * Obtiene objetos interactuables
     */
    async getInteractableObjects(roomId: string, scene: THREE.Group<THREE.Object3DEventMap>): Promise<Record<string, ObjectEventArray>> {
        const config = await this.getConfig(roomId);
        return this.extractInteractableObjects(config, scene);
    }

    /**
     * Obtiene objetos interactuables (versión síncrona - asume que la config ya está cargada)
     */
    getInteractableObjectsSync(scene: THREE.Group<THREE.Object3DEventMap>): Record<string, ObjectEventArray> {
        if (!this.currentConfig) {
            console.warn('[ConfigManager] No config loaded, returning empty interactables');
            return {};
        }
        return this.extractInteractableObjects(this.currentConfig, scene);
    }

    /**
     * Obtiene objetos con colores
     */
    async getColorableObjects(roomId: string): Promise<Record<string, string>> {
        const config = await this.getConfig(roomId);
        return this.extractColorableObjects(config);
    }

    /**
     * Obtiene objetos con colores (versión síncrona - asume que la config ya está cargada)
     */
    getColorableObjectsSync(): Record<string, string> {
        if (!this.currentConfig) {
            console.warn('[ConfigManager] No config loaded, returning empty colorables');
            return {};
        }
        return this.extractColorableObjects(this.currentConfig);
    }

    /**
     * Limpia la configuración actual (cuando se cambia de habitación)
     */
    clearCurrent(): void {
        this.currentConfig = null;
        this.currentRoomId = null;
    }

    // Métodos privados de extracción
    private extractLookAtableObjects(config: RoomConfig, scene: THREE.Group<THREE.Object3DEventMap>): Record<string, THREE.Vector3> {
        const lookAtables: Record<string, THREE.Vector3> = {};

        for (const [name, obj] of Object.entries(config.objects)) {
            if (obj.lookAtOffset) {
                const object3D = scene.getObjectByName(name);
                if (object3D) {
                    const worldPos = new THREE.Vector3();
                    object3D.getWorldPosition(worldPos);
                    const offset = new THREE.Vector3(...obj.lookAtOffset);
                    lookAtables[name] = worldPos.add(offset);
                }
            }
        }

        return lookAtables;
    }

    private extractAnimatableObjects(config: RoomConfig): Record<string, AnimationAction> {
        const animatables: Record<string, AnimationAction> = {};

        for (const [name, obj] of Object.entries(config.objects)) {
            if (obj.animation) {
                animatables[name] = obj.animation;
            }
        }

        return animatables;
    }

    private extractInteractableObjects(config: RoomConfig, scene: THREE.Group<THREE.Object3DEventMap>): Record<string, ObjectEventArray> {
        const interactables: Record<string, ObjectEventArray> = {};

        for (const [name, obj] of Object.entries(config.objects)) {

            if (obj.interceptable && obj.event) {

                // Asegurar que event es siempre un array
                const eventArray = Array.isArray(obj.event) ? obj.event : [obj.event];
                interactables[name] = eventArray;
            }
        }

        const mapped = this.mapHandlersToChildObjects(scene, interactables);

        return mapped;
    }

    private extractColorableObjects(config: RoomConfig): Record<string, string> {
        const colorables: Record<string, string> = {};

        for (const [name, obj] of Object.entries(config.objects)) {
            if (obj.color) {
                colorables[name] = obj.color;
            }
        }

        return colorables;
    }

    private mapHandlersToChildObjects(
        scene: THREE.Group<THREE.Object3DEventMap>,
        handlers: Record<string, ObjectEventArray>
    ): Record<string, ObjectEventArray> {
        const mapped: Record<string, ObjectEventArray> = {};

        Object.entries(handlers).forEach(([name, event]) => {
            if (this.isHandlerObject(name)) {
                const childName = this.getChildObjectName(scene, name);
                if (childName) {
                    mapped[childName] = event;
                }
            } else {
                mapped[name] = event;
            }
        });

        return mapped;
    }

    private isHandlerObject(name: string): boolean {
        return name.includes("_handler");
    }

    private getChildObjectName(scene: THREE.Group<THREE.Object3DEventMap>, handlerName: string): string | null {
        const handler = scene.getObjectByName(handlerName);

        if (handler) {
            const child = handler.children[0]; // el primer mesh hijo
            const childName = child?.name || null;
            return childName;
        }

        return null;
    }
}