import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero3dComponent } from './components/hero-3d/hero-3d.component';
import { LiveMatchWidgetComponent } from './components/live-match-widget/live-match-widget.component';
import { AiInsightsWidgetComponent } from './components/ai-insights-widget/ai-insights-widget.component';
import { HighlightsWidgetComponent } from './components/highlights-widget/highlights-widget.component';
import { AnalyticsWidgetComponent } from './components/analytics-widget/analytics-widget.component';
import { FantasyWidgetComponent } from './components/fantasy-widget/fantasy-widget.component';
import { IntelligenceCardsComponent } from './components/intelligence-cards/intelligence-cards.component';
import gsap from 'gsap';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    Hero3dComponent,
    IntelligenceCardsComponent,
    LiveMatchWidgetComponent,
    AiInsightsWidgetComponent,
    HighlightsWidgetComponent,
    AnalyticsWidgetComponent,
    FantasyWidgetComponent
  ],
  template: `
    <div class="px-6 md:px-12 py-8 min-h-screen max-w-[1920px] mx-auto">
      
      <!-- 3D Hero Section -->
      <app-hero-3d></app-hero-3d>

      <!-- Intelligence Cards -->
      <app-intelligence-cards></app-intelligence-cards>

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[240px]">
        
        <!-- Live Match Center (Tall) -->
        <div #gridItem class="md:col-span-4 md:row-span-2 opacity-0 translate-y-12">
          <app-live-match-widget></app-live-match-widget>
        </div>

        <!-- AI Insights (Tall) -->
        <div #gridItem class="md:col-span-5 md:row-span-2 opacity-0 translate-y-12">
          <app-ai-insights-widget></app-ai-insights-widget>
        </div>

        <!-- Fantasy Widget (Standard) -->
        <div #gridItem class="md:col-span-3 md:row-span-1 opacity-0 translate-y-12">
          <app-fantasy-widget></app-fantasy-widget>
        </div>

        <!-- Analytics Widget (Standard) -->
        <div #gridItem class="md:col-span-3 md:row-span-1 opacity-0 translate-y-12">
          <app-analytics-widget></app-analytics-widget>
        </div>

        <!-- Highlights Widget (Wide) -->
        <div #gridItem class="md:col-span-12 md:row-span-1 opacity-0 translate-y-12">
          <app-highlights-widget></app-highlights-widget>
        </div>

      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChildren('gridItem') gridItems!: QueryList<ElementRef>;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // GSAP Staggered Grid Animation
    setTimeout(() => {
      const elements = this.gridItems.map(item => item.nativeElement);
      gsap.to(elements, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2
      });
    }, 100);
  }
}
