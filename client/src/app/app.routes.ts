import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { trainerGuard } from './core/guards/trainer.guard';
import { gymGuard } from './core/guards/gym.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'feed',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'trainer',
    canActivate: [trainerGuard],
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./features/trainer/pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'achievements',
        loadComponent: () => import('./features/trainer/pages/achievements/achievements.component').then(m => m.AchievementsComponent)
      },
      {
        path: 'applications',
        loadComponent: () => import('./features/trainer/pages/applications/applications.component').then(m => m.ApplicationsComponent)
      }
    ]
  },
  {
    path: 'gym',
    canActivate: [gymGuard],
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./features/gym/pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'jobs',
        loadComponent: () => import('./features/gym/pages/jobs/jobs.component').then(m => m.JobsComponent)
      },
      {
        path: 'applications',
        loadComponent: () => import('./features/gym/pages/applications/applications.component').then(m => m.ApplicationsComponent)
      }
    ]
  },
  {
    path: 'feed',
    loadComponent: () => import('./features/feed/pages/feed/feed.component').then(m => m.FeedComponent)
  },
  {
    path: '**',
    redirectTo: 'feed'
  }
];
