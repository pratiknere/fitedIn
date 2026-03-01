import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementService } from '../../../../core/services/achievement.service';
import { JobService } from '../../../../core/services/job.service';
import { Achievement } from '../../../../shared/models/achievement.model';
import { Job } from '../../../../shared/models/job.model';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="feed-container">
      <div class="header">
        <h1>FitLink Community Feed</h1>
        <p>Discover achievements and job opportunities</p>
      </div>

      <div class="feed-content">
        <div class="feed-section">
          <h2>Latest Achievements</h2>
          <div *ngIf="achievements.length === 0" class="empty-state">
            <p>No achievements yet. Be the first to share!</p>
          </div>
          <div *ngFor="let achievement of achievements" class="feed-item">
            <div class="item-header">
              <h3>{{ achievement.title }}</h3>
              <small>by {{ achievement.trainerName }}</small>
            </div>
            <p class="description">{{ achievement.description }}</p>
            <div *ngIf="achievement.imageUrl" class="image-placeholder">
              <img [src]="achievement.imageUrl" alt="Achievement" />
            </div>
            <small class="date">{{ achievement.createdAt | date:'medium' }}</small>
          </div>
        </div>

        <div class="feed-section">
          <h2>Open Job Opportunities</h2>
          <div *ngIf="jobs.length === 0" class="empty-state">
            <p>No open positions at the moment.</p>
          </div>
          <div *ngFor="let job of jobs" class="feed-item job-item">
            <div class="item-header">
              <h3>{{ job.title }}</h3>
              <small>{{ job.gymName }}</small>
            </div>
            <p class="description">{{ job.description }}</p>
            <div class="job-details">
              <span><strong>Experience:</strong> {{ job.experienceRequired }} years</span>
              <span *ngIf="job.salaryRange"><strong>Salary:</strong> {{ job.salaryRange }}</span>
            </div>
            <small class="date">Posted {{ job.createdAt | date:'medium' }}</small>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .feed-container {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    .header {
      color: white;
      text-align: center;
      padding: 60px 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 36px;
    }
    .header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
    }
    .feed-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }
    .feed-section {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    .feed-section h2 {
      color: #667eea;
      margin-top: 0;
      border-bottom: 2px solid #667eea;
      padding-bottom: 15px;
    }
    .feed-item {
      padding: 20px;
      margin-bottom: 20px;
      background: #f9f9f9;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }
    .item-header h3 {
      margin: 0;
      color: #333;
      font-size: 18px;
    }
    .item-header small {
      color: #999;
      font-style: italic;
    }
    .description {
      color: #555;
      line-height: 1.6;
      margin: 10px 0;
    }
    .image-placeholder {
      margin: 15px 0;
      background: #e0e0e0;
      border-radius: 5px;
      overflow: hidden;
      max-height: 200px;
    }
    .image-placeholder img {
      width: 100%;
      height: auto;
    }
    .job-item {
      border-left-color: #9b59b6;
    }
    .job-details {
      display: flex;
      gap: 20px;
      margin: 10px 0;
      color: #666;
      font-size: 14px;
    }
    .date {
      display: block;
      color: #999;
      margin-top: 10px;
    }
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #999;
    }
    @media (max-width: 768px) {
      .feed-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FeedComponent {
  private readonly achievementService = inject(AchievementService);
  private readonly jobService = inject(JobService);

  achievements: Achievement[] = [];
  jobs: Job[] = [];

  constructor() {
    this.loadFeed();
    this.loadJobs();
  }

  loadFeed() {
    this.achievementService.getFeed(0, 10).subscribe({
      next: (data: any) => this.achievements = data.content,
      error: (err: any) => console.error('Error loading feed', err)
    });
  }

  loadJobs() {
    this.jobService.getAllJobs(0, 10).subscribe({
      next: (data: any) => this.jobs = data.content,
      error: (err: any) => console.error('Error loading jobs', err)
    });
  }
}
