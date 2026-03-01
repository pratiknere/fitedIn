export interface GymProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  gymName: string;
  address: string;
  facilities?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateGymProfileRequest {
  gymName: string;
  address: string;
  facilities?: string;
  description?: string;
}
