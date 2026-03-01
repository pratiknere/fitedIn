import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <header class="header">
        <h1>FitLink Dashboard</h1>
        <div class="user-info">
          <span *ngIf="user()">Welcome, {{ user()?.name }}</span>
          <button (click)="logout()">Logout</button>
        </div>
      </header>

      <div class="dashboard-content">
        <h2>Welcome to FitLink</h2>
        <p *ngIf="user()?.role === 'TRAINER'">
          You are logged in as a Personal Trainer. 
          <a href="/trainer/profile">Complete your profile</a>,
          <a href="/trainer/achievements">post achievements</a>, or
          <a href="/trainer/applications">view job applications</a>.
        </p>
        <p *ngIf="user()?.role === 'GYM'">
          You are logged in as a Gym Owner. 
          <a href="/gym/profile">Complete your gym profile</a>,
          <a href="/gym/jobs">post job openings</a>, or
          <a href="/gym/applications">review trainer applications</a>.
        </p>
        <p>
          Check out the <a href="/feed">community feed</a> to see achievements from trainers.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background: #f5f5f5;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header h1 {
      margin: 0;
    }
    .user-info {
      display: flex;
      gap: 20px;
      align-items: center;
    }
    .user-info button {
      padding: 8px 16px;
      background: white;
      color: #667eea;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
    }
    .dashboard-content {
      max-width: 1200px;
      margin: 40px auto;
      padding: 30px;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .dashboard-content h2 {
      color: #667eea;
      margin-top: 0;
    }
    .dashboard-content a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      margin: 0 5px;
    }
    .dashboard-content a:hover {
      text-decoration: underline;
    }
  `]
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user = this.authService.user;

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
