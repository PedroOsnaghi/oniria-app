import * as THREE from 'three';
import { useCallback } from 'react';
import { useEngineCore } from '@engine/core';
import { CameraService } from '../services';

/**
 * Hook que proporciona métodos para transiciones de cámara y animaciones
 * 
 * @returns Objeto con métodos para manejar transiciones visuales
 */
export function useTransitions() {
    const core = useEngineCore();
    const cameraService = core.getService(CameraService);
    const activeRoom = core.getCurrentRoom();

    /**
     * Transiciona la cámara para ver los nodos de la sala activa
     */
    const viewNodes = useCallback(() => {
        if (!cameraService || !activeRoom) return;
        const target = activeRoom.getPortal()?.position;
        if (!target) return;

        const onRest = () => {
            cameraService.removeEventListener('rest', onRest);
        };

        cameraService.addEventListener('rest', onRest);

        cameraService.setRestThreshold(0.8);
        cameraService.setLookAt(
            new THREE.Vector3(target.x, target.y, target.z),
            new THREE.Vector3(target.x, target.y, target.z - 0.5),
            true
        );
    }, [cameraService, activeRoom]);

    const viewReset = useCallback(() => {
        if (!cameraService) return;

        cameraService.resetInitialPosition();

    }, [cameraService]);

    return { viewNodes, viewReset };
}
