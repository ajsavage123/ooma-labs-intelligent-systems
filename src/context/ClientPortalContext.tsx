import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  ClientUser,
  ClientProject,
  ProjectMilestone,
  ProjectLiveUrl,
  ClientRating,
  ProjectComment,
  ClientPayment,
  SupportTicket,
  ClientReferralData,
} from "../types";
import { isSupabaseConfigured, getSupabaseClient } from "../lib/supabase";
import { supabaseService } from "../lib/supabaseService";

// Helper for formatting Indian currency (INR / ₹)
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// ==============================================================================
// CANONICAL 6 DELIVERY STAGES & EDITABLE NOTES (CLEAN - NO CLUTTER)
// ==============================================================================
export const CANONICAL_6_STAGES: { stage: number; title: string; defaultNotes: string }[] = [
  {
    stage: 1,
    title: "1. Client Discovery",
    defaultNotes: "Intake of all client assets, credentials, brand guidelines, and infrastructure access.",
  },
  {
    stage: 2,
    title: "2. Objective Requirements Gathering",
    defaultNotes: "Formal Scope of Work (SOW), functional specifications, user story journeys, and database models.",
  },
  {
    stage: 3,
    title: "3. UI/UX Development",
    defaultNotes: "Figma wireframes, design tokens, responsive prototype testing, and design sign-off.",
  },
  {
    stage: 4,
    title: "4. Development",
    defaultNotes: "Fullstack engineering implementation, backend APIs, database migrations, and frontend state architecture.",
  },
  {
    stage: 5,
    title: "5. Testing",
    defaultNotes: "End-to-end QA, cross-device testing, security penetration audits, and client User Acceptance Testing (UAT).",
  },
  {
    stage: 6,
    title: "6. Hosting",
    defaultNotes: "Production cloud launch (AWS/GCP), custom domain DNS and SSL certificate binding, and 24/7 monitoring handover.",
  },
];

export const CANONICAL_6_PHASES = CANONICAL_6_STAGES.map((s) => ({
  title: s.title,
  description: s.defaultNotes,
  deliverables: [] as string[],
}));

export function ensure6PhaseMilestones(project: {
  id?: string;
  milestones?: ProjectMilestone[];
  overallProgress?: number;
  startDate?: string;
  targetLaunchDate?: string;
}): ProjectMilestone[] {
  const current = project.milestones || [];

  // Check if compliant: strictly 6 items, clean stage titles, no 'sprint' keyword
  const isStrictlyCompliant =
    current.length === 6 &&
    current.every(
      (m) =>
        m.title &&
        !m.title.toLowerCase().includes("sprint") &&
        !m.description?.toLowerCase().includes("initial database schemas, authentication")
    );

  if (isStrictlyCompliant) {
    return current.map((m, idx) => ({
      ...m,
      title: CANONICAL_6_STAGES[idx]?.title || m.title,
      notes: m.notes || m.description || CANONICAL_6_STAGES[idx]?.defaultNotes || "",
      description: m.notes || m.description || CANONICAL_6_STAGES[idx]?.defaultNotes || "",
    }));
  }

  // Generate standard 6 stages, preserving progress and custom notes
  const overall = project.overallProgress ?? 0;
  return CANONICAL_6_STAGES.map((stage, idx) => {
    const existing = current[idx];
    const isCompleted = overall >= (idx + 1) * 16.6 || existing?.status === "completed";
    const isInProgress = !isCompleted && (overall >= idx * 16.6 || existing?.status === "in_progress" || idx === 0);
    const progress = isCompleted ? 100 : isInProgress ? (existing?.progress || (idx === 0 ? 30 : 15)) : 0;
    const status: "completed" | "in_progress" | "pending" = isCompleted ? "completed" : isInProgress ? "in_progress" : "pending";
    const noteText =
      existing?.notes ||
      (existing?.description && !existing.description.toLowerCase().includes("initial database schemas")
        ? existing.description
        : stage.defaultNotes);

    return {
      id: existing?.id?.startsWith("m-") ? existing.id : `m-${project.id || "proj"}-${idx + 1}`,
      title: stage.title,
      description: noteText,
      notes: noteText,
      status,
      progress,
      dueDate: existing?.dueDate || (idx === 5 ? (project.targetLaunchDate || "Target Handover") : `Target: Week ${(idx + 1) * 2}`),
      completedDate: isCompleted ? (existing?.completedDate || project.startDate || "Completed") : undefined,
      deliverables: [],
    };
  });
}

// Grounded Indian Enterprise Clients
export const MOCK_CLIENTS: ClientUser[] = [
  {
    id: "client-bharatlogistics",
    name: "Rajesh Sharma",
    email: "rajesh.sharma@bharatlogistics.in",
    company: "BharatLogistics Tech Pvt Ltd",
    title: "Chief Operating Officer",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80",
    phone: "+91 98490 21345",
    joinedDate: "January 2025",
    portalRole: "client_admin",
  },
  {
    id: "client-swasthyacare",
    name: "Priya Nair",
    email: "priya.nair@swasthyacare.com",
    company: "SwasthyaCare Digital Health",
    title: "VP of Product Engineering",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
    phone: "+91 98201 55432",
    joinedDate: "November 2024",
    portalRole: "client_admin",
  },
];

export const INITIAL_PROJECTS: ClientProject[] = [
  {
    id: "proj-bharatlogistics-01",
    title: "Pan-India Fleet Operations & FASTag Dispatch Portal",
    clientId: "client-bharatlogistics",
    company: "BharatLogistics Tech Pvt Ltd",
    summary:
      "Enterprise logistics platform tracking 1,200+ inter-city transport trucks across India with live GPS, automated FASTag toll tracking, GST E-Way Bill integration, and driver mobile app.",
    tier: "Strategic Engineering",
    overallProgress: 82,
    status: "in_development",
    startDate: "Jan 10, 2025",
    targetLaunchDate: "April 20, 2025",
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Google Maps India", "NIC E-Way Bill API"],
    dedicatedLead: {
      name: "Arjun Mehta",
      role: "Lead Systems Architect (OOMA Labs Hyderabad)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      email: "arjun@oomalabs.com",
      status: "Available at Hyderabad Tech Center",
    },
    milestones: [
      {
        id: "m-1",
        title: "1. Client Discovery",
        description: "Intake and audit of client assets, existing brand design tokens, AWS/GCP cloud environments, and external telematics vendor API credentials.",
        notes: "Intake and audit of client assets, existing brand design tokens, AWS/GCP cloud environments, and external telematics vendor API credentials.",
        status: "completed",
        progress: 100,
        dueDate: "Jan 18, 2025",
        completedDate: "Jan 17, 2025",
      },
      {
        id: "m-2",
        title: "2. Objective Requirements Gathering",
        description: "Formal Scope of Work (SOW), multi-depot operational workflows, functional specifications, and PostgreSQL database ER schemas.",
        notes: "Formal Scope of Work (SOW), multi-depot operational workflows, functional specifications, and PostgreSQL database ER schemas.",
        status: "completed",
        progress: 100,
        dueDate: "Jan 30, 2025",
        completedDate: "Jan 29, 2025",
      },
      {
        id: "m-3",
        title: "3. UI/UX Development",
        description: "High-contrast driver screens optimized for direct sunlight, transport dispatcher operations console, and interactive Figma design sign-off.",
        notes: "High-contrast driver screens optimized for direct sunlight, transport dispatcher operations console, and interactive Figma design sign-off.",
        status: "completed",
        progress: 100,
        dueDate: "Feb 18, 2025",
        completedDate: "Feb 17, 2025",
      },
      {
        id: "m-4",
        title: "4. Development",
        description: "Fullstack engineering: Live GPS map telemetry, NPCI FASTag webhook integration, driver web application, and GST tax invoicing engine.",
        notes: "Fullstack engineering: Live GPS map telemetry, NPCI FASTag webhook integration, driver web application, and GST tax invoicing engine.",
        status: "in_progress",
        progress: 85,
        dueDate: "March 28, 2025",
      },
      {
        id: "m-5",
        title: "5. Testing",
        description: "End-to-end integration testing across 4 regional transport hubs, security vulnerability assessment, and client User Acceptance Testing (UAT).",
        notes: "End-to-end integration testing across 4 regional transport hubs, security vulnerability assessment, and client User Acceptance Testing (UAT).",
        status: "pending",
        progress: 20,
        dueDate: "April 10, 2025",
      },
      {
        id: "m-6",
        title: "6. Hosting",
        description: "Production cloud launch on AWS Mumbai, domain SSL/TLS certificate binding, 99.98% uptime monitoring, and final handover.",
        notes: "Production cloud launch on AWS Mumbai, domain SSL/TLS certificate binding, 99.98% uptime monitoring, and final handover.",
        status: "pending",
        progress: 0,
        dueDate: "April 20, 2025",
      },
    ],
    liveUrls: [
      {
        id: "url-1",
        label: "Production Transport Portal",
        url: "https://fleet.bharatlogistics.in",
        type: "production",
        status: "live",
        uptime: "99.98%",
        lastDeployed: "Yesterday at 18:30 IST",
        notes: "Live deployment on secure Mumbai AWS data center.",
      },
      {
        id: "url-2",
        label: "Staging Test Server (Build #192)",
        url: "https://staging-fleet.oomalabs.com",
        type: "staging",
        status: "live",
        uptime: "100%",
        lastDeployed: "Today at 10:15 IST",
        notes: "Contains latest E-Way bill scanner and driver sign-off component.",
      },
      {
        id: "url-3",
        label: "Figma UI/UX Screens",
        url: "https://figma.com/@oomalabs/bharat-fleet",
        type: "design",
        status: "live",
        uptime: "Synced",
        lastDeployed: "Updated 2 days ago",
        notes: "High-contrast driver screens optimized for direct sunlight on phones.",
      },
      {
        id: "url-4",
        label: "REST API Documentation",
        url: "https://api-docs.bharatlogistics.in",
        type: "api_docs",
        status: "live",
        uptime: "99.99%",
        lastDeployed: "3 days ago",
        notes: "Swagger specs for GPS telematics vendors and warehouse ERPs.",
      },
    ],
    ratings: [
      {
        id: "rat-1",
        overallScore: 5,
        categories: {
          engineeringQuality: 5,
          communication: 5,
          velocity: 5,
          uiUxDesign: 5,
        },
        feedbackText:
          "OOMA LABS has built an outstanding system for us. Our Hyderabad and Bengaluru hub dispatchers are saving over 3 hours every day on vehicle tracking and toll calculations. Arjun and the team are very responsive.",
        authorName: "Rajesh Sharma",
        submittedAt: "March 2, 2025",
        clientRecommendation: true,
      },
    ],
    comments: [
      {
        id: "c-1",
        authorName: "Arjun Mehta",
        authorRole: "lead_architect",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        message:
          "Namaste Rajesh ji, we deployed build #192 to the staging environment. The FASTag toll auto-deduction reconciliation with ICICI NETC API is now verified for all 24 toll plazas on the Mumbai-Pune expressway.",
        timestamp: "Yesterday at 16:30 IST",
        isPinned: true,
      },
      {
        id: "c-2",
        authorName: "Rajesh Sharma",
        authorRole: "client",
        authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80",
        message:
          "Excellent work Arjun! Tested with our Bhiwandi transport manager. Can we also ensure the driver gets an instant WhatsApp alert when the trip destination is reached?",
        timestamp: "Today at 09:30 IST",
      },
      {
        id: "c-3",
        authorName: "Arjun Mehta",
        authorRole: "lead_architect",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        message:
          "Yes, we have integrated the WhatsApp Business API webhook. It will trigger automatically as soon as the consignee signature is submitted.",
        timestamp: "Today at 10:45 IST",
      },
    ],
    payments: [
      {
        id: "inv-001",
        invoiceNumber: "INV-2025-0102",
        milestoneTitle: "Milestone 1: Project Kickoff & Database Architecture",
        amount: 450000,
        currency: "INR",
        issueDate: "Jan 15, 2025",
        dueDate: "Jan 30, 2025",
        paidDate: "Jan 28, 2025",
        status: "paid",
      },
      {
        id: "inv-002",
        invoiceNumber: "INV-2025-0148",
        milestoneTitle: "Milestone 2: Live GPS Tracking & FASTag Toll API",
        amount: 550000,
        currency: "INR",
        issueDate: "Feb 15, 2025",
        dueDate: "March 02, 2025",
        paidDate: "Feb 27, 2025",
        status: "paid",
      },
      {
        id: "inv-003",
        invoiceNumber: "INV-2025-0219",
        milestoneTitle: "Milestone 3: Driver Mobile Web App & E-Way Bill Verification",
        amount: 450000,
        currency: "INR",
        issueDate: "March 01, 2025",
        dueDate: "March 25, 2025",
        status: "pending",
      },
      {
        id: "inv-004",
        invoiceNumber: "INV-2025-0290",
        milestoneTitle: "Milestone 4: GST Invoicing, Fuel Calculator & Launch",
        amount: 400000,
        currency: "INR",
        issueDate: "April 01, 2025",
        dueDate: "April 25, 2025",
        status: "pending",
      },
    ],
    supportTickets: [
      {
        id: "tick-101",
        ticketNumber: "TCK-4019",
        title: "Tally GST export showing 0% IGST instead of 18% for inter-state routes",
        description:
          "When generating freight billing export for shipments from Maharashtra to Karnataka, the GST tax rate showed 0% instead of 18% IGST.",
        category: "billing",
        priority: "high",
        status: "in_progress",
        createdAt: "March 05, 2025",
        updatedAt: "2 hours ago",
        assignedEngineer: "Arjun Mehta (Lead Architect)",
        updates: [
          {
            id: "up-1",
            sender: "Rajesh Sharma",
            message: "Identified by our accounts team during monthly GST return filing.",
            time: "March 05, 11:00 IST",
          },
          {
            id: "up-2",
            sender: "Arjun Mehta",
            message: "Fixed the state code lookup mapping. Inter-state routes will now accurately tag 18% IGST and intra-state will tag 9% CGST + 9% SGST. Pushing patch today.",
            time: "Today at 09:15 IST",
          },
        ],
      },
    ],
    referrals: {
      referralCode: "OOMA-RAJESH-BLR",
      shareableUrl: "https://oomalabs.com/free-quotation?ref=OOMA-RAJESH-BLR",
      totalReferrals: 4,
      verifiedClientsCount: 2,
      requiredForUnlock: 4,
      isCouponUnlocked: false,
      isCardUnlocked: false,
      creditCardAmountINR: 4000,
      cardholderName: "Rajesh Sharma",
      unlockedCouponCode: "OOMA-VERIFIED-4X",
      discountPercentage: 20,
      totalEarnings: 150000,
      pendingPayout: 50000,
      history: [
        {
          id: "ref-1",
          contactName: "Vikram Singhania",
          companyName: "Singhania Express Cargo",
          email: "vikram@singhaniacargo.in",
          phone: "+91 98400 11223",
          requirementBrief: "Automated multi-depot fleet management & FASTag toll reconciliation system",
          status: "verified_client",
          advancePaidINR: 150000,
          rewardAmount: 100000,
          date: "Jan 22, 2025",
        },
        {
          id: "ref-2",
          contactName: "Karthik Reddy",
          companyName: "Deccan Cold Logistics",
          email: "karthik@deccancold.com",
          phone: "+91 99887 66554",
          requirementBrief: "IoT refrigerated vehicle telematics & cold-chain compliance portal",
          status: "verified_client",
          advancePaidINR: 100000,
          rewardAmount: 50000,
          date: "Feb 18, 2025",
        },
        {
          id: "ref-3",
          contactName: "Ananya Sengupta",
          companyName: "Kolkata Freight Movers",
          email: "ananya@kolkatafreight.in",
          phone: "+91 97332 44556",
          requirementBrief: "Interstate GST E-Way bill scanner & driver mobile workflow",
          status: "requirement_verified",
          advancePaidINR: 0,
          rewardAmount: 50000,
          date: "March 02, 2025",
        },
        {
          id: "ref-4",
          contactName: "Sanjay Deshmukh",
          companyName: "Deshmukh Agro Logistics",
          email: "sanjay@deshmukhagro.in",
          phone: "+91 98230 77889",
          requirementBrief: "Supply chain dispatch, rural mandi route planning & billing",
          status: "under_vetting",
          advancePaidINR: 0,
          rewardAmount: 50000,
          date: "March 28, 2025",
        },
      ],
    },
  },
  {
    id: "proj-swasthyacare-02",
    title: "ABDM & Ayushman Bharat Telemedicine Patient Portal",
    clientId: "client-swasthyacare",
    company: "SwasthyaCare Digital Health",
    summary:
      "Integrated healthcare portal with Ayushman Bharat Digital Mission (ABDM) ABHA ID creation, doctor video consultations, and digital prescription generation.",
    tier: "Strategic Engineering",
    overallProgress: 94,
    status: "live_deployed",
    startDate: "Nov 05, 2024",
    targetLaunchDate: "March 15, 2025",
    techStack: ["Next.js", "TypeScript", "Node.js", "ABDM Health Gateway", "PostgreSQL", "Tailwind CSS"],
    dedicatedLead: {
      name: "Sneha Kulkarni",
      role: "Lead Healthcare Systems Engineer",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      email: "sneha@oomalabs.com",
      status: "Available at Hyderabad Tech Center",
    },
    milestones: [
      {
        id: "sw-1",
        title: "1. Client Discovery",
        description: "Intake of hospital clinical assets, FHIR schemas, ABDM gateway certificates, and cloud infrastructure.",
        notes: "Intake of hospital clinical assets, FHIR schemas, ABDM gateway certificates, and cloud infrastructure.",
        status: "completed",
        progress: 100,
        dueDate: "Nov 20, 2024",
        completedDate: "Nov 19, 2024",
      },
      {
        id: "sw-2",
        title: "2. Objective Requirements Gathering",
        description: "ABHA creation user stories, doctor consultation flows, e-prescription schemas, and SOW sign-off.",
        notes: "ABHA creation user stories, doctor consultation flows, e-prescription schemas, and SOW sign-off.",
        status: "completed",
        progress: 100,
        dueDate: "Dec 05, 2024",
        completedDate: "Dec 04, 2024",
      },
      {
        id: "sw-3",
        title: "3. UI/UX Development",
        description: "Figma design system for patient mobile web, doctor prescription dashboard, and OPD kiosk screens.",
        notes: "Figma design system for patient mobile web, doctor prescription dashboard, and OPD kiosk screens.",
        status: "completed",
        progress: 100,
        dueDate: "Dec 28, 2024",
        completedDate: "Dec 27, 2024",
      },
      {
        id: "sw-4",
        title: "4. Development",
        description: "Fullstack ABDM gateway integration, WebRTC encrypted video consultations, and e-prescription generator.",
        notes: "Fullstack ABDM gateway integration, WebRTC encrypted video consultations, and e-prescription generator.",
        status: "completed",
        progress: 100,
        dueDate: "Feb 10, 2025",
        completedDate: "Feb 08, 2025",
      },
      {
        id: "sw-5",
        title: "5. Testing",
        description: "NHA official security audit, load testing with 10,000 concurrent patient queues, and hospital UAT.",
        notes: "NHA official security audit, load testing with 10,000 concurrent patient queues, and hospital UAT.",
        status: "completed",
        progress: 100,
        dueDate: "Feb 28, 2025",
        completedDate: "Feb 27, 2025",
      },
      {
        id: "sw-6",
        title: "6. Hosting",
        description: "Multi-AZ AWS Mumbai healthcare deployment, domain SSL binding, and 99.99% uptime monitoring handover.",
        notes: "Multi-AZ AWS Mumbai healthcare deployment, domain SSL binding, and 99.99% uptime monitoring handover.",
        status: "completed",
        progress: 100,
        dueDate: "March 15, 2025",
        completedDate: "March 12, 2025",
      },
    ],
    liveUrls: [
      {
        id: "sw-url-1",
        label: "Production Patient Portal",
        url: "https://app.swasthyacare.com",
        type: "production",
        status: "live",
        uptime: "99.99%",
        lastDeployed: "3 days ago",
      },
      {
        id: "sw-url-2",
        label: "Staging Testing Sandbox",
        url: "https://sandbox.swasthyacare.oomalabs.com",
        type: "staging",
        status: "live",
        uptime: "100%",
        lastDeployed: "1 week ago",
      },
    ],
    ratings: [
      {
        id: "sw-rat-1",
        overallScore: 5,
        categories: {
          engineeringQuality: 5,
          communication: 5,
          velocity: 5,
          uiUxDesign: 5,
        },
        feedbackText:
          "Flawless execution by OOMA LABS on the ABDM integration. Getting official NHA certification was completely painless thanks to their team.",
        authorName: "Priya Nair",
        submittedAt: "Feb 25, 2025",
        clientRecommendation: true,
      },
    ],
    comments: [
      {
        id: "sw-c-1",
        authorName: "Sneha Kulkarni",
        authorRole: "lead_architect",
        message: "Production portal has completed over 45,000 patient tele-consultations across Maharashtra.",
        timestamp: "3 days ago",
        isPinned: true,
      },
    ],
    payments: [
      {
        id: "sw-inv-1",
        invoiceNumber: "INV-2024-8901",
        milestoneTitle: "Full SOW Retainer (All ABDM Milestones)",
        amount: 1200000,
        currency: "INR",
        issueDate: "Nov 10, 2024",
        dueDate: "Nov 30, 2024",
        paidDate: "Nov 25, 2024",
        status: "paid",
      },
    ],
    supportTickets: [],
    referrals: {
      referralCode: "OOMA-PRIYA-SWAS",
      shareableUrl: "https://oomalabs.com/free-quotation?ref=OOMA-PRIYA-SWAS",
      totalReferrals: 4,
      verifiedClientsCount: 4,
      requiredForUnlock: 4,
      isCouponUnlocked: true,
      isCardUnlocked: true,
      creditCardAmountINR: 4000,
      cardholderName: "Priya Nair",
      unlockedCouponCode: "OOMA-VERIFIED-4X",
      discountPercentage: 20,
      totalEarnings: 200000,
      pendingPayout: 0,
      history: [
        {
          id: "ref-sw-1",
          contactName: "Dr. Arvind Rao",
          companyName: "CarePlus Diagnostic Clinics",
          email: "arvind@careplus.in",
          phone: "+91 98111 22334",
          requirementBrief: "Pathology LIMS lab automation & NABL certificate integration",
          status: "verified_client",
          advancePaidINR: 80000,
          rewardAmount: 50000,
          date: "Dec 10, 2024",
        },
        {
          id: "ref-sw-2",
          contactName: "Meera Krishnan",
          companyName: "Apex MedTech Solutions",
          email: "meera@apexmedtech.com",
          phone: "+91 98222 33445",
          requirementBrief: "Medical IoT vitals monitor backend & HL7 FHIR sync",
          status: "verified_client",
          advancePaidINR: 120000,
          rewardAmount: 50000,
          date: "Jan 14, 2025",
        },
        {
          id: "ref-sw-3",
          contactName: "Rohan Kapoor",
          companyName: "Kapoor Specialty Hospitals",
          email: "rohan@kapoorhospitals.com",
          phone: "+91 98333 44556",
          requirementBrief: "Hospital EMR & OPD Queue Kiosk system with Ayushman ABHA",
          status: "verified_client",
          advancePaidINR: 150000,
          rewardAmount: 50000,
          date: "Feb 08, 2025",
        },
        {
          id: "ref-sw-4",
          contactName: "Sunita Verma",
          companyName: "PharmaLink Direct",
          email: "sunita@pharmalink.in",
          phone: "+91 98444 55667",
          requirementBrief: "B2B Pharmacy procurement & medicine batch tracking ERP",
          status: "verified_client",
          advancePaidINR: 100000,
          rewardAmount: 50000,
          date: "March 01, 2025",
        },
      ],
    },
  },
];

export interface SpreadsheetRow {
  projectId: string;
  projectTitle: string;
  company: string;
  clientName: string;
  clientEmail: string;
  stageName: string;
  stageStatus: "completed" | "in_progress" | "pending";
  stageProgress: number;
  stageDueDate: string;
  overallProgress: number;
  primaryUrl: string;
  totalBudgetINR: number;
  paidINR: number;
  pendingINR: number;
}

interface ClientPortalContextType {
  clientUser: ClientUser | null;
  projects: ClientProject[];
  activeProject: ClientProject;
  availableClients: ClientUser[];
  selectProject: (id: string) => void;
  switchClient: (clientId: string) => void;
  loginClient: (email: string, pass?: string) => boolean;
  logoutClient: () => void;
  addComment: (message: string, attachments?: { name: string; url: string; size: string }[]) => void;
  submitRating: (data: {
    overallScore: number;
    categories: { engineeringQuality: number; communication: number; velocity: number; uiUxDesign: number };
    feedbackText: string;
    clientRecommendation: boolean;
  }) => void;
  payInvoice: (invoiceId: string, appliedCouponCode?: string, discountAmountINR?: number) => void;
  submitReferral: (data: {
    contactName: string;
    companyName: string;
    email: string;
    phone?: string;
    requirementBrief?: string;
  }) => void;
  verifyReferralRequirement: (projectId: string, referralId: string) => void;
  confirmReferralAdvancePaid: (projectId: string, referralId: string, advancePaidINR: number) => void;
  submitQuotationRequest: (data: {
    referralCode?: string;
    contactName: string;
    companyName: string;
    email: string;
    phone: string;
    projectCategory: string;
    requirementScope: string;
    budgetRange: string;
    timeline: string;
  }) => { success: boolean; leadId: string };
  createSupportTicket: (data: {
    title: string;
    description: string;
    category: SupportTicket["category"];
    priority: SupportTicket["priority"];
  }) => void;
  addTicketReply: (ticketId: string, message: string) => void;

  // --- ADMIN & SPREADSHEET PORTAL CONTROLS ---
  updateMilestone: (projectId: string, milestoneId: string, updates: Partial<ProjectMilestone>) => void;
  advanceProjectStage: (projectId: string) => void;
  setProjectStageIndex: (projectId: string, stageIndex: number) => void;
  addMilestone: (projectId: string, milestone: Omit<ProjectMilestone, "id">) => void;
  deleteMilestone: (projectId: string, milestoneId: string) => void;
  updateLiveUrl: (projectId: string, urlId: string, updates: Partial<ProjectLiveUrl>) => void;
  addLiveUrl: (projectId: string, url: Omit<ProjectLiveUrl, "id">) => void;
  deleteLiveUrl: (projectId: string, urlId: string) => void;
  addInvoice: (projectId: string, invoice: Omit<ClientPayment, "id">) => void;
  updateInvoice: (projectId: string, invoiceId: string, updates: Partial<ClientPayment>) => void;
  deleteInvoice: (projectId: string, invoiceId: string) => void;
  createClientAndProject: (
    clientData: { name: string; email: string; company: string; phone?: string; title?: string },
    projectData: {
      title: string;
      summary: string;
      targetLaunchDate: string;
      techStack: string[];
      milestones: { title: string; description: string; dueDate: string }[];
      invoices: { milestoneTitle: string; amount: number; dueDate: string }[];
      liveUrls: { label: string; url: string; type: ProjectLiveUrl["type"] }[];
    }
  ) => string;
  deleteProject: (projectId: string) => void;
  exportToSpreadsheetCSV: () => void;
  importFromSpreadsheetCSV: (csvString: string) => { success: boolean; message: string; rowsCount?: number };
  getSpreadsheetRows: () => SpreadsheetRow[];
  saveSpreadsheetRow: (row: SpreadsheetRow) => void;

  // Supabase Cloud Integration
  supabaseStatus: "connected" | "unconfigured" | "connecting" | "error";
  syncSupabase: () => Promise<{ success: boolean; message: string }>;
  uploadLocalToSupabase: () => Promise<{ success: boolean; message: string }>;
}

const ClientPortalContext = createContext<ClientPortalContextType | undefined>(undefined);

export const ClientPortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<ClientUser[]>(() => {
    try {
      const saved = localStorage.getItem("ooma_all_clients_inr");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return MOCK_CLIENTS;
  });

  const [clientUser, setClientUser] = useState<ClientUser | null>(() => {
    try {
      const savedUser = localStorage.getItem("ooma_client_user_inr");
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.error(e);
    }
    return MOCK_CLIENTS[0];
  });

  const [projects, setProjects] = useState<ClientProject[]>(() => {
    try {
      const saved = localStorage.getItem("ooma_client_projects_inr");
      if (saved) {
        const parsed: ClientProject[] = JSON.parse(saved);
        let hasChanges = false;
        const upgraded = parsed.map((p) => {
          const verifiedCount = p.referrals?.verifiedClientsCount ?? (p.referrals?.history?.filter((h: any) => h.status === "verified_client" || h.status === "paid_out").length || 0);
          const milestones = ensure6PhaseMilestones(p);
          return {
            ...p,
            milestones,
            referrals: {
              ...p.referrals,
              requiredForUnlock: 4,
              verifiedClientsCount: verifiedCount,
              isCouponUnlocked: verifiedCount >= 4 || !!p.referrals?.isCouponUnlocked,
              isCardUnlocked: verifiedCount >= 4 || !!p.referrals?.isCardUnlocked,
              creditCardAmountINR: p.referrals?.creditCardAmountINR || 4000,
              cardholderName: p.referrals?.cardholderName || (p.id === "proj-bharatlogistics-01" ? "Rajesh Sharma" : "Priya Nair"),
              unlockedCouponCode: p.referrals?.unlockedCouponCode || "OOMA-VERIFIED-4X",
              discountPercentage: p.referrals?.discountPercentage || 20,
              history: (p.referrals?.history || []).map((h: any) => ({
                ...h,
                status: (h.status === "paid_out" ? "verified_client" : h.status === "in_contract" ? "requirement_verified" : h.status) || "under_vetting",
                advancePaidINR: h.advancePaidINR ?? (h.status === "verified_client" || h.status === "paid_out" ? 100000 : 0),
              })),
            },
          };
        });

        // Immediately update localStorage so stale sprint cache is wiped
        try {
          localStorage.setItem("ooma_client_projects_inr", JSON.stringify(upgraded));
        } catch (e) {
          console.error(e);
        }
        return upgraded;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem("ooma_active_project_id_inr");
      if (savedId) return savedId;
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROJECTS[0].id;
  });

  useEffect(() => {
    localStorage.setItem("ooma_all_clients_inr", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    if (clientUser) {
      localStorage.setItem("ooma_client_user_inr", JSON.stringify(clientUser));
    } else {
      localStorage.removeItem("ooma_client_user_inr");
    }
  }, [clientUser]);

  useEffect(() => {
    localStorage.setItem("ooma_client_projects_inr", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("ooma_active_project_id_inr", activeProjectId);
  }, [activeProjectId]);

  // Supabase Cloud State & Sync
  const [supabaseStatus, setSupabaseStatus] = useState<"connected" | "unconfigured" | "connecting" | "error">(
    isSupabaseConfigured() ? "connecting" : "unconfigured"
  );

  const syncSupabase = async (): Promise<{ success: boolean; message: string }> => {
    if (!isSupabaseConfigured()) {
      setSupabaseStatus("unconfigured");
      return { success: false, message: "Supabase URL and Anon Key are not configured." };
    }
    setSupabaseStatus("connecting");
    try {
      const [remoteProjects, remoteClients] = await Promise.all([
        supabaseService.fetchProjects(),
        supabaseService.fetchClients(),
      ]);

      if (remoteProjects.length > 0) {
        const sanitizedRemote = remoteProjects.map((p) => ({
          ...p,
          milestones: ensure6PhaseMilestones(p),
        }));
        setProjects(sanitizedRemote);
        try {
          localStorage.setItem("ooma_client_projects_inr", JSON.stringify(sanitizedRemote));
        } catch (e) {
          console.error(e);
        }
      }
      if (remoteClients.length > 0) {
        setClients(remoteClients);
      }
      setSupabaseStatus("connected");
      return {
        success: true,
        message: `Connected to Supabase! Loaded ${remoteProjects.length} projects and ${remoteClients.length} clients from PostgreSQL.`,
      };
    } catch (err: any) {
      setSupabaseStatus("error");
      return { success: false, message: err.message || "Failed to sync from Supabase." };
    }
  };

  const uploadLocalToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    return await supabaseService.uploadLocalDataToSupabase(clients, projects);
  };

  // Immediate sanitization on mount to wipe any lingering sprint data
  useEffect(() => {
    setProjects((prev) => {
      let modified = false;
      const sanitized = prev.map((p) => {
        const clean = ensure6PhaseMilestones(p);
        const hasLegacySprint = (p.milestones || []).length !== 6 || (p.milestones || []).some((m) => m.title?.toLowerCase().includes("sprint"));
        if (hasLegacySprint) {
          modified = true;
          return { ...p, milestones: clean };
        }
        return p;
      });
      if (modified) {
        try {
          localStorage.setItem("ooma_client_projects_inr", JSON.stringify(sanitized));
        } catch (e) {
          console.error(e);
        }
        return sanitized;
      }
      return prev;
    });
  }, []);

  // Initial fetch and Realtime sync listener
  useEffect(() => {
    if (isSupabaseConfigured()) {
      syncSupabase();

      const client = getSupabaseClient();
      if (client) {
        // Handle OAuth Sign-in redirects (Google, Facebook)
        client.auth.getSession().then(({ data: { session } }) => {
          if (session?.user?.email) {
            loginClient(session.user.email);
          }
        });

        const { data: authListener } = client.auth.onAuthStateChange((event, session) => {
          if (session?.user?.email && (event === "SIGNED_IN" || event === "USER_UPDATED")) {
            loginClient(session.user.email);
          }
        });

        const handleRealtimeUpdate = async () => {
          try {
            const [projs, cls] = await Promise.all([
              supabaseService.fetchProjects(),
              supabaseService.fetchClients(),
            ]);
            if (projs.length > 0) {
              const sanitized = projs.map((p) => ({
                ...p,
                milestones: ensure6PhaseMilestones(p),
              }));
              setProjects(sanitized);
            }
            if (cls.length > 0) {
              setClients(cls);
            }
          } catch (err) {
            console.error("[Realtime] Sync error:", err);
          }
        };

        const channel = client
          .channel("realtime-portal-sync")
          .on("postgres_changes", { event: "*", schema: "public", table: "milestones" }, handleRealtimeUpdate)
          .on("postgres_changes", { event: "*", schema: "public", table: "invoices" }, handleRealtimeUpdate)
          .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, handleRealtimeUpdate)
          .on("postgres_changes", { event: "*", schema: "public", table: "live_urls" }, handleRealtimeUpdate)
          .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, handleRealtimeUpdate)
          .on("postgres_changes", { event: "*", schema: "public", table: "support_tickets" }, handleRealtimeUpdate)
          .on("postgres_changes", { event: "*", schema: "public", table: "ratings" }, handleRealtimeUpdate)
          .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, handleRealtimeUpdate)
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              setSupabaseStatus("connected");
            } else if (status === "CHANNEL_ERROR") {
              console.warn("[Realtime] Subscription channel error");
            }
          });

        return () => {
          client.removeChannel(channel);
          authListener?.subscription?.unsubscribe();
        };
      }
    } else {
      setSupabaseStatus("unconfigured");
    }
  }, []);

  const userProjects = projects.filter((p) => p.clientId === (clientUser?.id || "client-bharatlogistics"));
  const rawActiveProject =
    projects.find((p) => p.id === activeProjectId && p.clientId === clientUser?.id) ||
    userProjects[0] ||
    projects[0] ||
    INITIAL_PROJECTS[0];

  const activeProject: ClientProject = useMemo(() => {
    const cleanMilestones = ensure6PhaseMilestones(rawActiveProject);
    return {
      ...rawActiveProject,
      milestones: cleanMilestones,
    };
  }, [rawActiveProject]);

  const switchClient = (clientId: string) => {
    const found = clients.find((c) => c.id === clientId) || MOCK_CLIENTS.find((c) => c.id === clientId);
    if (found) {
      setClientUser(found);
      const firstProj = projects.find((p) => p.clientId === found.id);
      if (firstProj) setActiveProjectId(firstProj.id);
    }
  };

  const loginClient = (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = clients.find((c) => c.email.toLowerCase() === cleanEmail);
    if (found) {
      setClientUser(found);
      const userProj = projects.find((p) => p.clientId === found.id);
      if (userProj) setActiveProjectId(userProj.id);
      return true;
    }

    const companyPart = cleanEmail.split("@")[1]?.split(".")[0] || "Client";
    const customClient: ClientUser = {
      id: `client-custom-${Date.now()}`,
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      email: cleanEmail,
      company: `${companyPart.charAt(0).toUpperCase() + companyPart.slice(1)} India Pvt Ltd`,
      title: "Managing Director",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80",
      joinedDate: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      portalRole: "client_admin",
    };

    const newProject: ClientProject = {
      ...INITIAL_PROJECTS[0],
      id: `proj-${Date.now()}`,
      clientId: customClient.id,
      company: customClient.company,
      title: `${customClient.company} - Cloud Application Platform`,
    };

    setClients((prev) => [...prev, customClient]);
    setClientUser(customClient);
    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    return true;
  };

  const logoutClient = () => {
    setClientUser(null);
    const client = getSupabaseClient();
    if (client) {
      client.auth.signOut().catch(console.error);
    }
  };

  const selectProject = (id: string) => {
    setActiveProjectId(id);
  };

  const addComment = (message: string, attachments?: { name: string; url: string; size: string }[]) => {
    if (!clientUser) return;
    const newComment: ProjectComment = {
      id: `c-${Date.now()}`,
      authorName: clientUser.name,
      authorRole: "client",
      authorAvatar: clientUser.avatar,
      message,
      timestamp: "Just now",
      attachments,
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === activeProject.id) {
          return {
            ...proj,
            comments: [...proj.comments, newComment],
          };
        }
        return proj;
      })
    );

    if (isSupabaseConfigured()) {
      supabaseService.createComment(activeProject.id, newComment).catch(console.error);
    }
  };

  const submitRating = (data: {
    overallScore: number;
    categories: { engineeringQuality: number; communication: number; velocity: number; uiUxDesign: number };
    feedbackText: string;
    clientRecommendation: boolean;
  }) => {
    if (!clientUser) return;
    const newRating: ClientRating = {
      id: `rat-${Date.now()}`,
      overallScore: data.overallScore,
      categories: data.categories,
      feedbackText: data.feedbackText,
      authorName: clientUser.name,
      submittedAt: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      clientRecommendation: data.clientRecommendation,
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === activeProject.id) {
          return {
            ...proj,
            ratings: [newRating, ...proj.ratings],
          };
        }
        return proj;
      })
    );

    if (isSupabaseConfigured()) {
      supabaseService.createRating(activeProject.id, newRating).catch(console.error);
    }
  };

  const payInvoice = (invoiceId: string, appliedCouponCode?: string, discountAmountINR?: number) => {
    const now = new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === activeProject.id) {
          return {
            ...proj,
            payments: proj.payments.map((p) =>
              p.id === invoiceId
                ? {
                    ...p,
                    status: "paid",
                    paidDate: now,
                    appliedCouponCode: appliedCouponCode || undefined,
                    appliedDiscountINR: discountAmountINR || 0,
                    netPayableINR: Math.max(0, p.amount - (discountAmountINR || 0)),
                  }
                : p
            ),
          };
        }
        return proj;
      })
    );

    if (isSupabaseConfigured()) {
      supabaseService.updateInvoice(invoiceId, {
        status: "paid",
        paidDate: now,
        paymentMethod: "Online UPI / NetBanking",
      }).catch(console.error);
    }
  };

  const submitReferral = (data: {
    contactName: string;
    companyName: string;
    email: string;
    phone?: string;
    requirementBrief?: string;
  }) => {
    const newLead = {
      id: `ref-${Date.now()}`,
      contactName: data.contactName,
      companyName: data.companyName,
      email: data.email,
      phone: data.phone || "",
      requirementBrief: data.requirementBrief || "Custom software engineering requirement",
      status: "under_vetting" as const,
      advancePaidINR: 0,
      rewardAmount: 50000,
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === activeProject.id) {
          const currentRef = proj.referrals;
          return {
            ...proj,
            referrals: {
              ...currentRef,
              totalReferrals: (currentRef.totalReferrals || 0) + 1,
              history: [newLead, ...currentRef.history],
            },
          };
        }
        return proj;
      })
    );
  };

  const verifyReferralRequirement = (projectId: string, referralId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          const currentRef = proj.referrals;
          return {
            ...proj,
            referrals: {
              ...currentRef,
              history: currentRef.history.map((item) =>
                item.id === referralId
                  ? { ...item, status: "requirement_verified" as const }
                  : item
              ),
            },
          };
        }
        return proj;
      })
    );
  };

  const confirmReferralAdvancePaid = (projectId: string, referralId: string, advancePaidINR: number) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          const currentRef = proj.referrals;
          let wasAlreadyVerified = false;

          const updatedHistory = currentRef.history.map((item) => {
            if (item.id === referralId) {
              if (item.status === "verified_client" || item.status === "advance_paid") {
                wasAlreadyVerified = true;
              }
              return {
                ...item,
                status: "verified_client" as const,
                advancePaidINR: advancePaidINR || 100000,
              };
            }
            return item;
          });

          const currentCount = currentRef.verifiedClientsCount || 0;
          const newVerifiedCount = wasAlreadyVerified ? currentCount : currentCount + 1;
          const isNowUnlocked = newVerifiedCount >= (currentRef.requiredForUnlock || 4);

          return {
            ...proj,
            referrals: {
              ...currentRef,
              verifiedClientsCount: newVerifiedCount,
              isCouponUnlocked: isNowUnlocked,
              isCardUnlocked: isNowUnlocked,
              creditCardAmountINR: currentRef.creditCardAmountINR || 4000,
              cardholderName: currentRef.cardholderName || clientUser?.name || "VIP Partner",
              unlockedCouponCode: "OOMA-VERIFIED-4X",
              totalEarnings: (currentRef.totalEarnings || 0) + 50000,
              history: updatedHistory,
            },
          };
        }
        return proj;
      })
    );
  };

  const submitQuotationRequest = (data: {
    referralCode?: string;
    contactName: string;
    companyName: string;
    email: string;
    phone: string;
    projectCategory: string;
    requirementScope: string;
    budgetRange: string;
    timeline: string;
  }) => {
    const leadId = `ref-quo-${Date.now()}`;
    const newLead = {
      id: leadId,
      contactName: data.contactName,
      companyName: data.companyName,
      email: data.email,
      phone: data.phone,
      requirementBrief: `[${data.projectCategory}] ${data.requirementScope} (Timeline: ${data.timeline}, Budget: ${data.budgetRange})`,
      status: "under_vetting" as const,
      advancePaidINR: 0,
      rewardAmount: 50000,
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
    };

    setProjects((prev) =>
      prev.map((proj) => {
        const matchesRef =
          data.referralCode &&
          (proj.referrals.referralCode?.toLowerCase() === data.referralCode.toLowerCase() ||
            proj.id.toLowerCase() === data.referralCode.toLowerCase());

        if (matchesRef || (!data.referralCode && proj.id === activeProject.id)) {
          const currentRef = proj.referrals;
          return {
            ...proj,
            referrals: {
              ...currentRef,
              totalReferrals: (currentRef.totalReferrals || 0) + 1,
              history: [newLead, ...currentRef.history],
            },
          };
        }
        return proj;
      })
    );

    try {
      const existing = JSON.parse(localStorage.getItem("ooma_quotations_list") || "[]");
      existing.unshift({
        ...data,
        id: leadId,
        submittedAt: new Date().toISOString(),
        status: "pending_review",
      });
      localStorage.setItem("ooma_quotations_list", JSON.stringify(existing));
    } catch (e) {
      console.error(e);
    }

    return { success: true, leadId };
  };

  const createSupportTicket = (data: {
    title: string;
    description: string;
    category: SupportTicket["category"];
    priority: SupportTicket["priority"];
  }) => {
    if (!clientUser) return;
    const newTicket: SupportTicket = {
      id: `tick-${Date.now()}`,
      ticketNumber: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: "open",
      createdAt: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      updatedAt: "Just now",
      assignedEngineer: "Arjun Mehta (Lead Systems Architect)",
      updates: [
        {
          id: `up-${Date.now()}`,
          sender: clientUser.name,
          message: data.description,
          time: "Just now",
        },
      ],
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === activeProject.id) {
          return {
            ...proj,
            supportTickets: [newTicket, ...proj.supportTickets],
          };
        }
        return proj;
      })
    );

    if (isSupabaseConfigured()) {
      supabaseService.createSupportTicket(activeProject.id, newTicket).catch(console.error);
    }
  };

  const addTicketReply = (ticketId: string, message: string) => {
    if (!clientUser) return;
    const newUpdate = {
      id: `up-${Date.now()}`,
      sender: clientUser.name,
      message,
      time: "Just now",
    };

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === activeProject.id) {
          return {
            ...proj,
            supportTickets: proj.supportTickets.map((t) => {
              if (t.id === ticketId) {
                const updatedUpdates = [...t.updates, newUpdate];
                if (isSupabaseConfigured()) {
                  supabaseService.updateSupportTicket(ticketId, { updates: updatedUpdates }).catch(console.error);
                }
                return {
                  ...t,
                  updatedAt: "Just now",
                  updates: updatedUpdates,
                };
              }
              return t;
            }),
          };
        }
        return proj;
      })
    );
  };

  // ----------------------------------------------------
  // ADMIN ACTIONS: MILESTONES & STAGES MANAGEMENT
  // ----------------------------------------------------

  const updateMilestone = (projectId: string, milestoneId: string, updates: Partial<ProjectMilestone>) => {
    let newOverallProgress = 0;
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          const updatedMilestones = proj.milestones.map((m) =>
            m.id === milestoneId ? { ...m, ...updates } : m
          );

          // Auto-recalculate project overall progress
          const totalProgress = updatedMilestones.reduce((acc, curr) => acc + (curr.progress || 0), 0);
          const newOverall = updatedMilestones.length > 0 ? Math.round(totalProgress / updatedMilestones.length) : 0;
          newOverallProgress = newOverall;

          return {
            ...proj,
            milestones: updatedMilestones,
            overallProgress: newOverall,
            status: newOverall === 100 ? "live_deployed" : "in_development",
          };
        }
        return proj;
      })
    );

    if (isSupabaseConfigured()) {
      supabaseService.updateMilestone(milestoneId, updates).catch(console.error);
      supabaseService.updateProject(projectId, {
        overallProgress: newOverallProgress,
        status: newOverallProgress === 100 ? "live_deployed" : "in_development",
      }).catch(console.error);
    }
  };

  const advanceProjectStage = (projectId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          const milestones = proj.milestones || [];
          let currentActiveIdx = milestones.findIndex((m) => m.status === "in_progress");
          if (currentActiveIdx === -1) {
            const lastCompleted = milestones.map((m) => m.status).lastIndexOf("completed");
            currentActiveIdx = lastCompleted !== -1 ? lastCompleted : -1;
          }
          const nextIdx = currentActiveIdx + 1;
          if (nextIdx >= milestones.length) {
            const allDone = milestones.map((m) => ({
              ...m,
              status: "completed" as const,
              progress: 100,
              completedDate: m.completedDate || "Completed",
            }));

            if (isSupabaseConfigured()) {
              allDone.forEach((m) => {
                supabaseService.updateMilestone(m.id, {
                  status: m.status,
                  progress: m.progress,
                  completedDate: m.completedDate,
                }).catch(console.error);
              });
              supabaseService.updateProject(projectId, {
                overallProgress: 100,
                status: "live_deployed",
              }).catch(console.error);
            }

            return {
              ...proj,
              milestones: allDone,
              overallProgress: 100,
              status: "live_deployed",
            };
          }

          const updatedMilestones = milestones.map((m, idx) => {
            if (idx < nextIdx) {
              return {
                ...m,
                status: "completed" as const,
                progress: 100,
                completedDate: m.completedDate || "Completed",
              };
            } else if (idx === nextIdx) {
              return {
                ...m,
                status: "in_progress" as const,
                progress: 50,
              };
            } else {
              return {
                ...m,
                status: "pending" as const,
                progress: 0,
              };
            }
          });

          const totalProgress = updatedMilestones.reduce((acc, curr) => acc + (curr.progress || 0), 0);
          const newOverall = Math.round(totalProgress / updatedMilestones.length);

          if (isSupabaseConfigured()) {
            updatedMilestones.forEach((m) => {
              supabaseService.updateMilestone(m.id, {
                status: m.status,
                progress: m.progress,
                completedDate: m.completedDate,
              }).catch(console.error);
            });
            supabaseService.updateProject(projectId, {
              overallProgress: newOverall,
              status: newOverall === 100 ? "live_deployed" : "in_development",
            }).catch(console.error);
          }

          return {
            ...proj,
            milestones: updatedMilestones,
            overallProgress: newOverall,
            status: newOverall === 100 ? "live_deployed" : "in_development",
          };
        }
        return proj;
      })
    );
  };

  const setProjectStageIndex = (projectId: string, stageIndex: number) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          const milestones = proj.milestones || [];
          if (stageIndex < 0 || stageIndex >= milestones.length) return proj;

          const updatedMilestones = milestones.map((m, idx) => {
            if (idx < stageIndex) {
              return {
                ...m,
                status: "completed" as const,
                progress: 100,
                completedDate: m.completedDate || "Completed",
              };
            } else if (idx === stageIndex) {
              return {
                ...m,
                status: "in_progress" as const,
                progress: 50,
              };
            } else {
              return {
                ...m,
                status: "pending" as const,
                progress: 0,
              };
            }
          });

          const totalProgress = updatedMilestones.reduce((acc, curr) => acc + (curr.progress || 0), 0);
          const newOverall = Math.round(totalProgress / updatedMilestones.length);

          if (isSupabaseConfigured()) {
            updatedMilestones.forEach((m) => {
              supabaseService.updateMilestone(m.id, {
                status: m.status,
                progress: m.progress,
                completedDate: m.completedDate,
              }).catch(console.error);
            });
            supabaseService.updateProject(projectId, {
              overallProgress: newOverall,
              status: newOverall === 100 ? "live_deployed" : "in_development",
            }).catch(console.error);
          }

          return {
            ...proj,
            milestones: updatedMilestones,
            overallProgress: newOverall,
            status: newOverall === 100 ? "live_deployed" : "in_development",
          };
        }
        return proj;
      })
    );
  };

  const addMilestone = (projectId: string, milestone: Omit<ProjectMilestone, "id">) => {
    const newId = `m-${Date.now()}`;
    const fullMilestone: ProjectMilestone = { ...milestone, id: newId };
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          const updated = [...proj.milestones, fullMilestone];
          const totalProgress = updated.reduce((acc, curr) => acc + (curr.progress || 0), 0);
          const newOverall = Math.round(totalProgress / updated.length);

          if (isSupabaseConfigured()) {
            supabaseService.createMilestone(projectId, fullMilestone).catch(console.error);
            supabaseService.updateProject(projectId, { overallProgress: newOverall }).catch(console.error);
          }

          return {
            ...proj,
            milestones: updated,
            overallProgress: newOverall,
          };
        }
        return proj;
      })
    );
  };

  const deleteMilestone = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          const updated = proj.milestones.filter((m) => m.id !== milestoneId);
          const totalProgress = updated.reduce((acc, curr) => acc + (curr.progress || 0), 0);
          const newOverall = updated.length > 0 ? Math.round(totalProgress / updated.length) : 0;

          if (isSupabaseConfigured()) {
            supabaseService.deleteMilestone(milestoneId).catch(console.error);
            supabaseService.updateProject(projectId, { overallProgress: newOverall }).catch(console.error);
          }

          return {
            ...proj,
            milestones: updated,
            overallProgress: newOverall,
          };
        }
        return proj;
      })
    );
  };

  // ----------------------------------------------------
  // ADMIN ACTIONS: LIVE URLS MANAGEMENT
  // ----------------------------------------------------

  const updateLiveUrl = (projectId: string, urlId: string, updates: Partial<ProjectLiveUrl>) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            liveUrls: proj.liveUrls.map((u) => (u.id === urlId ? { ...u, ...updates } : u)),
          };
        }
        return proj;
      })
    );

    if (isSupabaseConfigured()) {
      supabaseService.updateLiveUrl(urlId, updates).catch(console.error);
    }
  };

  const addLiveUrl = (projectId: string, url: Omit<ProjectLiveUrl, "id">) => {
    const newId = `url-${Date.now()}`;
    const fullUrl: ProjectLiveUrl = { ...url, id: newId };
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            liveUrls: [...proj.liveUrls, fullUrl],
          };
        }
        return proj;
      })
    );

    if (isSupabaseConfigured()) {
      supabaseService.createLiveUrl(projectId, fullUrl).catch(console.error);
    }
  };

  const deleteLiveUrl = (projectId: string, urlId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            liveUrls: proj.liveUrls.filter((u) => u.id !== urlId),
          };
        }
        return proj;
      })
    );

    if (isSupabaseConfigured()) {
      supabaseService.deleteLiveUrl(urlId).catch(console.error);
    }
  };

  // ----------------------------------------------------
  // ADMIN ACTIONS: INVOICES & BILLING MANAGEMENT
  // ----------------------------------------------------

  const addInvoice = (projectId: string, invoice: Omit<ClientPayment, "id">) => {
    const newId = `inv-${Date.now()}`;
    const fullInvoice: ClientPayment = { ...invoice, id: newId };
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            payments: [...proj.payments, fullInvoice],
          };
        }
        return proj;
      })
    );

    if (isSupabaseConfigured()) {
      supabaseService.createInvoice(projectId, fullInvoice).catch(console.error);
    }
  };

  const updateInvoice = (projectId: string, invoiceId: string, updates: Partial<ClientPayment>) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            payments: proj.payments.map((p) => (p.id === invoiceId ? { ...p, ...updates } : p)),
          };
        }
        return proj;
      })
    );

    if (isSupabaseConfigured()) {
      supabaseService.updateInvoice(invoiceId, updates).catch(console.error);
    }
  };

  const deleteInvoice = (projectId: string, invoiceId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            payments: proj.payments.filter((p) => p.id !== invoiceId),
          };
        }
        return proj;
      })
    );

    if (isSupabaseConfigured()) {
      supabaseService.deleteInvoice(invoiceId).catch(console.error);
    }
  };

  // ----------------------------------------------------
  // ADMIN ACTIONS: NEW CLIENT & PROJECT CREATION
  // ----------------------------------------------------

  const createClientAndProject = (
    clientData: { name: string; email: string; company: string; phone?: string; title?: string },
    projectData: {
      title: string;
      summary: string;
      targetLaunchDate: string;
      techStack: string[];
      milestones: { title: string; description: string; dueDate: string }[];
      invoices: { milestoneTitle: string; amount: number; dueDate: string }[];
      liveUrls: { label: string; url: string; type: ProjectLiveUrl["type"] }[];
    }
  ): string => {
    const newClientId = `client-${Date.now()}`;
    const newProjectId = `proj-${Date.now()}`;

    const newClient: ClientUser = {
      id: newClientId,
      name: clientData.name,
      email: clientData.email,
      company: clientData.company,
      title: clientData.title || "Project Director",
      phone: clientData.phone || "+91 98000 00000",
      joinedDate: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }),
      portalRole: "client_admin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    };

    const newMilestones: ProjectMilestone[] = CANONICAL_6_PHASES.map((phase, idx) => {
      const custom = projectData.milestones?.[idx];
      return {
        id: `m-${newProjectId}-${idx + 1}`,
        title: phase.title,
        description: custom?.description || phase.description,
        status: idx === 0 ? "in_progress" : "pending",
        progress: idx === 0 ? 30 : 0,
        dueDate: custom?.dueDate || (idx === 5 ? projectData.targetLaunchDate : `Within ${(idx + 1) * 2} Weeks`),
        deliverables: phase.deliverables,
      };
    });

    const newInvoices: ClientPayment[] = projectData.invoices.map((inv, idx) => ({
      id: `inv-${Date.now()}-${idx}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      milestoneTitle: inv.milestoneTitle,
      amount: inv.amount,
      currency: "INR",
      issueDate: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      dueDate: inv.dueDate,
      status: "pending",
    }));

    const newUrls: ProjectLiveUrl[] = projectData.liveUrls.map((u, idx) => ({
      id: `url-${Date.now()}-${idx}`,
      label: u.label,
      url: u.url,
      type: u.type,
      status: "live",
      uptime: "99.98%",
      lastDeployed: "Initial setup",
    }));

    const initialOverall = newMilestones.length > 0 ? Math.round(newMilestones[0].progress / newMilestones.length) : 0;

    const newProject: ClientProject = {
      id: newProjectId,
      clientId: newClientId,
      company: clientData.company,
      title: projectData.title,
      summary: projectData.summary,
      tier: "Strategic Engineering",
      overallProgress: initialOverall,
      status: "in_development",
      startDate: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      targetLaunchDate: projectData.targetLaunchDate,
      techStack: projectData.techStack.length > 0 ? projectData.techStack : ["React", "Node.js", "PostgreSQL"],
      dedicatedLead: {
        name: "Arjun Mehta",
        role: "Lead Systems Architect (OOMA Labs Hyderabad)",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        email: "arjun@oomalabs.com",
        status: "Assigned Lead",
      },
      milestones: newMilestones,
      liveUrls: newUrls,
      ratings: [],
      comments: [
        {
          id: `c-${Date.now()}`,
          authorName: "Arjun Mehta",
          authorRole: "lead_architect",
          authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
          message: `Namaste ${clientData.name}! Welcome to your dedicated OOMA LABS Client Portal for ${projectData.title}. We have initialized your 6-phase engineering lifecycle and project timeline below.`,
          timestamp: "Just now",
          isPinned: true,
        },
      ],
      payments: newInvoices,
      supportTickets: [],
      referrals: {
        referralCode: `OOMA-${clientData.name.split(" ")[0].toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        shareableUrl: `https://oomalabs.com/refer?client=${newClientId}`,
        totalReferrals: 0,
        verifiedClientsCount: 0,
        requiredForUnlock: 4,
        isCouponUnlocked: false,
        unlockedCouponCode: "OOMA-VERIFIED-4X",
        discountPercentage: 20,
        totalEarnings: 0,
        pendingPayout: 0,
        history: [],
      },
    };

    setClients((prev) => [...prev, newClient]);
    setProjects((prev) => [newProject, ...prev]);
    setClientUser(newClient);
    setActiveProjectId(newProjectId);

    if (isSupabaseConfigured()) {
      supabaseService.createClientAndProject(newClient, newProject).catch(console.error);
    }

    return newProjectId;
  };

  const deleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    const remaining = projects.filter((p) => p.id !== projectId);
    if (remaining.length > 0) {
      setActiveProjectId(remaining[0].id);
    }
    if (isSupabaseConfigured()) {
      supabaseService.deleteProject(projectId).catch(console.error);
    }
  };

  // ----------------------------------------------------
  // SPREADSHEETS (GOOGLE SHEETS & EXCEL CSV EXPORT / IMPORT)
  // ----------------------------------------------------

  const getSpreadsheetRows = (): SpreadsheetRow[] => {
    const rows: SpreadsheetRow[] = [];
    projects.forEach((proj) => {
      const client = clients.find((c) => c.id === proj.clientId);
      const totalBudget = proj.payments.reduce((a, b) => a + b.amount, 0);
      const paid = proj.payments.filter((p) => p.status === "paid").reduce((a, b) => a + b.amount, 0);
      const pending = proj.payments.filter((p) => p.status !== "paid").reduce((a, b) => a + b.amount, 0);
      const primaryUrl = proj.liveUrls.find((u) => u.type === "production")?.url || proj.liveUrls[0]?.url || "";
      const stagingUrl = proj.liveUrls.find((u) => u.type === "staging")?.url || "";

      if (proj.milestones.length === 0) {
        rows.push({
          projectId: proj.id,
          projectTitle: proj.title,
          company: proj.company,
          clientName: client?.name || "",
          clientEmail: client?.email || "",
          stageName: "Initial Setup",
          stageStatus: "in_progress",
          stageProgress: proj.overallProgress,
          stageDueDate: proj.targetLaunchDate,
          overallProgress: proj.overallProgress,
          primaryUrl,
          totalBudgetINR: totalBudget,
          paidINR: paid,
          pendingINR: pending,
        });
      } else {
        proj.milestones.forEach((m) => {
          rows.push({
            projectId: proj.id,
            projectTitle: proj.title,
            company: proj.company,
            clientName: client?.name || "",
            clientEmail: client?.email || "",
            stageName: m.title,
            stageStatus: m.status,
            stageProgress: m.progress,
            stageDueDate: m.dueDate,
            overallProgress: proj.overallProgress,
            primaryUrl,
            totalBudgetINR: totalBudget,
            paidINR: paid,
            pendingINR: pending,
          });
        });
      }
    });
    return rows;
  };

  const saveSpreadsheetRow = (updatedRow: SpreadsheetRow) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === updatedRow.projectId) {
          let matchedMilestone: ProjectMilestone | undefined;
          const updatedMilestones = proj.milestones.map((m) => {
            if (m.title.toLowerCase() === updatedRow.stageName.toLowerCase()) {
              matchedMilestone = {
                ...m,
                status: updatedRow.stageStatus,
                progress: Number(updatedRow.stageProgress) || 0,
                dueDate: updatedRow.stageDueDate,
              };
              return matchedMilestone;
            }
            return m;
          });

          const totalProg = updatedMilestones.reduce((acc, curr) => acc + (curr.progress || 0), 0);
          const newOverall = updatedMilestones.length > 0 ? Math.round(totalProg / updatedMilestones.length) : proj.overallProgress;

          if (isSupabaseConfigured()) {
            if (matchedMilestone) {
              supabaseService.updateMilestone(matchedMilestone.id, {
                status: matchedMilestone.status,
                progress: matchedMilestone.progress,
                dueDate: matchedMilestone.dueDate,
              }).catch(console.error);
            }
            supabaseService.updateProject(proj.id, {
              overallProgress: newOverall,
              title: updatedRow.projectTitle || proj.title,
            }).catch(console.error);
          }

          return {
            ...proj,
            title: updatedRow.projectTitle || proj.title,
            company: updatedRow.company || proj.company,
            milestones: updatedMilestones,
            overallProgress: newOverall,
          };
        }
        return proj;
      })
    );
  };

  const exportToSpreadsheetCSV = () => {
    const rows = getSpreadsheetRows();
    const headers = [
      "Project ID",
      "Project Title",
      "Client Company",
      "Client Name",
      "Client Email",
      "Stage / Milestone Name",
      "Stage Status",
      "Stage Progress %",
      "Stage Due Date",
      "Overall Project %",
      "Live Production URL",
      "Total SOW Budget (INR)",
      "Paid (INR)",
      "Pending (INR)",
    ];

    const csvLines = [headers.join(",")];

    rows.forEach((r) => {
      const line = [
        `"${r.projectId}"`,
        `"${r.projectTitle.replace(/"/g, '""')}"`,
        `"${r.company.replace(/"/g, '""')}"`,
        `"${r.clientName.replace(/"/g, '""')}"`,
        `"${r.clientEmail}"`,
        `"${r.stageName.replace(/"/g, '""')}"`,
        `"${r.stageStatus}"`,
        r.stageProgress,
        `"${r.stageDueDate}"`,
        r.overallProgress,
        `"${r.primaryUrl}"`,
        r.totalBudgetINR,
        r.paidINR,
        r.pendingINR,
      ];
      csvLines.push(line.join(","));
    });

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvLines.join("\n"));
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `ooma_client_projects_spreadsheet_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importFromSpreadsheetCSV = (csvString: string): { success: boolean; message: string; rowsCount?: number } => {
    try {
      const lines = csvString.trim().split("\n");
      if (lines.length < 2) {
        return { success: false, message: "CSV does not contain sufficient rows." };
      }

      let updatedCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        // basic CSV parser taking into account quotes
        const match = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        const parts = line.split(",").map((s) => s.replace(/^"|"$/g, "").trim());

        if (parts.length >= 8) {
          const [projId, projTitle, comp, cName, cEmail, stName, stStatus, stProg, stDue] = parts;

          if (projId && stName) {
            setProjects((prev) =>
              prev.map((proj) => {
                if (proj.id === projId || proj.title.toLowerCase() === projTitle?.toLowerCase()) {
                  const updatedMilestones = proj.milestones.map((m) => {
                    if (m.title.toLowerCase().includes(stName.toLowerCase())) {
                      return {
                        ...m,
                        status: (stStatus === "completed" || stStatus === "in_progress" || stStatus === "pending"
                          ? stStatus
                          : m.status) as any,
                        progress: Number(stProg) >= 0 ? Number(stProg) : m.progress,
                        dueDate: stDue || m.dueDate,
                      };
                    }
                    return m;
                  });

                  const totalProg = updatedMilestones.reduce((acc, curr) => acc + (curr.progress || 0), 0);
                  const newOverall = updatedMilestones.length > 0 ? Math.round(totalProg / updatedMilestones.length) : proj.overallProgress;

                  updatedCount++;
                  return {
                    ...proj,
                    milestones: updatedMilestones,
                    overallProgress: newOverall,
                  };
                }
                return proj;
              })
            );
          }
        }
      }

      return { success: true, message: `Successfully updated ${updatedCount} milestone stage records from CSV!`, rowsCount: updatedCount };
    } catch (e: any) {
      return { success: false, message: e.message || "Failed to parse CSV spreadsheet." };
    }
  };

  return (
    <ClientPortalContext.Provider
      value={{
        clientUser,
        projects,
        activeProject,
        availableClients: clients,
        selectProject,
        switchClient,
        loginClient,
        logoutClient,
        addComment,
        submitRating,
        payInvoice,
        submitReferral,
        verifyReferralRequirement,
        confirmReferralAdvancePaid,
        submitQuotationRequest,
        createSupportTicket,
        addTicketReply,

        // Admin & Spreadsheet operations
        updateMilestone,
        advanceProjectStage,
        setProjectStageIndex,
        addMilestone,
        deleteMilestone,
        updateLiveUrl,
        addLiveUrl,
        deleteLiveUrl,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        createClientAndProject,
        deleteProject,
        exportToSpreadsheetCSV,
        importFromSpreadsheetCSV,
        getSpreadsheetRows,
        saveSpreadsheetRow,

        // Supabase Cloud State & Methods
        supabaseStatus,
        syncSupabase,
        uploadLocalToSupabase,
      }}
    >
      {children}
    </ClientPortalContext.Provider>
  );
};

export const useClientPortal = () => {
  const context = useContext(ClientPortalContext);
  if (!context) {
    throw new Error("useClientPortal must be used within a ClientPortalProvider");
  }
  return context;
};

