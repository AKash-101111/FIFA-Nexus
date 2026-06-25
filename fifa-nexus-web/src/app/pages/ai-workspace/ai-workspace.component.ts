import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NexusApiService } from '../../core/services/nexus-api.service';
import gsap from 'gsap';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

@Component({
  selector: 'app-ai-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-[calc(100vh-5rem)] flex gap-4 p-4 max-w-[1920px] mx-auto">
      
      <!-- LEFT PANEL: History & Saved -->
      <div #leftPanel class="hidden lg:flex w-72 glass-panel rounded-3xl p-5 flex-col opacity-0 -translate-x-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-electric-blue to-cyan-accent flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="font-display text-lg font-bold text-white uppercase tracking-widest">History</h2>
        </div>
        
        <button class="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-accent/50 rounded-xl text-sm font-bold text-cyan-accent transition-all duration-300 mb-6 flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Analysis
        </button>

        <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
          <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 mt-4">Today</div>
          <div class="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 cursor-pointer transition-colors group">
            <p class="text-sm text-gray-300 group-hover:text-white truncate font-medium">Argentina vs France tactics</p>
            <p class="text-xs text-gray-500 mt-1">2 hours ago</p>
          </div>
          <div class="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 cursor-pointer transition-colors group">
            <p class="text-sm text-gray-300 group-hover:text-white truncate font-medium">Messi vs Mbappe comparison</p>
            <p class="text-xs text-gray-500 mt-1">5 hours ago</p>
          </div>

          <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 mt-6">Saved Reports</div>
          
          <div *ngIf="savedReportsList.length === 0" class="text-xs text-gray-500 italic px-2">No saved reports yet.</div>
          
          <div *ngFor="let report of savedReportsList" (click)="loadReport(report)" class="p-3 rounded-xl bg-premium-purple/10 hover:bg-premium-purple/20 border border-premium-purple/20 cursor-pointer transition-colors group flex flex-col gap-1 mb-2">
            <div class="flex items-center gap-3">
              <svg class="w-4 h-4 text-premium-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-sm text-premium-purple font-bold truncate">{{ report.title }}</p>
            </div>
            <span class="text-[10px] text-gray-500 pl-7">{{ report.date | date:'short' }}</span>
          </div>
        </div>
      </div>

      <!-- CENTER PANEL: Chat Interface -->
      <div #centerPanel class="flex-1 glass-panel rounded-3xl p-2 md:p-6 flex flex-col relative overflow-hidden opacity-0 translate-y-8">
        <!-- Mode Selector Bar -->
        <div class="hidden md:flex items-center gap-2 mb-6 px-4 py-2 bg-black/40 rounded-full border border-white/5 mx-auto">
          <button *ngFor="let mode of aiModes" 
                  (click)="activeMode = mode"
                  [ngClass]="activeMode === mode ? 'bg-cyan-accent text-deep-space font-bold' : 'text-gray-400 hover:text-white hover:bg-white/5'"
                  class="px-4 py-1.5 rounded-full text-xs uppercase tracking-widest transition-all">
            {{ mode }}
          </button>
        </div>

        <!-- Chat Area -->
        <div #chatContainer class="flex-1 overflow-y-auto custom-scrollbar px-2 md:px-4 space-y-6 flex flex-col pb-4">
          <!-- Empty State -->
          <div *ngIf="messages.length === 0" class="m-auto text-center max-w-lg">
            <div class="w-20 h-20 mx-auto mb-6 relative">
               <div class="absolute inset-0 bg-electric-blue/20 rounded-full blur-xl animate-pulse"></div>
               <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" alt="Gemini" class="w-full h-full object-contain relative z-10 filter grayscale invert opacity-80">
            </div>
            <h1 class="text-3xl font-display font-black text-white uppercase tracking-widest mb-4">How can I assist you?</h1>
            <p class="text-gray-400 text-sm mb-8 leading-relaxed">FIFA Nexus AI is connected to real-time football data. Ask for match predictions, tactical breakdowns, or fantasy advice.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              <button *ngFor="let prompt of presetPrompts" (click)="setPrompt(prompt)" class="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-accent/30 transition-all group">
                <p class="text-sm text-gray-300 group-hover:text-white">{{ prompt }}</p>
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div *ngFor="let msg of messages; let i = index" class="w-full flex" [ngClass]="msg.sender === 'user' ? 'justify-end' : 'justify-start'">
            
            <div *ngIf="msg.sender === 'ai'" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 mt-1 shrink-0">
               <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" class="w-4 h-4 filter grayscale invert opacity-80">
            </div>

            <div [ngClass]="msg.sender === 'user' ? 'bg-electric-blue/20 border-electric-blue/30 text-white rounded-br-sm' : 'bg-white/5 border-white/10 text-gray-200 rounded-bl-sm'" 
                 class="max-w-[85%] md:max-w-[75%] rounded-2xl p-4 border shadow-lg message-bubble">
              <p class="text-sm leading-relaxed" [innerHTML]="formatMessage(msg.text)"></p>
            </div>

            <div *ngIf="msg.sender === 'user'" class="w-8 h-8 rounded-full bg-cyan-accent/20 flex items-center justify-center ml-3 mt-1 shrink-0 border border-cyan-accent/30">
              <span class="text-cyan-accent font-bold text-xs uppercase">Me</span>
            </div>
          </div>

          <!-- Streaming / Typing Indicator -->
          <div *ngIf="isTyping && !isStreaming" class="self-start flex items-center gap-3 w-full">
            <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
               <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" class="w-4 h-4 filter grayscale invert opacity-80">
            </div>
            <div class="bg-white/5 max-w-[85%] rounded-2xl p-4 border border-white/10 flex gap-1.5 items-center h-12">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="relative z-10 mt-2 px-2 md:px-4">
          <div class="flex gap-2 mb-3">
             <button (click)="saveReport()" class="px-3 py-1.5 text-xs font-bold text-premium-purple bg-premium-purple/10 border border-premium-purple/20 rounded-lg hover:bg-premium-purple/20 transition-colors">
               Save Report
             </button>
             <button (click)="exportPDF()" class="px-3 py-1.5 text-xs font-bold text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
               Export PDF
             </button>
             <button (click)="exportCSV()" class="px-3 py-1.5 text-xs font-bold text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
               Export CSV
             </button>
             <div *ngIf="actionMessage" class="text-xs text-green-400 ml-auto self-center">{{ actionMessage }}</div>
          </div>
          <div class="relative flex items-center bg-black/50 border border-white/10 hover:border-cyan-accent/50 focus-within:border-cyan-accent/80 rounded-2xl transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <button class="p-3 text-gray-400 hover:text-cyan-accent transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input type="text" [(ngModel)]="prompt" (keyup.enter)="sendPrompt()" placeholder="Ask about tactics, stats, or fantasy..." [disabled]="isTyping || isStreaming" class="w-full bg-transparent py-4 text-sm text-white focus:outline-none placeholder-gray-500 disabled:opacity-50">
            <button (click)="sendPrompt()" [disabled]="!prompt.trim() || isTyping || isStreaming" class="mr-2 p-2 rounded-xl bg-gradient-to-r from-electric-blue to-cyan-accent text-white hover:shadow-[0_0_15px_rgba(0,194,255,0.4)] transition-all disabled:opacity-50 disabled:shadow-none">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          <p class="text-center text-[10px] text-gray-500 mt-3 uppercase tracking-widest">Gemini may produce inaccurate information. Press Ctrl + K for quick commands.</p>
        </div>
      </div>

      <!-- RIGHT PANEL: Context & Insights -->
      <div #rightPanel class="hidden xl:flex w-80 glass-panel rounded-3xl p-5 flex-col opacity-0 translate-x-8">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-premium-purple to-pink-500 flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h2 class="font-display text-lg font-bold text-white uppercase tracking-widest">Trending Context</h2>
        </div>

        <div class="space-y-6 overflow-y-auto custom-scrollbar pr-2 pb-4">
          
          <!-- Trending Match -->
          <div>
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Hot Match</h3>
            <div class="bg-black/40 border border-white/5 rounded-2xl p-4">
              <div class="flex justify-between items-center mb-3">
                <span class="text-xs text-cyan-accent font-bold">World Cup Semi-Final</span>
                <span class="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded animate-pulse">LIVE 67'</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-white font-bold">ARG</span>
                <span class="text-xl font-display font-black text-white">2 - 1</span>
                <span class="text-white font-bold">FRA</span>
              </div>
              <button (click)="setPrompt('Analyze the current tactical situation in ARG vs FRA')" class="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-300 hover:text-white transition-colors border border-white/10">Analyze Tactics</button>
            </div>
          </div>

          <!-- Trending Players -->
          <div>
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Trending Players</h3>
            <div class="space-y-2">
              <div class="bg-black/40 border border-white/5 rounded-xl p-3 flex justify-between items-center cursor-pointer hover:border-premium-purple/50 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-white/10 border border-premium-purple overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=50" class="w-full h-full object-cover">
                  </div>
                  <span class="text-sm font-bold text-gray-200">V. Júnior</span>
                </div>
                <svg class="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <div class="bg-black/40 border border-white/5 rounded-xl p-3 flex justify-between items-center cursor-pointer hover:border-premium-purple/50 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-white/10 border border-premium-purple overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1511886929837-354d827aae26?w=50" class="w-full h-full object-cover">
                  </div>
                  <span class="text-sm font-bold text-gray-200">E. Haaland</span>
                </div>
                <svg class="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
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
    
    /* Markdown formatting styles for innerHTML */
    ::ng-deep .message-bubble p { margin-bottom: 0.75em; }
    ::ng-deep .message-bubble p:last-child { margin-bottom: 0; }
    ::ng-deep .message-bubble strong { color: #00c2ff; font-weight: 700; }
    ::ng-deep .message-bubble ul { list-style-type: disc; margin-left: 1.5em; margin-bottom: 0.75em; }
    ::ng-deep .message-bubble li { margin-bottom: 0.25em; }
  `]
})
export class AiWorkspaceComponent implements OnInit, AfterViewChecked {
  @ViewChild('leftPanel') leftPanel!: ElementRef;
  @ViewChild('centerPanel') centerPanel!: ElementRef;
  @ViewChild('rightPanel') rightPanel!: ElementRef;
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  prompt = '';
  messages: Message[] = [];
  isTyping = false;
  isStreaming = false;

  aiModes = ['General', 'Tactical', 'Fantasy', 'Predictions', 'Scouting'];
  activeMode = 'General';

  presetPrompts = [
    "Predict Argentina vs France",
    "Analyze USA national team tactics",
    "Compare Messi vs Mbappe",
    "Best fantasy captain for Matchday 1"
  ];

  constructor(private api: NexusApiService) {}

  ngOnInit(): void {
    this.loadSavedReports();
    setTimeout(() => {
      gsap.to([this.leftPanel.nativeElement, this.centerPanel.nativeElement, this.rightPanel.nativeElement], {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }, 100);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadReport(report: any) {
    this.messages = [...report.messages];
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  setPrompt(text: string) {
    this.prompt = text;
  }

  sendPrompt() {
    if (!this.prompt.trim() || this.isTyping || this.isStreaming) return;
    
    const text = this.prompt.trim();
    this.messages.push({ text, sender: 'user' });
    this.prompt = '';
    this.isTyping = true;
    
    // Add an empty AI message that we will stream into
    const aiMessageIndex = this.messages.length;
    this.messages.push({ text: '', sender: 'ai' });
    this.isStreaming = true;

    this.api.streamAiInsight(`[Mode: ${this.activeMode}] ${text}`).subscribe({
      next: (chunk: string) => {
        this.isTyping = false; // Stop the bouncing dots once stream starts
        this.messages[aiMessageIndex].text += chunk;
      },
      error: (err: any) => {
        this.messages[aiMessageIndex].text = 'Error connecting to Gemini Core. Please try again.';
        this.isTyping = false;
        this.isStreaming = false;
      },
      complete: () => {
        this.isTyping = false;
        this.isStreaming = false;
      }
    });
  }

  formatMessage(text: string): string {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
      .replace(/- (.*)/g, '<ul><li>$1</li></ul>')
      .replace(/<\/ul><br\/><ul>/g, ''); 
  }

  actionMessage = '';

  saveReport() {
    if (this.messages.length === 0) return;
    const reportTitle = this.messages[0].text.substring(0, 30) + '...';
    
    // Save to local storage
    const saved = JSON.parse(localStorage.getItem('ai_saved_reports') || '[]');
    saved.push({
      title: reportTitle,
      date: new Date().toISOString(),
      messages: [...this.messages]
    });
    localStorage.setItem('ai_saved_reports', JSON.stringify(saved));
    
    this.showActionMessage('Report saved successfully!');
    this.loadSavedReports();
  }

  exportPDF() {
    if (this.messages.length === 0) return;
    // Basic print to PDF approach
    const printContent = this.messages.map(m => `[${m.sender.toUpperCase()}]:\n${m.text}`).join('\n\n');
    const blob = new Blob([printContent], { type: 'text/plain' }); // Fallback to txt for simplicity
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FIFA_Nexus_Report_${new Date().getTime()}.txt`;
    a.click();
    this.showActionMessage('Report exported!');
  }

  exportCSV() {
    if (this.messages.length === 0) return;
    let csv = 'Sender,Message\n';
    this.messages.forEach(m => {
      const text = m.text.replace(/"/g, '""');
      csv += `"${m.sender}","${text}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FIFA_Nexus_Report_${new Date().getTime()}.csv`;
    a.click();
    this.showActionMessage('CSV exported!');
  }

  private showActionMessage(msg: string) {
    this.actionMessage = msg;
    setTimeout(() => this.actionMessage = '', 3000);
  }

  savedReportsList: any[] = [];
  
  loadSavedReports() {
    this.savedReportsList = JSON.parse(localStorage.getItem('ai_saved_reports') || '[]');
  }
}
