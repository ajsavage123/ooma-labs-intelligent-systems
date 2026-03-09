// Shared types across the application

export type Role = "partner" | "admin";

export type Designation =
  | "Innovation & Research Team"
  | "Developer & Engineering Team"
  | "Business Strategy & Marketing Team";

export interface UserProfile {
  id: string;
  username: string;
  designation: Designation | null;
  role: Role;
  created_at?: string;
}

export interface PartnershipRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  profession?: string;
  expertise: string;
  linkedin?: string;
  interest: string;
  reason?: string;
  status: "pending" | "approved" | "rejected";
  created_at?: string;
}

export interface TimelineLog {
  id: string;
  project_id: string;
  user_name: string;
  designation: string;
  stage: string;
  update_text: string;
  created_at?: string;
}

export type ProjectStage =
  | "Ideology & Concept"
  | "Research"
  | "Development"
  | "Deployment"
  | "Business Strategy"
  | "Marketing Planning"
  | "Customer Feedback"
  | "Admin Review";

export interface Project {
  id: string;
  name: string;
  description: string;
  drive_link?: string;
  github_link?: string;
  current_stage: ProjectStage;
  progress: number;
  created_by: string;
  created_at: string;
}

export interface AdminRating {
  id: string;
  project_id: string;
  problem_importance: number;
  technical_feasibility: number;
  market_demand: number;
  impact_potential: number;
  development_complexity: number;
  innovation_score: number;
  notes?: string;
  rated_at: string;
}

// Keeping these for potential migration/reference
export interface LegacyProject {
  id: string;
  name: string;
  description: string;
  owner: string;
  teamMembers: string[];
  stages: any[];
  currentStageIndex: number;
  lastUpdated: string;
  status: string;
}
