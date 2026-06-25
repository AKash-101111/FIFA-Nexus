import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NexusDataService, Team } from '../../core/services/nexus-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-[1920px] mx-auto min-h-screen text-white">
      <h1 class="text-4xl font-display font-black tracking-tighter uppercase mb-8">Group Stage</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div *ngFor="let group of groups" class="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-cyan-accent/30 transition-colors">
          <h2 class="text-xl font-bold text-cyan-accent mb-4">Group {{ group.name }}</h2>
          
          <table class="w-full text-sm">
            <thead>
              <tr class="text-gray-400 border-b border-white/10 text-xs tracking-widest uppercase">
                <th class="text-left pb-2 w-8">#</th>
                <th class="text-left pb-2">Team</th>
                <th class="text-center pb-2 w-8">MP</th>
                <th class="text-center pb-2 w-8">W</th>
                <th class="text-center pb-2 w-8">D</th>
                <th class="text-center pb-2 w-8">L</th>
                <th class="text-center pb-2 w-8">GF</th>
                <th class="text-center pb-2 w-8">GA</th>
                <th class="text-center pb-2 w-8">GD</th>
                <th class="text-right pb-2 w-8">Pts</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let team of group.teams; let i = index" class="border-b border-white/5 hover:bg-white/10 transition-colors cursor-pointer group" [ngClass]="{'bg-green-500/10': i < 2}">
                <td class="py-3">
                  <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" [ngClass]="{'bg-cyan-accent/20 text-cyan-accent': i < 2, 'text-gray-500': i >= 2}">{{ i + 1 }}</div>
                </td>
                <td class="py-3 flex items-center gap-2">
                  <span class="text-lg">{{ team.flag }}</span>
                  <span class="font-bold truncate group-hover:text-cyan-accent transition-colors">{{ team.name }}</span>
                </td>
                <td class="py-3 text-center text-gray-400 font-mono">{{ team.played }}</td>
                <td class="py-3 text-center text-green-400 font-mono">{{ team.won }}</td>
                <td class="py-3 text-center text-yellow-400 font-mono">{{ team.drawn }}</td>
                <td class="py-3 text-center text-red-400 font-mono">{{ team.lost }}</td>
                <td class="py-3 text-center font-mono">{{ team.gf }}</td>
                <td class="py-3 text-center font-mono">{{ team.ga }}</td>
                <td class="py-3 text-center font-mono" [ngClass]="{'text-green-400': team.gd > 0, 'text-red-400': team.gd < 0}">{{ team.gd > 0 ? '+' + team.gd : team.gd }}</td>
                <td class="py-3 text-right font-bold text-cyan-accent font-display text-lg">{{ team.points }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class GroupsComponent implements OnInit, OnDestroy {
  groups: { name: string, teams: Team[] }[] = [];
  private sub?: Subscription;

  constructor(private dataService: NexusDataService) {}

  ngOnInit() {
    this.sub = this.dataService.teams$.subscribe(teams => {
      // Group teams by 'group' letter and sort them by points, then gd, then gf
      const groupMap = new Map<string, Team[]>();
      
      teams.forEach(t => {
        if (!groupMap.has(t.group)) {
          groupMap.set(t.group, []);
        }
        groupMap.get(t.group)?.push({ ...t });
      });

      this.groups = Array.from(groupMap.keys()).sort().map(key => {
        const groupTeams = groupMap.get(key) || [];
        groupTeams.sort((a, b) => {
          if (b.points !== a.points) return b.points - a.points;
          if (b.gd !== a.gd) return b.gd - a.gd;
          return b.gf - a.gf;
        });
        
        // Pad out missing teams to ensure 4 teams per group for the UI
        while (groupTeams.length < 4) {
          groupTeams.push({
            id: 'TBD', name: 'TBD', shortName: 'TBD', flag: '🏳️', group: key,
            points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, ranking: 0, manager: '', formation: ''
          });
        }

        return { name: key, teams: groupTeams };
      });
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
