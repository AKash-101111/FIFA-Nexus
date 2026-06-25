import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NexusApiService } from '../../../../core/services/nexus-api.service';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

@Component({
  selector: 'app-ai-insights-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="glass-panel rounded-3xl p-6 h-full flex flex-col hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,194,255,0.2)] transition-all duration-500 relative overflow-hidden group">
      <div class="absolute -top-10 -left-10 w-32 h-32 bg-electric-blue/20 rounded-full blur-[40px] group-hover:bg-electric-blue/30 transition-all duration-500"></div>
      
      <div class="flex items-center gap-3 mb-6 relative z-10">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-electric-blue to-cyan-accent flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 class="font-display text-xl font-bold uppercase tracking-widest text-white">AI Insights</h2>
      </div>

      <div #chatContainer class="flex-1 overflow-y-auto space-y-4 mb-4 relative z-10 custom-scrollbar pr-2 flex flex-col">
        <div *ngIf="messages.length === 0" class="m-auto text-center">
          <div class="w-16 h-16 mx-auto mb-4 opacity-50">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg" alt="Gemini" class="w-full h-full object-contain filter grayscale invert">
          </div>
          <p class="text-sm text-gray-500 uppercase tracking-widest">Ask Gemini about tactics,<br>predictions, or stats.</p>
        </div>

        <div *ngFor="let msg of messages" [ngClass]="msg.sender === 'user' ? 'self-end bg-electric-blue/40' : 'self-start bg-white/5'" class="max-w-[85%] rounded-2xl p-3 border border-white/10">
          <p class="text-sm text-gray-200 leading-relaxed font-light" [innerHTML]="formatMessage(msg.text)"></p>
        </div>

        <div *ngIf="isTyping" class="self-start bg-white/5 max-w-[85%] rounded-2xl p-3 border border-white/10 flex gap-1">
          <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>

      <div class="relative z-10 mt-auto">
        <div class="relative flex items-center">
          <input type="text" [(ngModel)]="prompt" (keyup.enter)="sendPrompt()" placeholder="Analyze Real Madrid's form..." [disabled]="isTyping" class="w-full bg-black/50 border border-white/10 rounded-full py-3 pl-5 pr-12 text-sm text-white focus:outline-none focus:border-cyan-accent/50 transition-colors placeholder-gray-600 disabled:opacity-50">
          <button (click)="sendPrompt()" [disabled]="!prompt.trim() || isTyping" class="absolute right-2 w-8 h-8 rounded-full bg-electric-blue flex items-center justify-center hover:bg-cyan-accent transition-colors disabled:opacity-50">
            <svg class="w-4 h-4 text-white ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); rounded: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,194,255,0.3); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,194,255,0.8); }
  `]
})
export class AiInsightsWidgetComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  prompt = '';
  messages: Message[] = [];
  isTyping = false;

  constructor(private api: NexusApiService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  sendPrompt() {
    if (!this.prompt.trim() || this.isTyping) return;
    
    const text = this.prompt.trim();
    this.messages.push({ text, sender: 'user' });
    this.prompt = '';
    this.isTyping = true;

    // Cache key specific to the prompt
    const cacheKey = `ai:${text.toLowerCase().replace(/\s+/g, '_')}`;

    this.api.getAiInsight(text, cacheKey).subscribe({
      next: (res) => {
        this.messages.push({ text: res.insight, sender: 'ai' });
        this.isTyping = false;
      },
      error: (err) => {
        this.messages.push({ text: 'Error connecting to Gemini Core. Please try again.', sender: 'ai' });
        this.isTyping = false;
      }
    });
  }

  formatMessage(text: string): string {
    // Simple markdown bold formatting for UI display
    return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
               .replace(/\n/g, '<br/>');
  }
}
