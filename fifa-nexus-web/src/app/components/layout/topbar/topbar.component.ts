import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="h-20 w-full flex items-center justify-between px-6 bg-deep-space/80 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-30 transition-all duration-300">
      
      <!-- Mobile Logo (Visible only on mobile) -->
      <div class="md:hidden flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-electric-blue to-cyan-accent flex items-center justify-center shadow-[0_0_20px_rgba(0,194,255,0.4)]">
          <span class="text-white font-black text-xs tracking-tighter">FN</span>
        </div>
        <span class="text-md font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Nexus</span>
      </div>

      <!-- Global Search / Command Palette Trigger -->
      <div class="hidden md:flex flex-1 max-w-xl mx-8">
        <button class="w-full flex items-center gap-3 px-4 py-2.5 bg-black/40 hover:bg-white/5 border border-white/10 hover:border-cyan-accent/50 hover:shadow-[0_0_20px_rgba(0,194,255,0.15)] rounded-xl text-gray-400 transition-all group">
          <svg class="w-5 h-5 group-hover:text-cyan-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span class="text-sm font-medium tracking-wide">Search teams, players, or ask AI...</span>
          <div class="ml-auto flex gap-1">
            <kbd class="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-bold text-gray-300">CTRL</kbd>
            <kbd class="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-bold text-gray-300">K</kbd>
          </div>
        </button>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-4 shrink-0 ml-auto">
        
        <!-- Theme Toggle -->
        <button (click)="toggleTheme()" class="relative p-2 text-gray-400 hover:text-white transition-colors group">
          <svg *ngIf="(theme$ | async) === 'dark'" class="w-6 h-6 group-hover:text-yellow-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg *ngIf="(theme$ | async) === 'light'" class="w-6 h-6 group-hover:text-cyan-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <!-- Language Selector -->
        <div class="relative group cursor-pointer hidden md:block">
          <div class="flex items-center gap-1 text-gray-400 hover:text-white transition-colors p-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
            <span class="text-xs font-bold uppercase tracking-widest">{{ currentLang$ | async }}</span>
          </div>
          <!-- Lang Dropdown -->
          <div class="absolute right-0 top-full mt-2 w-32 bg-deep-space/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right">
            <div class="p-2 space-y-1">
              <button (click)="setLang('en')" class="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-widest font-bold">English</button>
              <button (click)="setLang('es')" class="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-widest font-bold">Español</button>
              <button (click)="setLang('fr')" class="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-widest font-bold">Français</button>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <button class="relative p-2 text-gray-400 hover:text-white transition-colors group">
          <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-accent animate-ping opacity-75"></span>
          <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-accent shadow-[0_0_10px_rgba(0,194,255,0.8)]"></span>
          <svg class="w-6 h-6 group-hover:text-cyan-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        <div class="h-6 w-px bg-white/10 hidden md:block"></div>

        <!-- User Profile Dropdown Trigger -->
        <ng-container *ngIf="(user$ | async) as user">
          <div class="relative group cursor-pointer">
            <div class="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-electric-blue/30 px-2 pr-4 py-1.5 rounded-full transition-all">
              <div class="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-electric-blue to-premium-purple flex items-center justify-center p-0.5">
                <img *ngIf="user.photoURL" [src]="user.photoURL" class="w-full h-full rounded-full object-cover">
                <span *ngIf="!user.photoURL" class="text-white font-bold text-xs uppercase">{{ user.displayName.charAt(0) || user.email.charAt(0) || 'U' }}</span>
              </div>
              <span class="hidden md:block text-sm font-bold text-white tracking-wide">{{ user.displayName || 'Profile' }}</span>
              <svg class="hidden md:block w-4 h-4 text-gray-400 group-hover:text-cyan-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <!-- Dropdown Menu -->
            <div class="absolute right-0 top-full mt-2 w-48 bg-deep-space/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
              <div class="p-2 border-b border-white/5">
                <p class="text-xs text-cyan-accent font-bold px-2 uppercase tracking-widest truncate">{{ user.email }}</p>
              </div>
              <div class="p-2 space-y-1">
                <a routerLink="/dashboard" class="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">My Profile</a>
                <a routerLink="/settings" class="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">Settings</a>
              </div>
              <div class="p-2 border-t border-white/5">
                <button (click)="logout()" class="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors font-bold flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </ng-container>

      </div>
    </header>
  `
})
export class TopbarComponent {
  user$;
  theme$;
  currentLang$: any;

  constructor(private authService: AuthService, private router: Router, private themeService: ThemeService) {
    this.user$ = this.authService.currentUser$;
    this.theme$ = this.themeService.theme$;
    
    // Mocking lang for now since ngx-translate isn't wired up in app.config yet
    import('rxjs').then(rxjs => {
      this.currentLang$ = new rxjs.BehaviorSubject('en').asObservable();
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  setLang(lang: string) {
    // Will connect to TranslateService in next step
    console.log('Language changed to', lang);
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }
}
