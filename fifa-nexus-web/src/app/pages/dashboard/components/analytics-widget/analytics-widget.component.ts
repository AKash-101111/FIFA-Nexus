import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-panel rounded-3xl p-6 h-full flex flex-col hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(59,130,246,0.2)] transition-all duration-500 group relative overflow-hidden">
      <div class="flex justify-between items-center mb-6 relative z-10">
        <h2 class="font-display text-xl font-bold uppercase tracking-widest text-white">Team Analytics</h2>
        <svg class="w-5 h-5 text-gray-400 group-hover:text-electric-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>

      <div class="flex-1 flex items-center justify-center relative z-10">
        <div class="w-full space-y-4">
          <!-- Stat Bar 1 -->
          <div>
            <div class="flex justify-between text-xs text-gray-400 uppercase tracking-widest mb-1">
              <span>Possession</span>
              <span class="text-white font-bold">62%</span>
            </div>
            <div class="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
              <div class="bg-gradient-to-r from-royal-blue to-blue-400 h-1.5 rounded-full" style="width: 62%"></div>
            </div>
          </div>
          <!-- Stat Bar 2 -->
          <div>
            <div class="flex justify-between text-xs text-gray-400 uppercase tracking-widest mb-1">
              <span>Expected Goals (xG)</span>
              <span class="text-white font-bold">2.4</span>
            </div>
            <div class="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
              <div class="bg-gradient-to-r from-electric-blue to-cyan-accent h-1.5 rounded-full" style="width: 75%"></div>
            </div>
          </div>
          <!-- Stat Bar 3 -->
          <div>
            <div class="flex justify-between text-xs text-gray-400 uppercase tracking-widest mb-1">
              <span>Pass Accuracy</span>
              <span class="text-white font-bold">89%</span>
            </div>
            <div class="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
              <div class="bg-gradient-to-r from-green-600 to-green-400 h-1.5 rounded-full" style="width: 89%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AnalyticsWidgetComponent {}
