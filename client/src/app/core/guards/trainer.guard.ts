import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const trainerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.user();
  if (user && user.role === 'TRAINER') {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
