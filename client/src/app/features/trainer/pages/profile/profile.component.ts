import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrainerService } from '../../../../core/services/trainer.service';
import { TrainerProfile } from '../../../../shared/models/trainer.model';

@Component({
  selector: 'app-trainer-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="profile-card">
        <h2>Trainer Profile</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Experience (Years)</label>
            <input type="number" [(ngModel)]="formData.experienceYears" name="experienceYears" required />
          </div>
          <div class="form-group">
            <label>Specialization</label>
            <input type="text" [(ngModel)]="formData.specialization" name="specialization" required />
          </div>
          <div class="form-group">
            <label>Certifications</label>
            <textarea [(ngModel)]="formData.certifications" name="certifications"></textarea>
          </div>
          <div class="form-group">
            <label>Bio</label>
            <textarea [(ngModel)]="formData.bio" name="bio"></textarea>
          </div>
          <button type="submit" [disabled]="loading()">
            {{ isEditing ? 'Update Profile' : 'Create Profile' }}
          </button>
        </form>
        <div *ngIf="profile()" class="profile-info">
          <h3>Current Profile</h3>
          <p><strong>Name:</strong> {{ profile()?.name }}</p>
          <p><strong>Experience:</strong> {{ profile()?.experienceYears }} years</p>
          <p><strong>Specialization:</strong> {{ profile()?.specialization }}</p>
          <p><strong>Total Clients:</strong> {{ profile()?.totalClients }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
    }
    .profile-card {
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
      resize: vertical;
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
    button:hover:not(:disabled) {
      background: #764ba2;
    }
    .profile-info {
      margin-top: 30px;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 5px;
    }
    .profile-info h3 {
      margin-top: 0;
      color: #667eea;
    }
  `]
})
export class ProfileComponent {
  private readonly trainerService = inject(TrainerService);

  formData = {
    experienceYears: 0,
    specialization: '',
    certifications: '',
    bio: ''
  };

  profile: any;
  loading: any = () => false;
  isEditing = false;

  constructor() {
    this.loadProfile();
  }

  loadProfile() {
    this.trainerService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.isEditing = true;
        this.formData = {
          experienceYears: data.experienceYears,
          specialization: data.specialization,
          certifications: data.certifications || '',
          bio: data.bio || ''
        };
      },
      error: () => this.isEditing = false
    });
  }

  onSubmit() {
    const service$ = this.isEditing 
      ? this.trainerService.updateProfile(this.formData)
      : this.trainerService.createProfile(this.formData);

    service$.subscribe({
      next: (data) => {
        alert('Profile saved successfully!');
        this.profile = data;
        this.isEditing = true;
      },
      error: (err) => alert(err.error?.message || 'Error saving profile')
    });
  }
}
