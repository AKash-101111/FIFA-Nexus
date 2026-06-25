import { Injectable, OnDestroy } from '@angular/core';
import { NexusDataService, Match } from './nexus-data.service';
import { Subscription, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiveMatchSimulationService implements OnDestroy {
  private simSub?: Subscription;

  constructor(private dataService: NexusDataService) {
    this.startSimulation();
  }

  private startSimulation() {
    // Update live matches every 5 seconds
    this.simSub = interval(5000).subscribe(() => {
      const matches = this.dataService.getMatches();
      const liveMatches = matches.filter(m => m.status === 'live');
      
      liveMatches.forEach(match => {
        // Increment minute
        if (match.minute === undefined) match.minute = 0;
        match.minute += 1;
        
        // Random chance of goal (approx 5% every 5s for fast simulation)
        if (Math.random() < 0.05) {
          if (Math.random() < 0.5) {
            match.homeScore += 1;
          } else {
            match.awayScore += 1;
          }
        }

        // End match at 90 mins
        if (match.minute >= 90) {
          match.status = 'finished';
        }

        this.dataService.updateMatch(match);
      });
    });
  }

  ngOnDestroy() {
    if (this.simSub) {
      this.simSub.unsubscribe();
    }
  }
}
