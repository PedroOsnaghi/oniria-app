/* eslint-disable no-unused-vars */
import { Room } from "@engine/entities/Room";
import { Skin } from "@engine/entities/Skin";
import type { ColorRepresentation } from "three";

export enum EngineState {
    INITIALIZING = "INITIALIZING",
    LOADING_ASSETS = "LOADING_ASSETS",
    LOADING_CONFIG = "LOADING_CONFIG",
    READY = "READY",
    ERROR = "ERROR"
}


export type UserSettings = {
    activeRoom: Room;
    activeSkin: Skin
}

export type EngineSettings = {
    backgroundColor: ColorRepresentation
    cameraInitialPosition?: [number, number, number]
    cameraRotation?: [number, number, number]
    cameraFOV?: number
}



