import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TrainerProfile, CreateTrainerProfileRequest } from '../../shared/models/trainer.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/trainer';

  createProfile(request: CreateTrainerProfileRequest): Observable<TrainerProfile> {
    return this.http.post<{ data: TrainerProfile }>(`${this.apiUrl}/profile`, request)
      .pipe(map(response => response.data));
  }

  updateProfile(request: CreateTrainerProfileRequest): Observable<TrainerProfile> {
    return this.http.put<{ data: TrainerProfile }>(`${this.apiUrl}/profile`, request)
      .pipe(map(response => response.data));
  }

  getProfile(): Observable<TrainerProfile> {
    return this.http.get<{ data: TrainerProfile }>(`${this.apiUrl}/profile`)
      .pipe(map(response => response.data));
  }
}
