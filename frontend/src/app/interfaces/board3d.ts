
import * as THREE from 'three';

export interface Model {
    id: string;
    fileName: string;
    x: number;
    y: number;
    z: number;
    textureFileName?: string;
    rotationY?: number;
}

export interface Pointer {
    x: number;
    y: number;
}

export interface ModelTexture {
    [meshID: string]: THREE.Material;
}

export interface CameraPosition {
    x: number;
    y: number;
    z: number;
}