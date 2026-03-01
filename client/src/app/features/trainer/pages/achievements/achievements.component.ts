import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AchievementService } from '../../../../core/services/achievement.service';
import { Achievement } from '../../../../shared/models/achievement.model';

@Component({
  selector: 'app-trainer-achievements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="achievements-section">
        <h2>Post Achievement</h2>
        <form (ngSubmit)="onSubmit()" class="achievement-form">
          <div class="form-group">
            <label>Title</label>
            <input type="text" [(ngModel)]="formData.title" name="title" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="formData.description" name="description" required></textarea>
          </div>
          <div class="form-group">
            <label>Image URL</label>
            <input type="text" [(ngModel)]="formData.imageUrl" name="imageUrl" />
          </div>
          <button type="submit">Post Achievement</button>
        </form>
      </div>

      <div class="achievements-list">
        <h2>My Achievements</h2>
        <div *ngIf="achievements.length === 0" class="empty-state">
          <p>No achievements posted yet. Share your first achievement!</p>
        </div>
        <div *ngFor="let achievement of achievements" class="achievement-card">
          <h3>{{ achievement.title }}</h3>
          <p>{{ achievement.description }}</p>
          <small>Posted on {{ achievement.createdAt | date }}</small>
          <button (click)="deleteAchievement(achievement.id)">Delete</button>
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
    .achievements-section {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
    }
    .achievements-list {
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
    .achievement-card {
      background: #f9f9f9;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 5px;
      border-left: 4px solid #667eea;
    }
    .achievement-card h3 {
      margin-top: 0;
      color: #333;
    }
    .achievement-card button {
      background: #e74c3c;
      padding: 8px 16px;
      font-size: 12px;
    }
    .empty-state {
      text-align: center;
      color: #999;
      padding: 40px 20px;
    }
  `]
})
export class AchievementsComponent {
  private readonly achievementService = inject(AchievementService);

  formData = {
    title: '',
    description: '',
    imageUrl: ''
  };

  achievements: Achievement[] = [];

  constructor() {
    this.loadAchievements();
  }

  loadAchievements() {
    this.achievementService.getFeed().subscribe({
      next: (data: any) => this.achievements = data.content,
      error: (err: any) => console.error('Error loading achievements', err)
    });
  }

  onSubmit() {
    this.achievementService.createAchievement(this.formData).subscribe({
      next: () => {
        alert('Achievement posted successfully!');
        this.formData = { title: '', description: '', imageUrl: '' };
        this.loadAchievements();
      },
      error: (err: any) => alert(err.error?.message || 'Error posting achievement')
    });
  }

  deleteAchievement(id: string) {
    if (confirm('Delete this achievement?')) {
      this.achievementService.deleteAchievement(id).subscribe({
        next: () => {
          alert('Achievement deleted');
          this.loadAchievements();
        },
        error: (err: any) => alert('Error deleting achievement')
      });
    }
  }
}
