import * as THREE from "three";

import { EventEmitter } from "@engine/utils/EventEmitter";
import { ServiceRegistry } from "./ServiceRegistry";
import { AssetManager, CameraService, MaterialService, AnimationService, InteractionService } from "@/engine/services";
import { ConfigManager } from "@/engine/utils/ConfigManager";
import { RoomManager } from "@/engine/services/managers/RoomManager";
import { PortalManager } from "@/engine/services/managers/PortalManager";
import { NodeManager } from "@/engine/services/managers/NodeManager";
import { NebulaManager } from "@/engine/services/managers/NebulaManager";
import { ImageManager } from "@/engine/services/managers/ImageManager";
import { Node, Room } from "@/engine/entities";
import type { ISystem } from "./ISystem";
import { EngineState } from "../types/engine.types";
import { useEngineStore } from "../store/engineStore";
import { PortalholeRenderer } from "@/engine/services/renderers/PortalholeRenderer";
import { NebulaRenderer } from "@/engine/services/renderers/NebulaRenderer";
import { HighlightService } from "@/engine/services/effects/HighlightService";

/**
 * Núcleo del motor 3D que coordina servicios, sistemas y el ciclo de vida del motor.
 * Gestiona la inicialización, actualización y disposición de recursos, así como
 * el cambio de salas y estados del motor.
 */
export class EngineCore extends EventEmitter {
    private registry = new ServiceRegistry();

    private systems: ISystem[] = [];

    private _gl: THREE.WebGLRenderer | null = null;

    private _scene: THREE.Scene | null = null;

    private _camera: THREE.Camera | null = null;

    private state: EngineState = EngineState.DISPOSED;

    roomId: string | null = null;

    skinId: string | null = null;

    currentRoom: Room | null = null;

    currentNode: Node | null = null;

    private store = useEngineStore.getState();

    constructor() {
        super();
    }

    /**
     * Inicializa el núcleo del motor con los objetos Three.js necesarios.
     * 
     * @param gl - Renderer de WebGL
     * @param scene - Escena de Three.js
     * @param camera - Cámara de Three.js
     */
    init(gl: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
        console.log("[EngineCore]: Inicializando núcleo del motor");
        this.setState(EngineState.INITIALIZING);
        this._gl = gl;
        this._scene = scene;
        this._camera = camera;
        this.initializeService();
        this.setupAssets();
        this.setState(EngineState.READY);
        console.log("[EngineCore]: Motor inicializado correctamente");
    }

    async setupAssets() {
        //preload de texturas que se usaran
        await this.getService(AssetManager).preloadTextures(["/textures/water.jpg", "/textures/bg.jpg", "/textures/noise_grain.png", "/textures/noise_small.png"]);
        const holeTexture = this.getService(AssetManager).getTexture('/textures/water.jpg');
        const bgTexture = this.getService(AssetManager).getTexture('/textures/bg.jpg');
        if (holeTexture && bgTexture) {
            this.getService(PortalholeRenderer).init(holeTexture);
            this.getService(NebulaRenderer).init(bgTexture);
        }
    }

    /**
     * Inicializa todos los servicios del motor y configura los event listeners.
     */
    initializeService() {
        console.log("[EngineCore]: Registrando servicios del motor");

        // Registrar servicios principales
        this.registry.registerService(AssetManager, new AssetManager(this._gl!));
        const materialService = new MaterialService();
        this.registry.registerService(MaterialService, materialService);
        this.registry.registerService(CameraService, new CameraService(this._camera as THREE.PerspectiveCamera, this._gl!.domElement));
        const animationService = new AnimationService(this._scene);
        this.registry.registerService(AnimationService, animationService);

        // Inyectar AnimationService en MaterialService
        materialService.setAnimationService(animationService);

        this.registry.registerService(InteractionService, new InteractionService(this._camera as THREE.PerspectiveCamera, this._gl!.domElement));

        // Rendererers especializados
        this.registry.registerService(PortalholeRenderer, new PortalholeRenderer(this._scene!, this._camera!));
        this.registry.registerService(NebulaRenderer, new NebulaRenderer(this._scene!));
        this.registry.registerService(HighlightService, new HighlightService());

        // Crear managers especializados

        this.registry.registerService(RoomManager, new RoomManager(this, new ConfigManager()));
        this.registry.registerService(PortalManager, new PortalManager(this));
        this.registry.registerService(NodeManager, new NodeManager(this));
        this.registry.registerService(NebulaManager, new NebulaManager(this, this._gl!.domElement));
        this.registry.registerService(ImageManager, new ImageManager(this));



        this.setupRoomEventListeners();
        console.log("[EngineCore]: Servicios registrados correctamente");
    }

    /**
     * Configura los listeners para eventos de salas y nodos.
     */
    private setupRoomEventListeners() {
        this.on("room:loading", (_data: unknown) => this.onRoomLoading(_data as { room: any, skin?: any }));
        this.on("room:ready", (_data: unknown) => this.onRoomReady(_data as { room: Room }));
        this.on("room:error", (_data: unknown) => this.onRoomError(_data as { error: any, room: any, skin?: any }));
        this.on("room:unloading", (_data: unknown) => this.onRoomUnloading(_data as { room: Room }));
        this.on("skin:change:start", (_data: unknown) => this.onSkinChangeStart(_data as { skin: any, room: Room }));
        this.on("skin:change:complete", (_data: unknown) => this.onSkinChangeComplete(_data as { skin: any, room: Room }));
        this.on("skin:change:error", (_data: unknown) => this.onSkinChangeError(_data as { skin: any, error: any, room: Room }));
        this.on("node:created", (_data: unknown) => this.onNodeCreated(_data as { newNode: any }));
        this.on("node:destroyed", (_data: unknown) => this.onNodeDestroyed(_data as { node: any }));
        this.on("nebula:ready", () => {
            this.store.setDreamSystemActive(true);
            console.log("[EngineCore]: Actualizando store")
        });
        this.on("node:ready", () => {
            console.log("[EngineCore]: Nodo listo - Activando panel de historial");
            this.store.setHistoryPanelActive(true);
            this.store.openHistoryPanel();
            // Deshabilitar interacciones cuando se abre el historial

        });

    }

    /**
     * Maneja el evento de inicio de carga de sala.
     * 
     * @param data - Datos de la sala y skin a cargar
     */
    private onRoomLoading(data: { room: any, skin?: any }) {
        console.log("[EngineCore]: Iniciando carga de sala:", data.room.id);
        this.setState(EngineState.LOADING_ASSETS);
        this.roomId = data.room.id;
        this.skinId = data.skin?.id || null;
    }

    /**
     * Maneja el evento de sala lista para usar.
     * 
     * @param data - Datos de la sala cargada
     */
    private onRoomReady(data: { room: Room, skin?: any }) {
        console.log("[EngineCore]: Sala cargada correctamente:", data.room);
        this.currentRoom = data.room;
        this.setState(EngineState.READY);
    }

    /**
     * Maneja el evento de error en carga de sala.
     * 
     * @param data - Datos del error ocurrido
     */
    private onRoomError(data: { error: any, room: any, skin?: any }) {
        console.error("[EngineCore]: Error cargando sala:", data.error);
        this.setState(EngineState.READY);
    }

    /**
     * Maneja el evento de descarga de sala.
     * 
     * @param data - Datos de la sala a descargar
     */
    private onRoomUnloading(data: { room: Room }) {
        console.log("[EngineCore]: Descargando sala:", data.room);
        this.currentRoom = null;
    }

    /**
     * Maneja el evento de inicio de cambio de skin.
     * NO cambia el estado del engine porque no queremos desmontar los sistemas.
     * 
     * @param data - Datos del skin a cambiar
     */
    private onSkinChangeStart(data: { skin: any, room: Room }) {
        console.log("[EngineCore]: Iniciando cambio de skin:", data.skin.id);
        // NO cambiar estado - mantener READY para que los sistemas no se desmonten
        // this.setState(EngineState.LOADING_ASSETS);
    }

    /**
     * Maneja el evento de cambio de skin completado.
     * 
     * @param data - Datos del skin cambiado
     */
    private onSkinChangeComplete(data: { skin: any, room: Room }) {
        console.log("[EngineCore]: Cambio de skin completado:", data.skin.id);
        this.skinId = data.skin.id;
        // El estado ya debería ser READY, no necesitamos cambiarlo
        // this.setState(EngineState.READY);
    }

    /**
     * Maneja el evento de error en cambio de skin.
     * 
     * @param data - Datos del error en cambio de skin
     */
    private onSkinChangeError(data: { skin: any, error: any, room: Room }) {
        console.error("[EngineCore]: Error cambiando skin:", data.error);
        this.setState(EngineState.READY);
    }

    /**
     * Maneja el evento de creación de nodo.
     * 
     * @param data - Datos del nodo creado
     */
    private onNodeCreated(data: { newNode: Node }) {
        console.log("[EngineCore]: Nodo creado:", data.newNode);
        this.currentNode = this.getService(NodeManager).getCurrentNode();
        this.emit("node:ready", { node: data.newNode });
    }

    /**
     * Maneja el evento de destrucción de nodo.
     * 
     * @param data - Datos del nodo destruido
     */
    private onNodeDestroyed(data: { node: Node }) {
        console.log("[EngineCore]: Nodo destruido:", data.node);
        this.currentNode = null

    }

    /**
     * Obtiene una instancia de servicio registrado.
     * 
     * @param service - Constructor del servicio
     * @returns Instancia del servicio
     */
    getService<T>(service: new (..._args: any[]) => T): T {
        return this.registry.getService(service);
    }

    /**
     * Obtiene la sala actualmente cargada.
     * 
     * @returns Sala actual o null si no hay ninguna
     */
    getCurrentRoom(): Room | null {
        return this.currentRoom;
    }

    /**
     * Obtiene el nodo actualmente activo.
     * 
     * @returns Nodo actual o null si no hay ninguno
     */
    getCurrentNode(): any | null {
        return this.currentNode;
    }

    /**
     * Ciclo principal de actualización del motor.
     * Ejecuta todos los sistemas registrados y managers.
     * 
     * @param dt - Delta time en segundos
     */
    update(dt: number) {
        for (const sys of this.systems) sys.update(dt);

        const portalManager = this.getService(PortalManager);
        if (portalManager && portalManager.update) {
            portalManager.update(dt);
        }

        const nodeManager = this.getService(NodeManager);
        if (nodeManager && nodeManager.update) {
            nodeManager.update(dt);
        }

        const nebulaManager = this.getService(NebulaManager);
        if (nebulaManager && nebulaManager.update) {
            nebulaManager.update(dt);
        }

        const imageManager = this.getService(ImageManager);
        if (imageManager && imageManager.update) {
            imageManager.update(dt);
        }
    }

    /**
     * Solicita el cambio a una nueva sala con skin opcional.
     * 
     * @param roomId - Identificador de la sala
     * @param skinId - Identificador opcional del skin
     */
    setRoom(roomId: string, skinId?: string) {
        console.log("[EngineCore]: Solicitando cambio de sala:", roomId, "skin:", skinId);
        this.emit("room:change:requested", { roomId, skinId });
    }

    /**
     * Establece el tema del motor y actualiza el store.
     * 
     * @param theme - Tema a aplicar ('light' | 'dark')
     */
    setTheme(theme: 'light' | 'dark') {
        console.log("[EngineCore]: Estableciendo tema:", theme);
        this.store.setTheme(theme);
    }

    /**
     * Registra un sistema en el motor.
     * 
     * @param system - Sistema a registrar
     */
    addSystem(system: ISystem) {
        this.systems.push(system);
        system.init(this);
    }

    /**
     * Obtiene una instancia de sistema registrado.
     * 
     * @param systemClass - Constructor del sistema
     * @returns Instancia del sistema o null si no existe
     */
    getSystem(systemClass: new (..._args: any[]) => ISystem): ISystem | null {
        for (const sys of this.systems) {
            if (sys instanceof systemClass) {
                return sys;
            }
        }
        return null;
    }

    /**
     * Establece el estado interno del motor y notifica a todos los listeners.
     * 
     * @param state - Nuevo estado del motor
     */
    private setState(state: EngineState) {
        this.state = state;
        useEngineStore.getState().setEngineState(state);
        this.emit("engine:state", state);
    }

    /**
     * Obtiene el estado actual del motor.
     * 
     * @returns Estado actual del motor
     */
    getState(): EngineState {
        return this.state;
    }

    /**
     * Obtiene la escena de Three.js.
     * 
     * @returns Escena de Three.js o null si no está inicializada
     */
    getScene(): THREE.Scene | null {
        return this._scene;
    }

    /**
     * Obtiene la cámara de Three.js.
     * 
     * @returns Cámara de Three.js o null si no está inicializada
     */
    getCamera(): THREE.Camera | null {
        return this._camera;
    }

    /**
     * Obtiene el renderer de WebGL.
     * 
     * @returns Renderer de WebGL o null si no está inicializado
     */
    getGl(): THREE.WebGLRenderer | null {
        return this._gl;
    }

    /**
     * Libera todos los recursos del motor y limpia referencias.
     */
    dispose() {
        console.log("[EngineCore]: Liberando recursos del motor");
        for (const sys of this.systems) sys.dispose();
        this.systems = [];
        this.registry.dispose();
        this.setState(EngineState.DISPOSED);
    }
}