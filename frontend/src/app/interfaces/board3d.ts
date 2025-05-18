
import * as THREE from 'three';

export interface SkinSet {
    name: string;
    folder: string;
}

export interface Model {
    id?: string;
    x: number;
    y: number;
    z: number;
    skinType: string;
    modelFileName: string;
    textureFileName?: string;
    rotationY?: number;
    castShadow?: boolean;
    receiveShadow?: boolean;
}

export interface Pointer {
    x: number;
    y: number;
}

export interface ModelTexture {
    [meshID: string]: Texture;
}

export type Texture = THREE.Material | {'reference': string};

export interface CameraPosition {
    x: number;
    y: number;
    z: number;
}