import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GymProfile, CreateGymProfileRequest } from '../../shared/models/gym.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GymService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/gym';

  createProfile(request: CreateGymProfileRequest): Observable<GymProfile> {
    return this.http.post<{ data: GymProfile }>(`${this.apiUrl}/profile`, request)
      .pipe(map(response => response.data));
  }

  updateProfile(request: CreateGymProfileRequest): Observable<GymProfile> {
    return this.http.put<{ data: GymProfile }>(`${this.apiUrl}/profile`, request)
      .pipe(map(response => response.data));
  }

  getProfile(): Observable<GymProfile> {
    return this.http.get<{ data: GymProfile }>(`${this.apiUrl}/profile`)
      .pipe(map(response => response.data));
  }
}
