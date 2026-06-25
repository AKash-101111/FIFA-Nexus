import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NexusApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    // Note: If you have an interceptor, this might not be needed.
    // For now we'll just rely on Firebase auth tokens or a generic header setup if needed.
    return {};
  }

  // --- World Cup Data ---
  getWorldCupLive(): Observable<any> {
    return this.http.get(`${this.apiUrl}/worldcup/live`);
  }

  getLiveMatches(): Observable<any> {
    return this.http.get(`${this.apiUrl}/worldcup/live`);
  }

  getWorldCupUpcoming(): Observable<any> {
    return this.http.get(`${this.apiUrl}/worldcup/upcoming`);
  }

  getWorldCupFinished(): Observable<any> {
    return this.http.get(`${this.apiUrl}/worldcup/finished`);
  }

  getAiInsight(prompt: string, cacheKey: string): Observable<any> {
    return new Observable<any>(observer => {
      setTimeout(() => {
        observer.next({
          insight: "Based on the Nexus Data Model, the current tactical setup relies heavily on transitions. The xG trend shows an overperformance of 1.2 goals in the last 3 matches."
        });
        observer.complete();
      }, 1500); // Simulate network delay
    });
  }

  streamAiInsight(prompt: string): Observable<string> {
    return new Observable<string>(observer => {
      const responses = [
        "Based on the latest data from the FIFA Nexus simulation, ",
        "here is my analysis for your request: \\n\\n",
        "**Tactical Breakdown:**\\n",
        "The team has been heavily relying on vertical passing and quick transitions. ",
        "Their expected goals (xG) is consistently outperforming their actual goals, indicating they are creating high-quality chances but failing to finish. ",
        "\\n\\n**Key Player Impact:**\\n",
        "We've seen massive involvement from the midfield pivot, controlling the tempo and breaking lines effectively. ",
        "\\n\\n**Prediction:**\\n",
        "Given the current momentum and statistical trends, I project a strong performance in the next 15 minutes of gameplay. ",
        "Expect a high probability of a goal-scoring opportunity if they maintain this level of pressing."
      ];

      let currentIndex = 0;
      
      const interval = setInterval(() => {
        if (currentIndex < responses.length) {
          observer.next(responses[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(interval);
          observer.complete();
        }
      }, 300); // Send a chunk every 300ms

      return () => {
        clearInterval(interval);
      };
    });
  }

  // --- YouTube Highlights ---
  getYoutubeHighlights(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/youtube/highlights?q=${encodeURIComponent(query)}`);
  }
}
