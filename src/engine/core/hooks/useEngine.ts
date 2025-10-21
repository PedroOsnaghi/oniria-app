import { useEngineAPI } from "../context/EngineApiProvider";

/**
 * Hook público que expone las acciones disponibles del motor
 * Permite a los componentes de la UI ejecutar acciones registradas por los sistemas
 * 
 * @example
 * ```tsx
 * const engine = useEngine();
 * 
 * // Ejecutar acción viewNodes registrada por CameraSystem
 * engine.actions.viewNodes?.();
 * 
 * // O usando el método de conveniencia
 * engine.executeAction('viewNodes');
 * ```
 */
export function useEngine() {
    const api = useEngineAPI();

    /**
     * Ejecuta una acción por nombre si está disponible
     * @param actionName - Nombre de la acción a ejecutar
     */
    const executeAction = (actionName: string) => {
        const action = api.actions?.[actionName];
        if (action) {
            action();
        } else {
            console.warn(`Acción '${actionName}' no está registrada`);
        }
    };

    return {
        // Acciones disponibles (registradas por los sistemas)
        actions: api.actions || {},

        // Método de conveniencia para ejecutar acciones
        executeAction,

        // Métodos de configuración
        setRoom: api.setRoom,
        setDream: api.setDream,

        dream: api.dream,


        // Estado actual
        roomId: api.roomId,
        skinId: api.skinId,

        // Servicios específicos
        node: api.node,
        animation: api.animation,
    };
}
