import { Component, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-b from-deep-black/60 via-deep-black/40 to-deep-black z-10"></div>
        <img src="assets/images/hero-bg.png" alt="Stadium" class="w-full h-full object-cover object-center hero-img opacity-80" />
      </div>

      <!-- Hero Content -->
      <div class="relative z-20 text-center px-6 max-w-5xl mx-auto hero-content">
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-500 drop-shadow-2xl">
          Where Football Meets <span class="text-gold-accent">Intelligence</span>
        </h1>
        <p class="text-lg md:text-2xl text-gray-300 font-light max-w-3xl mx-auto mb-10 leading-relaxed hero-subtitle">
          Live Scores. Advanced Analytics. AI Insights. Experience the world's most advanced global football ecosystem.
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 hero-buttons">
          <button class="px-8 py-4 bg-gold-accent hover:bg-yellow-500 text-deep-black rounded-sm font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] w-full sm:w-auto">
            Explore Platform
          </button>
          <button class="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-sm font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-105 w-full sm:w-auto flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch Live Matches
          </button>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/50">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-32 px-6 relative z-10 bg-deep-black overflow-hidden">
      <!-- Decorative Elements -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-royal-blue/20 rounded-full blur-[150px] -z-10"></div>
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-accent/10 rounded-full blur-[150px] -z-10"></div>

      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-20 section-header">
          <h2 class="text-gold-accent font-bold uppercase tracking-[0.2em] text-sm mb-4">The Nexus Ecosystem</h2>
          <h3 class="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-6">Everything You Need To <br/> Dominate The Game</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <!-- Feature Card 1 -->
          <div #featureCard class="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-royal-blue to-gold-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="w-14 h-14 bg-royal-blue/30 rounded-xl flex items-center justify-center mb-6 border border-royal-blue/50 text-gold-accent">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 class="text-2xl font-bold text-white mb-3 tracking-wide">Live Match Center</h4>
            <p class="text-gray-400 leading-relaxed font-light mb-6">Real-time scores, possession, xG, momentum charts, and interactive shot maps updated every second.</p>
            <a href="#" class="text-gold-accent text-sm font-bold uppercase tracking-wider group-hover:text-white transition-colors flex items-center gap-2">Explore Live <span class="group-hover:translate-x-2 transition-transform">&rarr;</span></a>
          </div>

          <!-- Feature Card 2 -->
          <div #featureCard class="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-royal-blue to-gold-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="w-14 h-14 bg-royal-blue/30 rounded-xl flex items-center justify-center mb-6 border border-royal-blue/50 text-gold-accent">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 class="text-2xl font-bold text-white mb-3 tracking-wide">Advanced Analytics</h4>
            <p class="text-gray-400 leading-relaxed font-light mb-6">Dive deep into player statistics, heatmaps, passing networks, and side-by-side comparison matrices.</p>
            <a href="#" class="text-gold-accent text-sm font-bold uppercase tracking-wider group-hover:text-white transition-colors flex items-center gap-2">View Stats <span class="group-hover:translate-x-2 transition-transform">&rarr;</span></a>
          </div>

          <!-- Feature Card 3 -->
          <div #featureCard class="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-royal-blue to-gold-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="w-14 h-14 bg-royal-blue/30 rounded-xl flex items-center justify-center mb-6 border border-royal-blue/50 text-gold-accent">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h4 class="text-2xl font-bold text-white mb-3 tracking-wide">AI Predictions</h4>
            <p class="text-gray-400 leading-relaxed font-light mb-6">Leverage machine learning for match outcome probabilities, injury risk detection, and fantasy suggestions.</p>
            <a href="#" class="text-gold-accent text-sm font-bold uppercase tracking-wider group-hover:text-white transition-colors flex items-center gap-2">AI Insights <span class="group-hover:translate-x-2 transition-transform">&rarr;</span></a>
          </div>

          <!-- Feature Card 4 -->
          <div #featureCard class="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-royal-blue to-gold-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="w-14 h-14 bg-royal-blue/30 rounded-xl flex items-center justify-center mb-6 border border-royal-blue/50 text-gold-accent">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h4 class="text-2xl font-bold text-white mb-3 tracking-wide">Awards & Best XI</h4>
            <p class="text-gray-400 leading-relaxed font-light mb-6">Track Golden Boot, Golden Glove, and interactive Best XI visualizations generated continuously.</p>
            <a href="#" class="text-gold-accent text-sm font-bold uppercase tracking-wider group-hover:text-white transition-colors flex items-center gap-2">See Awards <span class="group-hover:translate-x-2 transition-transform">&rarr;</span></a>
          </div>

          <!-- Feature Card 5 -->
          <div #featureCard class="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-royal-blue to-gold-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="w-14 h-14 bg-royal-blue/30 rounded-xl flex items-center justify-center mb-6 border border-royal-blue/50 text-gold-accent">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 class="text-2xl font-bold text-white mb-3 tracking-wide">Highlights Hub</h4>
            <p class="text-gray-400 leading-relaxed font-light mb-6">Cinematic match highlights, top goals, and interactive media galleries updated instantly post-match.</p>
            <a href="#" class="text-gold-accent text-sm font-bold uppercase tracking-wider group-hover:text-white transition-colors flex items-center gap-2">Watch Now <span class="group-hover:translate-x-2 transition-transform">&rarr;</span></a>
          </div>

          <!-- Feature Card 6 -->
          <div #featureCard class="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 lg:bg-gradient-to-br lg:from-gold-accent/20 lg:to-transparent">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-royal-blue to-gold-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="w-14 h-14 bg-gold-accent/20 rounded-xl flex items-center justify-center mb-6 border border-gold-accent/50 text-gold-accent">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 class="text-2xl font-bold text-white mb-3 tracking-wide">Fantasy & Community</h4>
            <p class="text-gray-400 leading-relaxed font-light mb-6">Build your dream team, join global leaderboards, predict outcomes, and earn exclusive badges.</p>
            <a href="#" class="text-gold-accent text-sm font-bold uppercase tracking-wider group-hover:text-white transition-colors flex items-center gap-2">Join Community <span class="group-hover:translate-x-2 transition-transform">&rarr;</span></a>
          </div>

        </div>
      </div>
    </section>
  `
})
export class HomeComponent implements AfterViewInit {
  @ViewChildren('featureCard') featureCards!: QueryList<ElementRef>;

  ngAfterViewInit() {
    // Hero Animation
    gsap.fromTo('.hero-content h1', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 }
    );
    
    gsap.fromTo('.hero-subtitle',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.6 }
    );

    gsap.fromTo('.hero-buttons',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)', delay: 1 }
    );

    // Image Parallax
    gsap.to('.hero-img', {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: 'section.relative',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    // Features Section Header Animation
    gsap.fromTo('.section-header',
      { opacity: 0, y: 40 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.section-header',
          start: 'top 80%'
        }
      }
    );

    // Feature Cards Stagger Animation
    this.featureCards.forEach((card, index) => {
      gsap.fromTo(card.nativeElement,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card.nativeElement,
            start: 'top 85%'
          },
          delay: index * 0.1
        }
      );
    });
  }
}
