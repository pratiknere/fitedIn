import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { JobApplication, ApplyJobRequest, ApplicationsPage } from '../../shared/models/application.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/applications';

  applyJob(request: ApplyJobRequest): Observable<JobApplication> {
    return this.http.post<{ data: JobApplication }>(`${this.apiUrl}/apply`, request)
      .pipe(map(response => response.data));
  }

  getMyApplications(page: number = 0, size: number = 10): Observable<ApplicationsPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<{ data: ApplicationsPage }>(`${this.apiUrl}/my-applications`, { params })
      .pipe(map(response => response.data));
  }

  getJobApplications(jobId: string, page: number = 0, size: number = 10): Observable<ApplicationsPage> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<{ data: ApplicationsPage }>(`${this.apiUrl}/job/${jobId}`, { params })
      .pipe(map(response => response.data));
  }

  updateApplicationStatus(applicationId: string, status: 'APPLIED' | 'SHORTLISTED' | 'REJECTED'): Observable<JobApplication> {
    return this.http.patch<{ data: JobApplication }>(`${this.apiUrl}/${applicationId}/status`, null, {
      params: new HttpParams().set('status', status)
    }).pipe(map(response => response.data));
  }
}
