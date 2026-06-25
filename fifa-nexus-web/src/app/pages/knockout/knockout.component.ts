import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NexusDataService, Match, Team } from '../../core/services/nexus-data.service';
import { Subscription } from 'rxjs';

interface KnockoutNode {
  id: string;
  stage: string; // R32, R16, QF, SF, F, 3RD
  match?: Match;
  nextMatchId?: string;
}

@Component({
  selector: 'app-knockout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-[1920px] mx-auto min-h-screen text-white overflow-x-auto custom-scrollbar relative">
      <h1 class="text-4xl font-display font-black tracking-tighter uppercase mb-8 sticky left-6">Knockout Stage</h1>
      
      <div class="min-w-[1400px] pb-24 relative" id="bracket-container">
        <!-- SVG Canvas for Connecting Lines -->
        <svg class="absolute inset-0 pointer-events-none z-0" width="100%" height="100%">
          <path *ngFor="let line of svgLines" 
                [attr.d]="line.path" 
                fill="none" 
                [attr.stroke]="line.active ? '#00BFFF' : 'rgba(255,255,255,0.1)'" 
                [attr.stroke-width]="line.active ? '2' : '1'" 
                class="transition-all duration-500" />
        </svg>

        <div class="flex justify-between items-stretch gap-6 relative z-10 w-full">
          <!-- Round of 32 -->
          <div class="flex-1 flex flex-col justify-around gap-2" id="col-R32">
            <div class="text-center text-cyan-accent font-bold tracking-widest uppercase mb-4 sticky top-0 bg-[#050816] py-2 z-20">Round of 32</div>
            <ng-container *ngFor="let m of getMatchesByStage('Round of 32')">
              <ng-container *ngTemplateOutlet="matchCard; context: { match: m, id: 'node-' + m.id }"></ng-container>
            </ng-container>
          </div>

          <!-- Round of 16 -->
          <div class="flex-1 flex flex-col justify-around gap-4" id="col-R16">
            <div class="text-center text-cyan-accent font-bold tracking-widest uppercase mb-4 sticky top-0 bg-[#050816] py-2 z-20">Round of 16</div>
            <ng-container *ngFor="let m of getMatchesByStage('Round of 16')">
              <ng-container *ngTemplateOutlet="matchCard; context: { match: m, id: 'node-' + m.id }"></ng-container>
            </ng-container>
          </div>

          <!-- Quarter Finals -->
          <div class="flex-1 flex flex-col justify-around gap-8" id="col-QF">
            <div class="text-center text-gold-accent font-bold tracking-widest uppercase mb-4 sticky top-0 bg-[#050816] py-2 z-20">Quarter Finals</div>
            <ng-container *ngFor="let m of getMatchesByStage('Quarter Final')">
              <ng-container *ngTemplateOutlet="matchCard; context: { match: m, id: 'node-' + m.id, highlight: true }"></ng-container>
            </ng-container>
          </div>

          <!-- Semi Finals -->
          <div class="flex-1 flex flex-col justify-around gap-16" id="col-SF">
            <div class="text-center text-gold-accent font-bold tracking-widest uppercase mb-4 sticky top-0 bg-[#050816] py-2 z-20">Semi Finals</div>
            <ng-container *ngFor="let m of getMatchesByStage('Semi Final')">
              <ng-container *ngTemplateOutlet="matchCard; context: { match: m, id: 'node-' + m.id, glow: true }"></ng-container>
            </ng-container>
          </div>

          <!-- Finals -->
          <div class="flex-1 flex flex-col justify-center gap-12" id="col-F">
            <div class="text-center text-[#FFD700] font-black tracking-widest uppercase mb-4 sticky top-0 bg-[#050816] py-2 z-20 text-xl drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">Final</div>
            <ng-container *ngFor="let m of getMatchesByStage('Final')">
              <ng-container *ngTemplateOutlet="matchCard; context: { match: m, id: 'node-' + m.id, final: true }"></ng-container>
            </ng-container>
            
            <div class="mt-8 text-center text-gray-400 font-bold tracking-widest uppercase">Third Place</div>
            <ng-container *ngFor="let m of getMatchesByStage('Third Place')">
              <ng-container *ngTemplateOutlet="matchCard; context: { match: m, id: 'node-' + m.id }"></ng-container>
            </ng-container>
          </div>
        </div>
      </div>
    </div>

    <!-- Reusable Match Card Template -->
    <ng-template #matchCard let-match="match" let-id="id" let-highlight="highlight" let-glow="glow" let-final="final">
      <div [id]="id" (click)="goToMatch(match.id)"
           class="bg-black/40 border rounded-lg p-3 text-sm hover:-translate-y-1 transition-all duration-300 cursor-pointer relative group"
           [ngClass]="{
             'border-white/10 hover:border-cyan-accent/50': !highlight && !glow && !final,
             'border-gold-accent/30 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:border-gold-accent/60': highlight,
             'bg-gradient-to-br from-gold-accent/20 to-transparent border-gold-accent/50 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:border-gold-accent': glow,
             'bg-gradient-to-br from-[#FFD700]/30 to-black border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:shadow-[0_0_50px_rgba(255,215,0,0.6)] scale-110 mx-4': final
           }">
        
        <div *ngIf="match.status === 'live'" class="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping z-20"></div>
        <div *ngIf="match.status === 'live'" class="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full z-20 border border-white"></div>
        
        <div class="flex flex-col gap-2">
          <!-- Home Team -->
          <div class="flex justify-between items-center border-b border-white/5 pb-1">
            <div class="flex items-center gap-2">
              <span class="text-lg leading-none">{{ getTeam(match.homeTeamId)?.flag || '🏳️' }}</span>
              <span class="font-bold" [ngClass]="{'text-white': match.homeScore > match.awayScore && match.status === 'finished', 'text-gray-400': match.status === 'finished' && match.homeScore < match.awayScore}">{{ getTeam(match.homeTeamId)?.shortName || 'TBD' }}</span>
            </div>
            <span class="font-mono text-base font-bold" [ngClass]="{'text-cyan-accent': match.status === 'live'}">{{ match.status === 'upcoming' ? '-' : match.homeScore }}</span>
          </div>
          <!-- Away Team -->
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-lg leading-none">{{ getTeam(match.awayTeamId)?.flag || '🏳️' }}</span>
              <span class="font-bold" [ngClass]="{'text-white': match.awayScore > match.homeScore && match.status === 'finished', 'text-gray-400': match.status === 'finished' && match.awayScore < match.homeScore}">{{ getTeam(match.awayTeamId)?.shortName || 'TBD' }}</span>
            </div>
            <span class="font-mono text-base font-bold" [ngClass]="{'text-cyan-accent': match.status === 'live'}">{{ match.status === 'upcoming' ? '-' : match.awayScore }}</span>
          </div>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,194,255,0.3); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,194,255,0.8); }
  `]
})
export class KnockoutComponent implements OnInit, OnDestroy {
  matches: Match[] = [];
  teams: Team[] = [];
  svgLines: { path: string, active: boolean }[] = [];
  
  private mSub?: Subscription;
  private tSub?: Subscription;

  constructor(private dataService: NexusDataService, private router: Router) {}

  ngOnInit() {
    this.tSub = this.dataService.teams$.subscribe(t => this.teams = t);
    this.mSub = this.dataService.matches$.subscribe(m => {
      this.matches = m.filter(match => !match.stage.toLowerCase().includes('group'));
      
      // Ensure we have scaffolding for the whole bracket if matches are missing
      this.buildBracketScaffolding();
      
      setTimeout(() => this.drawLines(), 100);
    });
  }

  ngOnDestroy() {
    if (this.mSub) this.mSub.unsubscribe();
    if (this.tSub) this.tSub.unsubscribe();
  }

  @HostListener('window:resize')
  onResize() {
    this.drawLines();
  }

  getTeam(id: string): Team | undefined {
    return this.teams.find(t => t.id === id);
  }

  getMatchesByStage(stage: string): Match[] {
    return this.matches.filter(m => m.stage === stage).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  buildBracketScaffolding() {
    // If we don't have enough R32 matches generated, create dummy ones for UI structure
    const stages = [
      { name: 'Round of 32', count: 16 },
      { name: 'Round of 16', count: 8 },
      { name: 'Quarter Final', count: 4 },
      { name: 'Semi Final', count: 2 },
      { name: 'Third Place', count: 1 },
      { name: 'Final', count: 1 }
    ];

    stages.forEach(s => {
      let currentMatches = this.matches.filter(m => m.stage === s.name);
      for (let i = currentMatches.length; i < s.count; i++) {
        this.matches.push({
          id: `dummy-${s.name.replace(/\\s/g, '')}-${i}`,
          homeTeamId: 'TBD',
          awayTeamId: 'TBD',
          homeScore: 0,
          awayScore: 0,
          status: 'upcoming',
          minute: 0,
          stage: s.name,
          date: new Date(),
          venue: 'TBD'
        });
      }
    });
    
    // Sort logic to maintain stable pairing
    const stageOrder = ['Round of 32', 'Round of 16', 'Quarter Final', 'Semi Final', 'Final', 'Third Place'];
    this.matches.sort((a, b) => {
      if (a.stage !== b.stage) {
        return stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage);
      }
      return a.id.localeCompare(b.id);
    });
  }

  drawLines() {
    this.svgLines = [];
    const container = document.getElementById('bracket-container');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    const connectStages = (fromStage: string, toStage: string) => {
      const fromMatches = this.getMatchesByStage(fromStage);
      const toMatches = this.getMatchesByStage(toStage);

      // In a standard single-elimination bracket, fromMatches[0] and fromMatches[1] map to toMatches[0]
      for (let i = 0; i < toMatches.length; i++) {
        const toMatch = toMatches[i];
        const toEl = document.getElementById('node-' + toMatch.id);
        
        // Find the two feeders
        const feeder1 = fromMatches[i * 2];
        const feeder2 = fromMatches[i * 2 + 1];
        
        if (toEl && feeder1) {
          const el1 = document.getElementById('node-' + feeder1.id);
          this.addLine(el1, toEl, containerRect, feeder1.status === 'finished');
        }
        if (toEl && feeder2) {
          const el2 = document.getElementById('node-' + feeder2.id);
          this.addLine(el2, toEl, containerRect, feeder2.status === 'finished');
        }
      }
    };

    connectStages('Round of 32', 'Round of 16');
    connectStages('Round of 16', 'Quarter Final');
    connectStages('Quarter Final', 'Semi Final');
    connectStages('Semi Final', 'Final'); // Connect SF to Final
  }

  addLine(fromEl: HTMLElement | null, toEl: HTMLElement | null, containerRect: DOMRect, active: boolean) {
    if (!fromEl || !toEl) return;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const startX = fromRect.right - containerRect.left;
    const startY = fromRect.top + fromRect.height / 2 - containerRect.top;
    
    const endX = toRect.left - containerRect.left;
    const endY = toRect.top + toRect.height / 2 - containerRect.top;

    // Control points for cubic bezier (S-curve)
    const curveOffset = (endX - startX) / 2;
    const cp1X = startX + curveOffset;
    const cp1Y = startY;
    const cp2X = endX - curveOffset;
    const cp2Y = endY;

    const path = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
    this.svgLines.push({ path, active });
  }

  goToMatch(id: string) {
    if (!id.startsWith('dummy')) {
      this.router.navigate(['/live-center', id]);
    }
  }
}
