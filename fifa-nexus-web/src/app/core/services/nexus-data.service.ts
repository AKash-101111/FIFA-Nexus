import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  flag: string;
  group: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  ranking: number;
  manager: string;
  formation: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  position: string;
  number: number;
  age: number;
  goals: number;
  assists: number;
  rating: number;
  image: string;
  value: string;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  status: 'upcoming' | 'live' | 'finished';
  date: Date;
  minute?: number;
  stage: string;
  venue: string;
}

@Injectable({
  providedIn: 'root'
})
export class NexusDataService {
  private teamsSubject = new BehaviorSubject<Team[]>(this.getInitialTeams());
  private playersSubject = new BehaviorSubject<Player[]>(this.getInitialPlayers());
  private matchesSubject = new BehaviorSubject<Match[]>(this.getInitialMatches());

  public teams$ = this.teamsSubject.asObservable();
  public players$ = this.playersSubject.asObservable();
  public matches$ = this.matchesSubject.asObservable();

  constructor() { }

  getTeams(): Team[] {
    return this.teamsSubject.value;
  }

  getPlayers(): Player[] {
    return this.playersSubject.value;
  }

  getMatches(): Match[] {
    return this.matchesSubject.value;
  }

  updateMatch(updatedMatch: Match) {
    const matches = this.getMatches();
    const index = matches.findIndex(m => m.id === updatedMatch.id);
    if (index !== -1) {
      matches[index] = updatedMatch;
      this.matchesSubject.next([...matches]);
      this.recalculateStandings();
    }
  }

  private recalculateStandings() {
    // Logic to recalculate points, GF, GA, GD based on finished/live matches
    const teams = this.getTeams();
    const matches = this.getMatches().filter(m => m.status === 'finished' || m.status === 'live');
    
    // Reset stats
    teams.forEach(t => { t.played = 0; t.won = 0; t.drawn = 0; t.lost = 0; t.gf = 0; t.ga = 0; t.gd = 0; t.points = 0; });

    matches.forEach(m => {
      const home = teams.find(t => t.id === m.homeTeamId);
      const away = teams.find(t => t.id === m.awayTeamId);
      if (home && away) {
        home.played++; away.played++;
        home.gf += m.homeScore; away.gf += m.awayScore;
        home.ga += m.awayScore; away.ga += m.homeScore;
        home.gd = home.gf - home.ga; away.gd = away.gf - away.ga;

        if (m.homeScore > m.awayScore) { home.won++; home.points += 3; away.lost++; }
        else if (m.homeScore < m.awayScore) { away.won++; away.points += 3; home.lost++; }
        else { home.drawn++; away.drawn++; home.points += 1; away.points += 1; }
      }
    });

    this.teamsSubject.next([...teams]);
  }

  private getInitialTeams(): Team[] {
    return [
      { id: 'ARG', name: 'Argentina', shortName: 'ARG', flag: '🇦🇷', group: 'A', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, ranking: 1, manager: 'Lionel Scaloni', formation: '4-3-3' },
      { id: 'FRA', name: 'France', shortName: 'FRA', flag: '🇫🇷', group: 'D', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, ranking: 2, manager: 'Didier Deschamps', formation: '4-2-3-1' },
      { id: 'BRA', name: 'Brazil', shortName: 'BRA', flag: '🇧🇷', group: 'G', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, ranking: 3, manager: 'Dorival Júnior', formation: '4-3-3' },
      { id: 'ENG', name: 'England', shortName: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'B', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, ranking: 4, manager: 'Gareth Southgate', formation: '4-2-3-1' },
      { id: 'ESP', name: 'Spain', shortName: 'ESP', flag: '🇪🇸', group: 'E', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, ranking: 5, manager: 'Luis de la Fuente', formation: '4-3-3' },
      { id: 'POR', name: 'Portugal', shortName: 'POR', flag: '🇵🇹', group: 'H', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, ranking: 6, manager: 'Roberto Martínez', formation: '4-3-3' },
      { id: 'GER', name: 'Germany', shortName: 'GER', flag: '🇩🇪', group: 'E', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, ranking: 7, manager: 'Julian Nagelsmann', formation: '4-2-3-1' },
      { id: 'ITA', name: 'Italy', shortName: 'ITA', flag: '🇮🇹', group: 'B', points: 0, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, ranking: 8, manager: 'Luciano Spalletti', formation: '4-3-3' }
    ];
  }

  private getInitialPlayers(): Player[] {
    return [
      { id: 'p1', name: 'Lionel Messi', teamId: 'ARG', position: 'FW', number: 10, age: 36, goals: 7, assists: 3, rating: 9.2, image: 'assets/players/messi.png', value: '€35M' },
      { id: 'p2', name: 'Kylian Mbappé', teamId: 'FRA', position: 'FW', number: 10, age: 25, goals: 8, assists: 2, rating: 9.1, image: 'assets/players/mbappe.png', value: '€180M' },
      { id: 'p3', name: 'Vinícius Júnior', teamId: 'BRA', position: 'LW', number: 7, age: 23, goals: 4, assists: 4, rating: 8.9, image: 'assets/players/vinicius.png', value: '€150M' },
      { id: 'p4', name: 'Jude Bellingham', teamId: 'ENG', position: 'AM', number: 10, age: 20, goals: 3, assists: 5, rating: 8.8, image: 'assets/players/bellingham.png', value: '€150M' }
    ];
  }

  private getInitialMatches(): Match[] {
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

    return [
      { id: 'm1', homeTeamId: 'ARG', awayTeamId: 'FRA', homeScore: 2, awayScore: 2, status: 'live', date: today, minute: 68, stage: 'Final', venue: 'MetLife Stadium' },
      { id: 'm2', homeTeamId: 'BRA', awayTeamId: 'ENG', homeScore: 0, awayScore: 0, status: 'upcoming', date: tomorrow, stage: 'Semi-Final', venue: 'AT&T Stadium' },
      { id: 'm3', homeTeamId: 'ESP', awayTeamId: 'POR', homeScore: 1, awayScore: 0, status: 'finished', date: yesterday, stage: 'Quarter-Final', venue: 'Hard Rock Stadium' },
      { id: 'm4', homeTeamId: 'GER', awayTeamId: 'ITA', homeScore: 2, awayScore: 1, status: 'finished', date: yesterday, stage: 'Quarter-Final', venue: 'Lumen Field' }
    ];
  }
}
