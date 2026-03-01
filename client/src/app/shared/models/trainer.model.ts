export interface TrainerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  experienceYears: number;
  specialization: string;
  certifications?: string;
  totalClients: number;
  bio?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTrainerProfileRequest {
  experienceYears: number;
  specialization: string;
  certifications?: string;
  bio?: string;
}
