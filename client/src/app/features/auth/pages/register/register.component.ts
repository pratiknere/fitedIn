import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { RegisterRequest } from '../../../../shared/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="register-box">
        <h2>FitLink</h2>
        <h3>Register</h3>
        <form (ngSubmit)="onRegister()">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="name" name="name" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required />
          </div>
          <div class="form-group">
            <label>I am a</label>
            <select [(ngModel)]="role" name="role" required>
              <option value="">Select Role</option>
              <option value="TRAINER">Personal Trainer</option>
              <option value="GYM">Gym Owner</option>
            </select>
          </div>
          <button type="submit" [disabled]="isLoading()">
            {{ isLoading() ? 'Registering...' : 'Register' }}
          </button>
          <p *ngIf="error()">{{ error() }}</p>
        </form>
        <p>Already have an account? <a routerLink="/auth/login">Login here</a></p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .register-box {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
    }
    h2 {
      color: #667eea;
      text-align: center;
      margin-bottom: 10px;
    }
    h3 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
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
    input, select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      box-sizing: border-box;
    }
    input:focus, select:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
    }
    button {
      width: 100%;
      padding: 12px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }
    button:hover:not(:disabled) {
      background: #764ba2;
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    p {
      margin-top: 20px;
      text-align: center;
      color: #666;
    }
    a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }
  `]
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  name = '';
  email = '';
  password = '';
  role: 'TRAINER' | 'GYM' | '' = '';

  isLoading = this.authService.isLoading;
  error = this.authService.error;

  onRegister() {
    const request: RegisterRequest = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role as 'TRAINER' | 'GYM'
    };

    this.authService.register(request).subscribe({
      next: () => {
        alert('Registration successful! Please login.');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => console.error('Registration error', err)
    });
  }
}
