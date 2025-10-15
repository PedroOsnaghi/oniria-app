import * as THREE from "three";
import { useCallback, useRef } from "react";

import { useEngineCore } from "@engine/core";
import type { AnimationAction, FunctionAction, ObjectEvent, ObjectEventArray } from "../config/room.type";
import type { EventArgs } from "../services";
import { Node } from "../entities/Node";

/**
 * Hook que proporciona handlers tipados para eventos del motor
 * 
 * @returns Objeto con métodos para manejar diferentes tipos de eventos
 * 
 * @example
 * const { handleObjectEvent } = useHandlers();
 * handleObjectEvent('click', objectId, eventData);
 */
export function useHandlers() {
    const core = useEngineCore();
    const animationService = core.getAnimationService();

    // Estado para controlar si hay una animación de navegación en curso
    const isNavigationAnimating = useRef(false);


    // Callbacks para eventos de interacción en Room
    const onObjectsEnter = useCallback((event: EventArgs<string, ObjectEventArray>) => {
        event.data.forEach((element: ObjectEvent) => {
            if (element.type === "animation") {
                element.action.forEach((animation: AnimationAction) => {
                    if (animation.on === "hoverEnter") {
                        document.body.style.cursor = "grab";
                        animationService?.stop(animation.target);
                        animationService?.play(animation);
                    }
                });
            }
        });
    }, [animationService]);

    const onObjectsLeave = useCallback((event: EventArgs<string, ObjectEventArray>) => {
        event.data.forEach((element: ObjectEvent) => {
            if (element.type === "animation") {
                element.action.forEach((action: AnimationAction) => {
                    if (action.on === "hoverLeave") {
                        document.body.style.cursor = "default";
                        animationService?.stop(action.target);
                        animationService?.play(action);
                    }
                });
            }
        });
    }, [animationService]);

    const onObjectsClick = useCallback((event: EventArgs<string, ObjectEventArray>) => {
        event.data.forEach((element: ObjectEvent) => {
            if (element.type === "animation") {
                element.action.forEach((action: AnimationAction) => {
                    if (action.on === "click") {
                        document.body.style.cursor = "pointer";
                        animationService?.stop(action.target);
                        animationService?.play(action);
                        document.body.style.cursor = "default";
                    }
                });
            }

            if (element.type === "function") {
                element.action.forEach((action: FunctionAction) => {
                    if (action.on === "click") {
                        // Ejecutar función
                    }
                });
            }
        });
    }, [animationService]);

    const onNodeClick = useCallback((event: EventArgs<Node, { distance: number; position: THREE.Vector3 }>) => {
        const group = event.target.getGroup();
        if (!group) {
            console.warn("No se pudo obtener el grupo del nodo");
            return;
        }

        // Verificar si animationService está disponible
        if (!animationService) {
            console.warn("AnimationService no está disponible");
            return;
        }

        // Buscar el material del nodo para animar el uniform
        const mesh = group.children[0]?.children[0] as THREE.Mesh;
        const material = mesh?.material as THREE.ShaderMaterial;

        if (!material || !material.uniforms?.uFresnelBrightWidth) {
            console.warn("No se pudo encontrar el material o el uniform uFresnelBrightWidth");
        }

        const currentScale = group.scale; // Asumir escala uniforme
        const originalFresnelWidth = material?.uniforms?.uFresnelBrightWidth?.value || 0.7;

        // Crear y ejecutar la animación: achicarse y volver con efecto elástico
        const timeline = animationService?.createCustomTimeline();
        timeline
            ?.to(group.scale, {
                x: currentScale.x * 0.95,
                y: currentScale.y * 0.95,
                z: currentScale.z * 0.95,
                duration: 0.1,
                ease: "power2.in"
            })
            .to(group.scale, {
                x: currentScale.x,
                y: currentScale.y,
                z: currentScale.z,
                duration: 0.6,
                ease: "elastic.out(1., 0.25)"
            }); // Secuencial: empieza cuando termina la anterior

        // Animar el uniform uFresnelBrightWidth en paralelo
        if (material?.uniforms?.uFresnelBrightWidth) {
            timeline
                ?.to(material.uniforms.uFresnelBrightWidth, {
                    value: 1.4,
                    duration: 0.1,
                    ease: "power2.in"
                }, "<") // Sincronizar con la compresión
                .to(material.uniforms.uFresnelBrightWidth, {
                    value: originalFresnelWidth,
                    duration: 0.7,
                    ease: "power2.out"
                }, "<0.1"); // Iniciar cuando termina la compresión
        }

        // Ejecutar la animación
        timeline?.play();
    }, [animationService]);

    /**
     * Handler para cuando el cursor entra en un nodo
     * @param _event - Evento con datos del nodo y posición
     */
    const onNodeEnter = useCallback((_event: EventArgs<Node, { distance: number; position: THREE.Vector3 }>) => {
        console.log("Node entered:", _event.target.id);
    }, []);

    /**
     * Handler para cuando el cursor sale de un nodo
     * @param _event - Evento con datos del nodo y posición
     */
    const onNodeLeave = useCallback((_event: EventArgs<Node, { distance: number; position: THREE.Vector3 }>) => {
        console.log("Node left:", _event.target.id);
    }, []);

    /**
    * Handler para animación al siguiente nodo
    * El nodo sale hacia arriba y reentra por abajo
    */
    const handleNextNode = useCallback(() => {
        // Prevenir múltiples animaciones simultáneas
        if (isNavigationAnimating.current) return;

        const activeNode = core.activeNode;
        const group = activeNode?.getGroup();

        if (!group || !animationService) {
            return;
        }

        // Marcar animación como en curso
        isNavigationAnimating.current = true;

        // Guardar posición original
        const originalY = group.position.y;
        const originalX = group.position.x;

        // Obtener el material para animar los uniforms
        const nodeGroup = group.children[0] as THREE.Group; // nodeRef group
        const blobMesh = nodeGroup?.children.find((child: THREE.Object3D) => child.name === "blob") as THREE.Mesh;
        const material = blobMesh?.material as THREE.ShaderMaterial;

        // Debug: verificar si encontramos los uniforms
        console.log("🔍 Debug uniforms (next):", {
            groupChildren: group.children.length,
            nodeGroupExists: !!nodeGroup,
            blobMeshExists: !!blobMesh,
            materialExists: !!material,
            uniformsExists: !!material?.uniforms,
            uSmokeDirectionOffset: material?.uniforms?.uSmokeDirectionOffset?.value,
            uSmokeDirection: material?.uniforms?.uSmokeDirection?.value,
            uSmokeTurbulence: material?.uniforms?.uSmokeTurbulence?.value
        });

        // Crear timeline para la animación compleja
        const timeline = animationService.createCustomTimeline();

        timeline
            // Fase 1: Salir hacia arriba con movimiento senoidal lateral + uniforms
            ?.to(group.position, {
                y: originalY + 6, // Sale por arriba
                duration: 2.,
                ease: "back.in(.4)",
                onUpdate: function () {
                    // Crear movimiento senoidal en X mientras sube
                    const progress = this.progress(); // 0 a 1
                    const sineWave = Math.sin(progress * Math.PI * 3) * 0.1; // 3 oscilaciones completas
                    group.position.x = originalX + sineWave;
                }
            });

        // Animar uniforms durante la salida (en paralelo)
        if (material?.uniforms?.uSmokeDirectionOffset && material?.uniforms?.uSmokeTurbulence) {
            console.log("✅ Animando uniforms durante salida (next)");

            timeline
                ?.to(material.uniforms.uSmokeDirectionOffset, {
                    value: 0.151, // Offset va a 0.16 cuando sale
                    duration: .8, // Duración de la animación
                    ease: "back.out(.2)"
                }, "<") // Sincronizar con la animación de posición
                .to(material.uniforms.uSmokeTurbulence, {
                    value: 0.37, // Turbulencia aumenta ligeramente cuando sale (0.35 -> 0.37)
                    duration: 1.8, // Duración más larga para efecto gradual
                    ease: "expoScale"
                }, "<"); // Sincronizar con la animación de posición
        } else {
            console.warn("❌ No se encontraron uniforms para animar durante salida (next)");
        } timeline
            // Fase 2: Teleportar instantáneamente abajo (fuera de vista)
            ?.set(group.position, {
                y: originalY - 6, // Aparece por debajo
                x: originalX // Vuelve al centro en X
            })
            // Fase 3: Entrar desde abajo (más suave)
            .to(group.position, {
                y: originalY, // Vuelve a posición original
                duration: 1.6,
                ease: "back.out(.6)",
                onComplete: () => {
                    // Liberar el flag cuando termine la animación
                    isNavigationAnimating.current = false;
                }
            });

        // Animar uniforms durante la entrada (en paralelo)
        if (material?.uniforms?.uSmokeDirectionOffset && material?.uniforms?.uSmokeTurbulence) {
            console.log("✅ Animando uniforms durante entrada (next)");

            timeline
                ?.to(material.uniforms.uSmokeDirectionOffset, {
                    value: 0.15, // Offset vuelve a valor normal cuando entra
                    duration: 1.6, // Misma duración que la animación de posición
                    ease: "back.out(.6)"
                }, "<") // Sincronizar con la entrada
                .to(material.uniforms.uSmokeTurbulence, {
                    value: 0.35, // Turbulencia vuelve al valor por defecto cuando entra
                    duration: 1.6, // Misma duración que la animación de posición
                    ease: "back.out(.6)"
                }, "<"); // Sincronizar con la entrada
        } else {
            console.warn("❌ No se encontraron uniforms para animar durante entrada (next)");
        }

        timeline?.play();
    }, [animationService, core]);

    /**
     * Handler para animación al nodo anterior
     * El nodo sale hacia arriba y reentra por abajo (mismo comportamiento)
     */
    const handlePrevNode = useCallback(({ nodeId }: { nodeId: string }) => {
        // Prevenir múltiples animaciones simultáneas
        if (isNavigationAnimating.current) {
            console.log("⏸️ Animación en curso, ignorando nueva llamada a prev");
            return;
        }

        console.log(`🎬 Iniciando animación prev desde nodo: ${nodeId}`);

        const activeNode = core.activeNode;
        const group = activeNode?.getGroup();

        if (!group || !animationService) {
            console.warn("No se pudo obtener el grupo del nodo o animationService para animación prev");
            return;
        }

        // Marcar animación como en curso
        isNavigationAnimating.current = true;

        // Guardar posición original
        const originalY = group.position.y;
        const originalX = group.position.x;

        // Obtener el material para animar los uniforms
        const nodeGroup = group.children[0] as THREE.Group; // nodeRef group
        const blobMesh = nodeGroup?.children.find((child: THREE.Object3D) => child.name === "blob") as THREE.Mesh;
        const material = blobMesh?.material as THREE.ShaderMaterial;

        // Debug: verificar si encontramos los uniforms
        console.log("🔍 Debug uniforms (prev):", {
            groupChildren: group.children.length,
            nodeGroupExists: !!nodeGroup,
            blobMeshExists: !!blobMesh,
            materialExists: !!material,
            uniformsExists: !!material?.uniforms,
            uSmokeDirectionOffset: material?.uniforms?.uSmokeDirectionOffset?.value,
            uSmokeDirection: material?.uniforms?.uSmokeDirection?.value
        });

        // Valores originales de los uniforms
        const originalDirection = material?.uniforms?.uSmokeDirection?.value || 0.0;

        // Crear timeline para la animación (mismo comportamiento que next)
        const timeline = animationService.createCustomTimeline();

        timeline
            // Fase 1: Salir hacia arriba con movimiento senoidal lateral
            ?.to(group.position, {
                y: originalY + 8, // Sale por arriba
                duration: 0.4,
                ease: "power2.in",
                onUpdate: function () {
                    // Crear movimiento senoidal en X mientras sube (dirección opuesta)
                    const progress = this.progress(); // 0 a 1
                    const sineWave = Math.sin(progress * Math.PI * 2) * 0.25; // 2 oscilaciones más rápidas
                    group.position.x = originalX - sineWave; // Dirección opuesta a next
                }
            });

        // Animar uniforms durante la salida (en paralelo)
        if (material?.uniforms?.uSmokeDirectionOffset && material?.uniforms?.uSmokeTurbulence) {
            console.log("✅ Animando uniforms durante salida (prev)");

            timeline
                // Reset suave de uTime con interpolación
                ?.to(material.uniforms.uTime, {
                    value: 0.0,
                    duration: 0.2, // Interpolación suave de 200ms
                    ease: "power2.out"
                }, 0.1) // Pequeño delay de 100ms
                .to(material.uniforms.uSmokeDirectionOffset, {
                    value: 0.0, // Offset va a 0 cuando sale
                    duration: 0.4, // Misma duración que la animación de posición
                    ease: "power2.in"
                }, "<") // Sincronizar con la animación de posición

                .to(material.uniforms.uSmokeTurbulence, {
                    value: 0.37, // Turbulencia aumenta ligeramente cuando sale (igual que next)
                    duration: 0.4, // Misma duración que otras animaciones
                    ease: "power2.in"
                }, "<"); // Sincronizar con la animación de posición
        } else {
            console.warn("❌ No se encontraron uniforms para animar durante salida (prev)");
        }

        timeline
            // Fase 2: Teleportar instantáneamente abajo
            ?.set(group.position, {
                y: originalY - 8, // Aparece por debajo
                x: originalX // Vuelve al centro en X
            })
            // Fase 3: Entrar desde abajo
            .to(group.position, {
                y: originalY, // Vuelve a posición original
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => {
                    // Liberar el flag cuando termine la animación
                    isNavigationAnimating.current = false;
                    console.log("✅ Animación prev completada");
                }
            });

        // Animar uniforms durante la entrada (en paralelo)
        if (material?.uniforms?.uSmokeDirectionOffset && material?.uniforms?.uSmokeTurbulence) {
            console.log("✅ Animando uniforms durante entrada (prev)");
            timeline
                ?.to(material.uniforms.uSmokeDirectionOffset, {
                    value: originalDirection, // Offset = originalDirection cuando entra
                    duration: 0.6, // Misma duración que la animación de posición
                    ease: "power2.out"
                }, "<") // Sincronizar con la entrada

                .to(material.uniforms.uSmokeTurbulence, {
                    value: 0.35, // Turbulencia vuelve al valor por defecto cuando entra
                    duration: 0.6, // Misma duración que la animación de posición
                    ease: "power2.out"
                }, "<"); // Sincronizar con la entrada
        } else {
            console.warn("❌ No se encontraron uniforms para animar durante entrada (prev)");
        }

        timeline?.play();
    }, [animationService, core]);

    return { onObjectsEnter, onObjectsLeave, onObjectsClick, onNodeClick, onNodeEnter, onNodeLeave, handleNextNode, handlePrevNode };
}
