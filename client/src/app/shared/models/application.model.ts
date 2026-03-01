export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  trainerId: string;
  trainerName: string;
  status: 'APPLIED' | 'SHORTLISTED' | 'REJECTED';
  appliedAt: string;
  updatedAt?: string;
}

export interface ApplyJobRequest {
  jobId: string;
}

export interface ApplicationsPage {
  content: JobApplication[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
