import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="md:hidden fixed bottom-0 left-0 w-full h-16 bg-deep-space/95 backdrop-blur-xl border-t border-white/10 z-50 px-2 flex justify-between items-center pb-safe">
      <a *ngFor="let item of navItems" 
         [routerLink]="item.path"
         routerLinkActive="text-cyan-accent"
         [routerLinkActiveOptions]="{exact: item.exact}"
         class="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-white transition-colors relative">
         <svg class="w-6 h-6 mb-1 transition-all duration-300" [innerHTML]="item.icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"></svg>
         <span class="text-[10px] font-bold uppercase tracking-wider">{{ item.label }}</span>
      </a>
    </nav>
  `,
  styles: [`
    /* pb-safe is used for iOS home indicator */
    .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
    /* active states animate the svg up */
    a.text-cyan-accent svg { transform: translateY(-2px) scale(1.1); filter: drop-shadow(0 0 8px rgba(0,194,255,0.6)); }
  `]
})
export class MobileNavComponent {
  navItems = [
    { label: 'Home', path: '/dashboard', exact: true, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />' },
    { label: 'Live', path: '/live', exact: false, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />' },
    { label: 'Fantasy', path: '/fantasy', exact: false, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />' },
    { label: 'AI', path: '/ai-insights', exact: false, icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />' },
  ];
}
