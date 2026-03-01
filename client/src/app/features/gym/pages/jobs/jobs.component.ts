import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../../core/services/job.service';
import { Job } from '../../../../shared/models/job.model';

@Component({
  selector: 'app-gym-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="job-section">
        <h2>Post New Job</h2>
        <form (ngSubmit)="onSubmit()" class="job-form">
          <div class="form-group">
            <label>Job Title</label>
            <input type="text" [(ngModel)]="formData.title" name="title" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="formData.description" name="description" required></textarea>
          </div>
          <div class="form-group">
            <label>Experience Required (Years)</label>
            <input type="number" [(ngModel)]="formData.experienceRequired" name="experienceRequired" required />
          </div>
          <div class="form-group">
            <label>Salary Range</label>
            <input type="text" [(ngModel)]="formData.salaryRange" name="salaryRange" placeholder="e.g., $500-$1000/month" />
          </div>
          <button type="submit">Post Job</button>
        </form>
      </div>

      <div class="jobs-list">
        <h2>Your Job Postings</h2>
        <div *ngIf="jobs.length === 0" class="empty-state">
          <p>No jobs posted yet.</p>
        </div>
        <div *ngFor="let job of jobs" class="job-card">
          <h3>{{ job.title }}</h3>
          <p>{{ job.description }}</p>
          <p><strong>Experience Required:</strong> {{ job.experienceRequired }} years</p>
          <p *ngIf="job.salaryRange"><strong>Salary:</strong> {{ job.salaryRange }}</p>
          <p><strong>Status:</strong> <span [class]="'status-' + job.status.toLowerCase()">{{ job.status }}</span></p>
          <button (click)="toggleJobStatus(job.id, job.status)">
            {{ job.status === 'OPEN' ? 'Close' : 'Reopen' }} Job
          </button>
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
    .job-section {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
    }
    .jobs-list {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    h2 {
      color: #667eea;
      margin-top: 0;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      color: #333;
      font-weight: 500;
    }
    input, textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      box-sizing: border-box;
    }
    textarea {
      min-height: 100px;
    }
    input:focus, textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
    }
    button {
      padding: 12px 24px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
    }
    button:hover {
      background: #764ba2;
    }
    .job-card {
      background: #f9f9f9;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 5px;
      border-left: 4px solid #667eea;
    }
    .job-card h3 {
      margin-top: 0;
    }
    .status-open {
      background: #27ae60;
      color: white;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 12px;
    }
    .status-closed {
      background: #e74c3c;
      color: white;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 12px;
    }
    .job-card button {
      background: #9b59b6;
      padding: 8px 16px;
      font-size: 12px;
    }
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #999;
    }
  `]
})
export class JobsComponent {
  private readonly jobService = inject(JobService);

  formData = {
    title: '',
    description: '',
    experienceRequired: 0,
    salaryRange: ''
  };

  jobs: Job[] = [];

  constructor() {
    this.loadJobs();
  }

  loadJobs() {
    this.jobService.getAllJobs().subscribe({
      next: (data: any) => this.jobs = data.content,
      error: (err: any) => console.error('Error loading jobs', err)
    });
  }

  onSubmit() {
    this.jobService.createJob(this.formData).subscribe({
      next: () => {
        alert('Job posted successfully!');
        this.formData = {
          title: '',
          description: '',
          experienceRequired: 0,
          salaryRange: ''
        };
        this.loadJobs();
      },
      error: (err: any) => alert(err.error?.message || 'Error posting job')
    });
  }

  toggleJobStatus(jobId: string, currentStatus: string) {
    const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    this.jobService.updateJobStatus(jobId, newStatus as 'OPEN' | 'CLOSED').subscribe({
      next: () => this.loadJobs(),
      error: (err: any) => alert('Error updating job status')
    });
  }
}
