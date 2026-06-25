import { Component, HostListener, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NexusDataService } from '../../../core/services/nexus-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-deep-space/80 backdrop-blur-sm" (click)="close()">
      <div class="w-full max-w-2xl bg-black/60 border border-white/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200" (click)="$event.stopPropagation()">
        
        <div class="flex items-center px-4 py-3 border-b border-white/10">
          <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input #searchInput type="text" [(ngModel)]="query" (ngModelChange)="onSearch()" placeholder="Search teams, players, matches, or actions..." class="flex-1 bg-transparent border-none text-white focus:outline-none placeholder-gray-500 text-lg">
          <div class="flex gap-1 ml-3">
            <kbd class="px-2 py-1 bg-white/10 rounded text-[10px] text-gray-400 font-mono">ESC</kbd>
          </div>
        </div>

        <div class="max-h-96 overflow-y-auto custom-scrollbar p-2">
          
          <div *ngIf="query === ''" class="p-4 text-center text-gray-500 text-sm">
            Try searching for "Argentina", "Messi", or "Live Matches"
          </div>

          <div *ngIf="query !== '' && results.length === 0" class="p-8 text-center text-gray-400">
            No results found for "{{ query }}"
          </div>

          <div *ngFor="let group of resultGroups" class="mb-4">
            <div *ngIf="group.items.length > 0">
               <h3 class="px-3 py-1 text-[10px] font-bold text-cyan-accent uppercase tracking-widest">{{ group.title }}</h3>
               <div *ngFor="let item of group.items" (click)="navigate(item.route)" class="px-3 py-3 rounded-xl hover:bg-white/10 cursor-pointer flex items-center justify-between group transition-colors">
                 <div class="flex items-center gap-3">
                   <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-cyan-accent group-hover:bg-cyan-accent/10 transition-colors">
                     <i class="fas fa-arrow-right text-xs"></i>
                   </div>
                   <span class="text-sm text-gray-200 group-hover:text-white font-medium">{{ item.name }}</span>
                 </div>
                 <span class="text-[10px] text-gray-500 uppercase tracking-widest">{{ item.type }}</span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
  `]
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  isOpen = false;
  query = '';
  
  allData: any[] = [
    { name: 'Live Command Center', route: '/live', type: 'Page', category: 'Navigation' },
    { name: 'Group Stages', route: '/groups', type: 'Page', category: 'Navigation' },
    { name: 'Knockout Bracket', route: '/knockout', type: 'Page', category: 'Navigation' },
    { name: 'AI Workspace', route: '/ai-workspace', type: 'Page', category: 'Navigation' }
  ];

  results: any[] = [];
  resultGroups: { title: string, items: any[] }[] = [];
  
  private sub?: Subscription;

  constructor(private router: Router, private dataService: NexusDataService) {}

  ngOnInit() {
    this.sub = this.dataService.teams$.subscribe(teams => {
      const teamData = teams.map(t => ({ name: t.name, route: '/teams', type: 'Team', category: 'Teams' }));
      this.allData = [...this.allData.filter(d => d.category !== 'Teams'), ...teamData];
    });

    const sub2 = this.dataService.players$.subscribe(players => {
      const playerData = players.map(p => ({ name: p.name, route: '/players', type: 'Player', category: 'Players' }));
      this.allData = [...this.allData.filter(d => d.category !== 'Players'), ...playerData];
    });
    this.sub.add(sub2);
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.toggle();
    }
    if (event.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.query = '';
      this.results = [];
      this.resultGroups = [];
      setTimeout(() => {
        if (this.searchInput) {
          this.searchInput.nativeElement.focus();
        }
      }, 50);
    }
  }

  close() {
    this.isOpen = false;
  }

  onSearch() {
    const q = this.query.toLowerCase().trim();
    if (!q) {
      this.results = [];
      this.resultGroups = [];
      return;
    }

    this.results = this.allData.filter(item => item.name.toLowerCase().includes(q));
    
    // Group results
    const groups: any = {};
    this.results.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });

    this.resultGroups = Object.keys(groups).map(key => ({
      title: key,
      items: groups[key]
    }));
  }

  navigate(route: string) {
    this.router.navigate([route]);
    this.close();
  }
}

