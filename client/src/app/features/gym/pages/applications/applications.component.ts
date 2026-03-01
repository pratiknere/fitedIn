import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../../../core/services/application.service';
import { JobApplication } from '../../../../shared/models/application.model';

@Component({
  selector: 'app-gym-applications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Job Applications</h2>
      <div *ngIf="applications.length === 0" class="empty-state">
        <p>No applications received yet.</p>
      </div>
      <div *ngFor="let app of applications" class="application-card">
        <h3>{{ app.jobTitle }}</h3>
        <p><strong>Trainer:</strong> {{ app.trainerName }}</p>
        <p><strong>Status:</strong> <span [class]="'status-' + app.status.toLowerCase()">{{ app.status }}</span></p>
        <p><strong>Applied on:</strong> {{ app.appliedAt | date }}</p>
        <div class="actions">
          <button (click)="updateStatus(app.id, 'SHORTLISTED')" *ngIf="app.status === 'APPLIED'">Shortlist</button>
          <button (click)="updateStatus(app.id, 'REJECTED')" *ngIf="app.status !== 'REJECTED'">Reject</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1000px;
      margin: 40px auto;
      padding: 20px;
    }
    h2 {
      color: #667eea;
    }
    .application-card {
      background: white;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #667eea;
    }
    .application-card h3 {
      margin-top: 0;
    }
    .status-applied {
      background: #3498db;
      color: white;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 12px;
    }
    .status-shortlisted {
      background: #27ae60;
      color: white;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 12px;
    }
    .status-rejected {
      background: #e74c3c;
      color: white;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 12px;
    }
    .actions {
      margin-top: 15px;
      display: flex;
      gap: 10px;
    }
    button {
      padding: 8px 16px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 12px;
    }
    button:hover {
      background: #764ba2;
    }
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 10px;
      color: #999;
    }
  `]
})
export class ApplicationsComponent {
  private readonly applicationService = inject(ApplicationService);

  applications: JobApplication[] = [];

  constructor() {
    this.loadApplications();
  }

  loadApplications() {
    this.applicationService.getMyApplications().subscribe({
      next: (data: any) => this.applications = data.content,
      error: (err: any) => console.error('Error loading applications', err)
    });
  }

  updateStatus(applicationId: string, status: 'APPLIED' | 'SHORTLISTED' | 'REJECTED') {
    this.applicationService.updateApplicationStatus(applicationId, status).subscribe({
      next: () => {
        alert('Status updated');
        this.loadApplications();
      },
      error: (err: any) => alert('Error updating status')
    });
  }
}
