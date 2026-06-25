import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NexusDataService, Match, Team } from '../../core/services/nexus-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fixtures',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-[1920px] mx-auto min-h-screen text-white">
      <h1 class="text-4xl font-display font-black tracking-tighter uppercase mb-8">Fixtures</h1>
      
      <div class="flex gap-4 mb-8 overflow-x-auto pb-4 custom-scrollbar">
        <button *ngFor="let filter of filters" 
                (click)="setFilter(filter)"
                class="px-6 py-2 rounded-full font-bold tracking-widest uppercase transition-colors whitespace-nowrap"
                [ngClass]="activeFilter === filter ? 'bg-cyan-accent text-deep-black shadow-[0_0_15px_rgba(0,194,255,0.4)]' : 'bg-white/10 hover:bg-white/20'">
          {{ filter }}
        </button>
      </div>

      <div class="space-y-4">
        <div *ngIf="filteredMatches.length === 0" class="text-center py-12 text-gray-500 uppercase tracking-widest">
          No matches found for this filter.
        </div>
        
        <div *ngFor="let fixture of filteredMatches" class="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center hover:bg-white/10 hover:border-cyan-accent/30 transition-all duration-300 cursor-pointer group">
          <div class="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
            <div class="text-gray-400 text-sm tracking-widest uppercase min-w-[140px] text-center md:text-left">
              {{ fixture.date | date:'dd MMM yyyy' }}
              <div *ngIf="fixture.status === 'live'" class="text-red-400 font-bold animate-pulse mt-1 text-xs">LIVE {{ fixture.minute }}'</div>
              <div *ngIf="fixture.status === 'finished'" class="text-gray-500 mt-1 text-xs">FT</div>
            </div>
            
            <div class="flex items-center justify-center gap-6 w-full md:w-[400px]">
              <div class="flex items-center gap-3 w-1/2 justify-end">
                <span class="font-bold text-lg md:text-xl truncate group-hover:text-cyan-accent transition-colors">{{ getTeam(fixture.homeTeamId)?.name }}</span>
                <span class="text-2xl">{{ getTeam(fixture.homeTeamId)?.flag }}</span>
              </div>
              
              <div class="px-4 py-2 bg-black/50 rounded-lg font-bold text-xl min-w-[80px] text-center" [ngClass]="{'text-cyan-accent border border-cyan-accent/30 shadow-[0_0_10px_rgba(0,194,255,0.2)]': fixture.status === 'upcoming', 'text-white border border-white/10': fixture.status !== 'upcoming'}">
                <span *ngIf="fixture.status === 'upcoming'">VS</span>
                <span *ngIf="fixture.status !== 'upcoming'">{{ fixture.homeScore }} - {{ fixture.awayScore }}</span>
              </div>
              
              <div class="flex items-center gap-3 w-1/2 justify-start">
                <span class="text-2xl">{{ getTeam(fixture.awayTeamId)?.flag }}</span>
                <span class="font-bold text-lg md:text-xl truncate group-hover:text-cyan-accent transition-colors">{{ getTeam(fixture.awayTeamId)?.name }}</span>
              </div>
            </div>
          </div>
          
          <div class="mt-6 md:mt-0 flex flex-col items-center md:items-end w-full md:w-auto border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
            <span class="text-sm font-bold tracking-widest uppercase text-gray-300">{{ fixture.venue }}</span>
            <span class="text-xs text-cyan-accent uppercase tracking-widest mt-1">{{ fixture.stage }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,194,255,0.3); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,194,255,0.8); }
  `]
})
export class FixturesComponent implements OnInit, OnDestroy {
  filters = ['All', 'Today', 'Tomorrow', 'Group Stage', 'Knockout'];
  activeFilter = 'All';
  
  allMatches: Match[] = [];
  filteredMatches: Match[] = [];
  teams: Team[] = [];

  private mSub?: Subscription;
  private tSub?: Subscription;

  constructor(private dataService: NexusDataService) {}

  ngOnInit() {
    this.tSub = this.dataService.teams$.subscribe(t => this.teams = t);
    this.mSub = this.dataService.matches$.subscribe(m => {
      // Sort matches: live first, then upcoming, then finished. Within those, sort by date.
      this.allMatches = [...m].sort((a, b) => {
        if (a.status === 'live' && b.status !== 'live') return -1;
        if (a.status !== 'live' && b.status === 'live') return 1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      this.applyFilter();
    });
  }

  ngOnDestroy() {
    if (this.mSub) this.mSub.unsubscribe();
    if (this.tSub) this.tSub.unsubscribe();
  }

  getTeam(id: string): Team | undefined {
    return this.teams.find(t => t.id === id);
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.applyFilter();
  }

  applyFilter() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    this.filteredMatches = this.allMatches.filter(match => {
      const matchDate = new Date(match.date);
      matchDate.setHours(0, 0, 0, 0);

      switch (this.activeFilter) {
        case 'Today':
          return matchDate.getTime() === today.getTime();
        case 'Tomorrow':
          return matchDate.getTime() === tomorrow.getTime();
        case 'Group Stage':
          return match.stage.toLowerCase().includes('group');
        case 'Knockout':
          return !match.stage.toLowerCase().includes('group');
        case 'All':
        default:
          return true;
      }
    });
  }
}
