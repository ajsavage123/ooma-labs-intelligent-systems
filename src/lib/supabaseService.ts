import { getSupabaseClient, isSupabaseConfigured } from "./supabase";
import {
  ClientUser,
  ClientProject,
  ProjectMilestone,
  ProjectLiveUrl,
  ClientPayment,
  ProjectComment,
  ClientRating,
  SupportTicket,
} from "../types";

export const supabaseService = {
  /**
   * Fetch all clients (profiles) from Supabase
   */
  async fetchClients(): Promise<ClientUser[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("[Supabase] Error fetching profiles:", error.message);
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        company: row.company,
        title: row.title || "Client Partner",
        phone: row.phone || "+91 98000 00000",
        avatar: row.avatar_url || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80",
        joinedDate: row.created_at ? new Date(row.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Recently",
        portalRole: "client_admin",
      }));
    } catch (err) {
      console.error("[Supabase] fetchClients failed:", err);
      return [];
    }
  },

  /**
   * Fetch all projects with their milestones, invoices, live URLs, comments, ratings, and tickets
   */
  async fetchProjects(): Promise<ClientProject[]> {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    try {
      const { data: projectsData, error: projErr } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (projErr || !projectsData) {
        console.warn("[Supabase] Error fetching projects:", projErr?.message);
        return [];
      }

      // Fetch related records in parallel
      const [milestonesRes, urlsRes, invoicesRes, commentsRes, ratingsRes, ticketsRes] = await Promise.all([
        supabase.from("milestones").select("*").order("sort_order", { ascending: true }),
        supabase.from("live_urls").select("*"),
        supabase.from("invoices").select("*").order("created_at", { ascending: false }),
        supabase.from("comments").select("*").order("created_at", { ascending: true }),
        supabase.from("ratings").select("*"),
        supabase.from("support_tickets").select("*").order("created_at", { ascending: false }),
      ]);

      const allMilestones = milestonesRes.data || [];
      const allUrls = urlsRes.data || [];
      const allInvoices = invoicesRes.data || [];
      const allComments = commentsRes.data || [];
      const allRatings = ratingsRes.data || [];
      const allTickets = ticketsRes.data || [];

      return projectsData.map((p): ClientProject => {
        let milestones: ProjectMilestone[] = allMilestones
          .filter((m) => m.project_id === p.id)
          .map((m) => ({
            id: m.id,
            title: m.title,
            description: m.description || "",
            status: m.status,
            progress: Number(m.progress) || 0,
            dueDate: m.due_date,
            completedDate: m.completed_date || undefined,
            deliverables: m.deliverables || [],
          }));

        if (milestones.length !== 6 || milestones.some((m) => m.title?.toLowerCase().includes("sprint"))) {
          const overall = Number(p.overall_progress) || 0;
          const PHASE_TEMPLATES = [
            {
              title: "Phase 1: Client Discovery",
              description: "Collect and audit all details related to client assets, brand assets, credentials, domains, and cloud infrastructure.",
              deliverables: ["Client Asset & Brand Ingestion", "API Credentials & Cloud Access Setup", "Architecture Discovery Scope"],
            },
            {
              title: "Phase 2: Objective Requirements Gathering",
              description: "Formal Scope of Work (SOW), functional specifications, user story journeys, and database ER schema architecture sign-off.",
              deliverables: ["Formal SOW & Functional Specifications", "Database Entity-Relationship (ER) Schema", "User Journey & Acceptance Criteria Mapping"],
            },
            {
              title: "Phase 3: UI/UX Development",
              description: "High-fidelity Figma wireframes, interactive design tokens, and client design review sign-off.",
              deliverables: ["High-Fidelity Figma Prototypes", "Component Design System Tokens", "Client UI/UX Review & Sign-Off"],
            },
            {
              title: "Phase 4: Development",
              description: "Fullstack engineering implementation, backend APIs, database migrations, third-party integrations, and frontend state architecture.",
              deliverables: ["Fullstack Core Architecture & APIs", "Third-Party Integrations & Webhooks", "Production Responsive UI"],
            },
            {
              title: "Phase 5: Testing",
              description: "Rigorous quality assurance, cross-device testing, security vulnerability penetration audits, and client UAT sign-off.",
              deliverables: ["Cross-Device & Cross-Browser QA", "Security Vulnerability & Penetration Audit", "Client User Acceptance Testing (UAT) Sign-Off"],
            },
            {
              title: "Phase 6: Hosting",
              description: "Production cloud launch (AWS/GCP), custom domain DNS and SSL certificate binding, 24/7 monitoring handover.",
              deliverables: ["Production Multi-AZ Cloud Deployment", "Domain DNS & SSL Certificate Binding", "24/7 Monitoring & Operational Handover"],
            },
          ];

          milestones = PHASE_TEMPLATES.map((tmpl, idx) => {
            const isCompleted = overall >= (idx + 1) * 16.6;
            const isInProgress = !isCompleted && (overall >= idx * 16.6 || idx === 0);
            return {
              id: `m-${p.id}-${idx + 1}`,
              title: tmpl.title,
              description: tmpl.description,
              status: isCompleted ? "completed" : isInProgress ? "in_progress" : "pending",
              progress: isCompleted ? 100 : isInProgress ? 40 : 0,
              dueDate: idx === 5 ? (p.target_launch_date || "Launch Handover") : `Target: Week ${(idx + 1) * 2}`,
              completedDate: isCompleted ? (p.start_date || "Completed") : undefined,
              deliverables: tmpl.deliverables,
            };
          });
        }

        const liveUrls: ProjectLiveUrl[] = allUrls
          .filter((u) => u.project_id === p.id)
          .map((u) => ({
            id: u.id,
            label: u.label,
            url: u.url,
            type: u.type,
            status: u.status,
            uptime: u.uptime || "99.9%",
            lastDeployed: u.last_deployed || "Recently",
            notes: u.notes || undefined,
          }));

        const payments: ClientPayment[] = allInvoices
          .filter((inv) => inv.project_id === p.id)
          .map((inv) => ({
            id: inv.id,
            invoiceNumber: inv.invoice_number,
            milestoneTitle: inv.milestone_title,
            amount: Number(inv.amount),
            currency: "INR",
            gstSacCode: inv.gst_sac || "998314",
            issueDate: inv.issue_date,
            dueDate: inv.due_date,
            paidDate: inv.paid_date || undefined,
            status: inv.status,
            paymentMethod: inv.payment_method || undefined,
          }));

        const comments: ProjectComment[] = allComments
          .filter((c) => c.project_id === p.id)
          .map((c) => ({
            id: c.id,
            authorName: c.author_name,
            authorRole: c.author_role || "client",
            authorAvatar: c.author_avatar,
            message: c.message,
            timestamp: c.created_at ? new Date(c.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST" : "Just now",
            isPinned: Boolean(c.is_pinned),
            attachments: c.attachments || [],
          }));

        const ratings: ClientRating[] = allRatings
          .filter((r) => r.project_id === p.id)
          .map((r) => ({
            id: r.id,
            overallScore: r.overall_score,
            categories: {
              engineeringQuality: r.engineering_quality,
              communication: r.communication,
              velocity: r.velocity,
              uiUxDesign: r.ui_ux_design,
            },
            feedbackText: r.feedback_text,
            authorName: r.author_name,
            submittedAt: r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Recently",
            clientRecommendation: Boolean(r.client_recommendation),
          }));

        const supportTickets: SupportTicket[] = allTickets
          .filter((t) => t.project_id === p.id)
          .map((t) => ({
            id: t.id,
            ticketNumber: t.ticket_number,
            title: t.title,
            description: t.description,
            category: t.category,
            priority: t.priority,
            status: t.status,
            assignedEngineer: t.assigned_engineer || "Arjun Mehta (Lead Systems Architect)",
            createdAt: t.created_at ? new Date(t.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Recently",
            updatedAt: "Recently",
            updates: t.updates || [],
          }));

        return {
          id: p.id,
          title: p.title,
          clientId: p.client_id,
          company: p.company,
          summary: p.summary || "",
          tier: p.tier || "Strategic Engineering",
          overallProgress: Number(p.overall_progress) || 0,
          status: p.status,
          startDate: p.start_date,
          targetLaunchDate: p.target_launch_date,
          techStack: p.tech_stack || [],
          dedicatedLead: {
            name: p.lead_name || "Arjun Mehta",
            role: p.lead_role || "Lead Systems Architect (OOMA Labs Hyderabad)",
            avatar: p.lead_avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
            email: p.lead_email || "arjun@oomalabs.com",
            status: "Available at Hyderabad Tech Center",
          },
          milestones,
          liveUrls,
          ratings,
          comments,
          payments,
          supportTickets,
          referrals: {
            referralCode: "OOMA-" + p.company.slice(0, 4).toUpperCase(),
            shareableUrl: `https://oomalabs.com/refer?client=${p.client_id}`,
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
      });
    } catch (err) {
      console.error("[Supabase] fetchProjects error:", err);
      return [];
    }
  },

  /**
   * Insert new Client & Project into Supabase
   */
  async createClientAndProject(client: ClientUser, project: ClientProject): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      // 1. Profile
      await supabase.from("profiles").upsert({
        id: client.id,
        name: client.name,
        email: client.email,
        company: client.company,
        title: client.title,
        phone: client.phone,
        avatar_url: client.avatar,
        role: "client",
      });

      // 2. Project
      await supabase.from("projects").upsert({
        id: project.id,
        client_id: client.id,
        title: project.title,
        company: project.company,
        summary: project.summary,
        tier: project.tier,
        overall_progress: project.overallProgress,
        status: project.status,
        start_date: project.startDate,
        target_launch_date: project.targetLaunchDate,
        tech_stack: project.techStack,
      });

      // 3. Milestones
      if (project.milestones.length > 0) {
        await supabase.from("milestones").upsert(
          project.milestones.map((m, idx) => ({
            id: m.id,
            project_id: project.id,
            title: m.title,
            description: m.description,
            status: m.status,
            progress: m.progress,
            due_date: m.dueDate,
            completed_date: m.completedDate,
            deliverables: m.deliverables,
            sort_order: idx + 1,
          }))
        );
      }

      // 4. Invoices
      if (project.payments.length > 0) {
        await supabase.from("invoices").upsert(
          project.payments.map((p) => ({
            id: p.id,
            project_id: project.id,
            invoice_number: p.invoiceNumber,
            milestone_title: p.milestoneTitle,
            amount: p.amount,
            currency: "INR",
            issue_date: p.issueDate,
            due_date: p.dueDate,
            paid_date: p.paidDate,
            status: p.status,
          }))
        );
      }

      // 5. Live URLs
      if (project.liveUrls.length > 0) {
        await supabase.from("live_urls").upsert(
          project.liveUrls.map((u) => ({
            id: u.id,
            project_id: project.id,
            label: u.label,
            url: u.url,
            type: u.type,
            status: u.status,
            uptime: u.uptime,
            last_deployed: u.lastDeployed,
            notes: u.notes,
          }))
        );
      }

      return true;
    } catch (err) {
      console.error("[Supabase] createClientAndProject failed:", err);
      return false;
    }
  },

  /**
   * Update Milestone in Supabase
   */
  async updateMilestone(milestoneId: string, updates: Partial<ProjectMilestone>): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const payload: any = {};
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.progress !== undefined) payload.progress = updates.progress;
      if (updates.dueDate !== undefined) payload.due_date = updates.dueDate;
      if (updates.completedDate !== undefined) payload.completed_date = updates.completedDate;
      if (updates.deliverables !== undefined) payload.deliverables = updates.deliverables;

      const { error } = await supabase.from("milestones").update(payload).eq("id", milestoneId);
      return !error;
    } catch (e) {
      console.error("[Supabase] updateMilestone error:", e);
      return false;
    }
  },

  /**
   * Update Invoice in Supabase
   */
  async updateInvoice(invoiceId: string, updates: Partial<ClientPayment>): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const payload: any = {};
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.paidDate !== undefined) payload.paid_date = updates.paidDate;
      if (updates.amount !== undefined) payload.amount = updates.amount;
      if (updates.dueDate !== undefined) payload.due_date = updates.dueDate;
      if (updates.paymentMethod !== undefined) payload.payment_method = updates.paymentMethod;

      const { error } = await supabase.from("invoices").update(payload).eq("id", invoiceId);
      return !error;
    } catch (e) {
      console.error("[Supabase] updateInvoice error:", e);
      return false;
    }
  },

  /**
   * Upload all local memory/localStorage clients and projects to Supabase (1-Click migration)
   */
  async uploadLocalDataToSupabase(clients: ClientUser[], projects: ClientProject[]): Promise<{ success: boolean; message: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, message: "Supabase client not configured." };
    }

    try {
      let migratedCount = 0;
      for (const client of clients) {
        const clientProjects = projects.filter((p) => p.clientId === client.id);
        for (const proj of clientProjects) {
          await this.createClientAndProject(client, proj);
          migratedCount++;
        }
      }

      return {
        success: true,
        message: `Successfully synchronized ${clients.length} clients and ${migratedCount} projects to Supabase PostgreSQL!`,
      };
    } catch (err: any) {
      return { success: false, message: err.message || "Failed to upload to Supabase." };
    }
  },
};
