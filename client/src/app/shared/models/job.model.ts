export interface Job {
  id: string;
  gymId: string;
  gymName: string;
  title: string;
  description: string;
  experienceRequired: number;
  salaryRange?: string;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  updatedAt?: string;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  experienceRequired: number;
  salaryRange?: string;
}

export interface JobsPage {
  content: Job[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
