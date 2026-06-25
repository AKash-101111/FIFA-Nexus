import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, UserProfile } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav 
      [class.bg-deep-black]="isScrolled" 
      [class.bg-opacity-90]="isScrolled" 
      [class.backdrop-blur-md]="isScrolled"
      [class.shadow-xl]="isScrolled"
      class="fixed w-full z-50 transition-all duration-300 px-6 py-4 top-0"
    >
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-2 group">
          <div class="w-10 h-10 bg-gradient-to-tr from-royal-blue to-gold-accent rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-transform duration-300">
            <span class="text-white font-bold text-xl tracking-tighter">FN</span>
          </div>
          <span class="text-2xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">FIFA Nexus</span>
        </a>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-8">
          <a *ngFor="let item of navItems" 
             [routerLink]="item.path" 
             class="text-sm font-medium text-gray-300 hover:text-gold-accent transition-colors duration-300 uppercase tracking-widest relative group">
            {{item.label}}
            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-accent transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>

        <!-- Auth Buttons -->
        <div class="hidden md:flex items-center gap-4">
          <ng-container *ngIf="!(user$ | async) as user">
            <a routerLink="/" class="px-5 py-2 text-sm font-bold uppercase tracking-wider text-white hover:text-gold-accent transition-colors">Sign In</a>
            <a routerLink="/register" class="px-6 py-2.5 bg-gradient-to-r from-gold-accent to-yellow-600 rounded-sm text-sm font-bold uppercase tracking-wider text-deep-black hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] transition-shadow duration-300">Join Now</a>
          </ng-container>
          
          <ng-container *ngIf="(user$ | async) as user">
            <div class="flex items-center gap-4">
              <a routerLink="/dashboard" class="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
                <div class="w-8 h-8 rounded-full overflow-hidden bg-gold-accent flex items-center justify-center">
                  <img *ngIf="user.photoURL" [src]="user.photoURL" class="w-full h-full object-cover">
                  <span *ngIf="!user.photoURL" class="text-deep-black font-bold uppercase text-xs">{{ user.displayName.charAt(0) || user.email.charAt(0) || 'U' }}</span>
                </div>
                <span class="text-white text-sm font-bold">{{ user.displayName || 'Profile' }}</span>
              </a>
              <button (click)="logout()" class="text-gray-400 hover:text-red-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </ng-container>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="md:hidden text-white" (click)="toggleMenu()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path *ngIf="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            <path *ngIf="isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu Dropdown -->
      <div *ngIf="isMenuOpen" class="md:hidden absolute top-full left-0 w-full bg-deep-black/95 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col gap-6 shadow-2xl">
        <a *ngFor="let item of navItems" 
           [routerLink]="item.path"
           (click)="toggleMenu()"
           class="text-lg font-medium text-gray-300 hover:text-gold-accent transition-colors uppercase tracking-wider">
          {{item.label}}
        </a>
        <div class="h-px w-full bg-white/10 my-2"></div>
        <button class="w-full py-3 text-center text-white hover:text-gold-accent font-bold tracking-wider uppercase">Sign In</button>
        <button class="w-full py-3 bg-gradient-to-r from-gold-accent to-yellow-600 text-deep-black font-bold tracking-wider uppercase rounded-sm shadow-lg">Join Now</button>
      </div>
    </nav>
  `
})
    export class NavbarComponent {
      isScrolled = false;
      isMenuOpen = false;
      user$;
    
      constructor(private authService: AuthService, private router: Router) {
        this.user$ = this.authService.currentUser$;
      }

      async logout() {
        await this.authService.logout();
        this.router.navigate(['/']);
      }

  navItems = [
    { label: 'Live Matches', path: '/live' },
    { label: 'Competitions', path: '/competitions' },
    { label: 'Teams', path: '/teams' },
    { label: 'Players', path: '/players' },
    { label: 'AI Insights', path: '/ai-insights' }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
