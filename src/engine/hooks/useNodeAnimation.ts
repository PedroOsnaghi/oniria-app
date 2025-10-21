import { useCallback } from "react";
import { useEngineCore } from "@engine/core";

/**
 * Hook que proporciona animaciones específicas para el nodo activo
 */
export function useNodeAnimation() {
    const core = useEngineCore();
    const animationService = core.getAnimationService();
    const activeNode = core.activeNode;

    /**
     * Animación idle: mueve el nodo hacia la izquierda y permanece ahí
     */
    const idle = useCallback(() => {
        if (!activeNode || !animationService) {
            console.warn("useNodeAnimation.idle: activeNode o animationService no disponible");
            return;
        }

        const group = activeNode.getGroup();
        if (!group) {
            console.warn("useNodeAnimation.idle: No se pudo obtener el grupo del activeNode");
            return;
        }

        // Crear timeline personalizado para animación idle
        const timeline = animationService.createCustomTimeline();
        const originalPosition = group.position.x;

        timeline?.to(group.position, {
            x: originalPosition - 0.2,
            duration: 1.,
            ease: "power2.inOut"
        });

        // Ejecutar la animación
        timeline?.play();
    }, [activeNode, animationService]);

    /**
     * Animación rest: regresa el nodo a su posición original
     */
    const rest = useCallback(() => {
        console.log("rest-animation")
        if (!activeNode || !animationService) {
            console.warn("useNodeAnimation.rest: activeNode o animationService no disponible");
            return;
        }

        const group = activeNode.getGroup();
        if (!group) {
            console.warn("useNodeAnimation.rest: No se pudo obtener el grupo del activeNode");
            return;
        }

        // Crear timeline personalizado para animación rest
        const timeline = animationService.createCustomTimeline();

        // Asumir que la posición original es 0 (ajustar según sea necesario)
        const originalPosition = group.position.x;

        timeline?.to(group.position, {
            x: originalPosition + 0.2,
            duration: 1.,
            ease: "power2.Out"
        });

        // Ejecutar la animación
        timeline?.play();
    }, [activeNode, animationService]);

    return {
        idle,
        rest
    };
}