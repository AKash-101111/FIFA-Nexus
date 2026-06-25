import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-[1920px] mx-auto min-h-[calc(100vh-5rem)]">
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-display font-black text-white uppercase tracking-widest">Command Center <span class="text-red-500">Admin</span></h1>
          <p class="text-gray-400 text-sm mt-1">Enterprise System Monitoring & User Management</p>
        </div>
        <div class="flex items-center gap-3 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-xl">
          <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span class="text-red-500 font-bold text-xs uppercase tracking-widest">Superuser Access</span>
        </div>
      </div>

      <!-- KPI Overview Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="glass-panel p-6 rounded-3xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-tr from-cyan-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex justify-between items-start mb-4">
            <span class="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Users</span>
            <svg class="w-5 h-5 text-cyan-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <div class="text-4xl font-display font-black text-white mb-2">142,854</div>
          <div class="text-xs text-green-400 font-bold flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> +1,240 this week</div>
        </div>
        <div class="glass-panel p-6 rounded-3xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-tr from-electric-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex justify-between items-start mb-4">
            <span class="text-xs text-gray-400 font-bold uppercase tracking-widest">Active Sessions</span>
            <svg class="w-5 h-5 text-electric-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div class="text-4xl font-display font-black text-white mb-2">12,405</div>
          <div class="text-xs text-green-400 font-bold flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> Peak Traffic</div>
        </div>
        <div class="glass-panel p-6 rounded-3xl relative overflow-hidden group border border-white/5 border-l-premium-purple">
          <div class="absolute inset-0 bg-gradient-to-tr from-premium-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex justify-between items-start mb-4">
            <span class="text-xs text-gray-400 font-bold uppercase tracking-widest">API Requests / hr</span>
            <svg class="w-5 h-5 text-premium-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div class="text-4xl font-display font-black text-white mb-2">1.2M</div>
          <div class="text-xs text-yellow-500 font-bold flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg> Stable load</div>
        </div>
        <div class="glass-panel p-6 rounded-3xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex justify-between items-start mb-4">
            <span class="text-xs text-gray-400 font-bold uppercase tracking-widest">Gemini API Quota</span>
            <svg class="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div class="text-4xl font-display font-black text-white mb-2">42%</div>
          <div class="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
            <div class="bg-pink-500 h-full w-[42%] shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Gemini Key Failover Status -->
        <div class="glass-panel rounded-3xl p-8">
          <h2 class="text-white font-bold tracking-widest uppercase text-sm mb-6 flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" class="w-5 h-5 filter grayscale invert opacity-80">
            Gemini Key Failover Status
          </h2>
          
          <div class="space-y-4">
            <div class="bg-black/40 border border-green-500/30 rounded-xl p-4 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse"></div>
                <div>
                  <div class="text-white font-bold text-sm">PRIMARY_GEMINI_API_KEY</div>
                  <div class="text-xs text-gray-400 font-mono mt-1">AQ.Ab8RN6LL...</div>
                </div>
              </div>
              <span class="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-widest rounded">Active</span>
            </div>
            
            <div class="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between opacity-60">
              <div class="flex items-center gap-4">
                <div class="w-3 h-3 rounded-full bg-gray-600"></div>
                <div>
                  <div class="text-white font-bold text-sm">SECONDARY_GEMINI_API_KEY</div>
                  <div class="text-xs text-gray-400 font-mono mt-1">AQ.Ab8RN6Ke...</div>
                </div>
              </div>
              <span class="px-3 py-1 bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded">Standby</span>
            </div>

            <div class="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between opacity-60">
              <div class="flex items-center gap-4">
                <div class="w-3 h-3 rounded-full bg-gray-600"></div>
                <div>
                  <div class="text-white font-bold text-sm">TERTIARY_GEMINI_API_KEY</div>
                  <div class="text-xs text-gray-400 font-mono mt-1">AQ.Ab8RN6I3...</div>
                </div>
              </div>
              <span class="px-3 py-1 bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded">Standby</span>
            </div>
          </div>
          <div class="mt-4 text-xs text-gray-500">
            System automatically falls back to secondary keys upon 429 Too Many Requests or Quota Exceeded errors.
          </div>
        </div>

        <!-- User Management Mock -->
        <div class="glass-panel rounded-3xl p-8 flex flex-col h-[400px]">
          <h2 class="text-white font-bold tracking-widest uppercase text-sm mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Recent Signups
          </h2>
          <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
            
            <div class="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between hover:bg-white/5 transition-colors group">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-cyan-accent text-deep-space font-bold flex items-center justify-center rounded-full text-xs">A</div>
                <div>
                  <div class="text-white text-sm font-bold">akash&#64;fifanexus.com</div>
                  <div class="text-[10px] text-gray-500">Joined 2 mins ago</div>
                </div>
              </div>
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="px-2 py-1 bg-white/10 text-white text-[10px] font-bold rounded hover:bg-white/20">Edit</button>
                <button class="px-2 py-1 bg-red-500/20 text-red-400 text-[10px] font-bold rounded hover:bg-red-500/40">Ban</button>
              </div>
            </div>

            <div class="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between hover:bg-white/5 transition-colors group">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-premium-purple text-white font-bold flex items-center justify-center rounded-full text-xs">J</div>
                <div>
                  <div class="text-white text-sm font-bold">john.doe&#64;example.com</div>
                  <div class="text-[10px] text-gray-500">Joined 15 mins ago</div>
                </div>
              </div>
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="px-2 py-1 bg-white/10 text-white text-[10px] font-bold rounded hover:bg-white/20">Edit</button>
                <button class="px-2 py-1 bg-red-500/20 text-red-400 text-[10px] font-bold rounded hover:bg-red-500/40">Ban</button>
              </div>
            </div>

            <div class="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center justify-between hover:bg-white/5 transition-colors group">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-electric-blue text-white font-bold flex items-center justify-center rounded-full text-xs">M</div>
                <div>
                  <div class="text-white text-sm font-bold">messi10&#64;legend.com</div>
                  <div class="text-[10px] text-gray-500">Joined 1 hour ago</div>
                </div>
              </div>
              <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="px-2 py-1 bg-white/10 text-white text-[10px] font-bold rounded hover:bg-white/20">Edit</button>
                <button class="px-2 py-1 bg-red-500/20 text-red-400 text-[10px] font-bold rounded hover:bg-red-500/40">Ban</button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,194,255,0.5); }
  `]
})
export class AdminDashboardComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}
