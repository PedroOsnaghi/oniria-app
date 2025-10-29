import * as THREE from "three";

import { BaseSystem } from "@engine/core/src/BaseSystem";
import { EngineCore } from "@engine/core/src/EngineCore";
import { CameraService, type CameraConfig } from "@engine/services/CameraService";
import type { Injectable } from "@engine/core/src/Injectable";

/**
 * Sistema de cámara del motor 3D que gestiona la configuración, controles
 * y comportamiento de la cámara para la exploración de escenas 3D.
 * Coordina con CameraService para proporcionar funcionalidades de alto nivel.
 */
export class CameraSystem extends BaseSystem implements Injectable {
    name = "CameraSystem";

    private cameraService: CameraService | null = null;

    private config: CameraConfig | null = null;

    private travel: boolean = false;

    /**
     * Constructor del sistema de cámara.
     * 
     * @param config - Configuración opcional inicial de la cámara
     */
    constructor(config?: CameraConfig) {
        super();
        this.config = config || null;
    }

    /**
     * Inicializa el sistema de cámara obteniendo el servicio de cámara
     * y configurando los listeners necesarios.
     * 
     * @param core - Núcleo del motor
     */
    init(core: EngineCore): void {
        super.init(core);

        this.cameraService = core.getService(CameraService);

        if (!this.cameraService) {
            console.error("[CameraSystem]: CameraService no disponible");
            return;
        }

        this.applyCameraConfig(this.config!);
        this.setupCameraListeners();
        console.log("[CameraSystem]: Sistema inicializado correctamente");
    }

    /**
     * Enfoca la cámara hacia un objeto específico por nombre.
     * 
     * @param target - Nombre del objeto a enfocar
     */
    async lookAt(target: string) {
        if (!this.cameraService) return;

        const lookatables = await this.core.getCurrentRoom()?.getLookAtableObjectByName(target);
        if (lookatables) {
            this.cameraService.setLookAt(
                lookatables.position,
                lookatables.target,
                true
            );
        }
    }

    /**
     * Transiciona la cámara para ver los nodos de la sala activa.
     */
    viewNodes(): void {
        if (!this.cameraService) return;

        const activeRoom = this.core.getCurrentRoom();
        if (!activeRoom) return;

        const target = activeRoom.getPortal()?.position;
        if (!target) return;

        this.travel = false;

        this.cameraService.setRestThreshold(0.8);
        this.cameraService.setLookAt(
            new THREE.Vector3(target.x, target.y, target.z),
            new THREE.Vector3(target.x, target.y, target.z - 0.5),
            true
        );

        // Emitir evento para notificar a los listeners
        this.core.emit("camera:viewNodes", {});
    }

    /**
    * Transiciona la cámara para ver los nodos de la sala activa.
    */
    startTravel(): void {
        if (!this.cameraService) return;

        const activeRoom = this.core.getCurrentRoom();
        if (!activeRoom) return;

        const target = activeRoom.getPortal()?.position;
        if (!target) return;


        this.travel = true;

        this.cameraService.setRestThreshold(0.8);
        this.cameraService.setLookAt(
            new THREE.Vector3(target.x, target.y, target.z),
            new THREE.Vector3(target.x, target.y, target.z - 0.5),
            true
        );

    }

    /**
     * Resetea la cámara a su posición inicial.
     */
    viewReset(): void {
        if (!this.cameraService) return;
        this.travel = false;
        this.core.emit("camera:view:reset", {});
        this.cameraService.resetInitialPosition();
    }

    /**
     * Actualiza el sistema de cámara en cada frame.
     * 
     * @param dt - Delta time en segundos
     */
    update(dt: number): void {
        if (this.cameraService) {
            this.cameraService.update(dt);
        }
    }

    /**
     * Aplica una nueva configuración a la cámara.
     * 
     * @param config - Configuración de cámara a aplicar
     */
    applyCameraConfig(config: CameraConfig): void {
        if (!this.cameraService) return;

        this.config = config;
        this.cameraService.setConfig(config);
    }

    /**
     * Habilita o deshabilita los controles de cámara.
     * 
     * @param enabled - Si los controles deben estar habilitados
     */
    setControlsEnabled(enabled: boolean): void {
        if (!this.cameraService) return;

        if (enabled) {
            this.cameraService.setEnableRotate(true);
            this.cameraService.setEnablePan(false);
            this.cameraService.setEnableZoom(true);
        } else {
            this.cameraService.setEnableRotate(false);
            this.cameraService.setEnablePan(false);
            this.cameraService.setEnableZoom(false);
        }
    }

    /**
     * Configura si se debe auto-configurar para la sala activa.
     * 
     * @param _enabled - Si la auto-configuración debe estar habilitada
     */
    //setAutoConfigureForRoom(_enabled: boolean): void {
    // Funcionalidad para implementar en el futuro
    //}

    /**
     * Obtiene la configuración actual de la cámara.
     * 
     * @returns Configuración actual o null si no hay ninguna
     */
    getCurrentConfig(): CameraConfig | null {
        return this.config;
    }

    /**
     * Obtiene la posición actual de la cámara.
     * 
     * @returns Posición actual o null si no está disponible
     */
    getPosition(): THREE.Vector3 | null {
        return this.cameraService?.getPosition() || null;
    }

    /**
     * Obtiene el target actual de la cámara.
     * 
     * @returns Target actual o null si no está disponible
     */
    getTarget(): THREE.Vector3 | null {
        return this.cameraService?.getTarget() || null;
    }

    /**
     * Obtiene la instancia del servicio de cámara.
     * 
     * @returns Servicio de cámara o null si no está disponible
     */
    getService(): CameraService | null {
        return this.cameraService;
    }

    /**
     * Configura listeners para eventos del CameraService.
     */
    private setupCameraListeners(): void {
        if (!this.cameraService) return;

        this.cameraService.addEventListener("controlstart", () => {
            // Control de cámara iniciado
        });

        this.cameraService.addEventListener("controlend", () => {
            this.core.emit("camera:controlend", {
                position: this.cameraService?.getPosition(),
                target: this.cameraService?.getTarget(),
            });
        });

        this.cameraService.addEventListener("rest", () => {
            this.checkCameraInPortal();
        });
    }

    /**
     * Verifica si la cámara está dentro del portal y ajusta los controles.
     */
    checkCameraInPortal = () => {
        if (!this.cameraService) return;

        const cameraPos = this.cameraService.getPosition();
        const portalPos = new THREE.Vector3();
        this.core.getCurrentRoom()?.getPortal()?.getWorldPosition(portalPos);
        const distance = cameraPos.distanceTo(portalPos);
        const threshold = 1.5;

        if (distance < threshold) {
            this.cameraService.setDraggingSmoothTime(1);
            this.cameraService.setMaxPolarAngle(1.63);
            this.cameraService.setMinPolarAngle(1.5);
            this.cameraService.setAzimuthMaxAngle(0.1);
            this.cameraService.setAzimuthMinAngle(-0.1);
            this.cameraService.setEnableZoom(false);
            this.cameraService.setEnablePan(false);
            this.core.emit("camera:inside-portal", { distance, travel: this.travel });
        } else {
            this.cameraService.setDraggingSmoothTime(0.1);
            const defaultConfig = this.cameraService.getDefaultConfig();
            if (defaultConfig) {
                this.cameraService.setMaxPolarAngle(defaultConfig.maxPolarAngle!);
                this.cameraService.setMinPolarAngle(defaultConfig.minPolarAngle!);
                this.cameraService.setAzimuthMaxAngle(defaultConfig.maxAzimuthAngle!);
                this.cameraService.setAzimuthMinAngle(defaultConfig.minAzimuthAngle!);
                this.cameraService.setEnableZoom(true);
                this.cameraService.setEnablePan(!!defaultConfig.enablePan);
            }
            this.core.emit("camera:outside-portal", { distance });
        }
    }

    /**
     * Libera recursos del sistema de cámara.
     */
    dispose(): void {
        if (this.cameraService) {
            this.cameraService.removeEventListener("controlstart", () => { });
            this.cameraService.removeEventListener("controlend", () => { });
            this.cameraService.removeEventListener("rest", () => { });
        }

        super.dispose();
    }
}

export default CameraSystem;