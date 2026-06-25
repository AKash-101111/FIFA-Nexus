import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NexusApiService } from '../../core/services/nexus-api.service';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  views: string;
  time: string;
  youtubeId: string;
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
            <button (click)="openVideo('F17j2O0R1_s')" class="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)]">
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
          <button class="px-6 py-2 rounded-full bg-white text-black font-bold text-sm whitespace-nowrap">For You</button>
          <button class="px-6 py-2 rounded-full bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors whitespace-nowrap border border-white/5">World Cup 2026</button>
          <button class="px-6 py-2 rounded-full bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors whitespace-nowrap border border-white/5">Group Stages</button>
          <button class="px-6 py-2 rounded-full bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors whitespace-nowrap border border-white/5">Knockouts</button>
          <button class="px-6 py-2 rounded-full bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors whitespace-nowrap border border-white/5">Classic Matches</button>
          <button class="px-6 py-2 rounded-full bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors whitespace-nowrap border border-white/5">Skills & Goals</button>
        </div>
      </div>

      <!-- VIDEO ROWS -->
      <div class="px-12 space-y-12">
        <ng-container *ngFor="let row of rows">
          <div>
            <h2 class="text-2xl font-bold text-white mb-6 tracking-wide">{{ row.title }}</h2>
            
            <div class="flex gap-6 overflow-x-auto custom-scrollbar pb-6 snap-x snap-mandatory">
              
              <!-- Video Card -->
              <div *ngFor="let video of row.videos" class="min-w-[300px] w-[300px] xl:min-w-[380px] xl:w-[380px] snap-center shrink-0">
                <div (click)="openVideo(video.youtubeId)" class="relative rounded-xl overflow-hidden cursor-pointer group/card transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:z-50 bg-deep-space">
                  
                  <div class="relative aspect-video bg-black">
                    <img [src]="video.thumbnail" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-black/20 group-hover/card:bg-transparent transition-colors"></div>
                    <div class="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs font-bold rounded">10:45</div>
                    
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
    <div *ngIf="activeVideoUrl" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm" (click)="closeVideo()">
      <div class="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden relative shadow-2xl" (click)="$event.stopPropagation()">
        <button (click)="closeVideo()" class="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <iframe [src]="activeVideoUrl" class="w-full h-full" frameborder="0" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .hide-scroll::-webkit-scrollbar { display: none; }
    .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    .custom-scrollbar::-webkit-scrollbar { height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,194,255,0.5); }
  `]
})
export class HighlightsHubComponent implements OnInit {
  activeVideoUrl: SafeResourceUrl | null = null;
  rows: any[] = [];
  isLoading = true;

  constructor(private sanitizer: DomSanitizer, private api: NexusApiService) {}
  
  ngOnInit() {
    this.fetchHighlights();
  }

  fetchHighlights() {
    this.api.getYoutubeHighlights('FIFA World Cup Highlights').subscribe({
      next: (res) => {
        if (res.items && res.items.length > 0) {
          const videos = res.items.map((item: any) => ({
            id: item.id.videoId,
            youtubeId: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            views: 'Popular',
            time: new Date(item.snippet.publishedAt).toLocaleDateString()
          }));
          
          this.rows = [
            {
              title: 'FIFA World Cup Highlights',
              videos: videos
            }
          ];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load highlights', err);
        this.isLoading = false;
      }
    });
  }

  openVideo(youtubeId: string) {
    if (!youtubeId) return;
    const url = 'https://www.youtube.com/embed/' + youtubeId + '?autoplay=1&controls=0&modestbranding=1&rel=0';
    this.activeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  closeVideo() {
    this.activeVideoUrl = null;
  }
}
