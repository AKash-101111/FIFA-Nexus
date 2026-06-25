import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NexusDataService, Player, Team } from '../../core/services/nexus-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-[1920px] mx-auto min-h-screen text-white">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 class="text-4xl font-display font-black tracking-tighter uppercase mb-2">Player Database</h1>
          <p class="text-gray-400 uppercase tracking-widest text-sm">World Cup 2026 Roster</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div class="w-full sm:w-64">
            <select [(ngModel)]="positionFilter" (ngModelChange)="filterPlayers()" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-accent focus:bg-black/60 transition-colors">
              <option value="">ALL POSITIONS</option>
              <option value="FW">FORWARDS</option>
              <option value="MF">MIDFIELDERS</option>
              <option value="DF">DEFENDERS</option>
              <option value="GK">GOALKEEPERS</option>
            </select>
          </div>
          <div class="w-full sm:w-72">
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="filterPlayers()" placeholder="SEARCH PLAYERS..." class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-accent focus:bg-black/60 transition-all duration-300">
          </div>
        </div>
      </div>
      
      <div *ngIf="filteredPlayers.length === 0" class="text-center py-12 text-gray-500 uppercase tracking-widest">
        No players found matching your criteria.
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6">
        <div *ngFor="let player of filteredPlayers" class="glass-panel border border-white/5 rounded-2xl overflow-hidden hover:border-gold-accent/50 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)] transition-all cursor-pointer group flex flex-col">
          <div class="h-40 bg-gradient-to-t from-deep-space to-transparent relative flex items-end justify-center">
            <!-- Team Flag background subtle -->
            <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] text-9xl overflow-hidden pointer-events-none">{{ getTeam(player.teamId)?.flag }}</div>
            <div class="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors"></div>
            <span class="text-6xl font-bold text-white/20 absolute bottom-0 mb-4 font-display">{{ player.number }}</span>
          </div>
          <div class="p-5 text-center relative z-10 bg-deep-space flex-1 flex flex-col">
            <h3 class="text-lg font-bold text-white leading-tight mb-1 truncate">{{ player.name }}</h3>
            <p class="text-cyan-accent text-xs font-bold uppercase tracking-widest mb-4 flex items-center justify-center gap-1">
              <span>{{ getTeam(player.teamId)?.flag }}</span>
              <span class="truncate">{{ getTeam(player.teamId)?.name }}</span>
            </p>
            
            <div class="grid grid-cols-2 gap-2 text-xs text-gray-400 border-t border-white/5 pt-3 mt-auto">
              <div class="flex flex-col">
                <span class="text-[9px] uppercase tracking-widest">Pos</span>
                <span class="font-bold text-white">{{ player.position }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[9px] uppercase tracking-widest">Rating</span>
                <span class="font-bold text-gold-accent font-mono">{{ player.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .glass-panel { background: rgba(10, 16, 36, 0.6); backdrop-filter: blur(20px); }
  `]
})
export class PlayersComponent implements OnInit, OnDestroy {
  searchQuery = '';
  positionFilter = '';
  
  allPlayers: Player[] = [];
  filteredPlayers: Player[] = [];
  teams: Team[] = [];

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

  getTeam(teamId: string): Team | undefined {
    return this.teams.find(t => t.id === teamId);
  }

  filterPlayers() {
    this.filteredPlayers = this.allPlayers.filter(p => {
      const matchPos = !this.positionFilter || p.position === this.positionFilter;
      const matchSearch = !this.searchQuery.trim() || 
                          p.name.toLowerCase().includes(this.searchQuery.toLowerCase().trim()) ||
                          this.getTeam(p.teamId)?.name.toLowerCase().includes(this.searchQuery.toLowerCase().trim());
      return matchPos && matchSearch;
    });
  }
}
