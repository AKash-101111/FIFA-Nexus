import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, UserProfile } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-deep-black pt-24 px-6 pb-12">
      <div class="max-w-4xl mx-auto">
        <!-- Profile Header -->
        <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-royal-blue to-gold-accent"></div>
          
          <div class="w-32 h-32 rounded-full bg-gradient-to-tr from-royal-blue to-gold-accent p-1">
            <div class="w-full h-full rounded-full bg-deep-black flex items-center justify-center overflow-hidden">
              <img *ngIf="user?.photoURL" [src]="user?.photoURL" alt="Profile" class="w-full h-full object-cover">
              <span *ngIf="!user?.photoURL" class="text-4xl text-white font-bold uppercase">{{ user?.displayName?.charAt(0) || user?.email?.charAt(0) }}</span>
            </div>
          </div>
          
          <div class="flex-1 text-center md:text-left">
            <div class="inline-block px-3 py-1 bg-gold-accent/10 border border-gold-accent/30 text-gold-accent text-xs font-bold uppercase tracking-wider rounded-full mb-3">
              {{ user?.role || 'User' }}
            </div>
            <h1 class="text-3xl font-black text-white uppercase tracking-wider mb-2">{{ user?.displayName || 'Football Fan' }}</h1>
            <p class="text-gray-400 mb-6">{{ user?.email }}</p>
            
            <button (click)="logout()" class="px-6 py-2 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white rounded-sm font-bold uppercase tracking-wider transition-colors text-sm">
              Sign Out
            </button>
          </div>
        </div>

        <!-- Dashboard Widgets Mockup -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 class="text-white font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-gold-accent"></span> My Team
            </h3>
            <p class="text-gray-400 text-sm">No favorite team selected yet.</p>
          </div>
          
          <div class="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 class="text-white font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-royal-blue"></span> Saved Highlights
            </h3>
            <p class="text-gray-400 text-sm">You haven't saved any highlights.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: UserProfile | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(u => {
      this.user = u;
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }
}
