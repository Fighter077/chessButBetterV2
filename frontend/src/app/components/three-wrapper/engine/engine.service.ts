import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CameraPosition, Model, Pointer } from 'src/app/interfaces/board3d';
import { Group, Object3D, Raycaster } from 'three';
import { AssetLoaderService } from './asset-loader.service';

@Injectable({ providedIn: 'root' })
export class EngineService implements OnDestroy {
  private canvas!: HTMLCanvasElement | null;
  private canvasParent!: HTMLElement | null;
  private renderer!: THREE.WebGLRenderer | null;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private light!: THREE.AmbientLight;

  private cube!: THREE.Mesh;

  private frameId!: number;

  private raycaster: Raycaster = new Raycaster();

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

  public createScene(canvas: ElementRef<HTMLCanvasElement>, initialCameraPosition: CameraPosition): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;
    this.canvasParent = this.canvas.parentElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    if (this.canvasParent !== null) {
      const bounds = this.canvasParent.getBoundingClientRect();
      const width = bounds.width;
      const height = bounds.height;
      this.renderer.setSize(width, height);

      // create the scene
      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000
      );
      this.camera.position.x = initialCameraPosition.x;
      this.camera.position.y = initialCameraPosition.y;
      this.camera.position.z = initialCameraPosition.z;
      this.scene.add(this.camera);

      const ambient = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
      this.scene.add(ambient);

      const directional = new THREE.DirectionalLight(0xffffff, 1.0);
      directional.position.set(10, 10, 10);
      this.scene.add(directional);

      // soft white light
      this.light = new THREE.AmbientLight(0xffffff, 1);
      this.light.position.z = 10;
      this.scene.add(this.light);

      const geometry = new THREE.BoxGeometry(10, 1, 10);
      const material = new THREE.MeshBasicMaterial({ color: 0x333333 });
      this.cube = new THREE.Mesh(geometry, material);
      this.scene.add(this.cube);

      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.target.set(0, 1.5, 0);
      controls.update();
      controls.enablePan = false;
      controls.enableDamping = true;
    }
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
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    //this.cube.rotation.x += 0.01;
    //this.cube.rotation.y += 0.01;
    if (this.renderer !== null && this.scene !== null && this.camera !== null) {
      this.renderer.render(this.scene, this.camera);
    }
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
          object.name = model.id;
          object.rotateY(model.rotationY || 0);

          const applyMaterialAndAddToScene = () => {
            renameChildren(object, model.id);
            this.scene.add(object);
            resolve();
          };

          if (model.textureFileName) {
            this.assetLoader.loadTexture(model).subscribe({
              next: (texture) => {
                for (const textureKey in texture) {
                  if (texture.hasOwnProperty(textureKey)) {
                    const material = texture[textureKey];
                    object.traverse((child) => {
                      if ((child as THREE.Mesh).isMesh && child.name === textureKey) {
                        (child as THREE.Mesh).material = material;
                      }
                    });
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

  public getObjectByCursor(pointer: Pointer): Object3D | null {
    const pointerVector = new THREE.Vector2();
    pointerVector.x = pointer.x;
    pointerVector.y = pointer.y;
    console.log('pointerVector', pointerVector);
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