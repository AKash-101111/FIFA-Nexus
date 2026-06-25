import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NexusDataService, Team } from '../../core/services/nexus-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-[1920px] mx-auto min-h-screen text-white">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 class="text-4xl font-display font-black tracking-tighter uppercase mb-2">National Teams</h1>
          <p class="text-gray-400 uppercase tracking-widest text-sm">Qualified for FIFA World Cup 2026</p>
        </div>
        <div class="w-full md:w-72">
          <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="filterTeams()" placeholder="SEARCH TEAMS..." class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-accent focus:bg-black/60 transition-all duration-300">
        </div>
      </div>
      
      <div *ngIf="filteredTeams.length === 0" class="text-center py-12 text-gray-500 uppercase tracking-widest">
        No teams found matching your search.
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
        <div *ngFor="let team of filteredTeams" class="glass-panel border border-white/5 rounded-2xl p-6 hover:border-cyan-accent/50 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,194,255,0.15)] transition-all cursor-pointer group">
          <div class="flex flex-col items-center text-center">
            <div class="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 overflow-hidden group-hover:scale-110 transition-transform shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] text-5xl">
              {{ team.flag }}
            </div>
            <h3 class="text-xl font-bold text-white mb-1 truncate w-full">{{ team.name }}</h3>
            <span class="text-[10px] bg-cyan-accent/20 text-cyan-accent px-2 py-1 rounded font-bold tracking-widest uppercase mb-4 border border-cyan-accent/30">Group {{ team.group }}</span>
            
            <div class="w-full flex justify-between text-xs text-gray-400 border-t border-white/5 pt-3 mt-auto">
              <div class="flex flex-col items-center">
                <span class="uppercase tracking-widest text-[9px] mb-1">Rank</span>
                <span class="font-bold text-white font-mono">{{ team.ranking }}</span>
              </div>
              <div class="flex flex-col items-center">
                <span class="uppercase tracking-widest text-[9px] mb-1">Manager</span>
                <span class="font-bold text-white truncate max-w-[100px]">{{ team.manager }}</span>
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
export class TeamsComponent implements OnInit, OnDestroy {
  searchQuery = '';
  allTeams: Team[] = [];
  filteredTeams: Team[] = [];
  
  private sub?: Subscription;

  constructor(private dataService: NexusDataService) {}

  ngOnInit() {
    this.sub = this.dataService.teams$.subscribe(t => {
      this.allTeams = [...t].sort((a, b) => a.ranking - b.ranking);
      this.filterTeams();
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  filterTeams() {
    if (!this.searchQuery.trim()) {
      this.filteredTeams = this.allTeams;
      return;
    }
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredTeams = this.allTeams.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.shortName.toLowerCase().includes(q) ||
      t.manager.toLowerCase().includes(q)
    );
  }
}
