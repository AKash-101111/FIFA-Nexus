import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import gsap from 'gsap';

@Component({
  selector: 'app-hero-3d',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-[60vh] md:h-[70vh] overflow-hidden rounded-3xl mb-12 border border-white/5 shadow-2xl group">
      <!-- Three.js Canvas Container -->
      <div #canvasContainer class="absolute inset-0 z-0 bg-gradient-to-b from-electric-blue/10 via-deep-space to-deep-space"></div>
      
      <!-- Overlay Text -->
      <div class="absolute inset-0 z-10 flex flex-col justify-center px-12 pointer-events-none">
        <div #textContent class="opacity-0 translate-y-12">
          <span class="inline-block py-1 px-3 rounded-full border border-gold-accent/30 bg-gold-accent/10 text-gold-accent text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            World Cup 2026
          </span>
          <h1 class="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            FIFA Nexus
          </h1>
          <p class="text-xl text-gray-300 max-w-xl font-light tracking-wide drop-shadow-md">
            The ultimate football intelligence platform.
          </p>
        </div>
      </div>
      
      <!-- Premium Vignette Overlay -->
      <div class="absolute inset-0 z-0 shadow-[inset_0_0_150px_rgba(10,10,10,0.9)] pointer-events-none"></div>
    </div>
  `
})
export class Hero3dComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef;
  @ViewChild('textContent') textContent!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private sphere!: THREE.Mesh;
  private animationId: number = 0;
  private mouseX = 0;
  private mouseY = 0;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initThreeJs();
    this.animateGSAP();
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    cancelAnimationFrame(this.animationId);
    
    // Cleanup Three.js to prevent memory leaks
    if (this.renderer) {
      this.renderer.dispose();
      this.scene.clear();
    }
  }

  private initThreeJs(): void {
    const container = this.canvasContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 10;
    this.camera.position.x = 3; 

    // Renderer Configuration
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    container.appendChild(this.renderer.domElement);

    // High detail Icosahedron makes a great base for a realistic football shape
    const geometry = new THREE.IcosahedronGeometry(3, 8); // High poly for soft shadows and smooth curves
    
    // Create an environment map dynamically for reflections
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    
    // We create a procedural texture for the hex/pentagon pattern
    const createFootballTexture = (isBump = false) => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = isBump ? '#aaaaaa' : '#ffffff';
        ctx.fillRect(0, 0, 2048, 1024);
        
        ctx.lineWidth = 12;
        ctx.strokeStyle = isBump ? '#000000' : '#111111';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        
        const hexRadius = 64;
        const dx = hexRadius * Math.sqrt(3);
        const dy = hexRadius * 1.5;
        let row = 0;
        for (let y = -100; y < canvas.height + 100; y += dy) {
          for (let x = -100; x < canvas.width + 100; x += dx) {
            const cx = x + (row % 2 === 0 ? 0 : dx / 2);
            const cy = y;
            
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
              const angle = Math.PI / 3 * i + Math.PI / 6;
              const px = cx + hexRadius * Math.cos(angle);
              const py = cy + hexRadius * Math.sin(angle);
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            
            // Pattern for black pentagons vs white hexagons
            if (!isBump && (Math.floor(cx / dx) + Math.floor(cy / dy)) % 3 === 0) {
              ctx.fillStyle = '#151515';
              ctx.fill();
            } else if (isBump && (Math.floor(cx / dx) + Math.floor(cy / dy)) % 3 === 0) {
              ctx.fillStyle = '#888888';
              ctx.fill();
            }
            ctx.stroke();
            
            // Add fake stitching for realism
            if (!isBump) {
              ctx.lineWidth = 2;
              ctx.strokeStyle = '#aaaaaa';
              ctx.setLineDash([4, 8]);
              ctx.stroke();
              ctx.setLineDash([]);
              ctx.lineWidth = 12;
              ctx.strokeStyle = '#111111';
            }
          }
          row++;
        }
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      return texture;
    };

    const colorMap = createFootballTexture(false);
    const bumpMap = createFootballTexture(true);

    // Photorealistic PBR Material
    const material = new THREE.MeshPhysicalMaterial({
      map: colorMap,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      metalness: 0.1,
      roughness: 0.6,
      clearcoat: 0.3,
      clearcoatRoughness: 0.4,
      envMapIntensity: 1.2,
    });

    this.sphere = new THREE.Mesh(geometry, material);
    this.sphere.castShadow = true;
    this.sphere.receiveShadow = true;
    
    // Position it slightly to the right
    this.sphere.position.x = 2;
    this.scene.add(this.sphere);

    // Premium Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.bias = -0.0005;
    mainLight.shadow.normalBias = 0.02;
    this.scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.5);
    rimLight.position.set(-5, 5, -5);
    this.scene.add(rimLight);

    const pointLight = new THREE.PointLight(0xD4AF37, 4, 50); // Gold accent light
    pointLight.position.set(-5, 5, 5);
    this.scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x0F62FE, 3, 50); // Royal Blue accent light
    pointLight2.position.set(5, -5, -2);
    this.scene.add(pointLight2);

    this.animate();
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    // Rotate sphere
    if (this.sphere) {
      this.sphere.rotation.x += 0.002;
      this.sphere.rotation.y += 0.003;
      
      // Parallax effect based on mouse
      this.sphere.position.x += (this.mouseX * 0.5 + 2 - this.sphere.position.x) * 0.05;
      this.sphere.position.y += (-this.mouseY * 0.5 - this.sphere.position.y) * 0.05;
    }

    // Camera parallax
    this.camera.position.x += (this.mouseX * 1 + 3 - this.camera.position.x) * 0.05;
    this.camera.position.y += (-this.mouseY * 1 - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  };

  private onWindowResize(): void {
    if (!this.camera || !this.renderer || !this.canvasContainer) return;
    const container = this.canvasContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private onMouseMove(event: MouseEvent): void {
    // Normalize mouse coordinates (-1 to +1)
    this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = (event.clientY / window.innerHeight) * 2 - 1;
  }

  private animateGSAP(): void {
    gsap.to(this.textContent.nativeElement, {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: 'power4.out',
      delay: 0.3
    });
  }
}
