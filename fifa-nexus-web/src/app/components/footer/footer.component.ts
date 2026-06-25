import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-[#050505] border-t border-white/5 py-12 px-6 mt-20">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        <!-- Brand -->
        <div class="space-y-4 col-span-1 md:col-span-1">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-tr from-royal-blue to-gold-accent rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-sm tracking-tighter">FN</span>
            </div>
            <span class="text-xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">FIFA Nexus</span>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed">
            Where Football Meets Intelligence. The ultimate football ecosystem powered by real-time data and advanced AI analytics.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-white font-bold uppercase tracking-wider mb-4 text-sm">Platform</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-400 hover:text-gold-accent text-sm transition-colors">Live Matches</a></li>
            <li><a href="#" class="text-gray-400 hover:text-gold-accent text-sm transition-colors">Competitions</a></li>
            <li><a href="#" class="text-gray-400 hover:text-gold-accent text-sm transition-colors">Teams & Players</a></li>
            <li><a href="#" class="text-gray-400 hover:text-gold-accent text-sm transition-colors">Fantasy Football</a></li>
          </ul>
        </div>

        <!-- AI & Stats -->
        <div>
          <h4 class="text-white font-bold uppercase tracking-wider mb-4 text-sm">Intelligence</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-400 hover:text-gold-accent text-sm transition-colors">AI Match Predictions</a></li>
            <li><a href="#" class="text-gray-400 hover:text-gold-accent text-sm transition-colors">Player Analytics</a></li>
            <li><a href="#" class="text-gray-400 hover:text-gold-accent text-sm transition-colors">Expected Goals (xG)</a></li>
            <li><a href="#" class="text-gray-400 hover:text-gold-accent text-sm transition-colors">Momentum Charts</a></li>
          </ul>
        </div>

        <!-- Social & Legal -->
        <div>
          <h4 class="text-white font-bold uppercase tracking-wider mb-4 text-sm">Connect</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-400 hover:text-gold-accent text-sm transition-colors">Twitter / X</a></li>
            <li><a href="#" class="text-gray-400 hover:text-gold-accent text-sm transition-colors">Instagram</a></li>
            <li><a href="#" class="text-gray-400 hover:text-gold-accent text-sm transition-colors">Discord Community</a></li>
            <li><a href="#" class="text-gray-400 hover:text-gold-accent text-sm transition-colors">Contact Support</a></li>
          </ul>
        </div>

      </div>

      <div class="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-gray-500 text-xs">
          &copy; 2026 FIFA Nexus. All rights reserved. This is a conceptual project.
        </p>
        <div class="flex gap-4 text-xs text-gray-500">
          <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" class="hover:text-white transition-colors">Cookie Settings</a>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
