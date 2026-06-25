import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NexusDataService, Match, Player, Team } from '../../../../core/services/nexus-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-intelligence-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
      
      <!-- Live Match Status -->
      <div class="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-cyan-accent/50 transition-colors">
        <div class="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent"></div>
        <div class="relative z-10" *ngIf="liveMatch; else noLive">
          <div class="flex justify-between items-start mb-2">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Match</span>
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="font-bold truncate max-w-[40px]">{{ getTeamName(liveMatch.homeTeamId) }}</span>
            <span class="text-xl font-black text-cyan-accent">{{ liveMatch.homeScore }} - {{ liveMatch.awayScore }}</span>
            <span class="font-bold truncate max-w-[40px]">{{ getTeamName(liveMatch.awayTeamId) }}</span>
          </div>
          <p class="text-xs text-gray-500 mt-2">{{ liveMatch.minute }}</p>
        </div>
        <ng-template #noLive>
           <div class="relative z-10 flex flex-col items-center justify-center h-full opacity-50">
             <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No Live Matches</span>
           </div>
        </ng-template>
      </div>

      <!-- Upcoming Fixtures -->
      <div class="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-gold-accent/50 transition-colors">
        <div class="relative z-10" *ngIf="nextMatch; else noNext">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Next Fixture</span>
          <div class="flex justify-between items-center">
            <span class="font-bold text-sm truncate max-w-[50px]">{{ getTeamName(nextMatch.homeTeamId) }}</span>
            <span class="text-xs text-gray-500">vs</span>
            <span class="font-bold text-sm truncate max-w-[50px]">{{ getTeamName(nextMatch.awayTeamId) }}</span>
          </div>
          <p class="text-xs text-gold-accent mt-2 font-bold">{{ nextMatch.date | date:'shortTime' }}</p>
        </div>
        <ng-template #noNext>
           <div class="relative z-10 flex flex-col items-center justify-center h-full opacity-50">
             <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No Upcoming</span>
           </div>
        </ng-template>
      </div>

      <!-- Recent Results -->
      <div class="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-electric-blue/50 transition-colors">
        <div class="relative z-10" *ngIf="lastMatch; else noLast">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Recent Result</span>
          <div class="flex justify-between items-center">
            <span class="font-bold text-sm opacity-50 truncate max-w-[40px]">{{ getTeamName(lastMatch.homeTeamId) }}</span>
            <span class="text-sm font-black text-gray-300">{{ lastMatch.homeScore }} - {{ lastMatch.awayScore }}</span>
            <span class="font-bold text-sm text-electric-blue truncate max-w-[40px]">{{ getTeamName(lastMatch.awayTeamId) }}</span>
          </div>
          <p class="text-xs text-gray-500 mt-2">FT</p>
        </div>
        <ng-template #noLast>
           <div class="relative z-10 flex flex-col items-center justify-center h-full opacity-50">
             <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No Recent</span>
           </div>
        </ng-template>
      </div>

      <!-- Top Scorers -->
      <div class="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-white/30 transition-colors">
        <div class="relative z-10" *ngIf="topScorer">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Top Scorer</span>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden font-black text-[10px]">
              {{ getTeam(topScorer.teamId)?.flag }}
            </div>
            <div>
              <p class="text-sm font-bold truncate max-w-[100px]">{{ topScorer.name }}</p>
              <p class="text-xs text-cyan-accent font-black">5 Goals</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Assists -->
      <div class="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-white/30 transition-colors">
        <div class="relative z-10" *ngIf="topAssists">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Top Assist</span>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden font-black text-[10px]">
              {{ getTeam(topAssists.teamId)?.flag }}
            </div>
            <div>
              <p class="text-sm font-bold truncate max-w-[100px]">{{ topAssists.name }}</p>
              <p class="text-xs text-electric-blue font-black">4 Assists</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Trending Teams -->
      <div class="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-green-500/50 transition-colors">
        <div class="relative z-10">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Trending Team</span>
          <div class="flex justify-between items-center">
            <span class="font-bold text-lg truncate max-w-[80px]">{{ trendingTeam?.name || 'Japan' }}</span>
            <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          </div>
          <p class="text-xs text-gray-500 mt-1">+45% Mention</p>
        </div>
      </div>

      <!-- Trending Players -->
      <div class="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-green-500/50 transition-colors">
        <div class="relative z-10">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Trending Player</span>
          <div class="flex justify-between items-center">
            <span class="font-bold text-lg truncate max-w-[80px]">{{ trendingPlayer?.name || 'Bellingham' }}</span>
            <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
          </div>
          <p class="text-xs text-gray-500 mt-1">MVP Candidate</p>
        </div>
      </div>

      <!-- FIFA Ranking -->
      <div class="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-white/30 transition-colors">
        <div class="relative z-10">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Ranking Move</span>
          <div class="flex justify-between items-center">
            <span class="font-bold text-lg text-white truncate max-w-[80px]">{{ risingTeam?.name || 'USA' }}</span>
            <span class="text-sm font-black text-green-400">+3</span>
          </div>
          <p class="text-xs text-gray-500 mt-1">Now #{{ risingTeam?.ranking || 11 }}</p>
        </div>
      </div>

      <!-- Tournament Countdown -->
      <div class="glass-panel p-4 rounded-2xl relative overflow-hidden group hover:border-gold-accent/50 transition-colors col-span-2 md:col-span-1 lg:col-span-2">
        <div class="absolute inset-0 bg-gradient-to-r from-gold-accent/10 to-transparent"></div>
        <div class="relative z-10">
          <span class="text-[10px] font-bold text-gold-accent uppercase tracking-widest block mb-1">Final Countdown</span>
          <div class="flex items-end gap-2">
            <span class="text-3xl font-black font-display text-white leading-none">12</span>
            <span class="text-sm text-gray-400 mb-1">Days</span>
            <span class="text-3xl font-black font-display text-white leading-none ml-2">14</span>
            <span class="text-sm text-gray-400 mb-1">Hours</span>
          </div>
        </div>
      </div>

    </div>
  `
})
export class IntelligenceCardsComponent implements OnInit, OnDestroy {
  teams: Team[] = [];
  players: Player[] = [];
  matches: Match[] = [];

  liveMatch?: Match;
  nextMatch?: Match;
  lastMatch?: Match;

  topScorer?: Player;
  topAssists?: Player;
  trendingTeam?: Team;
  trendingPlayer?: Player;
  risingTeam?: Team;

  private sub?: Subscription;

  constructor(private dataService: NexusDataService) {}

  ngOnInit() {
    this.sub = this.dataService.teams$.subscribe(t => {
      this.teams = t;
      this.risingTeam = this.teams.find(x => x.name === 'USA') || this.teams[0];
      this.trendingTeam = this.teams.find(x => x.name === 'Japan') || this.teams[1];
    });

    this.sub.add(this.dataService.players$.subscribe(p => {
      this.players = p;
      this.topScorer = this.players.find(x => x.name.includes('Mbapp')) || this.players[0];
      this.topAssists = this.players.find(x => x.name.includes('Messi')) || this.players[1];
      this.trendingPlayer = this.players.find(x => x.name.includes('Bellingham')) || this.players[2];
    }));

    this.sub.add(this.dataService.matches$.subscribe(m => {
      this.matches = m;
      this.liveMatch = m.find(x => x.status === 'live');
      this.nextMatch = m.filter(x => x.status === 'upcoming').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
      this.lastMatch = m.filter(x => x.status === 'finished').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    }));
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  getTeam(id: string): Team | undefined {
    return this.teams.find(t => t.id === id);
  }

  getTeamName(id: string): string {
    return this.getTeam(id)?.shortName || 'TBD';
  }
}
