import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-stadium-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[-1] overflow-hidden bg-deep-space pointer-events-none">
      <canvas #webglCanvas class="w-full h-full opacity-40"></canvas>
      <!-- Gradient overlay for better text readability -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80"></div>
    </div>
  `,
})
export class StadiumBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('webglCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationId!: number;
  private particles!: THREE.Points;

  ngAfterViewInit() {
    this.initThreeJs();
  }

  private initThreeJs() {
    const canvas = this.canvasRef.nativeElement;
    
    // Scene
    this.scene = new THREE.Scene();
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
    this.camera.position.y = 2;
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle System (Simulating Stadium Dust/Lights)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20; // Spread over 20 units
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00C2FF, // Cyan Accent
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
    this.scene.add(this.particles);

    // Grid (Simulating Pitch)
    const gridHelper = new THREE.GridHelper(20, 40, 0x0F62FE, 0x0F62FE);
    (gridHelper.material as THREE.Material).opacity = 0.2;
    (gridHelper.material as THREE.Material).transparent = true;
    this.scene.add(gridHelper);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x7C3AED, 2); // Purple glow
    pointLight.position.set(2, 3, 4);
    this.scene.add(pointLight);

    // Resize Handler
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // Animation Loop
    this.animate();
  }

  private animate() {
    this.animationId = requestAnimationFrame(this.animate.bind(this));

    // Slow rotation
    if (this.particles) {
      this.particles.rotation.y += 0.001;
      this.particles.rotation.x += 0.0005;
    }

    // Gentle camera sway
    const time = Date.now() * 0.0005;
    this.camera.position.x = Math.sin(time) * 1.5;
    this.camera.position.z = Math.cos(time) * 1.5 + 5;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize() {
    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    
    // Dispose Three.js resources
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
