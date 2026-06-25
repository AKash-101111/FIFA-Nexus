import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NexusDataService, Match, Team } from '../../core/services/nexus-data.service';
import { Subscription } from 'rxjs';
import gsap from 'gsap';

@Component({
  selector: 'app-live-center',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-[1920px] mx-auto h-[calc(100vh-5rem)] flex flex-col overflow-hidden bg-[#050816]">
      <!-- Header -->
      <div class="mb-6 flex flex-col items-center justify-center text-center header-anim">
        <h1 class="text-3xl md:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#00D9FF] tracking-tighter uppercase mb-2">
          FIFA WORLD CUP 2026
        </h1>
        <p class="text-sm md:text-base text-gray-400 font-bold tracking-[0.2em] uppercase">
          Live Command Center
        </p>
      </div>

      <!-- Top Status Bar -->
      <div class="flex items-center justify-between mb-6 glass-panel rounded-2xl p-4 shrink-0 status-bar-anim shadow-[0_10px_30px_rgba(0,191,255,0.05)] border border-[#00BFFF]/20">
        <div class="flex gap-8">
          <div class="flex flex-col">
            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Live Matches</span>
            <span class="text-3xl font-display font-black text-red-500 counter-live">{{liveMatches.length}}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Upcoming</span>
            <span class="text-3xl font-display font-black text-[#00BFFF] counter-upcoming">{{upcomingMatches.length}}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Finished</span>
            <span class="text-3xl font-display font-black text-green-500 counter-finished">{{finishedMatches.length}}</span>
          </div>
          <div class="flex flex-col hidden sm:flex">
            <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Updated</span>
            <span class="text-xl font-display font-black text-white mt-1">{{lastUpdated | date:'shortTime'}}</span>
          </div>
        </div>
        
        <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <div class="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
          <span class="text-xs text-red-500 font-bold tracking-widest uppercase">Live Sync Active</span>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="flex-1 flex gap-6 min-h-0">
        
        <!-- Center Panel: Matches Grid -->
        <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
          
          <div *ngIf="loading" class="flex justify-center items-center h-64">
            <div class="w-12 h-12 border-4 border-[#00BFFF]/30 border-t-[#00BFFF] rounded-full animate-spin"></div>
          </div>

          <!-- Fallback when no live matches exist -->
          <div *ngIf="!loading && liveMatches.length === 0" class="flex flex-col gap-6">
            <div class="glass-panel rounded-3xl p-6 border border-white/5">
              <h3 class="text-xl text-white font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                <svg class="w-6 h-6 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Next Up
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div *ngFor="let um of upcomingMatches | slice:0:2" class="bg-black/40 rounded-xl p-4 border border-white/5 hover:border-gold-accent/30 transition-colors">
                  <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{{ um.date | date:'short' }}</div>
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-lg">{{ getTeam(um.homeTeamId)?.shortName }}</span>
                    <span class="text-xs text-gray-500">vs</span>
                    <span class="font-bold text-lg">{{ getTeam(um.awayTeamId)?.shortName }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="glass-panel rounded-3xl p-6 border border-white/5">
              <h3 class="text-xl text-white font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
                <svg class="w-6 h-6 text-electric-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Recent Results
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div *ngFor="let fm of finishedMatches | slice:0:2" class="bg-black/40 rounded-xl p-4 border border-white/5">
                  <div class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">FT</div>
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-lg text-gray-500">{{ getTeam(fm.homeTeamId)?.shortName }}</span>
                    <span class="font-black text-xl text-white">{{ fm.homeScore }} - {{ fm.awayScore }}</span>
                    <span class="font-bold text-lg text-electric-blue">{{ getTeam(fm.awayTeamId)?.shortName }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-2 gap-5 matches-grid" *ngIf="!loading && allMatches.length > 0">
            
            <div *ngFor="let match of allMatches" (click)="goToMatch(match.id)" 
                 class="glass-panel rounded-2xl p-5 cursor-pointer hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,191,255,0.15)] transition-all group border border-white/5 relative overflow-hidden match-card"
                 [ngClass]="{'hover:border-red-500/50': match.status === 'live', 'hover:border-[#00BFFF]/50': match.status === 'upcoming', 'hover:border-green-500/50': match.status === 'finished'}">
              
              <!-- Glow Effect -->
              <div class="absolute -right-12 -bottom-12 w-40 h-40 rounded-full blur-[50px] transition-all opacity-20 group-hover:opacity-40"
                   [ngClass]="{'bg-red-500': match.status === 'live', 'bg-[#00BFFF]': match.status === 'upcoming', 'bg-green-500': match.status === 'finished'}"></div>
              
              <div class="flex justify-between items-center mb-5">
                <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{match.venue || 'FIFA World Cup Stadium'}}</span>
                
                <span *ngIf="match.status === 'live'" class="text-[10px] bg-red-500 text-white px-2 py-1 rounded shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse font-bold tracking-wider">LIVE {{match.minute}}'</span>
                <span *ngIf="match.status === 'finished'" class="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded font-bold tracking-wider">FT</span>
                <span *ngIf="match.status === 'upcoming'" class="text-[10px] bg-[#00BFFF]/20 text-[#00BFFF] border border-[#00BFFF]/30 px-2 py-1 rounded font-bold tracking-wider">{{match.date | date:'shortTime'}}</span>
              </div>
              
              <div class="flex justify-between items-center mb-6 relative z-10">
                <!-- Home Team -->
                <div class="flex flex-col items-center gap-3 flex-1">
                  <div class="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden text-2xl shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]">
                    {{ getTeam(match.homeTeamId)?.flag }}
                  </div>
                  <span class="text-sm font-bold text-gray-200 text-center leading-tight">{{ getTeam(match.homeTeamId)?.name }}</span>
                </div>
                
                <!-- Score -->
                <div class="flex flex-col items-center justify-center px-4 shrink-0">
                  <div class="text-4xl md:text-5xl font-display font-black text-white tracking-widest drop-shadow-lg">
                    <ng-container *ngIf="match.status !== 'upcoming'">{{match.homeScore}} - {{match.awayScore}}</ng-container>
                    <ng-container *ngIf="match.status === 'upcoming'">VS</ng-container>
                  </div>
                </div>
                
                <!-- Away Team -->
                <div class="flex flex-col items-center gap-3 flex-1">
                  <div class="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden text-2xl shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]">
                    {{ getTeam(match.awayTeamId)?.flag }}
                  </div>
                  <span class="text-sm font-bold text-gray-200 text-center leading-tight">{{ getTeam(match.awayTeamId)?.name }}</span>
                </div>
              </div>

              <!-- Match Analytics (If Available) -->
              <div *ngIf="match.status !== 'upcoming'" class="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 relative z-10">
                <div class="text-center">
                  <div class="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Possession</div>
                  <div class="text-xs font-bold text-white">55% - 45%</div>
                </div>
                <div class="text-center border-l border-r border-white/10">
                  <div class="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Shots</div>
                  <div class="text-xs font-bold text-white">6 - 4</div>
                </div>
                <div class="text-center">
                  <div class="text-[9px] text-gray-500 uppercase tracking-widest mb-1">xG</div>
                  <div class="text-xs font-bold text-white">1.2 - 0.8</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: AI Insights Hub -->
        <div class="hidden 2xl:flex w-80 glass-panel rounded-3xl p-6 flex-col border border-white/5 insights-anim">
          <div class="flex items-center gap-3 mb-6">
            <svg class="w-5 h-5 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 class="text-white font-bold tracking-widest uppercase text-sm">Gemini AI Insights</h2>
          </div>
          
          <div class="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
            
            <div *ngIf="loadingInsights" class="flex flex-col gap-3">
               <div class="h-20 w-full bg-white/5 animate-pulse rounded-xl"></div>
               <div class="h-24 w-full bg-white/5 animate-pulse rounded-xl"></div>
            </div>

            <div *ngIf="!loadingInsights && insights.length === 0" class="text-xs text-gray-500 text-center mt-10">
              Waiting for live match events...
            </div>

            <div *ngFor="let insight of insights" class="p-4 bg-gradient-to-br from-[#0A1024] to-[#070B1A] border border-white/10 rounded-2xl hover:border-[#00BFFF]/40 transition-colors shadow-lg">
              <h3 class="text-[10px] font-bold text-[#00BFFF] uppercase tracking-widest mb-2">{{insight.title}}</h3>
              <p class="text-sm text-gray-300 leading-relaxed">{{insight.content}}</p>
              <div class="mt-3 text-[9px] text-gray-600 font-bold uppercase tracking-wider text-right">{{insight.time}}</div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .glass-panel {
      background: rgba(10, 16, 36, 0.6);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 191, 255, 0.5); }
  `]
})
export class LiveCenterComponent implements OnInit, OnDestroy, AfterViewInit {
  allMatches: Match[] = [];
  liveMatches: Match[] = [];
  upcomingMatches: Match[] = [];
  finishedMatches: Match[] = [];
  teams: Team[] = [];
  
  insights: any[] = [];
  
  lastUpdated: Date = new Date();
  loading: boolean = true;
  loadingInsights: boolean = false;
  
  private sub!: Subscription;
  private tSub!: Subscription;

  constructor(private router: Router, private dataService: NexusDataService) {}

  ngOnInit() {
    this.tSub = this.dataService.teams$.subscribe(t => this.teams = t);
    
    this.sub = this.dataService.matches$.subscribe(m => {
      const isFirstLoad = this.loading;
      
      this.allMatches = [...m].sort((a, b) => {
        if (a.status === 'live' && b.status !== 'live') return -1;
        if (a.status !== 'live' && b.status === 'live') return 1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      this.liveMatches = this.allMatches.filter(x => x.status === 'live');
      this.upcomingMatches = this.allMatches.filter(x => x.status === 'upcoming');
      this.finishedMatches = this.allMatches.filter(x => x.status === 'finished');

      this.generateInsights();
      this.lastUpdated = new Date();
      this.loading = false;
      
      if (isFirstLoad) {
        this.animateCards();
      }
    });
  }

  ngAfterViewInit() {
    this.initAnimations();
  }

  getTeam(id: string): Team | undefined {
    return this.teams.find(t => t.id === id);
  }

  initAnimations() {
    const tl = gsap.timeline();
    tl.fromTo('.header-anim', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo('.status-bar-anim', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .fromTo('.insights-anim', { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4');
  }

  animateCards() {
    setTimeout(() => {
      gsap.fromTo('.match-card', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.2)' }
      );
    }, 50);
  }

  generateInsights() {
    if (this.liveMatches.length > 0) {
      const match = this.liveMatches[0];
      const home = this.getTeam(match.homeTeamId)?.name;
      const away = this.getTeam(match.awayTeamId)?.name;
      this.insights = [{
        title: 'Tactical Analysis',
        content: `${home} has generated high xG and controls midfield transitions against ${away}.`,
        time: 'Just now'
      }];
    } else {
      this.insights = [{
        title: 'Tournament Overview',
        content: 'The World Cup stages have been incredibly competitive. Expect tactical shifts in the upcoming fixtures.',
        time: 'Today'
      }];
    }
  }

  goToMatch(id: string) {
    this.router.navigate(['/live-center', id]);
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
    if (this.tSub) this.tSub.unsubscribe();
  }
}
