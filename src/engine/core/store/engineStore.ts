
import { create } from "zustand";

// Tipo para los datos del sueño
export interface Dream {
    title: string;
    description?: string;
    interpretation: string;
    emotion?: string;
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

type EngineStore = {
    // Room/Skin state
    roomId: string | null;
    skinId: string | null;
    setRoomId: (_id: string) => void;
    setSkinId: (_id: string) => void;

    // Node uniforms state para debug
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

    // Dream state
    dream: Dream | null;
    setDream: (_dream: Dream | null) => void;
    clearDream: () => void;

    // HUD state
    dreamModalVisible: boolean;
    setDreamModalVisible: (_visible: boolean) => void;

    // Loading state - nuestro sistema propio
    active: boolean;
    progress: number;
    items: LoadingItem[];
    errors: string[];

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

export const useEngineStore = create<EngineStore>((set, get) => ({
    // Room/Skin state
    roomId: null,
    skinId: null,
    setRoomId: (id) => set({ roomId: id }),
    setSkinId: (id) => set({ skinId: id }),

    // Dream state
    dream: null,
    setDream: (dream) => set({ dream }),
    clearDream: () => set({ dream: null }),

    // Node uniforms defaults
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

    // HUD state
    dreamModalVisible: false,
    setDreamModalVisible: (visible) => set({ dreamModalVisible: visible }),

    // Loading state inicial
    active: false,
    progress: 0,
    items: [],
    errors: [],

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
