import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  sendEmailVerification,
  User,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private auth;

  constructor(private http: HttpClient, private ngZone: NgZone) {
    // Initialize Firebase app if not already initialized
    const app = getApps().length === 0 ? initializeApp(environment.firebase) : getApp();
    this.auth = getAuth(app);

    // Set persistence
    setPersistence(this.auth, browserLocalPersistence).catch(console.error);

    // Listen to auth state changes
    onAuthStateChanged(this.auth, async (user: User | null) => {
      this.ngZone.run(async () => {
        if (user) {
          try {
            const token = await user.getIdToken();
            this.syncWithBackend(token).subscribe(
              profile => this.currentUserSubject.next(profile),
              err => {
                console.error('Failed to sync user', err);
                this.currentUserSubject.next(null);
              }
            );
          } catch (error) {
            console.error('Error getting token:', error);
            this.currentUserSubject.next(null);
          }
        } else {
          this.currentUserSubject.next(null);
        }
      });
    });
  }

  get currentUserValue(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  async getToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  // --- Google Auth ---
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    return result;
  }

  // --- Email Auth ---
  loginWithEmail(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  async registerWithEmail(email: string, pass: string) {
    const credential = await createUserWithEmailAndPassword(this.auth, email, pass);
    if (credential.user) {
      await sendEmailVerification(credential.user);
    }
    return credential;
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async logout() {
    await signOut(this.auth);
    this.currentUserSubject.next(null);
  }

  private syncWithBackend(token: string): Observable<UserProfile> {
    if (environment.firebase.projectId === 'placeholder') {
      return new Observable<UserProfile>(sub => {
        sub.next({
          uid: 'mock-uid',
          email: 'test@example.com',
          displayName: 'Test User',
          photoURL: '',
          role: 'admin'
        });
        sub.complete();
      });
    }

    return this.http.post<{ message: string, user: UserProfile }>(
      `${environment.apiUrl}/auth/sync`, 
      {}, 
      { headers: { Authorization: `Bearer ${token}` } }
    ).pipe(map(res => res.user));
  }
}
