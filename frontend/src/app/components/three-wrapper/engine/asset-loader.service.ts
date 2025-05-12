import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import * as THREE from 'three';
import { Model, ModelTexture } from "src/app/interfaces/board3d";
import { Observable, ReplaySubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AssetLoaderService {
    private apiUrl = 'assets/';

    private modelsLoaded: Map<string, Observable<GLTF>> = new Map<string, Observable<GLTF>>();
    private texturesLoaded: Map<string, Observable<ModelTexture>> = new Map<string, Observable<ModelTexture>>();

    constructor(private http: HttpClient) { }

    loadModel(model: Model): Observable<THREE.Group> {
        let cachedSubject = this.modelsLoaded.get(model.fileName) as ReplaySubject<GLTF>;

        if (!cachedSubject) {
            cachedSubject = new ReplaySubject<GLTF>(1);
            this.modelsLoaded.set(model.fileName, cachedSubject);

            const loader = new GLTFLoader();
            loader.load(
                this.apiUrl + 'models/' + model.fileName + '.glb',
                (gltf) => cachedSubject.next(gltf),
                undefined,
                (error) => cachedSubject.error(error)
            );
        }

        return new Observable<THREE.Group>(observer => {
            cachedSubject.subscribe({
                next: (gltf: GLTF) => {
                    observer.next(gltf.scene.clone());
                    observer.complete();
                },
                error: (err: any) => observer.error(err)
            });
        });
    }

    loadTexture(model: Model): Observable<ModelTexture> {
        let cachedSubject = this.texturesLoaded.get(model.textureFileName as string) as ReplaySubject<ModelTexture>;

        if (!cachedSubject) {
            cachedSubject = new ReplaySubject<ModelTexture>(1);
            this.texturesLoaded.set(model.textureFileName as string, cachedSubject);

            this.http.get<ModelTexture>(this.apiUrl + 'textures/' + model.textureFileName + '.json')
                .subscribe(
                    (texture) => {
                        // Convert texture properties to THREE.Material
                        (async () => {
                            const entries = Object.entries(texture);

                            const loadedMaterials = await Promise.all(
                                entries.map(([meshID, materialJson]) =>
                                    this.loadMaterialFromJson(materialJson, this.apiUrl + 'textures/')
                                        .then((material) => [meshID, material] as const)
                                )
                            );

                            const resolvedTexture = Object.fromEntries(loadedMaterials);
                            cachedSubject.next(resolvedTexture);
                        })();
                    },
                    (error) => cachedSubject.error(error)
                );
        }

        return new Observable<ModelTexture>(observer => {
            cachedSubject.subscribe({
                next: (texture: ModelTexture) => {
                    observer.next(texture);
                    observer.complete();
                },
                error: (err: any) => observer.error(err)
            });
        });
    }

    async loadMaterialFromJson(json: any, textureBasePath: string = ''): Promise<THREE.Material> {
        const textureLoader = new THREE.TextureLoader();
        const props = json.properties || {};
        const type = json.type || 'MeshStandardMaterial';

        const resolvedProps: any = {
            color: props.color ? new THREE.Color(props.color) : undefined,
            metalness: props.metalness,
            roughness: props.roughness,
            ior: props.ior,
            envMapIntensity: props.envMapIntensity,
            transmission: props.transmission,
            specularIntensity: props.specularIntensity,
            specularColor: props.specularColor ? new THREE.Color(props.specularColor) : undefined,
            opacity: props.opacity,
            side: props.side === 'DoubleSide' ? THREE.DoubleSide : THREE.FrontSide,
            transparent: props.transparent
        };

        // Resolve texture references if provided
        if (props.alphaMap) {
            resolvedProps.alphaMap = await textureLoader.loadAsync(textureBasePath + props.alphaMap);
        }
        if (props.envMap) {
            // Example: You may use RGBELoader here for HDR support
            resolvedProps.envMap = await textureLoader.loadAsync(textureBasePath + props.envMap);
        }

        // Remove undefined keys
        Object.keys(resolvedProps).forEach(key => {
            if (resolvedProps[key] === undefined) delete resolvedProps[key];
        });

        // Dynamically create the material based on type
        const materialClass = (THREE as any)[type];
        if (!materialClass) {
            throw new Error(`Unsupported material type: ${type}`);
        }

        return new materialClass(resolvedProps);
    }
}