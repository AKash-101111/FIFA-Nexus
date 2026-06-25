import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<ThemeMode>('dark');
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    this.initTheme();
  }

  private initTheme() {
    const savedTheme = localStorage.getItem('nexus_theme') as ThemeMode;
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Default to dark
      this.setTheme('dark');
    }
  }

  public toggleTheme() {
    const current = this.themeSubject.value;
    const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  private setTheme(theme: ThemeMode) {
    this.themeSubject.next(theme);
    localStorage.setItem('nexus_theme', theme);
    
    // Apply to document root for global CSS variable changes
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    } else {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    }
  }
}
