import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import gsap from 'gsap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="fixed inset-0 min-h-screen w-full bg-[#050816] overflow-hidden flex flex-col items-center justify-center p-4">
      
      <!-- Official Uploaded Background -->
      <!-- Set to cover, center, no-repeat as requested. Parallax removed to keep trophy stable -->
      <div class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style="background-image: url('/login-bg.jpg');">
        <!-- Subtle 30% dark overlay for readability while keeping the cinematic feel -->
        <div class="absolute inset-0 bg-black/30 z-10 pointer-events-none"></div>
      </div>
      
      <!-- Particle Overlay -->
      <div class="absolute inset-0 z-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <!-- Minimal Authentication UI (overlaid directly on the newly created glass podium) -->
      <div #loginCard class="absolute bottom-[8%] left-1/2 -translate-x-1/2 z-20 w-full max-w-[280px] px-4 opacity-0 flex flex-col items-center">
        
        <div *ngIf="!showEmailForm" class="w-full space-y-3 relative z-10">
          <button (click)="loginWithGoogle()" class="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3.5 px-4 rounded-full hover:bg-gray-100 transition-colors shadow-lg group">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Google Sign In</span>
          </button>

          <button (click)="showEmailForm = true" class="w-full flex items-center justify-center gap-3 bg-transparent border border-white/40 text-white font-semibold py-3 px-4 rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-md">
            Sign In with Email
          </button>
        </div>

        <form *ngIf="showEmailForm" (ngSubmit)="onSubmit()" #loginForm="ngForm" class="w-full space-y-3 relative z-10 backdrop-blur-md bg-black/60 p-4 rounded-3xl border border-white/10">
          <button type="button" (click)="showEmailForm = false" class="text-gray-400 hover:text-white transition-colors text-xs uppercase tracking-widest mb-1 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            Back
          </button>
          
          <div *ngIf="errorMessage" class="bg-red-500/10 border border-red-500/30 text-red-400 p-2 rounded-lg text-xs text-center">
            {{ errorMessage }}
          </div>

          <div class="space-y-1">
            <input type="email" [(ngModel)]="email" name="email" placeholder="Email" required class="w-full bg-black/80 border border-white/20 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00BFFF] transition-all duration-300 text-sm">
          </div>

          <div class="space-y-1">
            <input type="password" [(ngModel)]="password" name="password" placeholder="Password" required class="w-full bg-black/80 border border-white/20 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#00BFFF] transition-all duration-300 text-sm">
          </div>

          <button type="submit" [disabled]="!loginForm.form.valid || isLoading" class="w-full bg-gradient-to-r from-[#00BFFF] to-[#0055FF] text-white font-bold py-3.5 rounded-full hover:shadow-[0_0_15px_rgba(0,191,255,0.5)] transition-all duration-300 disabled:opacity-50 mt-2 text-sm">
            {{ isLoading ? 'Authenticating...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('loginCard') loginCard!: ElementRef;
  @ViewChild('parallaxBg') parallaxBg!: ElementRef;
  
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  showEmailForm = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngAfterViewInit() {
    gsap.to(this.loginCard.nativeElement, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power4.out",
      delay: 0.2
    });

    if (this.parallaxBg) {
      window.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 90;
        const y = (window.innerHeight - e.pageY * 2) / 90;
        
        gsap.to(this.parallaxBg.nativeElement, {
          x: x,
          y: y,
          duration: 1,
          ease: 'power1.out'
        });
      });
    }
  }

  async loginWithGoogle() {
    try {
      this.isLoading = true;
      await this.authService.loginWithGoogle();
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
      await this.authService.loginWithEmail(this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = 'Invalid credentials. Access denied.';
    } finally {
      this.isLoading = false;
    }
  }
}
