import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CameraPosition, Model, Pointer } from 'src/app/interfaces/board3d';
import { Group, Object3D, Raycaster } from 'three';
import { AssetLoaderService } from 'src/app/services/asset-loader/asset-loader.service';
import Stats from 'stats.js';
import { easeInOutCubic } from 'src/app/constants/timing-functions.constants';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

@Injectable()
export class EngineService implements OnDestroy {
  private canvas!: HTMLCanvasElement | null;
  private canvasParent!: HTMLElement | null;
  private renderer!: THREE.WebGLRenderer | null;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private scene!: THREE.Scene;

  private frameId!: number;

  private raycaster: Raycaster = new Raycaster();

  private stats: Stats = new Stats();

  private objectRegistry: Map<string, Object3D> = new Map<string, Object3D>();
  private crumbles: { [key: string]: { startTime: number } } = {};

  public constructor(private ngZone: NgZone, private assetLoader: AssetLoaderService) { }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.renderer != null) {
      this.renderer.dispose();
      this.renderer = null;
      this.canvas = null;
      this.canvasParent = null;
    }
  }

  public async createScene(canvas: ElementRef<HTMLCanvasElement>, initialCameraPosition: CameraPosition): Promise<void> {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;
    this.canvasParent = this.canvas.parentElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;  // More filmic and realistic
    this.renderer.toneMappingExposure = 0.4; // Adjust exposure for better lighting
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0); // Set background to transparent
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    if (this.canvasParent !== null) {
      const bounds = this.canvasParent.getBoundingClientRect();
      const width = bounds.width;
      const height = bounds.height;
      this.renderer.setSize(width, height);

      // create the scene
      this.scene = new THREE.Scene();

      await this.setEnv();

      this.camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000
      );
      this.camera.position.x = initialCameraPosition.x;
      this.camera.position.y = initialCameraPosition.y;
      this.camera.position.z = initialCameraPosition.z;
      this.scene.add(this.camera);

      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.maxPolarAngle = (Math.PI / 2) * 0.9;  // 90% of the way to the top
      controls.maxDistance = 20;
      controls.minDistance = 7;
      controls.rotateSpeed = 1.2;
      controls.minPolarAngle = 0;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.update();
      this.controls = controls;

      this.stats.showPanel(0); // 0 = fps, 1 = ms, 2 = memory
      this.stats.dom.style.position = 'absolute';
      this.stats.dom.style.left = 'unset';
      this.stats.dom.style.right = '0px';
      //this.canvasParent.parentElement?.appendChild(this.stats.dom);
    }
  }

  private generateSunlight(): void {
    // Strong directional light to simulate sunlight
    const directional = new THREE.DirectionalLight(0xffffff, 2.8);
    directional.position.set(10, 10, 10);
    directional.castShadow = true;
    directional.shadow.mapSize.set(2048, 2048);
    directional.shadow.camera.left = -10;
    directional.shadow.camera.right = 10;
    directional.shadow.camera.top = 10;
    directional.shadow.camera.bottom = -10;
    directional.shadow.camera.near = 0.5;
    directional.shadow.camera.far = 50;
    this.scene.add(directional);
  }

  private async setEnv(): Promise<void> {
    if (this.renderer === null) {
      return;
    }
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);

    //const envTexture = await new RGBELoader().loadAsync('assets/skins/lakeside_sunrise_4k.hdr');
    //const envTexture = await new RGBELoader().loadAsync('assets/skins/qwantani_afternoon_4k.hdr');
    //this.scene.environment = pmremGenerator.fromEquirectangular(envTexture).texture
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    //this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Key directional light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 10, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    this.scene.add(keyLight);

    // Remove HDRI environment
    /*this.scene.environment = null;

    // Soft ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Boost this if too dark

    
    // Key directional light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(5, 10, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.bias = -0.005;
    this.scene.add(keyLight);

    /*
    // Fill light (optional)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, 5, -5);

    // Fill light (optional)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(0, 10, -2);

    const sunLight1 = new THREE.DirectionalLight(0xffffff, 1);
    sunLight1.position.set(0, 10, 2); // aim more toward front

    // Back light (optional for rim highlight)
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
    rimLight.position.set(5, 5, 5); // aim more toward front

    // Add to scene
    this.scene.add(ambientLight, keyLight, fillLight, rimLight, sunLight, sunLight1);*/

    /*const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    const envTexture = await new RGBELoader().loadAsync('assets/skins/qwantani_afternoon_4k.hdr');
    this.scene.environment = pmremGenerator.fromEquirectangular(envTexture).texture;*/
  }

  public setCameraPosition(position: CameraPosition): void {
    const duration = 1000; // milliseconds

    const startPos = this.camera.position.clone();
    const endPos = new THREE.Vector3(position.x, position.y, position.z); // Clone the position object to avoid reference issues

    // Respect the current user-defined target
    const center = this.controls.target.clone();

    // Dynamically calculate radius from the current position to the target
    const startRadius = startPos.clone().setY(0).distanceTo(center);
    const endRadius = endPos.clone().setY(0).distanceTo(center);

    const startAngle = Math.atan2(startPos.x - center.x, startPos.z - center.z);
    const endAngle = Math.atan2(endPos.x - center.x, endPos.z - center.z);

    const startHeight = startPos.y;
    const endHeight = endPos.y;

    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeInOutCubic(t);

      // Interpolate radius, angle, and height
      const currentRadius = startRadius + (endRadius - startRadius) * easedT;
      const currentAngle = startAngle + (endAngle - startAngle) * easedT;
      const currentHeight = startHeight + (endHeight - startHeight) * easedT;

      const x = center.x + currentRadius * Math.sin(currentAngle);
      const z = center.z + currentRadius * Math.cos(currentAngle);

      this.camera.position.set(x, currentHeight, z);
      this.camera.lookAt(center);
      this.controls.update();

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }
    });
  }

  public render(): void {
    this.stats.begin();
    this.updateCrumbleAnimations();
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    //this.cube.rotation.x += 0.01;
    //this.cube.rotation.y += 0.01;
    if (this.renderer !== null && this.scene !== null && this.camera !== null) {
      this.renderer.render(this.scene, this.camera);
    }
    this.stats.end();
  }

  public resize(): void {
    if (this.canvas !== null && this.renderer !== null && this.canvasParent !== null) {
      const bounds = this.canvasParent.getBoundingClientRect();
      const width = bounds.width;
      const height = bounds.height;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
    }

  }

  public addModel(model: Model): Promise<void> {
    const renameChildren = (object: Object3D, name: string) => {
      object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.name = name;
        }
      });
    };

    return new Promise((resolve, reject) => {
      this.assetLoader.loadModel(model).subscribe({
        next: (object: Group) => {
          object.position.set(model.x, model.y, model.z);
          object.scale.set(1, 1, 1);
          if (model.id) {
            object.name = model.id;
          }
          object.rotateY(model.rotationY || 0);

          const applyMaterialAndAddToScene = () => {
            if (model.id) {
              renameChildren(object, model.id);
              this.objectRegistry.set(model.id, object);
            }
            this.scene.add(object);
            resolve();
          };

          if (model.textureFileName) {
            this.assetLoader.loadTexture(model).subscribe({
              next: (texture) => {
                for (const textureKey in texture) {
                  if (texture.hasOwnProperty(textureKey)) {
                    const material = texture[textureKey];
                    if (material instanceof THREE.Material) {
                      object.traverse((child) => {
                        if ((child as THREE.Mesh).isMesh && child.name === textureKey) {
                          (child as THREE.Mesh).material = material;
                          if (model.castShadow) {
                            (child as THREE.Mesh).castShadow = true;
                          }
                          if (model.receiveShadow) {
                            (child as THREE.Mesh).receiveShadow = true;
                          }
                        }
                      });
                    }
                  }
                }
                applyMaterialAndAddToScene();
              },
              error: reject
            });
          } else {
            applyMaterialAndAddToScene();
          }
        },
        error: reject
      });
    });
  }

  public triggerCrumble(modelId: string): void {
    const object = this.objectRegistry.get(modelId);
    if (!object) {
      return;
    }
    this.prepareCrumbleEffect(object);
    this.crumbles[modelId] = { startTime: performance.now() };
  }

  private prepareCrumbleEffect(object: Object3D): void {
    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const geometry = mesh.geometry;

        const count = geometry.getAttribute('position').count;
        const randomOffsets = new Float32Array(count);
        const groundDistances = new Float32Array(count);
        for (let i = 0; i < count; i++) {
          randomOffsets[i] = Math.random();
          const y = geometry.attributes['position'].getY(i);
          groundDistances[i] = y;  // Assuming the ground is at y=0 in local space
        }

        geometry.setAttribute('randomOffset', new THREE.BufferAttribute(randomOffsets, 1));
        geometry.setAttribute('groundDistance', new THREE.BufferAttribute(groundDistances, 1));

        const material = (mesh.material as THREE.Material).clone();
        child.raycast = () => { return; }; // Disable raycasting for this mesh
        material.side = THREE.DoubleSide;
        material.onBeforeCompile = (shader) => {
          shader.uniforms['time'] = { value: 0 };

          shader.vertexShader = `
            attribute float randomOffset;
            attribute float groundDistance;
            uniform float time;
          ` + shader.vertexShader;

          shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
              float safeOffset = 0.0 + randomOffset * 0.1;
              float localTime = max(time - safeOffset, 0.0);

              float v0 = 0.0;
              float gravity = 9.0;
              float displacement = v0 * localTime + 0.5 * gravity * localTime * localTime;

              vec3 outwardDir = normalize(position.xz == vec2(0.0) ? vec3(1.0, 0.0, 0.0) : vec3(position.x, 0.0, position.z));
              vec3 outwardOffset = outwardDir * displacement * 0.1;

              float maxFall = groundDistance + 0.1;
              float actualFall = min(displacement, maxFall);

              float freezeFactor = float(displacement >= maxFall);
              vec3 downwardOffset = vec3(0.0, -1.0, 0.0) * actualFall;
              vec3 frozenOutwardOffset = outwardOffset * (1.0 - freezeFactor);

              vec3 crumbleOffset = downwardOffset + frozenOutwardOffset;
              vec3 transformed = position + crumbleOffset;
            `
          );

          mesh.userData['shader'] = shader;
        };

        mesh.material = material;
      }
    });
  }

  private updateCrumbleAnimations(): void {
    const currentTime = performance.now();

    for (const modelId in this.crumbles) {
      const crumble = this.crumbles[modelId];
      const object = this.objectRegistry.get(modelId);
      if (!object) continue;

      object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && child.userData['shader']) {
          const elapsed = (currentTime - crumble.startTime) / 1000;
          child.userData['shader'].uniforms.time.value = Math.min(elapsed, 3.0);
        }
      });
    }
  }

  public getObjectByCursor(pointer: Pointer): Object3D | null {
    const pointerVector = new THREE.Vector2();
    pointerVector.x = pointer.x;
    pointerVector.y = pointer.y;
    this.raycaster.setFromCamera(pointerVector, this.camera);

    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      let obj = intersects[0].object;

      // Traverse up to the named parent
      while (obj && (!obj.name) && obj.parent) {
        obj = obj.parent;
      }
      return obj;
    }

    return null;
  }
}