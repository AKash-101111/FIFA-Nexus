import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-visualizations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="my-4 p-4 rounded-xl bg-black/40 border border-white/5 shadow-inner">
      
      <!-- Win Probability -->
      <div *ngIf="type === 'win-probability'">
        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Win Probability</h4>
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-cyan-accent font-bold">{{ data.homeTeam }}</span>
              <span class="text-white font-bold">{{ data.homeProb }}%</span>
            </div>
            <div class="w-full bg-white/10 rounded-full h-2">
              <div class="bg-cyan-accent h-2 rounded-full" [style.width]="data.homeProb + '%'"></div>
            </div>
          </div>
          <div class="text-xs text-gray-500 font-bold">DRAW {{ data.drawProb }}%</div>
          <div class="flex-1">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-premium-purple font-bold">{{ data.awayTeam }}</span>
              <span class="text-white font-bold">{{ data.awayProb }}%</span>
            </div>
            <div class="w-full bg-white/10 rounded-full h-2">
              <div class="bg-premium-purple h-2 rounded-full" [style.width]="data.awayProb + '%'"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Radar Chart (Mocked CSS) -->
      <div *ngIf="type === 'radar-chart'" class="flex flex-col items-center">
        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 w-full text-left">Player Strengths Matrix</h4>
        <div class="relative w-48 h-48 border border-white/10 rounded-full flex items-center justify-center">
          <div class="absolute w-32 h-32 border border-white/10 rounded-full"></div>
          <div class="absolute w-16 h-16 border border-white/10 rounded-full"></div>
          
          <!-- Axes -->
          <div class="absolute w-full h-[1px] bg-white/10 rotate-0"></div>
          <div class="absolute w-full h-[1px] bg-white/10 rotate-45"></div>
          <div class="absolute w-full h-[1px] bg-white/10 rotate-90"></div>
          <div class="absolute w-full h-[1px] bg-white/10 rotate-[135deg]"></div>

          <!-- Shape -->
          <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <polygon points="50,10 80,30 90,60 60,90 20,70 15,35" fill="rgba(0,194,255,0.3)" stroke="#00c2ff" stroke-width="2" />
          </svg>
          
          <span class="absolute -top-4 text-[10px] text-gray-400">Pace</span>
          <span class="absolute -bottom-4 text-[10px] text-gray-400">Defense</span>
          <span class="absolute -left-6 text-[10px] text-gray-400">Passing</span>
          <span class="absolute -right-6 text-[10px] text-gray-400">Shooting</span>
        </div>
      </div>

    </div>
  `
})
export class AiVisualizationsComponent implements OnInit {
  @Input() type: 'win-probability' | 'radar-chart' | 'none' = 'none';
  @Input() data: any = {};

  constructor() {}
  ngOnInit() {}
}
