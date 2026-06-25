import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { MobileNavComponent } from './mobile-nav/mobile-nav.component';
import { CommandPaletteComponent } from '../shared/command-palette/command-palette.component';
import { StadiumBackgroundComponent } from './stadium-background/stadium-background.component';
import { routeAnimations } from '../../core/animations/route-animations';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent, MobileNavComponent, CommandPaletteComponent, StadiumBackgroundComponent],
  animations: [routeAnimations],
  template: `
    <div class="flex h-screen bg-deep-black text-white overflow-hidden selection:bg-royal-blue selection:text-white" style="perspective: 1000px;">
      <app-stadium-background></app-stadium-background>
      <!-- Desktop Sidebar -->
      <app-sidebar></app-sidebar>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col h-full overflow-hidden relative">
        <app-topbar></app-topbar>
        
        <main class="flex-1 overflow-y-auto custom-scrollbar relative pb-16 md:pb-0" [@routeAnimations]="prepareRoute(outlet)">
          <router-outlet #outlet="outlet"></router-outlet>
        </main>

        <app-mobile-nav></app-mobile-nav>
      </div>
      
      <!-- Global Command Palette -->
      <app-command-palette></app-command-palette>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 8px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
  `]
})
export class AppLayoutComponent {
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
