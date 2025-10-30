
import { create } from "zustand";
import { EngineState } from "../types/engine.types";

// Tipo para los datos del sueño (adaptador de DreamAPIResponse)
export interface Dream {
    title: string;
    description: string;
    interpretation: string;
    emotion: string;
    imageUrl: string | null;
}

// Tipo para los formularios de dreams
export type DreamFormType = 'create' | 'edit' | 'view';

export interface DreamFormState {
    isOpen: boolean;
    type: DreamFormType;
    data?: Dream | null;
}

export interface HistoryPanelState {
    isOpen: boolean;
    isClosing: boolean;
}

type LoadingItem = {
    url: string;
    type: 'gltf' | 'texture' | 'ktx2' | 'audio' | 'binary';
    loaded: boolean;
    progress: number;
    error?: string;
};

const uniformDefaults = {
    // Controles de intensidad (existentes)
    uPlasmaStrength: 1.0,
    uGlassStrength: 1.0,
    uPlasmaRadius: 1.05,
    uFresnelWidth: 0.3,
    uFresnelIntensity: 2.0,
    uOnlyMask: 0.0,
    uFresnelBright: 1.7,
    uFresnelBrightWidth: 0.7,

    // Nuevos controles de color del blob
    // Colores del plasma
    uPlasmaColor: [1.9, 1.1, 1.9] as [number, number, number], // Color base del plasma
    uPlasmaColorIntensity: 1.0,
    uPlasmaColorMap: [-0.5, 0.5, 0.001, 0.0] as [number, number, number, number], // Mapeo interno del plasma
    // Paleta procedural del plasma (nuevos)
    uPlasmaOffset: [0.5, 0.5, 0.5] as [number, number, number],    // Offset del plasma
    uPlasmaAmplitude: [0.5, 0.5, 0.5] as [number, number, number], // Amplitud del plasma  
    uPlasmaFrequency: [1.0, 1.0, 1.0] as [number, number, number], // Frecuencia del plasma
    uPlasmaPhase: [0.0, 0.33, 0.67] as [number, number, number],   // Fase del plasma (desfasado para variación)

    // Colores del vidrio/contenedor (paleta procedural)
    uGlassColorBase: [1.0, 1.0, 1.0] as [number, number, number], // Color base blanco
    uGlassOffset: [0.1, 0.1, 0.1] as [number, number, number],    // Offset (era uGlassColorA)
    uGlassAmplitude: [0.3, 0.3, 0.3] as [number, number, number], // Amplitud (era uGlassColorB)
    uGlassFrequency: [1.0, 1.0, 1.0] as [number, number, number], // Frecuencia (era uGlassColorC)
    uGlassPhase: [0.0, 0.1, 0.2] as [number, number, number],     // Fase (era uGlassColorD)
    uGlassTint: [1.0, 0.7, 0.5] as [number, number, number],      // Tinte del vidrio

    // Control de dirección del humo/flujo
    uSmokeDirectionOffset: 0.15,        // Dirección principal del flujo 0.15
    uSmokeTurbulence: 0.35, // Turbulencia del flujo (variación aleatoria)

    // Control de gamma
    uGammaCorrection: 1.8,
};

// Portal uniforms defaults
const portalUniformDefaults = {
    uPortalAlpha: 1.0,
    uDensity: 4.5,
    uRadius: 1.2,
    uAngle: 3.2,
    uHue: 0.74,
    uSaturation: 0.58,
    uRadiusFactor: 1.5,
    uGainOffset: 0.5,
    uGainScale: 3.0,
};

type EngineStore = {
    // Room/Skin state
    roomId: string | null;
    skinId: string | null;
    theme: 'light' | 'dark';
    setRoomId: (_id: string) => void;
    setSkinId: (_id: string) => void;
    setTheme: (_theme: 'light' | 'dark') => void;

    // Nodo uniforms state para debug
    nodeUniforms: {
        // Controles de intensidad (existentes)
        uPlasmaStrength: number;
        uGlassStrength: number;
        uPlasmaRadius: number;
        uFresnelWidth: number;
        uFresnelIntensity: number;
        uOnlyMask: number;
        uFresnelBright: number;
        uFresnelBrightWidth: number;

        // Nuevos controles de color del blob
        uPlasmaColor: [number, number, number];
        uPlasmaColorIntensity: number;
        uPlasmaColorMap: [number, number, number, number];
        uPlasmaOffset: [number, number, number];
        uPlasmaAmplitude: [number, number, number];
        uPlasmaFrequency: [number, number, number];
        uPlasmaPhase: [number, number, number];
        uGlassColorBase: [number, number, number];
        uGlassOffset: [number, number, number];
        uGlassAmplitude: [number, number, number];
        uGlassFrequency: [number, number, number];
        uGlassPhase: [number, number, number];
        uGlassTint: [number, number, number];
        uSmokeTurbulence: number;
        uSmokeDirectionOffset: number;
        uGammaCorrection: number;
    };
    setNodeUniform: (_key: string, _value: number) => void;
    setNodeUniforms: (_uniforms: Partial<EngineStore['nodeUniforms']>) => void;
    resetNodeUniforms: () => void;

    // Portal uniforms state para debug
    portalUniforms: {
        uPortalAlpha: number;
        uDensity: number;
        uRadius: number;
        uAngle: number;
        uHue: number;
        uSaturation: number;
        uRadiusFactor: number;
        uGainOffset: number;
        uGainScale: number;
    };
    setPortalUniform: (_key: string, _value: number) => void;
    setPortalUniforms: (_uniforms: Partial<EngineStore['portalUniforms']>) => void;
    resetPortalUniforms: () => void;

    // Dream state
    dream: Dream | null;
    setDream: (_dream: Dream | null) => void;
    clearDream: () => void;

    // HUD state
    dreamModalVisible: boolean;
    setDreamModalVisible: (_visible: boolean) => void;

    // Menu state
    activeMenu: string | null;
    menuData?: Record<string, any>;
    setActiveMenu: (_menu: string | null, _data?: Record<string, any>) => void;
    closeMenu: () => void;

    // Dream forms state
    dreamForm: DreamFormState;
    openDreamForm: (_type: DreamFormType, _data?: Dream | null) => void;
    closeDreamForm: () => void;
    updateDreamFormData: (_data: Dream | null) => void;

    // Dream system state - controla si DreamSystem debe estar montado
    isDreamSystemActive: boolean;
    setDreamSystemActive: (_active: boolean) => void;

    // History panel state
    isHistoryPanelActive: boolean;
    setHistoryPanelActive: (_active: boolean) => void;
    historyPanel: HistoryPanelState;
    openHistoryPanel: () => void;
    closeHistoryPanel: () => void;

    // Loading state - nuestro sistema propio
    active: boolean;
    progress: number;
    items: LoadingItem[];
    errors: string[];

    // Engine state - estado del motor 3D
    engineState: EngineState;
    setEngineState: (_state: EngineState) => void;

    // Loading actions
    startLoading: () => void;
    finishLoading: () => void;
    setProgress: (_progress: number) => void;
    setItems: (_items: LoadingItem[]) => void;
    updateItem: (_index: number, _updates: Partial<LoadingItem>) => void;
    addError: (_error: string) => void;
    clearErrors: () => void;
    resetLoading: () => void;
};

// Función para leer el tema inicial del localStorage
const getInitialTheme = (): 'light' | 'dark' => {
    try {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }
        // Si no hay tema guardado, usar la preferencia del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'dark' : 'light';
    } catch {
        return 'light';
    }
};

export const useEngineStore = create<EngineStore>((set, get) => ({
    // Room/Skin state
    roomId: null,
    skinId: null,
    theme: getInitialTheme(),
    setRoomId: (id) => set({ roomId: id }),
    setSkinId: (id) => set({ skinId: id }),
    setTheme: (theme) => set({ theme }),

    // Dream state
    dream: null,
    setDream: (dream) => set({ dream }),
    clearDream: () => set({ dream: null }),

    // Nodo uniforms defaults
    nodeUniforms: { ...uniformDefaults },
    setNodeUniform: (key, value) => {
        set(state => ({
            nodeUniforms: {
                ...state.nodeUniforms,
                [key]: value
            }
        }));
    },
    setNodeUniforms: (uniforms) => {
        set(state => ({
            nodeUniforms: {
                ...state.nodeUniforms,
                ...uniforms
            }
        }));
    },
    resetNodeUniforms: () => {
        set((state) => ({
            nodeUniforms: {
                ...state.nodeUniforms,
                ...uniformDefaults
            }
        }));
    },

    // Portal uniforms defaults
    portalUniforms: { ...portalUniformDefaults },
    setPortalUniform: (key, value) => {
        set(state => ({
            portalUniforms: {
                ...state.portalUniforms,
                [key]: value
            }
        }));
    },
    setPortalUniforms: (uniforms) => {
        set(state => ({
            portalUniforms: {
                ...state.portalUniforms,
                ...uniforms
            }
        }));
    },
    resetPortalUniforms: () => {
        set((state) => ({
            portalUniforms: {
                ...state.portalUniforms,
                ...portalUniformDefaults
            }
        }));
    },

    // HUD state
    dreamModalVisible: false,
    setDreamModalVisible: (visible) => set({ dreamModalVisible: visible }),

    // Menu state
    activeMenu: null,
    menuData: undefined,
    setActiveMenu: (menu, data) => set({ activeMenu: menu, menuData: data }),
    closeMenu: () => set({ activeMenu: null, menuData: undefined }),

    // Dream forms state
    dreamForm: {
        isOpen: false,
        type: 'create',
        data: null
    },
    openDreamForm: (type, data = null) => {
        set({
            dreamForm: {
                isOpen: true,
                type,
                data
            }
        });
    },
    closeDreamForm: () => {
        set({
            dreamForm: {
                isOpen: false,
                type: 'create',
                data: null
            }
        });
    },
    updateDreamFormData: (data) => {
        set(state => ({
            dreamForm: {
                ...state.dreamForm,
                data
            }
        }));
    },

    // Dream system state
    isDreamSystemActive: false,
    setDreamSystemActive: (active) => set({ isDreamSystemActive: active }),

    // History panel state
    isHistoryPanelActive: false,
    setHistoryPanelActive: (active) => set({ isHistoryPanelActive: active }),
    historyPanel: {
        isOpen: false,
        isClosing: false,
    },
    openHistoryPanel: () =>
        set((state) => ({
            historyPanel: { ...state.historyPanel, isOpen: true, isClosing: false },
        })),
    closeHistoryPanel: () =>
        set((state) => ({
            historyPanel: { ...state.historyPanel, isClosing: true },
        })),

    // Loading state inicial
    active: false,
    progress: 0,
    items: [],
    errors: [],

    // Engine state inicial
    engineState: EngineState.DISPOSED,
    setEngineState: (state) => set({ engineState: state }),

    // Loading actions
    startLoading: () => {
        set({
            active: true,
            progress: 0,
            errors: []
        });
    },

    finishLoading: () => {
        set({
            active: false,
            progress: 100
        });
    },

    setProgress: (progress) => {
        const clampedProgress = Math.min(Math.max(progress, 0), 100);
        set({ progress: clampedProgress });
    },

    setItems: (items) => {
        set({ items });
        // El progreso global se calcula y se establece directamente desde useThreeLoader
        // No calculamos aquí para evitar promedios incorrectos
    },

    updateItem: (index, updates) => {
        const { items } = get();
        if (index >= 0 && index < items.length) {
            const newItems = [...items];
            newItems[index] = { ...newItems[index], ...updates };
            get().setItems(newItems);
        }
    },

    addError: (error) => {
        console.error("EngineStore: Error añadido:", error);
        set((state) => ({
            errors: [...state.errors, error]
        }));
    },

    clearErrors: () => {
        set({ errors: [] });
    },

    resetLoading: () => {
        console.log("EngineStore: Reset del loader");
        set({
            active: false,
            progress: 0,
            items: [],
            errors: []
        });
    }
}));
