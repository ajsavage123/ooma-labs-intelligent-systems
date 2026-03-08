// Shared types across the application

export type Role = "user" | "partner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  workspace_access: boolean;
  organization?: string; // What organization/team they belong to
  password?: string; // For partner users
  collaborateIn?: "innovations_research" | "developer_engineer" | "business_marketing"; // Role they applied for
  createdAt?: string;
}

export interface PartnershipApplication {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  cityCountry: string;
  currentProfession: string;
  areaOfExpertise: string;
  linkedinProfile: string;
  collaborateIn: "innovations_research" | "developer_engineer" | "business_marketing";
  organization?: string;
  role?: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedAt?: string;
}

export interface LogEntry {
  id: string;
  date: string; // ISO
  team: string;
  description: string;
}

export interface Stage {
  id: string;
  name: string;
  logs: LogEntry[];
}

export type ProjectStatus =
  | "in_progress"
  | "completed"
  | "pending_approval"
  | "approved"
  | "rejected";

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  teamMembers: string[];
  stages: Stage[];
  currentStageIndex: number;
  lastUpdated: string;
  status: ProjectStatus;
}

export interface Product {
  id: string;
  projectId: string;
  name: string;
  description: string;
  launchStatus: string;
  team: string[];
}
