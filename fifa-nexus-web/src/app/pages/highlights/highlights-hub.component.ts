import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NexusApiService } from '../../core/services/nexus-api.service';
import { Subscription } from 'rxjs';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  views: string;
  time: string;
  duration: string;
  youtubeId: string;
  match: string;
  tournament: string;
  teams: string;
}

@Component({
  selector: 'app-highlights-hub',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar relative bg-deep-black hide-scroll pb-24">
      
      <!-- HERO SECTION -->
      <div class="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
        
        <!-- Hero Image -->
        <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1920&q=80" class="absolute inset-0 w-full h-full object-cover object-center opacity-70 group-hover:scale-105 transition-transform duration-[10000ms] ease-out">
        
        <div class="absolute bottom-[20%] left-[5%] z-20 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div class="flex items-center gap-2 mb-4">
            <span class="px-2 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">Trending Now</span>
            <span class="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">FIFA World Cup 2026</span>
          </div>
          <h1 class="text-6xl font-display font-black text-white leading-tight tracking-wider mb-4 text-shadow-xl">ARGENTINA's GLORY</h1>
          <p class="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl text-shadow-sm">Lionel Messi orchestrates a breathtaking performance as Argentina secures a dominant victory in the World Cup.</p>
          
          <div class="flex items-center gap-4">
            <button (click)="openHeroVideo()" class="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
              Play Match
            </button>
            <button class="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-lg font-bold hover:bg-white/30 transition-colors border border-white/10">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              More Info
            </button>
          </div>
        </div>
      </div>

      <!-- CATEGORY NAVIGATION -->
      <div class="px-12 mb-8">
        <div class="flex items-center gap-4 overflow-x-auto custom-scrollbar pb-2">
          <button *ngFor="let cat of categories" (click)="setCategory(cat)"
            [ngClass]="activeCategory === cat ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20 border border-white/5'"
            class="px-6 py-2 rounded-full font-bold text-sm transition-colors whitespace-nowrap">
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- VIDEO ROWS -->
      <div class="px-12 space-y-12">
        <div *ngIf="isLoading" class="flex items-center justify-center py-20">
          <div class="w-12 h-12 border-4 border-cyan-accent border-t-transparent rounded-full animate-spin"></div>
        </div>

        <ng-container *ngIf="!isLoading">
          <div *ngFor="let row of rows">
            <h2 class="text-2xl font-bold text-white mb-6 tracking-wide">{{ row.title }}</h2>
            
            <div class="flex gap-6 overflow-x-auto custom-scrollbar pb-6 snap-x snap-mandatory">
              <!-- Video Card -->
              <div *ngFor="let video of row.videos; let i = index" class="min-w-[300px] w-[300px] xl:min-w-[380px] xl:w-[380px] snap-center shrink-0">
                <div (click)="openVideo(video, i, row.videos)" class="relative rounded-xl overflow-hidden cursor-pointer group/card transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:z-50 bg-deep-space">
                  
                  <div class="relative aspect-video bg-black">
                    <img [src]="video.thumbnail" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-black/20 group-hover/card:bg-transparent transition-colors"></div>
                    <div class="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs font-bold rounded">{{ video.duration }}</div>
                    
                    <!-- Play Button Overlay -->
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                        <svg class="w-6 h-6 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
                      </div>
                    </div>
                  </div>
                  
                  <div class="p-4 bg-gradient-to-b from-transparent to-black/80">
                    <h3 class="font-bold text-white text-lg mb-2 line-clamp-2 group-hover/card:text-cyan-accent transition-colors">{{ video.title }}</h3>
                    <div class="flex items-center text-sm text-gray-400">
                      <span>{{ video.views }} views</span>
                      <span class="mx-2">•</span>
                      <span>{{ video.time }}</span>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </ng-container>
      </div>

    <!-- Video Modal -->
    <div *ngIf="activeVideo" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm overflow-y-auto py-10" (click)="closeVideo()">
      <div class="w-full max-w-6xl bg-[#0a0a0a] rounded-2xl overflow-hidden relative shadow-2xl mx-4 my-auto border border-white/10" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex justify-between items-center p-4 border-b border-white/10">
          <div class="flex items-center gap-3">
             <span class="px-2 py-1 bg-red-600/20 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded border border-red-500/30">FIFA Nexus Player</span>
             <h3 class="text-white font-bold line-clamp-1">{{ activeVideo.title }}</h3>
          </div>
          <button (click)="closeVideo()" class="w-8 h-8 bg-white/5 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="flex flex-col lg:flex-row">
          
          <!-- Left: Player & Controls -->
          <div class="w-full lg:w-2/3 flex flex-col border-r border-white/10">
            <!-- Video Container -->
            <div class="relative aspect-video bg-black flex items-center justify-center" id="player-container">
               
               <div *ngIf="isVideoLoading && !videoError" class="absolute inset-0 flex items-center justify-center z-20 bg-black">
                 <div class="w-12 h-12 border-4 border-cyan-accent border-t-transparent rounded-full animate-spin"></div>
               </div>
               
               <div id="youtube-player" [ngClass]="{'hidden': videoError}"></div>

               <!-- Fallback if blocked -->
               <div *ngIf="videoError" class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-zinc-900/90 text-center p-6 border border-red-500/30">
                 <svg class="w-16 h-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                 <h2 class="text-xl font-bold text-white mb-2">Video Unavailable for Embedding</h2>
                 <p class="text-gray-400 mb-6 max-w-sm text-sm">This video contains content from FIFA, who has blocked it from being displayed within external applications.</p>
                 <a [href]="'https://www.youtube.com/watch?v=' + activeVideo.youtubeId" target="_blank" class="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-lg">
                   <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                   Watch on YouTube
                 </a>
               </div>
            </div>
            
            <!-- Controls Overlay (Only if no error) -->
            <div class="bg-zinc-900 p-4 flex items-center justify-between border-t border-white/5" *ngIf="!videoError">
              <div class="flex items-center gap-4">
                <button (click)="prevVideo()" class="text-white hover:text-cyan-accent transition-colors">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
                </button>
                <button (click)="togglePlay()" class="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <svg *ngIf="!isPlaying" class="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
                  <svg *ngIf="isPlaying" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                </button>
                <button (click)="nextVideo()" class="text-white hover:text-cyan-accent transition-colors">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M11.555 14.832A1 1 0 0010 14v-2.798L4.555 14.832A1 1 0 003 14V6a1 1 0 001.555-.832L10 8.798V6a1 1 0 001.555-.832l6 4a1 1 0 000 1.664l-6 4z" /></svg>
                </button>
                <button (click)="replayVideo()" class="text-gray-400 hover:text-white transition-colors ml-2" title="Replay">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
              </div>
              
              <div class="flex items-center gap-4">
                <button (click)="toggleFullscreen()" class="text-gray-400 hover:text-white transition-colors">
                   <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                </button>
                <a [href]="'https://www.youtube.com/watch?v=' + activeVideo.youtubeId" target="_blank" title="Watch on YouTube" class="text-gray-400 hover:text-red-500 transition-colors">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                </a>
              </div>
            </div>

            <!-- Video Metadata -->
            <div class="p-6 bg-black flex-1">
              <h2 class="text-2xl font-bold text-white mb-2">{{ activeVideo.title }}</h2>
              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-white/10">
                <span class="flex items-center gap-1"><svg class="w-4 h-4 text-cyan-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> {{ activeVideo.views }} Views</span>
                <span class="flex items-center gap-1"><svg class="w-4 h-4 text-cyan-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {{ activeVideo.time }}</span>
                <span class="flex items-center gap-1"><svg class="w-4 h-4 text-cyan-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> {{ activeVideo.tournament }}</span>
                <span class="flex items-center gap-1"><svg class="w-4 h-4 text-cyan-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> {{ activeVideo.teams }}</span>
              </div>
              <p class="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{{ activeVideo.description }}</p>
            </div>
          </div>
          
          <!-- Right: AI Match Analysis -->
          <div class="w-full lg:w-1/3 bg-zinc-950 p-6 flex flex-col h-[600px] lg:h-auto overflow-y-auto custom-scrollbar">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" class="w-4 h-4 filter grayscale invert opacity-80">
              </div>
              <h3 class="font-bold text-white uppercase tracking-widest text-sm">AI Match Analysis</h3>
            </div>
            
            <div *ngIf="isAiLoading" class="flex-1 flex flex-col items-center justify-center">
               <div class="w-8 h-8 border-2 border-premium-purple border-t-transparent rounded-full animate-spin mb-4"></div>
               <p class="text-xs text-premium-purple font-bold uppercase tracking-widest animate-pulse">Generating Insights...</p>
            </div>
            
            <div *ngIf="!isAiLoading" class="flex-1 space-y-6">
              <!-- Animated AI Content -->
              <div class="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed" [innerHTML]="aiAnalysisHtml"></div>
              
              <div class="bg-white/5 border border-white/10 rounded-xl p-4 mt-6">
                <h4 class="text-[10px] text-cyan-accent font-bold uppercase tracking-widest mb-3">Quick Stats</h4>
                <div class="space-y-3">
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-gray-400">Possession</span>
                    <span class="text-white font-bold">54% - 46%</span>
                  </div>
                  <div class="w-full bg-white/10 h-1.5 rounded-full overflow-hidden flex">
                    <div class="bg-cyan-accent h-full w-[54%]"></div>
                    <div class="bg-red-500 h-full w-[46%]"></div>
                  </div>
                  
                  <div class="flex justify-between items-center text-xs mt-4">
                    <span class="text-gray-400">Expected Goals (xG)</span>
                    <span class="text-white font-bold">2.1 - 0.8</span>
                  </div>
                  <div class="w-full bg-white/10 h-1.5 rounded-full overflow-hidden flex">
                    <div class="bg-cyan-accent h-full w-[70%]"></div>
                    <div class="bg-red-500 h-full w-[30%]"></div>
                  </div>
                  
                  <div class="flex justify-between items-center text-xs mt-4">
                    <span class="text-gray-400">Total Shots</span>
                    <span class="text-white font-bold">14 - 6</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .hide-scroll::-webkit-scrollbar { display: none; }
    .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,194,255,0.5); }
    .prose strong { color: #fff; }
  `]
})
export class HighlightsHubComponent implements OnInit, OnDestroy {
  categories = ['For You', 'World Cup 2026', 'Group Stages', 'Knockouts', 'Classic Matches', 'Skills & Goals'];
  activeCategory = 'For You';
  
  rows: any[] = [];
  isLoading = true;

  // Video Modal State
  activeVideo: Video | null = null;
  activeVideoIndex: number = 0;
  activeVideoList: Video[] = [];
  
  // Player State
  player: any;
  isVideoLoading = false;
  videoError = false;
  isPlaying = false;
  
  // AI State
  isAiLoading = false;
  aiAnalysisHtml = '';
  private aiSub?: Subscription;

  constructor(
    private sanitizer: DomSanitizer, 
    private api: NexusApiService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    this.initYouTubeAPI();
    this.fetchHighlights(this.activeCategory);
  }

  ngOnDestroy() {
    if (this.aiSub) this.aiSub.unsubscribe();
    this.destroyPlayer();
  }

  initYouTubeAPI() {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {};
    }
  }

  setCategory(cat: string) {
    this.activeCategory = cat;
    this.fetchHighlights(cat);
  }

  fetchHighlights(category: string) {
    this.isLoading = true;
    let query = 'FIFA World Cup Highlights';
    if (category !== 'For You') {
       query = `FIFA World Cup ${category}`;
    }

    this.api.getYoutubeHighlights(query).subscribe({
      next: (res) => {
        if (res.items && res.items.length > 0) {
          const videos = res.items.map((item: any) => ({
            id: item.id.videoId,
            youtubeId: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description || 'Watch the highlights of this incredible match from the FIFA World Cup.',
            thumbnail: item.snippet.thumbnails.high.url,
            views: (Math.floor(Math.random() * 5000) + 100).toLocaleString(),
            time: new Date(item.snippet.publishedAt).toLocaleDateString(),
            duration: ['04:20', '10:15', '08:45', '12:30'][Math.floor(Math.random() * 4)],
            match: 'Featured Match',
            tournament: 'FIFA World Cup™',
            teams: 'International Teams'
          }));
          
          this.rows = [
            {
              title: `Trending in ${category}`,
              videos: videos
            }
          ];
        } else {
          this.rows = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load highlights', err);
        this.isLoading = false;
      }
    });
  }

  openHeroVideo() {
    const heroVid: Video = {
      id: 'F17j2O0R1_s',
      youtubeId: 'F17j2O0R1_s',
      title: "ARGENTINA's GLORY - World Cup Highlights",
      description: "Lionel Messi orchestrates a breathtaking performance as Argentina secures a dominant victory.",
      thumbnail: '',
      views: '12,450,000',
      time: 'Dec 18, 2022',
      duration: '14:20',
      match: 'Final',
      tournament: 'FIFA World Cup 2022',
      teams: 'Argentina vs France'
    };
    this.openVideo(heroVid, 0, [heroVid]);
  }

  openVideo(video: Video, index: number, list: Video[]) {
    this.activeVideo = video;
    this.activeVideoIndex = index;
    this.activeVideoList = list;
    this.videoError = false;
    this.isVideoLoading = true;
    this.isPlaying = false;
    this.aiAnalysisHtml = '';
    
    // Slight delay to allow DOM to render modal container before initializing player
    setTimeout(() => {
      this.initPlayer(video.youtubeId);
      this.startAiAnalysis(video.title);
    }, 100);
  }

  closeVideo() {
    this.destroyPlayer();
    this.activeVideo = null;
    if (this.aiSub) this.aiSub.unsubscribe();
  }

  initPlayer(youtubeId: string) {
    this.destroyPlayer();
    
    if (window.YT && window.YT.Player) {
      this.player = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 0
        },
        events: {
          onReady: () => {
            this.ngZone.run(() => {
              this.isVideoLoading = false;
              this.isPlaying = true;
              this.cdr.detectChanges();
            });
          },
          onStateChange: (event: any) => {
            this.ngZone.run(() => {
              // Playing state is 1, Paused is 2
              this.isPlaying = event.data === 1;
              this.cdr.detectChanges();
            });
          },
          onError: (event: any) => {
            console.error('YouTube Player Error:', event.data);
            this.ngZone.run(() => {
              // Codes 101 and 150 mean embedding is disabled
              this.videoError = true;
              this.isVideoLoading = false;
              this.isPlaying = false;
              this.destroyPlayer();
              this.cdr.detectChanges();
            });
          }
        }
      });
    } else {
      // Fallback if API hasn't loaded yet
      setTimeout(() => this.initPlayer(youtubeId), 500);
    }
  }

  destroyPlayer() {
    if (this.player && typeof this.player.destroy === 'function') {
      this.player.destroy();
      this.player = null;
    }
  }

  // Player Controls
  togglePlay() {
    if (!this.player || typeof this.player.getPlayerState !== 'function') return;
    const state = this.player.getPlayerState();
    if (state === 1) { // Playing
      this.player.pauseVideo();
    } else {
      this.player.playVideo();
    }
  }

  replayVideo() {
    if (this.player && typeof this.player.seekTo === 'function') {
      this.player.seekTo(0);
      this.player.playVideo();
    }
  }

  nextVideo() {
    if (this.activeVideoList.length === 0) return;
    let nextIndex = this.activeVideoIndex + 1;
    if (nextIndex >= this.activeVideoList.length) nextIndex = 0;
    this.openVideo(this.activeVideoList[nextIndex], nextIndex, this.activeVideoList);
  }

  prevVideo() {
    if (this.activeVideoList.length === 0) return;
    let prevIndex = this.activeVideoIndex - 1;
    if (prevIndex < 0) prevIndex = this.activeVideoList.length - 1;
    this.openVideo(this.activeVideoList[prevIndex], prevIndex, this.activeVideoList);
  }

  toggleFullscreen() {
    const container = document.getElementById('player-container');
    if (!container) return;
    
    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // AI Stream
  startAiAnalysis(videoTitle: string) {
    if (this.aiSub) this.aiSub.unsubscribe();
    this.isAiLoading = true;
    this.aiAnalysisHtml = '';
    
    // Simulate initial delay
    setTimeout(() => {
      this.isAiLoading = false;
      this.aiSub = this.api.streamAiInsight(`Analyze this highlight: ${videoTitle}`).subscribe({
        next: (chunk) => {
          // Simple markdown parsing for bold
          const formattedChunk = chunk.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
          this.aiAnalysisHtml += formattedChunk;
          this.cdr.detectChanges();
        }
      });
    }, 1500);
  }
}
