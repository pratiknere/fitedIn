import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Job, CreateJobRequest, JobsPage } from '../../shared/models/job.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/jobs';

  createJob(request: CreateJobRequest): Observable<Job> {
    return this.http.post<{ data: Job }>(this.apiUrl, request)
      .pipe(map(response => response.data));
  }

  getJob(jobId: string): Observable<Job> {
    return this.http.get<{ data: Job }>(`${this.apiUrl}/${jobId}`)
      .pipe(map(response => response.data));
  }

  getAllJobs(page: number = 0, size: number = 10): Observable<JobsPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<{ data: JobsPage }>(this.apiUrl, { params })
      .pipe(map(response => response.data));
  }

  getJobsByGym(gymId: string, page: number = 0, size: number = 10): Observable<JobsPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<{ data: JobsPage }>(`${this.apiUrl}/gym/${gymId}`, { params })
      .pipe(map(response => response.data));
  }

  updateJobStatus(jobId: string, status: 'OPEN' | 'CLOSED'): Observable<Job> {
    return this.http.patch<{ data: Job }>(`${this.apiUrl}/${jobId}/status`, null, {
      params: new HttpParams().set('status', status)
    }).pipe(map(response => response.data));
  }
}
