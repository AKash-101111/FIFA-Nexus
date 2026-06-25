import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import gsap from 'gsap';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="fixed inset-0 min-h-screen w-full bg-deep-space overflow-hidden flex items-center justify-center">
      <!-- Fullscreen Stadium Background -->
      <div class="absolute inset-0 z-0 opacity-40">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-deep-space/50 to-deep-space z-10"></div>
        <img src="assets/login-bg.jpg" alt="FIFA World Cup 2026" class="w-full h-full object-cover">
      </div>
      
      <!-- Particle Overlay -->
      <div class="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
      <div class="ambient-bg z-0 opacity-50"></div>

      <div #registerCard class="relative z-10 w-full max-w-md px-6 opacity-0 translate-y-12">
        <div class="glass-panel rounded-3xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-t border-white/10 relative overflow-hidden">
          
          <!-- Animated Glow -->
          <div class="absolute -top-32 -right-32 w-64 h-64 bg-cyan-accent/20 rounded-full blur-[80px]"></div>
          
          <div class="text-center mb-10 relative z-10">
            <h2 class="font-display text-4xl font-black text-white uppercase tracking-widest mb-2">Join Nexus</h2>
            <p class="text-gray-400 text-sm tracking-widest uppercase">Begin Your Legacy</p>
          </div>

          <button (click)="registerWithGoogle()" class="group w-full flex items-center justify-center gap-4 glass-panel text-white font-bold py-3.5 px-4 rounded-xl hover:bg-white/10 hover:border-cyan-accent/30 transition-all duration-300 mb-8 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-electric-blue/0 via-electric-blue/30 to-electric-blue/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <svg class="w-5 h-5 relative z-10" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span class="relative z-10 tracking-wider">Continue with Google</span>
          </button>

          <div class="relative flex items-center justify-center mb-8">
            <div class="border-t border-white/5 w-full"></div>
            <span class="bg-deep-space px-4 text-xs text-gray-500 uppercase tracking-widest absolute rounded-full border border-white/5 py-1">Or</span>
          </div>

          <form (ngSubmit)="onSubmit()" #registerForm="ngForm" class="space-y-5 relative z-10">
            <div *ngIf="errorMessage" class="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm text-center backdrop-blur-sm">
              {{ errorMessage }}
            </div>
            
            <div *ngIf="successMessage" class="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-lg text-sm text-center backdrop-blur-sm">
              {{ successMessage }}
            </div>

            <div class="space-y-1.5">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
              <input type="email" [(ngModel)]="email" name="email" required class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-accent focus:bg-black/60 transition-all duration-300">
            </div>

            <div class="space-y-1.5">
              <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Password</label>
              <input type="password" [(ngModel)]="password" name="password" required minlength="6" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-accent focus:bg-black/60 transition-all duration-300">
            </div>

            <button type="submit" [disabled]="!registerForm.form.valid || isLoading" class="w-full bg-gradient-to-r from-electric-blue to-cyan-accent text-white font-black uppercase tracking-widest py-4 rounded-xl hover:shadow-[0_0_30px_rgba(0,194,255,0.4)] transition-all duration-300 disabled:opacity-50 disabled:shadow-none mt-6 group">
              <span class="inline-block group-hover:scale-105 transition-transform duration-300">
                {{ isLoading ? 'Creating Account...' : 'Initialize Profile' }}
              </span>
            </button>
          </form>

          <p class="text-center text-gray-400 text-xs mt-8 tracking-wider">
            Already have access? <a routerLink="/" class="text-cyan-accent hover:text-white font-bold transition-colors ml-1">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild('registerCard') registerCard!: ElementRef;
  
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit() {
    gsap.to(this.registerCard.nativeElement, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power4.out",
      delay: 0.2
    });
  }

  async registerWithGoogle() {
    try {
      this.isLoading = true;
      await this.authService.loginWithGoogle(); // Maps to register if new
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = error.message;
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit() {
    try {
      this.isLoading = true;
      this.errorMessage = '';
      await this.authService.registerWithEmail(this.email, this.password);
      this.successMessage = 'Registration successful! Redirecting...';
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    } catch (error: any) {
      this.errorMessage = error.message || 'Registration failed.';
    } finally {
      this.isLoading = false;
    }
  }
}
