import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService, ThemeMode } from '../../core/services/theme.service';
import { AuthService, UserProfile } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-[1920px] mx-auto min-h-screen text-white">
      <h1 class="text-4xl font-display font-black tracking-tighter uppercase mb-8">Settings</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 class="text-xl font-bold mb-4 text-cyan-accent">Preferences</h2>
          
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <span>Dark Mode</span>
              <button (click)="toggleTheme()" [ngClass]="theme === 'dark' ? 'bg-cyan-accent' : 'bg-white/20'" class="w-12 h-6 rounded-full relative transition-colors duration-300">
                <div [ngClass]="theme === 'dark' ? 'right-1' : 'left-1'" class="w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300"></div>
              </button>
            </div>
            <div class="flex items-center justify-between">
              <span>Notifications</span>
              <button class="w-12 h-6 bg-cyan-accent rounded-full relative transition-colors duration-300">
                <div class="w-4 h-4 bg-white rounded-full absolute right-1 top-1 transition-all duration-300"></div>
              </button>
            </div>
            <div class="flex items-center justify-between">
              <span>Language</span>
              <select [(ngModel)]="currentLang" class="bg-black/50 border border-white/10 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-cyan-accent">
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </div>

        <div class="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 class="text-xl font-bold mb-4 text-cyan-accent">Account</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs text-gray-400 uppercase tracking-widest mb-1">Email</label>
              <div class="bg-black/50 px-4 py-2 rounded-lg text-gray-300">{{ user?.email || 'Guest User' }}</div>
            </div>
            <button (click)="logout()" class="px-6 py-2 bg-red-500/20 text-red-500 font-bold uppercase tracking-widest rounded-lg border border-red-500/30 hover:bg-red-500 hover:text-white transition-colors mt-4">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  theme: ThemeMode = 'dark';
  user: UserProfile | null = null;
  currentLang = 'en';

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.themeService.theme$.subscribe(t => this.theme = t);
    this.authService.currentUser$.subscribe(u => this.user = u);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }
}
