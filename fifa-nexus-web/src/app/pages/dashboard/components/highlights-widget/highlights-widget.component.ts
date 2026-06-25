import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NexusApiService } from '../../../../core/services/nexus-api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-highlights-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-panel rounded-3xl p-6 h-full flex flex-col hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,194,255,0.2)] transition-all duration-500 relative overflow-hidden">
      <div class="flex justify-between items-center mb-6 relative z-10">
        <h2 class="font-display text-xl font-bold uppercase tracking-widest text-white">Latest Highlights</h2>
        <a href="#" class="text-xs text-cyan-accent hover:text-white transition-colors uppercase tracking-widest">View All</a>
      </div>

      <div *ngIf="isLoading" class="flex-1 flex items-center justify-center">
        <div class="w-8 h-8 border-2 border-cyan-accent border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div *ngIf="!isLoading && videos.length > 0" class="flex overflow-x-auto gap-4 custom-scrollbar pb-2">
        <div *ngFor="let video of videos" class="flex-none w-64 group cursor-pointer relative rounded-2xl overflow-hidden aspect-video">
          <!-- Thumbnail -->
          <img [src]="video.snippet.thumbnails.medium.url" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
          
          <!-- Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
          
          <!-- Play Button (pure CSS) -->
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-50">
            <div class="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center backdrop-blur-sm">
              <svg class="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          <!-- Title -->
          <div class="absolute bottom-0 left-0 w-full p-3">
            <p class="text-white text-xs font-bold line-clamp-2 leading-tight drop-shadow-lg" [innerHTML]="video.snippet.title"></p>
          </div>
        </div>
      </div>
      
      <!-- Fallback if quota exceeded -->
      <div *ngIf="!isLoading && videos.length === 0" class="flex-1 flex items-center justify-center">
         <p class="text-gray-500 text-xs uppercase tracking-widest text-center">Highlights temporarily<br>unavailable.</p>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); rounded: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,194,255,0.8); }
  `]
})
export class HighlightsWidgetComponent implements OnInit {
  videos: any[] = [];
  isLoading = true;

  constructor(private api: NexusApiService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.api.getYoutubeHighlights('FIFA World Cup Highlights').subscribe({
      next: (res) => {
        this.videos = res.items || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load highlights', err);
        this.isLoading = false;
      }
    });
  }
}
