import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Achievement, CreateAchievementRequest, AchievementsPage } from '../../shared/models/achievement.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/achievements';

  createAchievement(request: CreateAchievementRequest): Observable<Achievement> {
    return this.http.post<{ data: Achievement }>(this.apiUrl, request)
      .pipe(map(response => response.data));
  }

  getAchievement(achievementId: string): Observable<Achievement> {
    return this.http.get<{ data: Achievement }>(`${this.apiUrl}/${achievementId}`)
      .pipe(map(response => response.data));
  }

  getFeed(page: number = 0, size: number = 10): Observable<AchievementsPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<{ data: AchievementsPage }>(`${this.apiUrl}/feed`, { params })
      .pipe(map(response => response.data));
  }

  getTrainerAchievements(trainerId: string, page: number = 0, size: number = 10): Observable<AchievementsPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<{ data: AchievementsPage }>(`${this.apiUrl}/trainer/${trainerId}`, { params })
      .pipe(map(response => response.data));
  }

  deleteAchievement(achievementId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${achievementId}`);
  }
}
