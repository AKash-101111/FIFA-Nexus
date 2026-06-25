import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GlobalSearchComponent } from './components/shared/global-search/global-search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GlobalSearchComponent],
  template: `
    <router-outlet></router-outlet>
    <app-global-search></app-global-search>
  `
})
export class AppComponent {
  title = 'fifa-nexus-web';
}
