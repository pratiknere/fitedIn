export interface Achievement {
  id: string;
  trainerId: string;
  trainerName: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAchievementRequest {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface AchievementsPage {
  content: Achievement[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
