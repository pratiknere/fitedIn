import { inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from '../../shared/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  private userSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);
  private isLoadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  readonly user: Signal<User | null> = this.userSignal.asReadonly();
  readonly token: Signal<string | null> = this.tokenSignal.asReadonly();
  readonly isLoading: Signal<boolean> = this.isLoadingSignal.asReadonly();
  readonly error: Signal<string | null> = this.errorSignal.asReadonly();
  readonly isAuthenticated: Signal<boolean> = signal(false);

  constructor() {
    this.loadStoredToken();
  }

  register(request: RegisterRequest) {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, request)
      .pipe(
        tap(() => {
          this.isLoadingSignal.set(false);
        }),
        catchError(error => {
          this.errorSignal.set(error.error?.message || 'Registration failed');
          this.isLoadingSignal.set(false);
          throw error;
        })
      );
  }

  login(request: LoginRequest) {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.post<{ data: LoginResponse }>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          const loginResponse = response.data;
          this.storeToken(loginResponse.accessToken);
          this.userSignal.set({
            userId: loginResponse.userId,
            name: loginResponse.name,
            email: loginResponse.email,
            role: loginResponse.role
          });
          (this.isAuthenticated as any).set(true);
          this.isLoadingSignal.set(false);
        }),
        catchError(error => {
          this.errorSignal.set(error.error?.message || 'Login failed');
          this.isLoadingSignal.set(false);
          throw error;
        })
      );
  }

  logout() {
    this.clearToken();
    this.userSignal.set(null);
    (this.isAuthenticated as any).set(false);
    this.router.navigate(['/auth/login']);
  }

  private storeToken(token: string) {
    localStorage.setItem('authToken', token);
    this.tokenSignal.set(token);
  }

  private clearToken() {
    localStorage.removeItem('authToken');
    this.tokenSignal.set(null);
  }

  private loadStoredToken() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.tokenSignal.set(token);
      (this.isAuthenticated as any).set(true);
    }
  }

  getToken(): string | null {
    return this.tokenSignal();
  }
}
