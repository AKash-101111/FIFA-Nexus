import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-live-match-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-[1920px] mx-auto min-h-[calc(100vh-5rem)] bg-[#050816]">
      
      <!-- Top Navigation / Header -->
      <button (click)="goBack()" class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group">
        <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span class="font-bold uppercase tracking-widest text-xs">Back to Live Center</span>
      </button>

      <!-- Match Header -->
      <div class="glass-panel rounded-3xl p-8 mb-6 relative overflow-hidden border border-[#00BFFF]/20">
        <div class="absolute inset-0 bg-gradient-to-r from-[#00BFFF]/5 via-transparent to-red-500/5"></div>
        <div class="flex flex-col items-center justify-center relative z-10">
          <span class="text-xs font-bold text-[#00BFFF] uppercase tracking-widest mb-6">FIFA World Cup 2026 • Group Stage</span>
          
          <div class="flex items-center gap-8 md:gap-16">
            <div class="flex flex-col items-center gap-4">
              <div class="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-bold text-white shadow-[0_0_30px_rgba(0,191,255,0.2)]">BRA</div>
              <span class="font-bold text-lg text-white">Brazil</span>
            </div>
            
            <div class="flex flex-col items-center">
              <span class="text-xs bg-red-500 text-white px-3 py-1 rounded shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse font-bold tracking-widest mb-4">LIVE 67'</span>
              <div class="text-6xl font-display font-black text-white tracking-wider">2 - 1</div>
            </div>
            
            <div class="flex flex-col items-center gap-4">
              <div class="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-bold text-white shadow-[0_0_30px_rgba(0,191,255,0.2)]">ENG</div>
              <span class="font-bold text-lg text-white">England</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left: Match Events & Timeline -->
        <div class="glass-panel rounded-3xl p-6 flex flex-col h-[600px] border border-white/5">
          <h2 class="text-white font-bold tracking-widest uppercase mb-6 text-sm">Match Timeline</h2>
          <div class="flex-1 overflow-y-auto custom-scrollbar relative pl-4 border-l border-white/10 space-y-6">
            
            <div class="relative">
              <div class="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#00BFFF]"></div>
              <div class="text-[10px] text-gray-500 font-bold mb-1">64'</div>
              <div class="text-sm text-white font-bold">Goal! Brazil</div>
              <div class="text-xs text-[#00BFFF]">Vinícius Júnior</div>
            </div>

            <div class="relative">
              <div class="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
              <div class="text-[10px] text-gray-500 font-bold mb-1">42'</div>
              <div class="text-sm text-white font-bold">Yellow Card</div>
              <div class="text-xs text-yellow-500">Declan Rice</div>
            </div>

            <div class="relative">
              <div class="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-white"></div>
              <div class="text-[10px] text-gray-500 font-bold mb-1">12'</div>
              <div class="text-sm text-white font-bold">Goal! England</div>
              <div class="text-xs text-gray-400">Harry Kane</div>
            </div>
            
          </div>
        </div>

        <!-- Center: Stats & Visualizations -->
        <div class="lg:col-span-2 flex flex-col gap-6">
          <div class="glass-panel rounded-3xl p-6 border border-white/5">
            <h2 class="text-white font-bold tracking-widest uppercase mb-6 text-sm">Momentum Graph</h2>
            <div class="h-40 flex items-end justify-between border-b border-white/10 pb-2 relative gap-1">
              <div class="w-full bg-[#00BFFF]/20 rounded-t-sm relative group cursor-pointer" style="height: 20%"></div>
              <div class="w-full bg-red-500/20 rounded-t-sm" style="height: 40%"></div>
              <div class="w-full bg-red-500/40 rounded-t-sm" style="height: 70%"></div>
              <div class="w-full bg-[#00BFFF]/60 rounded-t-sm shadow-[0_0_10px_rgba(0,191,255,0.5)]" style="height: 90%"></div>
              <div class="w-full bg-[#00BFFF]/80 rounded-t-sm shadow-[0_0_10px_rgba(0,191,255,0.5)]" style="height: 100%"></div>
              <!-- Center line -->
              <div class="absolute w-full h-[1px] bg-white/20 top-1/2 left-0"></div>
            </div>
            <div class="flex justify-between mt-2 text-[10px] text-gray-500 font-bold">
              <span>0'</span><span>15'</span><span>30'</span><span>45'</span><span>60'</span><span>LIVE</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="glass-panel rounded-3xl p-6 border border-white/5">
              <h2 class="text-white font-bold tracking-widest uppercase mb-6 text-sm">Key Stats</h2>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-xs mb-1 font-bold"><span class="text-[#00BFFF]">55%</span><span class="text-gray-400">Possession</span><span class="text-white">45%</span></div>
                  <div class="w-full flex h-1.5 rounded-full overflow-hidden bg-black/50"><div class="bg-[#00BFFF] w-[55%]"></div><div class="bg-gray-600 w-[45%]"></div></div>
                </div>
                <div>
                  <div class="flex justify-between text-xs mb-1 font-bold"><span class="text-[#00BFFF]">12</span><span class="text-gray-400">Shots</span><span class="text-white">8</span></div>
                  <div class="w-full flex h-1.5 rounded-full overflow-hidden bg-black/50"><div class="bg-[#00BFFF] w-[60%]"></div><div class="bg-gray-600 w-[40%]"></div></div>
                </div>
              </div>
            </div>

            <div class="glass-panel rounded-3xl p-6 relative overflow-hidden group border border-[#FFD700]/20 bg-gradient-to-br from-[#0A1024] to-[#070B1A]">
              <div class="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="flex items-center gap-3 mb-4">
                <svg class="w-5 h-5 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h2 class="text-white font-bold tracking-widest uppercase text-sm">Gemini Insight</h2>
              </div>
              <p class="text-sm text-gray-300 leading-relaxed mb-4">
                Brazil has generated 2.4 xG and controls midfield transitions. England's pressing intensity dropped significantly after the 60th minute.
              </p>
              <button class="text-xs text-[#00BFFF] font-bold uppercase tracking-widest hover:text-white transition-colors">Generate More</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .glass-panel {
      background: rgba(10, 16, 36, 0.6);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,191,255,0.5); }
  `]
})
export class LiveMatchDetailComponent implements OnInit {
  matchId: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.matchId = this.route.snapshot.paramMap.get('id');
  }

  goBack() {
    this.router.navigate(['/live-center']);
  }
}
