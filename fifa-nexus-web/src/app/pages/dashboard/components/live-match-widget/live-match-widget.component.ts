import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NexusDataService, Match, Team } from '../../../../core/services/nexus-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-live-match-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-panel rounded-3xl p-6 h-full flex flex-col hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,194,255,0.2)] transition-all duration-500 relative overflow-hidden group">
      <!-- Glow effect -->
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-cyan-accent/10 rounded-full blur-[40px] group-hover:bg-cyan-accent/20 transition-all duration-500"></div>
      
      <div class="flex justify-between items-center mb-6 relative z-10">
        <h2 class="font-display text-xl font-bold uppercase tracking-widest text-white">Live Matches</h2>
        <span class="flex h-3 w-3 relative" *ngIf="hasLiveMatches">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </div>

      <div class="flex-1 overflow-y-auto space-y-4 relative z-10 custom-scrollbar pr-2">
        <div *ngIf="matches.length === 0" class="text-center text-gray-500 py-8 text-sm uppercase tracking-widest animate-pulse">
          Syncing Satellite Data...
        </div>

        <!-- Real Matches from NexusDataService -->
        <div *ngFor="let match of displayMatches" class="bg-black/40 border border-white/5 rounded-2xl p-4 hover:border-cyan-accent/30 transition-colors">
          <div class="flex justify-between items-center text-xs text-gray-400 mb-3 tracking-widest uppercase">
            <span>{{ match.stage }}</span>
            <span [ngClass]="{'text-red-400 font-bold animate-pulse': match.status === 'live', 'text-cyan-accent': match.status !== 'live'}">
              {{ match.status === 'live' ? 'LIVE ' + match.minute + '\\'' : match.status }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <div class="flex flex-col items-center gap-2 w-1/3 text-center">
              <div class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-xl shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]">{{ getTeam(match.homeTeamId)?.flag }}</div>
              <span class="text-sm font-bold truncate w-full px-1">{{ getTeam(match.homeTeamId)?.shortName }}</span>
            </div>
            <div class="flex flex-col items-center w-1/3">
              <span class="text-2xl font-display font-black" [ngClass]="{'text-white': match.status !== 'upcoming', 'text-gray-600': match.status === 'upcoming'}">
                {{ match.status === 'upcoming' ? 'v' : match.homeScore + ' - ' + match.awayScore }}
              </span>
            </div>
            <div class="flex flex-col items-center gap-2 w-1/3 text-center">
              <div class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-xl shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]">{{ getTeam(match.awayTeamId)?.flag }}</div>
              <span class="text-sm font-bold truncate w-full px-1">{{ getTeam(match.awayTeamId)?.shortName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); rounded: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.8); }
  `]
})
export class LiveMatchWidgetComponent implements OnInit, OnDestroy {
  matches: Match[] = [];
  displayMatches: Match[] = [];
  teams: Team[] = [];
  hasLiveMatches = false;
  private sub?: Subscription;
  private tSub?: Subscription;

  constructor(private dataService: NexusDataService) {}

  ngOnInit() {
    this.tSub = this.dataService.teams$.subscribe(t => this.teams = t);
    
    this.sub = this.dataService.matches$.subscribe(m => {
      this.matches = m;
      this.hasLiveMatches = this.matches.some(match => match.status === 'live');
      
      // If there are live matches, show them. Otherwise show upcoming.
      if (this.hasLiveMatches) {
        this.displayMatches = this.matches.filter(match => match.status === 'live');
      } else {
        this.displayMatches = this.matches.filter(match => match.status === 'upcoming');
        if (this.displayMatches.length === 0) {
          // Fallback to all matches if no upcoming
          this.displayMatches = this.matches;
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
    if (this.tSub) this.tSub.unsubscribe();
  }

  getTeam(id: string): Team | undefined {
    return this.teams.find(t => t.id === id);
  }
}
