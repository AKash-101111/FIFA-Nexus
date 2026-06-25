import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fantasy-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-panel rounded-3xl p-6 h-full flex flex-col hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(124,58,237,0.2)] transition-all duration-500 relative overflow-hidden group">
      <!-- Glow effect -->
      <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-premium-purple/10 rounded-full blur-[50px] group-hover:bg-premium-purple/20 transition-all duration-500"></div>

      <div class="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h2 class="font-display text-xl font-bold uppercase tracking-widest text-white">Fantasy Hub</h2>
          <p class="text-xs text-gray-400 mt-1 uppercase tracking-wider">Nexus Global League</p>
        </div>
        <div class="text-right">
          <p class="text-3xl font-display font-black text-premium-purple drop-shadow-md">142</p>
          <p class="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Points</p>
        </div>
      </div>

      <div class="flex-1 relative z-10 flex flex-col justify-end">
        <div class="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-premium-purple/30 transition-colors cursor-pointer">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full overflow-hidden bg-white/10 border-2 border-premium-purple">
              <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=100&auto=format&fit=crop" class="w-full h-full object-cover">
            </div>
            <div>
              <p class="text-sm font-bold text-white tracking-wide">Top Performer</p>
              <p class="text-xs text-premium-purple font-bold">V. Júnior <span class="text-gray-500 font-normal ml-1">12 pts</span></p>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-500 group-hover:text-premium-purple transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  `
})
export class FantasyWidgetComponent {}
