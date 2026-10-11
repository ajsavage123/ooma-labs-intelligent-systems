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

// ----------------------------------------------------
// Client Portal Types
// ----------------------------------------------------

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  avatar?: string;
  phone?: string;
  joinedDate: string;
  portalRole: "client_admin" | "client_viewer";
}

export type MilestoneStatus = "completed" | "in_progress" | "pending";

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  progress: number; // 0 - 100
  dueDate: string;
  completedDate?: string;
  deliverables?: string[];
  notes?: string;
}

export type EnvironmentType = "production" | "staging" | "design" | "api_docs" | "github";

export interface ProjectLiveUrl {
  id: string;
  label: string;
  url: string;
  type: EnvironmentType;
  status: "live" | "deploying" | "maintenance";
  uptime: string;
  lastDeployed: string;
  notes?: string;
}

export interface ClientRating {
  id: string;
  overallScore: number; // 1-5
  categories: {
    engineeringQuality: number;
    communication: number;
    velocity: number;
    uiUxDesign: number;
  };
  feedbackText: string;
  authorName: string;
  submittedAt: string;
  clientRecommendation: boolean;
}

export interface ProjectComment {
  id: string;
  authorName: string;
  authorRole: "client" | "lead_architect" | "project_manager" | "engineer";
  authorAvatar?: string;
  message: string;
  timestamp: string;
  attachments?: { name: string; url: string; size: string }[];
  likesCount?: number;
  isPinned?: boolean;
}

export type PaymentStatus = "paid" | "pending" | "overdue";

export interface ClientPayment {
  id: string;
  invoiceNumber: string;
  milestoneTitle: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  downloadUrl?: string;
  gstSacCode?: string;
  paymentMethod?: string;
  appliedDiscountINR?: number;
  appliedCouponCode?: string;
  netPayableINR?: number;
}

export type TicketPriority = "urgent" | "high" | "medium" | "low";
export type TicketStatus = "open" | "in_progress" | "resolved";

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: "bug" | "change_request" | "feature" | "billing" | "security";
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  assignedEngineer: string;
  updates: {
    id: string;
    sender: string;
    message: string;
    time: string;
  }[];
}

export type ReferralVettingStatus = 
  | "under_vetting"
  | "requirement_verified"
  | "advance_paid"
  | "verified_client"
  | "rejected";

export interface ReferralLead {
  id: string;
  contactName: string;
  companyName: string;
  email: string;
  phone?: string;
  requirementBrief?: string;
  status: ReferralVettingStatus;
  advancePaidINR?: number;
  rewardAmount: number;
  date: string;
}

export interface ClientReferralData {
  referralCode: string;
  shareableUrl: string;
  totalReferrals: number;
  verifiedClientsCount: number; // Counter towards the 4 required
  requiredForUnlock: number;    // Exactly 4 verified clients
  isCouponUnlocked: boolean;    // true when verifiedClientsCount >= 4
  isCardUnlocked?: boolean;     // Unlocks VIP Partner credit card when verifiedClientsCount >= 4
  creditCardAmountINR?: number; // e.g. 4000
  cardholderName?: string;
  unlockedCouponCode?: string;  // e.g. "OOMA-VERIFIED-4X"
  discountPercentage: number;   // e.g. 20%
  totalEarnings: number;
  pendingPayout: number;
  history: ReferralLead[];
}

export interface ClientProject {
  id: string;
  title: string;
  clientId: string;
  company: string;
  summary: string;
  tier: "Enterprise AI Suite" | "Cloud System" | "Strategic Engineering";
  overallProgress: number; // 0 - 100
  status: "in_development" | "in_testing" | "live_deployed" | "maintenance";
  startDate: string;
  targetLaunchDate: string;
  techStack: string[];
  dedicatedLead: {
    name: string;
    role: string;
    avatar: string;
    email: string;
    status: string;
  };
  milestones: ProjectMilestone[];
  liveUrls: ProjectLiveUrl[];
  ratings: ClientRating[];
  comments: ProjectComment[];
  payments: ClientPayment[];
  supportTickets: SupportTicket[];
  referrals: ClientReferralData;
}

