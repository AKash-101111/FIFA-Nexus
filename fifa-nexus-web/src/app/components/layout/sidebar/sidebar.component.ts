import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SafeHtmlPipe } from '../../../core/pipes/safe-html.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, SafeHtmlPipe],
  template: `
    <aside class="hidden md:flex flex-col w-64 h-screen bg-deep-space/90 backdrop-blur-2xl border-r border-white/5 sticky top-0 left-0 z-40 transition-all duration-300">
      
      <!-- Logo Area -->
      <div class="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
        <a routerLink="/dashboard" class="flex items-center gap-3 group w-full">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-electric-blue to-cyan-accent flex items-center justify-center shadow-[0_0_20px_rgba(0,194,255,0.4)] group-hover:scale-105 transition-transform duration-300">
            <span class="text-white font-black text-sm tracking-tighter">FN</span>
          </div>
          <span class="text-lg font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Nexus</span>
        </a>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 overflow-y-auto custom-scrollbar py-6 px-4 space-y-1">
        <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-3">Platform</div>
        
        <ng-container *ngFor="let item of navItems">
          <a [routerLink]="item.path" 
             routerLinkActive="bg-white/10 text-white border-l-2 border-cyan-accent shadow-[inset_4px_0_10px_rgba(0,194,255,0.1)]" 
             [routerLinkActiveOptions]="{exact: item.exact}"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 group">
            <svg class="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:text-cyan-accent transition-all" [innerHTML]="item.icon | safeHtml" viewBox="0 0 24 24" fill="none" stroke="currentColor"></svg>
            <span class="tracking-wide">{{ item.label }}</span>
          </a>
        </ng-container>

        <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-8 mb-3 px-3">Intelligence</div>

        <ng-container *ngFor="let item of intelligenceItems">
          <a [routerLink]="item.path" 
             routerLinkActive="bg-white/10 text-white border-l-2 border-premium-purple shadow-[inset_4px_0_10px_rgba(124,58,237,0.1)]" 
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 group">
            <svg class="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:text-premium-purple transition-all" [innerHTML]="item.icon | safeHtml" viewBox="0 0 24 24" fill="none" stroke="currentColor"></svg>
            <span class="tracking-wide">{{ item.label }}</span>
          </a>
        </ng-container>
      </nav>

      <!-- Bottom User/Settings Area -->
      <div class="p-4 border-t border-white/5 shrink-0">
        <a routerLink="/settings" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors group">
          <svg class="w-5 h-5 opacity-70 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="tracking-wide">Settings</span>
        </a>
      </div>
    </aside>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 3px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
  `]
})
export class SidebarComponent {
  navItems = [
    { label: 'Dashboard', path: '/dashboard', exact: true, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />' },
    { label: 'Live World Cup', path: '/live', exact: false, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />' },
    { label: 'Groups', path: '/groups', exact: false, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />' },
    { label: 'Fixtures', path: '/fixtures', exact: false, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />' },
    { label: 'Knockout', path: '/knockout', exact: false, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />' },
    { label: 'Teams', path: '/teams', exact: false, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />' },
    { label: 'Players', path: '/players', exact: false, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />' },
  ];

  intelligenceItems = [
    { label: 'AI Workspace', path: '/ai-workspace', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />' },
    { label: 'Analytics', path: '/analytics', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />' },
    { label: 'Fantasy League', path: '/fantasy', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />' },
    { label: 'Highlights', path: '/highlights', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />' },
  ];
}
