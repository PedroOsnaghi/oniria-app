import gsap from "gsap";
import * as THREE from "three";
import type { AnimationHandler, AnimationMetadata } from "./types";

/**
 * Animación de péndulo con rotación en un eje específico
 */
export const pendulumAnimation: AnimationHandler = (target, config) => {
    const {
        axis: axisArr = [0, 1, 0],
        angle = 30,
        D_right = 0.8,
        D_left = 0.8,
        T_rest = 1.5,
        ease = "sine.inOut",
    } = config.params;

    const qBase = target.quaternion.clone();
    const axis = new THREE.Vector3(...axisArr)
        .applyQuaternion(qBase)
        .normalize();

    const qTmp = new THREE.Quaternion();
    const proxy = { theta: 0 };

    const applyRotation = () => {
        qTmp.setFromAxisAngle(axis, proxy.theta);
        target.quaternion.copy(qBase).multiply(qTmp);
    };

    const A = THREE.MathUtils.degToRad(angle);
    const tl = gsap.timeline({ repeat: config.loop ? -1 : 0 });

    tl.to(proxy, {
        theta: +A,
        duration: D_right,
        ease,
        onUpdate: applyRotation,
    })
        .to(proxy, {
            theta: -A,
            duration: D_left,
            ease,
            onUpdate: applyRotation,
        })
        .to(proxy, {
            theta: 0,
            duration: D_right,
            ease,
            onUpdate: applyRotation,
        })
        .to({}, { duration: T_rest });

    return tl;
};

/**
 * Animación de rotación continua en un eje específico
 */
export const rotateAnimation: AnimationHandler = (target, config) => {
    const {
        axis: axisArr = [0, 1, 0],
        to = 360,
        duration = 5,
        ease = "none",
    } = config.params;

    const qBase = target.quaternion.clone();
    const axis = new THREE.Vector3(...axisArr)
        .applyQuaternion(qBase)
        .normalize();

    const qTmp = new THREE.Quaternion();
    const proxy = { theta: 0 };

    const applyRotation = () => {
        qTmp.setFromAxisAngle(axis, proxy.theta);
        target.quaternion.copy(qBase).multiply(qTmp);
    };

    const A = THREE.MathUtils.degToRad(to);
    const tl = gsap.timeline({ repeat: config.loop ? -1 : 0 });

    tl.to(proxy, {
        theta: A,
        duration,
        ease,
        onUpdate: applyRotation,
    });

    return tl;
};

/**
 * Animación de rotación directa usando las propiedades de rotación del objeto
 */
export const rotateToAnimation: AnimationHandler = (target, config) => {
    const {
        axis: axisArr = [0, 1, 0],
        to = 360,
        duration = 5,
        ease = "none",
    } = config.params;

    const maxAngle = THREE.MathUtils.degToRad(to);
    const tl = gsap.timeline({ repeat: config.loop ? -1 : 0 });

    tl.to(target.rotation, {
        y: maxAngle * Number(axisArr[1]),
        x: maxAngle * Number(axisArr[0]),
        z: maxAngle * Number(axisArr[2]),
        duration: duration ?? 0.8,
        ease: ease,
    });

    return tl;
};

/**
 * Animación para mostrar modal con escala desde centro-izquierdo
 */
export const modalShowAnimation: AnimationHandler = (target, config) => {
    const { duration = 0.3, ease = "power2.out" } = config.params;

    const tl = gsap.timeline();

    tl.to(target, {
        scale: 1,
        duration,
        ease,
        transformOrigin: "left center"
    });

    return tl;
};

/**
 * Animación para ocultar modal con escala hacia centro-izquierdo
 */
export const modalHideAnimation: AnimationHandler = (target, config) => {
    const { duration = 0.25, ease = "power2.in" } = config.params;

    const tl = gsap.timeline();

    tl.to(target, {
        scale: 0,
        duration,
        ease,
        transformOrigin: "left center"
    });

    return tl;
};

/**
 * Animación de entrada para elementos del modal (fade + slide)
 */
export const modalElementEnterAnimation: AnimationHandler = (target, config) => {
    const {
        duration = 0.2,
        ease = "power2.out"
    } = config.params;

    const tl = gsap.timeline();

    tl.to(target, {
        opacity: 1,
        y: 0,
        duration,
        ease
    });

    return tl;
};

/**
 * Animación idle para el nodo - movimiento sutil hacia la izquierda
 */
export const nodeIdleAnimation: AnimationHandler = (target, config) => {
    const {
        offsetX = -0.2,
        duration = 1.5,
        ease = "power2.inOut"
    } = config.params;

    const originalX = target.position.x;
    const tl = gsap.timeline({ repeat: config.loop ? -1 : 0 });

    tl.to(target.position, {
        x: originalX + offsetX,
        duration,
        ease,
    })
        .to(target.position, {
            x: originalX,
            duration,
            ease,
        });

    return tl;
};

/**
 * Metadatos de las animaciones por defecto
 */
export const defaultAnimationsMetadata: Record<string, AnimationMetadata> = {
    pendulum: {
        name: "pendulum",
        description: "Animación de péndulo con rotación en un eje específico",
        defaultParams: {
            axis: [0, 1, 0],
            angle: 30,
            D_right: 0.8,
            D_left: 0.8,
            T_rest: 1.5,
            ease: "sine.inOut"
        },
        requiredParams: []
    },
    rotate: {
        name: "rotate",
        description: "Animación de rotación continua en un eje específico",
        defaultParams: {
            axis: [0, 1, 0],
            to: 360,
            duration: 5,
            ease: "none"
        },
        requiredParams: []
    },
    rotateTo: {
        name: "rotateTo",
        description: "Rotación directa usando las propiedades de rotación del objeto",
        defaultParams: {
            axis: [0, 1, 0],
            to: 360,
            duration: 5,
            ease: "none"
        },
        requiredParams: []
    },
    modalShow: {
        name: "modalShow",
        description: "Animación para mostrar modal con escala desde centro-izquierdo",
        defaultParams: {
            duration: 0.3,
            ease: "power2.out"
        },
        requiredParams: []
    },
    modalHide: {
        name: "modalHide",
        description: "Animación para ocultar modal con escala hacia centro-izquierdo",
        defaultParams: {
            duration: 0.25,
            ease: "power2.in"
        },
        requiredParams: []
    },
    modalElementEnter: {
        name: "modalElementEnter",
        description: "Animación de entrada para elementos del modal (fade + slide)",
        defaultParams: {
            duration: 0.2,
            ease: "power2.out"
        },
        requiredParams: []
    },
    nodeIdle: {
        name: "nodeIdle",
        description: "Animación idle para el nodo - movimiento sutil hacia la izquierda",
        defaultParams: {
            offsetX: -0.2,
            duration: 1.5,
            ease: "power2.inOut"
        },
        requiredParams: []
    }
};

/**
 * Mapa de todas las animaciones por defecto
 */
export const defaultAnimations: Record<string, AnimationHandler> = {
    pendulum: pendulumAnimation,
    rotate: rotateAnimation,
    rotateTo: rotateToAnimation,
    modalShow: modalShowAnimation,
    modalHide: modalHideAnimation,
    modalElementEnter: modalElementEnterAnimation,
    nodeIdle: nodeIdleAnimation
};
