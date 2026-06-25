import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div class="absolute inset-0 bg-deep-space/80 backdrop-blur-sm" (click)="close()"></div>
      
      <div class="relative w-full max-w-2xl bg-deep-space border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Search Input -->
        <div class="flex items-center px-4 py-4 border-b border-white/5 bg-white/5">
          <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" #searchInput (input)="onSearch(searchInput.value)" placeholder="What do you want to do?" 
                 class="w-full bg-transparent text-white focus:outline-none placeholder-gray-500 text-lg">
          <kbd class="hidden sm:inline-block px-2 py-1 bg-white/10 border border-white/10 rounded text-[10px] text-gray-400 font-mono ml-3">ESC</kbd>
        </div>

        <!-- Commands List -->
        <div class="max-h-96 overflow-y-auto custom-scrollbar p-2">
          
          <!-- Section 1 -->
          <div *ngIf="filteredCommands('ai').length > 0">
            <div class="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI & Intelligence</div>
            <button *ngFor="let cmd of filteredCommands('ai')" (click)="executeCommand(cmd)" 
                    class="w-full text-left flex items-center px-3 py-3 rounded-xl hover:bg-white/5 group transition-colors">
              <div class="w-8 h-8 rounded-lg bg-electric-blue/20 text-electric-blue flex items-center justify-center mr-4 group-hover:bg-electric-blue group-hover:text-white transition-colors">
                <span [innerHTML]="cmd.icon"></span>
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-200 group-hover:text-white">{{ cmd.title }}</div>
                <div class="text-xs text-gray-500">{{ cmd.description }}</div>
              </div>
            </button>
          </div>

          <!-- Section 2 -->
          <div *ngIf="filteredCommands('nav').length > 0" class="mt-2">
            <div class="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Navigation</div>
            <button *ngFor="let cmd of filteredCommands('nav')" (click)="executeCommand(cmd)" 
                    class="w-full text-left flex items-center px-3 py-3 rounded-xl hover:bg-white/5 group transition-colors">
              <div class="w-8 h-8 rounded-lg bg-white/5 text-gray-400 flex items-center justify-center mr-4 group-hover:bg-cyan-accent group-hover:text-deep-space transition-colors">
                <span [innerHTML]="cmd.icon"></span>
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-200 group-hover:text-white">{{ cmd.title }}</div>
                <div class="text-xs text-gray-500">{{ cmd.description }}</div>
              </div>
            </button>
          </div>

          <div *ngIf="filteredCommands('all').length === 0" class="p-8 text-center text-gray-500">
            No commands found matching your search.
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
  `]
})
export class CommandPaletteComponent implements OnInit {
  isOpen = false;
  searchQuery = '';

  commands = [
    { id: 'ai-predict', type: 'ai', title: 'Match Prediction', description: 'Ask AI to predict a match outcome', icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>', action: () => this.router.navigate(['/ai-workspace']) },
    { id: 'ai-scout', type: 'ai', title: 'Player Scout', description: 'Find upcoming talents', icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>', action: () => this.router.navigate(['/ai-workspace']) },
    { id: 'ai-fantasy', type: 'ai', title: 'Fantasy Advisor', description: 'Get fantasy team recommendations', icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>', action: () => this.router.navigate(['/ai-workspace']) },
    
    { id: 'nav-live', type: 'nav', title: 'Live Match Center', description: 'View live scores and real-time stats', icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" /></svg>', action: () => this.router.navigate(['/live-center']) },
    { id: 'nav-dash', type: 'nav', title: 'Command Center', description: 'Go to main dashboard', icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>', action: () => this.router.navigate(['/dashboard']) },
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.searchQuery = '';
      }
    }
    
    if (event.key === 'Escape' && this.isOpen) {
      this.close();
    }
  }

  onSearch(query: string) {
    this.searchQuery = query.toLowerCase();
  }

  filteredCommands(type: string) {
    const matched = this.commands.filter(c => 
      c.title.toLowerCase().includes(this.searchQuery) || 
      c.description.toLowerCase().includes(this.searchQuery)
    );
    if (type === 'all') return matched;
    return matched.filter(c => c.type === type);
  }

  executeCommand(cmd: any) {
    this.close();
    cmd.action();
  }

  close() {
    this.isOpen = false;
  }
}
