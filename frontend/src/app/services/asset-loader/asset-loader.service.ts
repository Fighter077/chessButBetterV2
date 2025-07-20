import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import * as THREE from 'three';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Model, ModelTexture, SkinSet, Texture } from "src/app/interfaces/board3d";
import { Observable, ReplaySubject } from "rxjs";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Injectable({
    providedIn: 'root'
})
export class AssetLoaderService {
    private apiUrl = 'assets/skins/';

    private modelsLoaded: Map<string, Observable<GLTF>> = new Map<string, Observable<GLTF>>();
    private texturesLoaded: Map<string, Observable<ModelTexture>> = new Map<string, Observable<ModelTexture>>();
    private referenceTexturesLoaded: Map<string, Observable<THREE.Material>> = new Map<string, Observable<THREE.Material>>();

    private soundsLoaded: Map<string, Observable<HTMLAudioElement>> = new Map<string, Observable<HTMLAudioElement>>();

    private svgLoaded: Map<string, Observable<SafeHtml>> = new Map<string, Observable<SafeHtml>>();

    constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

    getOptions(): Observable<SkinSet[]> {
        return this.http.get<SkinSet[]>(this.apiUrl + 'skins.json');
    }

    loadModel(model: Model): Observable<THREE.Group> {
        const fileNameFull: string = model.skinType + '/models/' + model.modelFileName;
        let cachedSubject = this.modelsLoaded.get(fileNameFull) as ReplaySubject<GLTF>;

        if (!cachedSubject) {
            cachedSubject = new ReplaySubject<GLTF>(1);
            this.modelsLoaded.set(fileNameFull, cachedSubject);

            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('jsm/libs/draco/gltf/');

            const loader = new GLTFLoader();
            loader.setDRACOLoader(dracoLoader);
            loader.load(
                this.apiUrl + fileNameFull + '.glb',
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

    /**
     * Load a reference texture from a file.
     * @param referenceFileName The name of the reference texture file.
     * @returns An observable that emits the loaded material.
     * Each material is a THREE.Material object.
     * The reference itself can be a reference to another texture file.
     * If the reference is a reference to another texture, it will be loaded from that file recursively.
     */
    loadReferenceTexture(referenceFileName: string): Observable<THREE.Material> {
        let cachedSubject = this.referenceTexturesLoaded.get(referenceFileName) as ReplaySubject<THREE.Material>;
        if (!cachedSubject) {
            cachedSubject = new ReplaySubject<THREE.Material>(1);
            this.referenceTexturesLoaded.set(referenceFileName, cachedSubject);

            this.http.get<Texture>(this.apiUrl + referenceFileName + '.json')
                .subscribe(
                    (texture) => {
                        if (typeof texture === 'object' && 'reference' in texture) {
                            const referenceFileName = texture.reference;
                            this.loadReferenceTexture(referenceFileName).subscribe(
                                (material) => cachedSubject.next(material),
                                (error) => cachedSubject.error(error)
                            )
                        }
                        else {
                            this.loadMaterialFromJson(texture)
                                .then((material) => cachedSubject.next(material))
                                .catch((error) => cachedSubject.error(error));
                        }
                    },
                    (error) => cachedSubject.error(error)
                );
        }

        return new Observable<THREE.Material>(observer => {
            cachedSubject.subscribe({
                next: (material: THREE.Material) => {
                    observer.next(material);
                    observer.complete();
                },
                error: (err: any) => observer.error(err)
            });
        });
    }

    convertOffset(model: Model, texture: ModelTexture): ModelTexture {
        if (model.randomOffset) {
            const outputTexture: ModelTexture = {};
            Object.keys(texture).forEach((meshID) => {
                let mat = texture[meshID];
                if (mat instanceof THREE.Material) {
                    const clonedTexture = mat.clone();
                    const randomOffsetX = Math.random();
                    const randomOffsetY = Math.random();
                    const randomRotation = Math.random() * Math.PI * 2; // Random rotation
                    const offsetCloneMap = (newTexture: THREE.Texture): THREE.Texture => {
                        newTexture.offset.set(randomOffsetX, randomOffsetY);
                        newTexture.center.set(0.5, 0.5); // Center the texture
                        newTexture.rotation = randomRotation;
                        return newTexture;
                    };
                    ['map', 'normalMap', 'roughnessMap'].forEach((mapKey) => {
                        if ((clonedTexture as any)[mapKey] instanceof THREE.Texture) {
                            (clonedTexture as any)[mapKey] = offsetCloneMap(((clonedTexture as any)[mapKey] as THREE.Texture).clone());
                        }
                    });
                    outputTexture[meshID] = clonedTexture;
                } else {
                    // If the texture is a reference, we need to handle it differently
                    outputTexture[meshID] = mat; // Keep the reference as is
                }
            });
            return outputTexture;
        }
        return texture;
    }

    /**
     * Load a texture for a model.
     * @param model The model to load the texture for.
     * @returns An observable that emits the loaded texture.
     * Each texture is a map of mesh IDs to THREE.Material objects.
     * If a texture is a reference, it will be loaded from the reference file.
     */
    loadTexture(model: Model): Observable<ModelTexture> {
        const fileNameFull: string = model.skinType + '/textures/' + model.textureFileName;
        let cachedSubject = this.texturesLoaded.get(fileNameFull) as ReplaySubject<ModelTexture>;

        if (!cachedSubject) {
            cachedSubject = new ReplaySubject<ModelTexture>(1);
            this.texturesLoaded.set(fileNameFull, cachedSubject);

            this.http.get<ModelTexture>(this.apiUrl + fileNameFull + '.json')
                .subscribe(
                    (texture: ModelTexture) => {
                        // Convert texture properties to THREE.Material
                        (async () => {
                            const entries = Object.entries(texture);

                            const loadedMaterials = await Promise.all(
                                entries.map(([meshID, materialJson]) => {
                                    return new Promise<[string, THREE.Material]>((resolve, reject) => {
                                        // Check if the material is a reference
                                        if (typeof materialJson === 'object' && 'reference' in materialJson) {
                                            const referenceFileName = materialJson.reference;
                                            this.loadReferenceTexture(referenceFileName).subscribe(
                                                (material) => resolve([meshID, material]),
                                                (error) => reject(error)
                                            )
                                        }
                                        else {
                                            this.loadMaterialFromJson(materialJson).then(
                                                (material) => resolve([meshID, material]),
                                                (error) => reject(error)
                                            );
                                        }
                                    })
                                }));
                            const resolvedTexture = Object.fromEntries(loadedMaterials);
                            cachedSubject.next(this.convertOffset(model, resolvedTexture));
                        })();
                    },
                    (error) => cachedSubject.error(error)
                );
        }

        return new Observable<ModelTexture>(observer => {
            cachedSubject.subscribe({
                next: (texture: ModelTexture) => {
                    observer.next(this.convertOffset(model, texture));
                    observer.complete();
                },
                error: (err: any) => observer.error(err)
            });
        });
    }

    /**
     * Load a material from a JSON file.
     * @param json The JSON object containing the material properties.
     * @returns A promise that resolves to a THREE.Material object.
     * If the material has maps, they will be loaded asynchronously.
     */
    async loadMaterialFromJson(json: any): Promise<THREE.Material> {
        const textureLoader = new THREE.TextureLoader();
        const props = json.properties || {};
        const type = json.type || 'MeshStandardMaterial';

        const resolvedProps: any = {
            color: props.color ? (typeof props.color === 'object' ? new THREE.Color(props.color.r, props.color.g, props.color.b) : new THREE.Color(props.color)) : undefined,
            metalness: props.metalness,
            roughness: props.roughness,
            ior: props.ior,
            reflectivity: props.reflectivity,
            envMapIntensity: props.envMapIntensity,
            transmission: props.transmission,
            specularIntensity: props.specularIntensity,
            specularColor: props.specularColor ? new THREE.Color(props.specularColor) : undefined,
            opacity: props.opacity,
            side: props.side === 'DoubleSide' ? THREE.DoubleSide : THREE.FrontSide,
            transparent: props.transparent,
            clearcoat: props.clearcoat,
            clearcoatRoughness: props.clearcoatRoughness,
            sheen: props.sheen,
            sheenColor: props.sheenColor ? new THREE.Color(props.sheenColor) : undefined,
        };

        // Resolve texture references if provided
        const addedMaps = [];
        if (props.alphaMap) {
            resolvedProps.alphaMap = await textureLoader.loadAsync(this.apiUrl + props.alphaMap);
            addedMaps.push(resolvedProps.alphaMap);
        }
        if (props.envMap) {
            // Example: You may use RGBELoader here for HDR support
            resolvedProps.envMap = await textureLoader.loadAsync(this.apiUrl + props.envMap);
            addedMaps.push(resolvedProps.envMap);
        }
        if (props.map) {
            resolvedProps.map = await textureLoader.loadAsync(this.apiUrl + props.map);
            addedMaps.push(resolvedProps.map);
        }
        if (props.roughnessMap) {
            resolvedProps.roughnessMap = await textureLoader.loadAsync(this.apiUrl + props.roughnessMap);
            addedMaps.push(resolvedProps.roughnessMap);
        }
        if (props.normalMap) {
            resolvedProps.normalMap = await textureLoader.loadAsync(this.apiUrl + props.normalMap);
            addedMaps.push(resolvedProps.normalMap);
        }
        if (props.normalScale) {
            addedMaps.forEach((map: THREE.Texture) => {
                if (map) {
                    map.wrapS = THREE.RepeatWrapping;
                    map.wrapT = THREE.RepeatWrapping;
                    map.repeat.set(props.normalScale.x, props.normalScale.y);
                }
            });
        }

        // Remove undefined keys
        Object.keys(resolvedProps).forEach(key => {
            if (resolvedProps[key] === undefined) delete resolvedProps[key];
        });

        // Dynamically create the material based on type
        const materialClass: new (props: any) => THREE.Material = (THREE as any)[type];
        if (!materialClass) {
            throw new Error(`Unsupported material type: ${type}`);
        }
        return new materialClass(resolvedProps);
    }

    loadSvg(fileName: string): Observable<SafeHtml> {
        let cachedSubject = this.svgLoaded.get(fileName) as ReplaySubject<SafeHtml>;
        if (!cachedSubject) {
            cachedSubject = new ReplaySubject<SafeHtml>(1);
            this.svgLoaded.set(fileName, cachedSubject);

            this.http.get('assets/' + fileName, { responseType: 'text' }).subscribe(
                (svg) => {
                    const sanitizedSvg = this.sanitizer.bypassSecurityTrustHtml(svg);
                    cachedSubject.next(sanitizedSvg);
                },
                (error) => cachedSubject.error(error)
            );
        }

        return new Observable<SafeHtml>(observer => {
            cachedSubject.subscribe({
                next: (svg: SafeHtml) => {
                    observer.next(svg);
                    observer.complete();
                },
                error: (err: any) => observer.error(err)
            });
        });
    }

    loadSound(fileName: string): Observable<HTMLAudioElement> {
        let cached = this.soundsLoaded.get(fileName) as ReplaySubject<HTMLAudioElement>;

        if (!cached) {
            cached = new ReplaySubject<HTMLAudioElement>(1);
            this.soundsLoaded.set(fileName, cached);

            const audio = new Audio(`assets/${fileName}`);
            audio.load();

            audio.addEventListener('canplaythrough', () => {
                cached.next(audio);
                cached.complete();
            });

            audio.addEventListener('error', (err) => {
                cached.error(err);
            });
        }

        return cached.asObservable();
    }

    playSound(fileName: string): void {
        this.loadSound(fileName).subscribe({
            next: (audio: HTMLAudioElement) => {
                audio.currentTime = 0; // Reset to start
                audio.play().catch(err => console.error('Error playing sound:', err));
            },
            error: (err) => console.error('Error loading sound:', err)
        });
    }
}