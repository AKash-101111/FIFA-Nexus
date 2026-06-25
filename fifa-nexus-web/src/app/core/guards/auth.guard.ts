import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);

  return new Promise((resolve) => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        resolve(true);
        return;
      }
      
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) {
          resolve(true);
        } else {
          resolve(router.createUrlTree(['/']));
        }
      });
    } catch (error) {
      console.error("Auth Guard Error:", error);
      // If Firebase fails, allow them through to avoid blank screen or redirect to login
      resolve(router.createUrlTree(['/']));
    }
  });
};
