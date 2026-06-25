import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NexusDataService, Team, Player } from '../../core/services/nexus-data.service';
import { ExportService } from '../../core/services/export.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-[1920px] mx-auto min-h-[calc(100vh-5rem)]">
      
      <!-- Top Navigation Tabs -->
      <div class="flex items-center gap-4 mb-8">
        <button (click)="activeTab = 'team'" [ngClass]="activeTab === 'team' ? 'bg-cyan-accent text-deep-space font-bold' : 'glass-panel text-gray-400 hover:text-white'" class="px-6 py-3 rounded-full text-sm uppercase tracking-widest transition-all">Team Analytics</button>
        <button (click)="activeTab = 'player'" [ngClass]="activeTab === 'player' ? 'bg-premium-purple text-white font-bold' : 'glass-panel text-gray-400 hover:text-white'" class="px-6 py-3 rounded-full text-sm uppercase tracking-widest transition-all">Player Analytics</button>
        <button (click)="activeTab = 'compare'" [ngClass]="activeTab === 'compare' ? 'bg-electric-blue text-white font-bold' : 'glass-panel text-gray-400 hover:text-white'" class="px-6 py-3 rounded-full text-sm uppercase tracking-widest transition-all">Comparison Engine</button>
        <button (click)="exportReport()" class="ml-auto flex items-center gap-2 bg-gradient-to-r from-cyan-accent to-electric-blue text-deep-space px-6 py-3 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(0,194,255,0.3)] hover:shadow-[0_0_30px_rgba(0,194,255,0.5)] transition-all">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Export Report
        </button>
      </div>

      <!-- TEAM ANALYTICS VIEW -->
      <div *ngIf="activeTab === 'team'" class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <!-- Left Panel: Filters & AI -->
        <div class="flex flex-col gap-6">
          <div class="glass-panel rounded-3xl p-6">
            <h2 class="text-white font-bold tracking-widest uppercase mb-6 text-sm">Select Team</h2>
            <select [(ngModel)]="selectedTeamId" (ngModelChange)="onTeamSelected()" class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-accent mb-4">
              <option *ngFor="let t of teams" [value]="t.id">{{ t.name }}</option>
            </select>

            <ng-container *ngIf="selectedTeam">
              <div class="flex items-center justify-between text-xs text-gray-400 mb-2 mt-4">
                <span>FIFA Ranking</span>
                <span class="text-cyan-accent font-bold">{{ selectedTeam.ranking }}</span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-1.5 mb-6">
                <div class="bg-cyan-accent h-1.5 rounded-full shadow-[0_0_10px_rgba(0,194,255,0.5)] transition-all duration-1000" [style.width]="getStatBarWidth(selectedTeam.ranking, 200, true) + '%'"></div>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>Attacking Efficiency (Mock)</span>
                <span class="text-electric-blue font-bold">{{ mockStats.attack }}</span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-1.5 mb-6">
                <div class="bg-electric-blue h-1.5 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000" [style.width]="mockStats.attack + '%'"></div>
              </div>
              <div class="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>Defensive Solidity (Mock)</span>
                <span class="text-premium-purple font-bold">{{ mockStats.defense }}</span>
              </div>
              <div class="w-full bg-white/10 rounded-full h-1.5">
                <div class="bg-premium-purple h-1.5 rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)] transition-all duration-1000" [style.width]="mockStats.defense + '%'"></div>
              </div>
            </ng-container>
          </div>

          <!-- AI Report -->
          <div class="glass-panel rounded-3xl p-6 relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-tr from-cyan-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" class="w-4 h-4 filter grayscale invert opacity-80">
              </div>
              <h2 class="text-white font-bold tracking-widest uppercase text-sm">AI Analysis</h2>
            </div>
            <p class="text-sm text-gray-300 leading-relaxed mb-4">
              <ng-container *ngIf="selectedTeam">
                {{ selectedTeam.name }} excels in transition, utilizing a fluid structure that heavily relies on overloads. Their expected goals (xG) performance suggests strong attacking intent.
              </ng-container>
              <ng-container *ngIf="!selectedTeam">
                Select a team to generate an AI analysis report.
              </ng-container>
            </p>
            <button class="text-xs text-cyan-accent font-bold uppercase tracking-widest hover:text-white transition-colors">Generate Full Report</button>
          </div>
        </div>

        <!-- Center & Right: Visualizations -->
        <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6" *ngIf="selectedTeam">
          
          <!-- Tactical Setup / Pitch -->
          <div class="md:col-span-2 glass-panel rounded-3xl p-6 flex flex-col relative overflow-hidden">
            <h2 class="text-white font-bold tracking-widest uppercase mb-6 text-sm">Average Positions</h2>
            <div class="w-full h-64 bg-green-900/30 border border-white/10 rounded-xl relative overflow-hidden pitch-bg">
              <!-- Mock Pitch Lines -->
              <div class="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/20"></div>
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-white/20"></div>
              <div class="absolute top-1/2 -translate-y-1/2 -left-4 w-16 h-32 border border-white/20"></div>
              <div class="absolute top-1/2 -translate-y-1/2 -right-4 w-16 h-32 border border-white/20"></div>

              <!-- Nodes (Players) -->
              <div class="absolute top-[20%] left-[20%] w-6 h-6 rounded-full bg-cyan-accent shadow-[0_0_15px_rgba(0,194,255,0.8)] border border-white flex items-center justify-center text-[10px] text-black font-bold">2</div>
              <div class="absolute top-[80%] left-[20%] w-6 h-6 rounded-full bg-cyan-accent shadow-[0_0_15px_rgba(0,194,255,0.8)] border border-white flex items-center justify-center text-[10px] text-black font-bold">3</div>
              <div class="absolute top-[50%] left-[10%] w-6 h-6 rounded-full bg-cyan-accent shadow-[0_0_15px_rgba(0,194,255,0.8)] border border-white flex items-center justify-center text-[10px] text-black font-bold">4</div>
              <div class="absolute top-[50%] left-[40%] w-6 h-6 rounded-full bg-cyan-accent shadow-[0_0_15px_rgba(0,194,255,0.8)] border border-white flex items-center justify-center text-[10px] text-black font-bold">8</div>
              <div class="absolute top-[20%] left-[60%] w-6 h-6 rounded-full bg-electric-blue shadow-[0_0_15px_rgba(59,130,246,0.8)] border border-white flex items-center justify-center text-[10px] text-white font-bold">11</div>
              <div class="absolute top-[80%] left-[60%] w-6 h-6 rounded-full bg-electric-blue shadow-[0_0_15px_rgba(59,130,246,0.8)] border border-white flex items-center justify-center text-[10px] text-white font-bold">7</div>
              <div class="absolute top-[50%] left-[75%] w-6 h-6 rounded-full bg-premium-purple shadow-[0_0_15px_rgba(124,58,237,0.8)] border border-white flex items-center justify-center text-[10px] text-white font-bold">9</div>
              
              <!-- Pass Network Lines -->
              <svg class="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="10%" y1="50%" x2="40%" y2="50%" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
                <line x1="40%" y1="50%" x2="60%" y2="20%" stroke="rgba(0,194,255,0.8)" stroke-width="3" />
                <line x1="40%" y1="50%" x2="60%" y2="80%" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />
                <line x1="60%" y1="20%" x2="75%" y2="50%" stroke="rgba(0,194,255,0.5)" stroke-width="2" />
              </svg>
            </div>
          </div>

          <!-- xG Trend -->
          <div class="glass-panel rounded-3xl p-6 flex flex-col relative">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-white font-bold tracking-widest uppercase text-sm">xG Trend (Last 5)</h2>
            </div>
            <div class="flex-1 flex items-end justify-between gap-2 pt-8 relative">
              <div class="absolute top-4 left-0 w-full border-t border-dashed border-cyan-accent/50"></div>
              <span class="absolute top-1 left-0 text-[10px] text-cyan-accent">Expected (1.8)</span>
              
              <div class="w-full flex flex-col items-center group">
                <div class="w-full bg-cyan-accent/20 rounded-t-sm group-hover:bg-cyan-accent/40 transition-colors relative" [style.height]="mockStats.xg1 + '%'">
                  <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">{{ (mockStats.xg1 / 30).toFixed(1) }}</div>
                </div>
                <span class="text-[10px] text-gray-500 mt-2 font-bold">M1</span>
              </div>
              <div class="w-full flex flex-col items-center group">
                <div class="w-full bg-cyan-accent/20 rounded-t-sm group-hover:bg-cyan-accent/40 transition-colors relative" [style.height]="mockStats.xg2 + '%'">
                  <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">{{ (mockStats.xg2 / 30).toFixed(1) }}</div>
                </div>
                <span class="text-[10px] text-gray-500 mt-2 font-bold">M2</span>
              </div>
              <div class="w-full flex flex-col items-center group">
                <div class="w-full bg-cyan-accent/80 shadow-[0_0_10px_rgba(0,194,255,0.5)] rounded-t-sm relative" [style.height]="mockStats.xg3 + '%'">
                  <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">{{ (mockStats.xg3 / 30).toFixed(1) }}</div>
                </div>
                <span class="text-[10px] text-gray-500 mt-2 font-bold">M3</span>
              </div>
              <div class="w-full flex flex-col items-center group">
                <div class="w-full bg-cyan-accent/20 rounded-t-sm group-hover:bg-cyan-accent/40 transition-colors relative" [style.height]="mockStats.xg4 + '%'">
                  <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">{{ (mockStats.xg4 / 30).toFixed(1) }}</div>
                </div>
                <span class="text-[10px] text-gray-500 mt-2 font-bold">M4</span>
              </div>
              <div class="w-full flex flex-col items-center group">
                <div class="w-full bg-cyan-accent/20 rounded-t-sm group-hover:bg-cyan-accent/40 transition-colors relative" [style.height]="mockStats.xg5 + '%'">
                  <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">{{ (mockStats.xg5 / 30).toFixed(1) }}</div>
                </div>
                <span class="text-[10px] text-gray-500 mt-2 font-bold">M5</span>
              </div>
            </div>
          </div>

          <!-- Radar Chart Placeholder -->
          <div class="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center">
             <h2 class="text-white font-bold tracking-widest uppercase mb-4 text-sm w-full text-left">Style Matrix</h2>
             <div class="relative w-40 h-40 border border-white/10 rounded-full flex items-center justify-center transition-transform duration-1000" [style.transform]="'rotate(' + mockStats.defense + 'deg)'">
              <div class="absolute w-24 h-24 border border-white/10 rounded-full"></div>
              
              <div class="absolute w-full h-[1px] bg-white/10 rotate-0"></div>
              <div class="absolute w-full h-[1px] bg-white/10 rotate-45"></div>
              <div class="absolute w-full h-[1px] bg-white/10 rotate-90"></div>
              <div class="absolute w-full h-[1px] bg-white/10 rotate-[135deg]"></div>

              <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <polygon points="50,15 85,35 80,70 50,90 20,60 15,35" fill="rgba(124,58,237,0.3)" stroke="#7C3AED" stroke-width="2" />
              </svg>
            </div>
          </div>

        </div>
      </div>

      <!-- PLAYER ANALYTICS VIEW -->
      <div *ngIf="activeTab === 'player'" class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div class="flex flex-col gap-6">
          <div class="glass-panel rounded-3xl p-6">
            <h2 class="text-white font-bold tracking-widest uppercase mb-6 text-sm">Select Player</h2>
            <select [(ngModel)]="selectedPlayerId" (ngModelChange)="onPlayerSelected()" class="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-premium-purple mb-4">
              <option *ngFor="let p of players" [value]="p.id">{{ p.name }} ({{ getTeamName(p.teamId) }})</option>
            </select>
            
            <ng-container *ngIf="selectedPlayer">
               <div class="flex items-center justify-between text-xs text-gray-400 mb-2 mt-4">
                 <span>Rating</span>
                 <span class="text-premium-purple font-bold">{{ selectedPlayer.rating }}</span>
               </div>
               <div class="w-full bg-white/10 rounded-full h-1.5 mb-6">
                 <div class="bg-premium-purple h-1.5 rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)] transition-all duration-1000" [style.width]="selectedPlayer.rating + '%'"></div>
               </div>
            </ng-container>
          </div>
        </div>

        <div class="lg:col-span-2 glass-panel rounded-3xl p-16 text-center" *ngIf="!selectedPlayer">
          <h2 class="text-2xl font-display font-black text-white uppercase tracking-widest mb-4">Player Analytics Engine</h2>
          <p class="text-gray-400">Select a player to view detailed metrics.</p>
        </div>

        <div class="lg:col-span-2 glass-panel rounded-3xl p-6 text-center" *ngIf="selectedPlayer">
          <h2 class="text-2xl font-display font-black text-white uppercase tracking-widest mb-4">{{ selectedPlayer.name }}</h2>
          <p class="text-gray-400 mb-8">{{ getTeamName(selectedPlayer.teamId) }} • {{ selectedPlayer.position }} • #{{ selectedPlayer.number }}</p>
          
          <div class="grid grid-cols-3 gap-6">
             <div class="bg-white/5 border border-white/10 rounded-xl p-6">
                <span class="block text-xs text-gray-400 uppercase tracking-widest mb-2">Pace</span>
                <span class="text-3xl font-black text-white">{{ mockPlayerStats.pace }}</span>
             </div>
             <div class="bg-white/5 border border-white/10 rounded-xl p-6">
                <span class="block text-xs text-gray-400 uppercase tracking-widest mb-2">Shooting</span>
                <span class="text-3xl font-black text-white">{{ mockPlayerStats.shooting }}</span>
             </div>
             <div class="bg-white/5 border border-white/10 rounded-xl p-6">
                <span class="block text-xs text-gray-400 uppercase tracking-widest mb-2">Passing</span>
                <span class="text-3xl font-black text-white">{{ mockPlayerStats.passing }}</span>
             </div>
          </div>
        </div>
      </div>

      <!-- COMPARISON VIEW -->
      <div *ngIf="activeTab === 'compare'" class="glass-panel rounded-3xl p-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 class="text-2xl font-display font-black text-white uppercase tracking-widest mb-4">Comparison Engine</h2>
        <p class="text-gray-400">Select teams or players from their respective tabs first, or use the interactive matrices here to compare head-to-head.</p>
        <div class="flex justify-center mt-8 gap-8">
           <button (click)="activeTab = 'team'" class="px-6 py-2 border border-cyan-accent text-cyan-accent rounded-full text-xs font-bold uppercase tracking-widest hover:bg-cyan-accent hover:text-black transition-colors">Compare Teams</button>
           <button (click)="activeTab = 'player'" class="px-6 py-2 border border-premium-purple text-premium-purple rounded-full text-xs font-bold uppercase tracking-widest hover:bg-premium-purple hover:text-white transition-colors">Compare Players</button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .pitch-bg {
      background-size: 40px 40px;
      background-image: 
        linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
    }
  `]
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {
  activeTab = 'team';
  
  teams: Team[] = [];
  players: Player[] = [];
  
  selectedTeamId: string = '';
  selectedTeam?: Team;
  
  selectedPlayerId: string = '';
  selectedPlayer?: Player;

  mockStats = { attack: 85, defense: 80, xg1: 60, xg2: 80, xg3: 95, xg4: 50, xg5: 75 };
  mockPlayerStats = { pace: 85, shooting: 80, passing: 82 };

  private tSub?: Subscription;
  private pSub?: Subscription;

  constructor(
    private dataService: NexusDataService,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    this.tSub = this.dataService.teams$.subscribe(t => {
      this.teams = t;
      if (!this.selectedTeamId && t.length > 0) {
        this.selectedTeamId = t[0].id;
        this.onTeamSelected();
      }
    });

    this.pSub = this.dataService.players$.subscribe(p => {
      this.players = p;
    });
  }

  ngOnDestroy() {
    if (this.tSub) this.tSub.unsubscribe();
    if (this.pSub) this.pSub.unsubscribe();
  }

  onTeamSelected() {
    this.selectedTeam = this.teams.find(t => t.id === this.selectedTeamId);
    if (this.selectedTeam) {
      // Generate some random mock stats for visualization purely based on ranking
      const base = 100 - (this.selectedTeam.ranking * 0.5);
      this.mockStats = {
        attack: Math.min(99, Math.max(40, Math.floor(base + (Math.random() * 20 - 10)))),
        defense: Math.min(99, Math.max(40, Math.floor(base + (Math.random() * 20 - 10)))),
        xg1: Math.floor(Math.random() * 100),
        xg2: Math.floor(Math.random() * 100),
        xg3: Math.floor(Math.random() * 100),
        xg4: Math.floor(Math.random() * 100),
        xg5: Math.floor(Math.random() * 100)
      };
    }
  }

  onPlayerSelected() {
    this.selectedPlayer = this.players.find(p => p.id === this.selectedPlayerId);
    if (this.selectedPlayer) {
      const base = this.selectedPlayer.rating;
      this.mockPlayerStats = {
        pace: Math.min(99, Math.max(40, Math.floor(base + (Math.random() * 15 - 5)))),
        shooting: Math.min(99, Math.max(40, Math.floor(base + (Math.random() * 15 - 5)))),
        passing: Math.min(99, Math.max(40, Math.floor(base + (Math.random() * 15 - 5))))
      };
    }
  }

  getTeamName(teamId: string): string {
    return this.teams.find(t => t.id === teamId)?.name || 'Unknown';
  }

  getStatBarWidth(val: number, max: number, inverse: boolean = false): number {
    let pct = (val / max) * 100;
    if (inverse) pct = 100 - pct; // For ranking, lower is better (fuller bar)
    return Math.min(100, Math.max(0, pct));
  }

  exportReport() {
    let reportData: any = {};
    if (this.activeTab === 'team' && this.selectedTeam) {
      reportData = {
        Team: this.selectedTeam.name,
        Ranking: this.selectedTeam.ranking,
        Attack: this.mockStats.attack,
        Defense: this.mockStats.defense
      };
      this.exportService.exportCSV(`${this.selectedTeam.name}_Analytics`, [reportData]);
    } else if (this.activeTab === 'player' && this.selectedPlayer) {
      reportData = {
        Player: this.selectedPlayer.name,
        Team: this.getTeamName(this.selectedPlayer.teamId),
        Rating: this.selectedPlayer.rating,
        Pace: this.mockPlayerStats.pace,
        Shooting: this.mockPlayerStats.shooting,
        Passing: this.mockPlayerStats.passing
      };
      this.exportService.exportCSV(`${this.selectedPlayer.name}_Analytics`, [reportData]);
    } else {
      alert('Select a team or player first.');
    }
  }
}
