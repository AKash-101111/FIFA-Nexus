import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const guestGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);

  return new Promise((resolve) => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        resolve(router.createUrlTree(['/dashboard']));
        return;
      }

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) {
          resolve(router.createUrlTree(['/dashboard']));
        } else {
          resolve(true);
        }
      });
    } catch (error) {
      console.error("Guest Guard Error:", error);
      // If Firebase fails, resolve true so user can at least see login page
      resolve(true);
    }
  });
};
