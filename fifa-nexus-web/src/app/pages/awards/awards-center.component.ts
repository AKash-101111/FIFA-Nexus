import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-awards-center',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-[1920px] mx-auto min-h-[calc(100vh-5rem)]">
      
      <!-- Hero -->
      <div class="glass-panel rounded-3xl p-12 mb-8 relative overflow-hidden flex flex-col items-center justify-center text-center group">
        <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-premium-purple/10 to-electric-blue/10"></div>
        <div class="absolute -right-20 -bottom-20 w-64 h-64 bg-yellow-500/20 rounded-full blur-[80px]"></div>
        
        <svg class="w-16 h-16 text-yellow-500 mb-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <h1 class="text-5xl md:text-7xl font-display font-black text-white uppercase tracking-widest mb-4 relative z-10">Digital Museum</h1>
        <p class="text-xl text-gray-300 max-w-2xl relative z-10">Explore the legends of the beautiful game. Hall of Fame, Ballon d'Or winners, and AI-generated legendary stories.</p>
      </div>

      <!-- Categories -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="glass-panel p-6 rounded-3xl hover:-translate-y-2 transition-transform cursor-pointer group border border-white/5 hover:border-yellow-500/50">
          <h2 class="text-white font-bold tracking-widest uppercase mb-2">Ballon d'Or</h2>
          <p class="text-sm text-gray-400">The most prestigious individual award.</p>
        </div>
        <div class="glass-panel p-6 rounded-3xl hover:-translate-y-2 transition-transform cursor-pointer group border border-white/5 hover:border-cyan-accent/50">
          <h2 class="text-white font-bold tracking-widest uppercase mb-2">Golden Boot</h2>
          <p class="text-sm text-gray-400">Top goalscorers of the generation.</p>
        </div>
        <div class="glass-panel p-6 rounded-3xl hover:-translate-y-2 transition-transform cursor-pointer group border border-white/5 hover:border-electric-blue/50">
          <h2 class="text-white font-bold tracking-widest uppercase mb-2">Best XI</h2>
          <p class="text-sm text-gray-400">Team of the Year archives.</p>
        </div>
        <div class="glass-panel p-6 rounded-3xl hover:-translate-y-2 transition-transform cursor-pointer group border border-white/5 hover:border-premium-purple/50">
          <h2 class="text-white font-bold tracking-widest uppercase mb-2">Hall of Fame</h2>
          <p class="text-sm text-gray-400">Immortal legends of football.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Interactive Timeline -->
        <div class="lg:col-span-2 glass-panel rounded-3xl p-8 relative overflow-hidden">
          <div class="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-black/80 to-transparent z-10 pointer-events-none"></div>
          
          <h2 class="text-white font-bold tracking-widest uppercase text-sm mb-8">Ballon d'Or Winners Timeline</h2>
          
          <div class="flex gap-6 overflow-x-auto pb-8 custom-scrollbar relative">
            <div class="absolute top-1/2 left-0 w-max h-[2px] bg-white/10 -translate-y-1/2"></div>
            
            <!-- Timeline Nodes -->
            <div *ngFor="let year of [2024, 2023, 2022, 2021, 2019]" class="flex flex-col items-center justify-center shrink-0 w-48 relative z-20 group">
              <div class="text-[10px] text-gray-500 font-bold mb-4">{{ year }}</div>
              <div class="w-20 h-20 rounded-full border-4 border-black group-hover:border-yellow-500 transition-colors bg-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100" class="w-full h-full object-cover">
              </div>
              <div class="text-sm text-white font-bold mt-4">L. Messi</div>
              <div class="text-xs text-yellow-500">Inter Miami</div>
            </div>
            
            <div class="flex flex-col items-center justify-center shrink-0 w-48 relative z-20 group">
              <div class="text-[10px] text-gray-500 font-bold mb-4">2026 Prediction</div>
              <div class="w-20 h-20 rounded-full border-4 border-dashed border-cyan-accent bg-white/10 flex items-center justify-center overflow-hidden animate-pulse">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" class="w-8 h-8 filter grayscale invert opacity-50">
              </div>
              <div class="text-sm text-white font-bold mt-4">Ask Gemini</div>
            </div>
            
            <div class="w-32 shrink-0"></div> <!-- padding -->
          </div>
        </div>

        <!-- AI Generated Stories -->
        <div class="glass-panel rounded-3xl p-8 relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-electric-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div class="flex items-center gap-3 mb-6 relative z-10">
            <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" class="w-5 h-5 filter grayscale invert opacity-80">
            </div>
            <h2 class="text-white font-bold tracking-widest uppercase text-sm">Legendary Stories</h2>
          </div>
          
          <div class="space-y-6 relative z-10">
            <div class="bg-black/40 p-4 rounded-xl border border-white/5 hover:border-cyan-accent/50 transition-colors cursor-pointer">
              <h3 class="text-sm text-cyan-accent font-bold mb-2">The Miracle of Istanbul</h3>
              <p class="text-xs text-gray-400 leading-relaxed line-clamp-3">
                Generated by Gemini: In 2005, Liverpool faced AC Milan in the Champions League final. Down 3-0 at half-time, what followed was six minutes of madness...
              </p>
            </div>
            <div class="bg-black/40 p-4 rounded-xl border border-white/5 hover:border-cyan-accent/50 transition-colors cursor-pointer">
              <h3 class="text-sm text-electric-blue font-bold mb-2">Agüerooooo! (2012)</h3>
              <p class="text-xs text-gray-400 leading-relaxed line-clamp-3">
                Generated by Gemini: The clock ticked past 93 minutes. Manchester City needed a goal to win their first Premier League title...
              </p>
            </div>
          </div>
          
          <button class="w-full mt-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white uppercase tracking-widest border border-white/10 hover:border-cyan-accent/50 transition-colors relative z-10">
            Generate New Story
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,194,255,0.5); }
  `]
})
export class AwardsCenterComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
