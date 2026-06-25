import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NexusDataService, Player, Team } from '../../core/services/nexus-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fantasy-league',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-[1920px] mx-auto min-h-[calc(100vh-5rem)] flex flex-col gap-6">
      
      <!-- Top Bar: Budget & Live Points -->
      <div class="glass-panel rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-r from-premium-purple/10 via-electric-blue/5 to-cyan-accent/10 opacity-50"></div>
        
        <div class="flex items-center gap-6 relative z-10">
          <div class="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Remaining Budget</span>
            <div class="flex items-baseline gap-1">
              <span class="text-4xl font-display font-black text-white">12.5</span>
              <span class="text-xl text-gray-400 font-bold">M</span>
            </div>
            <div class="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div class="bg-gradient-to-r from-electric-blue to-cyan-accent h-full w-[87.5%]"></div>
            </div>
          </div>
        </div>

        <div class="flex gap-8 relative z-10">
          <div class="flex flex-col items-center">
            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Gameweek 12</span>
            <span class="text-3xl font-display font-black text-white">84</span>
            <span class="text-xs text-green-400 font-bold">+12 avg</span>
          </div>
          <div class="w-[1px] h-12 bg-white/10 self-center"></div>
          <div class="flex flex-col items-center">
            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Global Rank</span>
            <span class="text-3xl font-display font-black text-white">24K</span>
            <span class="text-xs text-green-400 font-bold flex items-center"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> 5.2K</span>
          </div>
        </div>

        <div class="relative z-10">
          <button class="px-8 py-3 rounded-full bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">Save Team</button>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="flex-1 flex flex-col xl:flex-row gap-6">
        
        <!-- Left Sidebar: Player Selection & Leaderboard -->
        <div class="w-full xl:w-80 flex flex-col gap-6 shrink-0">
          <!-- Player Search -->
          <div class="glass-panel rounded-3xl p-5 flex flex-col h-[400px]">
             <h2 class="text-white font-bold tracking-widest uppercase mb-4 text-sm">Transfer Market</h2>
             <div class="relative mb-4">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="filterPlayers()" placeholder="Search players..." class="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-accent transition-colors">
             </div>
             
             <!-- Filter Tabs -->
             <div class="flex gap-2 mb-4 overflow-x-auto hide-scroll">
               <button (click)="setPosition('')" [ngClass]="posFilter === '' ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">All</button>
               <button (click)="setPosition('FW')" [ngClass]="posFilter === 'FW' ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">FWD</button>
               <button (click)="setPosition('MF')" [ngClass]="posFilter === 'MF' ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">MID</button>
               <button (click)="setPosition('DF')" [ngClass]="posFilter === 'DF' ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">DEF</button>
               <button (click)="setPosition('GK')" [ngClass]="posFilter === 'GK' ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">GK</button>
             </div>

             <!-- Player List -->
             <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
               <div *ngIf="filteredPlayers.length === 0" class="text-xs text-gray-500 text-center py-4">No players found</div>
               
               <div *ngFor="let p of filteredPlayers" class="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 cursor-pointer transition-colors group">
                 <div class="flex items-center gap-3 w-2/3">
                   <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white shrink-0 overflow-hidden shadow-[inset_0_0_5px_rgba(255,255,255,0.2)]">
                     {{ getTeam(p.teamId)?.flag }}
                   </div>
                   <div class="flex flex-col truncate">
                     <span class="text-sm font-bold text-white group-hover:text-cyan-accent transition-colors truncate">{{ p.name }}</span>
                     <span class="text-[10px] text-gray-500 uppercase">{{ getTeam(p.teamId)?.shortName }} • {{ p.position }}</span>
                   </div>
                 </div>
                 <div class="flex flex-col items-end shrink-0">
                   <span class="text-sm font-bold text-white">{{ getPrice(p) }}M</span>
                   <span class="text-[10px] text-green-400">{{ getPoints(p) }} pts</span>
                 </div>
               </div>
             </div>
          </div>

          <!-- Mini Leaderboard -->
          <div class="glass-panel rounded-3xl p-5 flex-1 min-h-[250px]">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-white font-bold tracking-widest uppercase text-sm">Mini League</h2>
              <button class="text-[10px] text-cyan-accent font-bold uppercase hover:text-white transition-colors">View All</button>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-400 font-bold w-4">1</span>
                <span class="text-white font-bold flex-1 ml-3">Akash FC</span>
                <span class="text-cyan-accent font-bold">1,402</span>
              </div>
              <div class="flex items-center justify-between text-xs bg-white/10 p-2 rounded-lg border border-white/10">
                <span class="text-cyan-accent font-bold w-4">2</span>
                <span class="text-white font-bold flex-1 ml-3">Nexus United (You)</span>
                <span class="text-cyan-accent font-bold">1,385</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-400 font-bold w-4">3</span>
                <span class="text-white font-bold flex-1 ml-3">Madridista 99</span>
                <span class="text-cyan-accent font-bold">1,340</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Center: Squad Builder Pitch -->
        <div class="flex-1 glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col">
          <div class="flex justify-between items-center mb-6 relative z-10">
             <h2 class="text-white font-bold tracking-widest uppercase text-sm">Your Squad (4-3-3)</h2>
             <button class="text-xs text-gray-400 hover:text-white uppercase tracking-widest font-bold transition-colors">Change Formation</button>
          </div>

          <div class="flex-1 relative w-full rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center bg-green-900/30 pitch-bg">
             
             <!-- 3D Stadium Overlay (Mocked) -->
             <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"></div>
             <div class="absolute w-full h-[1px] bg-white/20 top-1/2 left-0 pointer-events-none"></div>
             <div class="absolute w-32 h-32 rounded-full border border-white/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

             <!-- Players Grid -->
             <div class="absolute inset-4 flex flex-col justify-between py-8">
               
               <!-- Attackers -->
               <div class="flex justify-center gap-12 sm:gap-24">
                 <div class="player-slot group">
                   <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 border-2 border-white/30 mb-2 flex items-center justify-center font-bold text-white cursor-pointer group-hover:border-cyan-accent transition-colors">VJ</div>
                   <div class="bg-black/80 px-2 py-1 rounded text-[10px] text-white font-bold tracking-wider text-center border border-white/10 group-hover:border-cyan-accent">V. JÚNIOR <span class="text-cyan-accent block text-[8px] mt-0.5">11.5M</span></div>
                 </div>
                 <div class="player-slot group relative">
                   <div class="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-electric-blue text-white flex items-center justify-center text-[10px] font-black z-10 border-2 border-black">C</div>
                   <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 border-2 border-electric-blue mb-2 flex items-center justify-center font-bold text-white cursor-pointer group-hover:border-white transition-colors shadow-[0_0_15px_rgba(59,130,246,0.5)]">LM</div>
                   <div class="bg-black/80 px-2 py-1 rounded text-[10px] text-white font-bold tracking-wider text-center border border-electric-blue">MESSI <span class="text-cyan-accent block text-[8px] mt-0.5">14.0M</span></div>
                 </div>
                 <div class="player-slot group">
                   <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 border-2 border-white/30 mb-2 flex items-center justify-center font-bold text-white cursor-pointer group-hover:border-cyan-accent transition-colors">KM</div>
                   <div class="bg-black/80 px-2 py-1 rounded text-[10px] text-white font-bold tracking-wider text-center border border-white/10 group-hover:border-cyan-accent">MBAPPÉ <span class="text-cyan-accent block text-[8px] mt-0.5">13.5M</span></div>
                 </div>
               </div>

               <!-- Midfielders -->
               <div class="flex justify-center gap-8 sm:gap-20">
                 <div class="player-slot group">
                   <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 border-2 border-white/30 mb-2 flex items-center justify-center cursor-pointer group-hover:border-cyan-accent transition-colors font-bold text-white">JB</div>
                   <div class="bg-black/80 px-2 py-1 rounded text-[10px] text-white font-bold tracking-wider text-center border border-white/10 group-hover:border-cyan-accent">BELLINGHAM <span class="text-cyan-accent block text-[8px] mt-0.5">10.0M</span></div>
                 </div>
                 <div class="player-slot group">
                   <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 border-2 border-white/30 mb-2 flex items-center justify-center cursor-pointer group-hover:border-cyan-accent transition-colors font-bold text-white">EP</div>
                   <div class="bg-black/80 px-2 py-1 rounded text-[10px] text-white font-bold tracking-wider text-center border border-white/10 group-hover:border-cyan-accent">ENZO <span class="text-cyan-accent block text-[8px] mt-0.5">8.0M</span></div>
                 </div>
                 <div class="player-slot group">
                   <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 border-2 border-white/30 mb-2 flex items-center justify-center cursor-pointer group-hover:border-cyan-accent transition-colors font-bold text-white">EC</div>
                   <div class="bg-black/80 px-2 py-1 rounded text-[10px] text-white font-bold tracking-wider text-center border border-white/10 group-hover:border-cyan-accent">CAMAVINGA <span class="text-cyan-accent block text-[8px] mt-0.5">7.5M</span></div>
                 </div>
               </div>

               <!-- Defenders -->
               <div class="flex justify-center gap-6 sm:gap-12">
                 <div class="player-slot group">
                   <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 border-2 border-white/30 mb-2 flex items-center justify-center cursor-pointer group-hover:border-cyan-accent transition-colors font-bold text-white">AD</div>
                   <div class="bg-black/80 px-2 py-1 rounded text-[10px] text-white font-bold tracking-wider text-center border border-white/10 group-hover:border-cyan-accent">DAVIES <span class="text-cyan-accent block text-[8px] mt-0.5">6.5M</span></div>
                 </div>
                 <div class="player-slot group">
                   <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 border-2 border-white/30 mb-2 flex items-center justify-center cursor-pointer group-hover:border-cyan-accent transition-colors font-bold text-white">WM</div>
                   <div class="bg-black/80 px-2 py-1 rounded text-[10px] text-white font-bold tracking-wider text-center border border-white/10 group-hover:border-cyan-accent">MARQUINHOS <span class="text-cyan-accent block text-[8px] mt-0.5">6.0M</span></div>
                 </div>
                 <div class="player-slot group relative">
                   <div class="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-gray-500 text-white flex items-center justify-center text-[10px] font-black z-10 border-2 border-black">V</div>
                   <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 border-2 border-gray-400 mb-2 flex items-center justify-center cursor-pointer group-hover:border-cyan-accent transition-colors font-bold text-white">WS</div>
                   <div class="bg-black/80 px-2 py-1 rounded text-[10px] text-white font-bold tracking-wider text-center border border-gray-400">SALIBA <span class="text-cyan-accent block text-[8px] mt-0.5">5.5M</span></div>
                 </div>
                 <div class="player-slot group">
                   <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 border-2 border-white/30 mb-2 flex items-center justify-center cursor-pointer group-hover:border-cyan-accent transition-colors font-bold text-white">TH</div>
                   <div class="bg-black/80 px-2 py-1 rounded text-[10px] text-white font-bold tracking-wider text-center border border-white/10 group-hover:border-cyan-accent">HERNÁNDEZ <span class="text-cyan-accent block text-[8px] mt-0.5">6.0M</span></div>
                 </div>
               </div>

               <!-- Goalkeeper -->
               <div class="flex justify-center">
                 <div class="player-slot group">
                   <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/10 border-2 border-yellow-500/50 mb-2 flex items-center justify-center cursor-pointer group-hover:border-cyan-accent transition-colors font-bold text-white">EM</div>
                   <div class="bg-black/80 px-2 py-1 rounded text-[10px] text-white font-bold tracking-wider text-center border border-yellow-500/50">MARTÍNEZ <span class="text-cyan-accent block text-[8px] mt-0.5">6.0M</span></div>
                 </div>
               </div>

             </div>
          </div>
        </div>

        <!-- Right Sidebar: AI Advisor -->
        <div class="w-full xl:w-80 flex flex-col gap-6 shrink-0">
          <div class="glass-panel rounded-3xl p-6 flex-1 relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-br from-electric-blue/10 to-premium-purple/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div class="flex items-center gap-3 mb-6 relative z-10">
              <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" class="w-5 h-5 filter grayscale invert opacity-80">
              </div>
              <h2 class="text-white font-bold tracking-widest uppercase text-sm">AI Advisor</h2>
            </div>
            
            <div class="space-y-6 relative z-10">
              <div>
                <h3 class="text-[10px] text-cyan-accent font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Captain Suggestion</h3>
                <p class="text-sm text-gray-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                  <strong class="text-white">L. Messi</strong> has an expected goals (xG) of 1.2 per 90 in the group stage. Highly recommended for GW3 captaincy.
                </p>
              </div>
              
              <div>
                <h3 class="text-[10px] text-premium-purple font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> Transfer Tip</h3>
                <p class="text-sm text-gray-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                  Consider transferring out <span class="line-through text-gray-500">Neymar</span> (injured) for <strong class="text-white">K. Mbappé</strong>. France has a favorable run of fixtures.
                </p>
              </div>
            </div>

            <button class="w-full mt-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white uppercase tracking-widest border border-white/10 hover:border-cyan-accent/50 transition-colors relative z-10">
              Ask Gemini For Advice
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .hide-scroll::-webkit-scrollbar { display: none; }
    .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,194,255,0.5); }
    
    .pitch-bg {
      background-size: 40px 40px;
      background-image: 
        linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
    }
    
    .player-slot {
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.2s ease;
    }
    .player-slot:hover {
      transform: translateY(-5px);
    }
  `]
})
export class FantasyLeagueComponent implements OnInit, OnDestroy {
  allPlayers: Player[] = [];
  filteredPlayers: Player[] = [];
  teams: Team[] = [];
  
  searchQuery = '';
  posFilter = '';

  private pSub?: Subscription;
  private tSub?: Subscription;

  constructor(private dataService: NexusDataService) {}

  ngOnInit() {
    this.tSub = this.dataService.teams$.subscribe(t => this.teams = t);
    this.pSub = this.dataService.players$.subscribe(p => {
      this.allPlayers = [...p].sort((a, b) => b.rating - a.rating);
      this.filterPlayers();
    });
  }

  ngOnDestroy() {
    if (this.pSub) this.pSub.unsubscribe();
    if (this.tSub) this.tSub.unsubscribe();
  }

  getTeam(id: string): Team | undefined {
    return this.teams.find(t => t.id === id);
  }

  getPrice(player: Player): string {
    return ((player.rating / 100) * 15).toFixed(1);
  }

  getPoints(player: Player): number {
    return Math.floor((player.rating / 100) * 100);
  }

  setPosition(pos: string) {
    this.posFilter = pos;
    this.filterPlayers();
  }

  filterPlayers() {
    this.filteredPlayers = this.allPlayers.filter(p => {
      const matchPos = !this.posFilter || p.position === this.posFilter;
      const matchSearch = !this.searchQuery.trim() || 
                          p.name.toLowerCase().includes(this.searchQuery.toLowerCase().trim()) ||
                          this.getTeam(p.teamId)?.name.toLowerCase().includes(this.searchQuery.toLowerCase().trim());
      return matchPos && matchSearch;
    });
  }
}
