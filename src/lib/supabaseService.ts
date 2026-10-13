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
  ClientReferralData,
} from "../types";

// Canonical 6 stages baseline
const CANONICAL_6_STAGES = [
  {
    stage: 1,
    title: "1. Client Discovery",
    description: "Intake and audit of client assets, existing brand design tokens, AWS/GCP cloud environments, and external telematics vendor API credentials.",
    deliverables: ["Client Asset & Brand Guideline Ingestion", "NIC E-Way Bill & NETC FASTag API Keys Verification", "Cloud Infrastructure Scoping & Access Setup"],
  },
  {
    stage: 2,
    title: "2. Objective Requirements Gathering",
    description: "Formal Scope of Work (SOW), multi-depot operational workflows, functional specifications, and PostgreSQL database ER schemas.",
    deliverables: ["Formal SOW & Functional Requirement Document", "PostgreSQL Schema & Depot Partitioning Model", "Dispatcher & Driver User Story Mapping"],
  },
  {
    stage: 3,
    title: "3. UI/UX Development",
    description: "High-contrast driver screens optimized for direct sunlight, transport dispatcher operations console, and interactive Figma design sign-off.",
    deliverables: ["Figma Design System & High-Contrast Mobile Tokens", "Dispatcher Fleet Map & Toll Ledger Wireframes", "Client Design Review & Final Sign-Off"],
  },
  {
    stage: 4,
    title: "4. Development",
    description: "Fullstack engineering: Live GPS map telemetry, NPCI FASTag webhook integration, driver web application, and GST tax invoicing engine.",
    deliverables: ["Live GPS Telematics & FASTag Toll Ledger APIs", "Driver Trip Manifest & E-Way Bill QR Scanner UI", "GST Compliant Invoicing Engine (HSN/SAC 9965)"],
  },
  {
    stage: 5,
    title: "5. Testing",
    description: "End-to-end integration testing across 4 regional transport hubs, security vulnerability assessment, and client User Acceptance Testing (UAT).",
    deliverables: ["Cross-Browser & Low-Connectivity Mobile QA", "OWASP Top 10 Security Penetration Audit", "Client User Acceptance Testing (UAT) Sign-Off"],
  },
  {
    stage: 6,
    title: "6. Hosting",
    description: "Production cloud launch on AWS Mumbai, domain SSL/TLS certificate binding, 99.98% uptime monitoring, and final handover.",
    deliverables: ["Production AWS Mumbai Multi-AZ Launch", "DNS & SSL Certificate Binding", "24/7 Sentry & CloudWatch Monitoring Handover"],
  },
];

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

      // Retrieve cached local referrals to preserve partner rewards & unlock states
      let cachedLocalProjects: ClientProject[] = [];
      try {
        const raw = localStorage.getItem("ooma_client_projects_inr");
        if (raw) cachedLocalProjects = JSON.parse(raw);
      } catch (e) {
        // ignore
      }

      return projectsData.map((p): ClientProject => {
        let milestones: ProjectMilestone[] = allMilestones
          .filter((m) => m.project_id === p.id)
          .map((m) => ({
            id: m.id,
            title: m.title,
            description: m.description || "",
            notes: m.description || "",
            status: m.status,
            progress: Number(m.progress) || 0,
            dueDate: m.due_date,
            completedDate: m.completed_date || undefined,
            deliverables: m.deliverables || [],
          }));

        // If no milestones found or legacy sprint titles linger, map to canonical 6 stages
        if (milestones.length === 0 || milestones.some((m) => m.title?.toLowerCase().includes("sprint"))) {
          const overall = Number(p.overall_progress) || 0;
          milestones = CANONICAL_6_STAGES.map((tmpl, idx) => {
            const existing = milestones[idx];
            const isCompleted = overall >= (idx + 1) * 16.6 || existing?.status === "completed";
            const isInProgress = !isCompleted && (overall >= idx * 16.6 || existing?.status === "in_progress" || idx === 0);
            return {
              id: existing?.id?.startsWith("m-") ? existing.id : `m-${p.id}-${idx + 1}`,
              title: tmpl.title,
              description: existing?.description || tmpl.description,
              notes: existing?.notes || existing?.description || tmpl.description,
              status: isCompleted ? "completed" : isInProgress ? "in_progress" : "pending",
              progress: isCompleted ? 100 : isInProgress ? (existing?.progress || (idx === 0 ? 30 : 15)) : 0,
              dueDate: existing?.dueDate || (idx === 5 ? (p.target_launch_date || "Launch Handover") : `Target: Week ${(idx + 1) * 2}`),
              completedDate: isCompleted ? (existing?.completedDate || p.start_date || "Completed") : undefined,
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

        // Preserve partner reward state from cache or baseline
        const cachedProj = cachedLocalProjects.find((lp) => lp.id === p.id);
        const referrals: ClientReferralData = cachedProj?.referrals || {
          referralCode: p.id === "proj-bharatlogistics-01" ? "OOMA-RAJESH-BLR" : "OOMA-" + p.company.slice(0, 4).toUpperCase(),
          shareableUrl: `https://oomalabs.com/free-quotation?ref=${p.id === "proj-bharatlogistics-01" ? "OOMA-RAJESH-BLR" : "OOMA-" + p.company.slice(0, 4).toUpperCase()}`,
          totalReferrals: p.id === "proj-bharatlogistics-01" ? 4 : 0,
          verifiedClientsCount: p.id === "proj-bharatlogistics-01" ? 2 : 0,
          requiredForUnlock: 4,
          isCouponUnlocked: false,
          isCardUnlocked: false,
          creditCardAmountINR: 4000,
          cardholderName: p.lead_name || "Client Partner",
          unlockedCouponCode: "OOMA-VERIFIED-4X",
          discountPercentage: 20,
          totalEarnings: p.id === "proj-bharatlogistics-01" ? 150000 : 0,
          pendingPayout: p.id === "proj-bharatlogistics-01" ? 50000 : 0,
          history: [],
        };

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
          referrals,
        };
      });
    } catch (err) {
      console.error("[Supabase] fetchProjects error:", err);
      return [];
    }
  },

  /**
   * Update Project in Supabase
   */
  async updateProject(projectId: string, updates: Partial<ClientProject>): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const payload: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.overallProgress !== undefined) payload.overall_progress = updates.overallProgress;
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.summary !== undefined) payload.summary = updates.summary;
      if (updates.targetLaunchDate !== undefined) payload.target_launch_date = updates.targetLaunchDate;
      if (updates.techStack !== undefined) payload.tech_stack = updates.techStack;

      const { error } = await supabase.from("projects").update(payload).eq("id", projectId);
      if (error) {
        console.warn("[Supabase] updateProject error:", error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error("[Supabase] updateProject failed:", err);
      return false;
    }
  },

  /**
   * Delete Project in Supabase
   */
  async deleteProject(projectId: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from("projects").delete().eq("id", projectId);
      return !error;
    } catch (err) {
      console.error("[Supabase] deleteProject error:", err);
      return false;
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
            description: m.notes || m.description,
            status: m.status,
            progress: m.progress,
            due_date: m.dueDate,
            completed_date: m.completedDate || null,
            deliverables: m.deliverables || [],
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
            paid_date: p.paidDate || null,
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
   * Create Milestone in Supabase
   */
  async createMilestone(projectId: string, milestone: ProjectMilestone | Omit<ProjectMilestone, "id">): Promise<string | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const id = "id" in milestone && milestone.id ? milestone.id : `m-${Date.now()}`;
      const { error } = await supabase.from("milestones").insert({
        id,
        project_id: projectId,
        title: milestone.title,
        description: milestone.notes || milestone.description || "",
        status: milestone.status || "pending",
        progress: milestone.progress || 0,
        due_date: milestone.dueDate,
        completed_date: milestone.completedDate || null,
        deliverables: milestone.deliverables || [],
      });
      if (error) {
        console.warn("[Supabase] createMilestone error:", error.message);
        return null;
      }
      return id;
    } catch (err) {
      console.error("[Supabase] createMilestone failed:", err);
      return null;
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
      if (updates.notes !== undefined || updates.description !== undefined) {
        payload.description = updates.notes || updates.description;
      }
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.progress !== undefined) payload.progress = updates.progress;
      if (updates.dueDate !== undefined) payload.due_date = updates.dueDate;
      if (updates.completedDate !== undefined) payload.completed_date = updates.completedDate;
      if (updates.deliverables !== undefined) payload.deliverables = updates.deliverables;

      const { error } = await supabase.from("milestones").update(payload).eq("id", milestoneId);
      if (error) {
        console.warn("[Supabase] updateMilestone error:", error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error("[Supabase] updateMilestone error:", e);
      return false;
    }
  },

  /**
   * Delete Milestone in Supabase
   */
  async deleteMilestone(milestoneId: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from("milestones").delete().eq("id", milestoneId);
      return !error;
    } catch (e) {
      console.error("[Supabase] deleteMilestone error:", e);
      return false;
    }
  },

  /**
   * Create Invoice in Supabase
   */
  async createInvoice(projectId: string, invoice: ClientPayment | Omit<ClientPayment, "id">): Promise<string | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const id = "id" in invoice && invoice.id ? invoice.id : `inv-${Date.now()}`;
      const { error } = await supabase.from("invoices").insert({
        id,
        project_id: projectId,
        invoice_number: invoice.invoiceNumber,
        milestone_title: invoice.milestoneTitle,
        amount: invoice.amount,
        currency: invoice.currency || "INR",
        gst_sac: invoice.gstSacCode || "998314",
        issue_date: invoice.issueDate,
        due_date: invoice.dueDate,
        paid_date: invoice.paidDate || null,
        status: invoice.status || "pending",
        payment_method: invoice.paymentMethod || null,
      });
      if (error) {
        console.warn("[Supabase] createInvoice error:", error.message);
        return null;
      }
      return id;
    } catch (err) {
      console.error("[Supabase] createInvoice failed:", err);
      return null;
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
      if (error) {
        console.warn("[Supabase] updateInvoice error:", error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.error("[Supabase] updateInvoice error:", e);
      return false;
    }
  },

  /**
   * Delete Invoice in Supabase
   */
  async deleteInvoice(invoiceId: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from("invoices").delete().eq("id", invoiceId);
      return !error;
    } catch (e) {
      console.error("[Supabase] deleteInvoice error:", e);
      return false;
    }
  },

  /**
   * Create Live URL in Supabase
   */
  async createLiveUrl(projectId: string, url: ProjectLiveUrl | Omit<ProjectLiveUrl, "id">): Promise<string | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      const id = "id" in url && url.id ? url.id : `url-${Date.now()}`;
      const { error } = await supabase.from("live_urls").insert({
        id,
        project_id: projectId,
        label: url.label,
        url: url.url,
        type: url.type,
        status: url.status || "live",
        uptime: url.uptime || "99.98%",
        last_deployed: url.lastDeployed || "Recently",
        notes: url.notes || null,
      });
      if (error) {
        console.warn("[Supabase] createLiveUrl error:", error.message);
        return null;
      }
      return id;
    } catch (err) {
      console.error("[Supabase] createLiveUrl failed:", err);
      return null;
    }
  },

  /**
   * Update Live URL in Supabase
   */
  async updateLiveUrl(urlId: string, updates: Partial<ProjectLiveUrl>): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const payload: any = {};
      if (updates.label !== undefined) payload.label = updates.label;
      if (updates.url !== undefined) payload.url = updates.url;
      if (updates.type !== undefined) payload.type = updates.type;
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.uptime !== undefined) payload.uptime = updates.uptime;
      if (updates.lastDeployed !== undefined) payload.last_deployed = updates.lastDeployed;
      if (updates.notes !== undefined) payload.notes = updates.notes;

      const { error } = await supabase.from("live_urls").update(payload).eq("id", urlId);
      return !error;
    } catch (e) {
      console.error("[Supabase] updateLiveUrl error:", e);
      return false;
    }
  },

  /**
   * Delete Live URL in Supabase
   */
  async deleteLiveUrl(urlId: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from("live_urls").delete().eq("id", urlId);
      return !error;
    } catch (e) {
      console.error("[Supabase] deleteLiveUrl error:", e);
      return false;
    }
  },

  /**
   * Create Comment in Supabase
   */
  async createComment(projectId: string, comment: ProjectComment): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from("comments").insert({
        id: comment.id,
        project_id: projectId,
        author_name: comment.authorName,
        author_role: comment.authorRole,
        author_avatar: comment.authorAvatar || null,
        message: comment.message,
        is_pinned: Boolean(comment.isPinned),
        attachments: comment.attachments || [],
      });
      return !error;
    } catch (err) {
      console.error("[Supabase] createComment failed:", err);
      return false;
    }
  },

  /**
   * Delete Comment in Supabase
   */
  async deleteComment(commentId: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from("comments").delete().eq("id", commentId);
      return !error;
    } catch (err) {
      console.error("[Supabase] deleteComment failed:", err);
      return false;
    }
  },

  /**
   * Create Support Ticket in Supabase
   */
  async createSupportTicket(projectId: string, ticket: SupportTicket): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from("support_tickets").insert({
        id: ticket.id,
        project_id: projectId,
        ticket_number: ticket.ticketNumber,
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status || "open",
        assigned_engineer: ticket.assignedEngineer || "Arjun Mehta (Lead Systems Architect)",
        updates: ticket.updates || [],
      });
      return !error;
    } catch (err) {
      console.error("[Supabase] createSupportTicket failed:", err);
      return false;
    }
  },

  /**
   * Update Support Ticket in Supabase
   */
  async updateSupportTicket(ticketId: string, updates: Partial<SupportTicket>): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const payload: any = {
        updated_at: new Date().toISOString(),
      };
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.priority !== undefined) payload.priority = updates.priority;
      if (updates.updates !== undefined) payload.updates = updates.updates;

      const { error } = await supabase.from("support_tickets").update(payload).eq("id", ticketId);
      return !error;
    } catch (err) {
      console.error("[Supabase] updateSupportTicket failed:", err);
      return false;
    }
  },

  /**
   * Create Client Rating in Supabase
   */
  async createRating(projectId: string, rating: ClientRating): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    try {
      const { error } = await supabase.from("ratings").insert({
        id: rating.id,
        project_id: projectId,
        overall_score: rating.overallScore,
        engineering_quality: rating.categories.engineeringQuality,
        communication: rating.categories.communication,
        velocity: rating.categories.velocity,
        ui_ux_design: rating.categories.uiUxDesign,
        feedback_text: rating.feedbackText,
        author_name: rating.authorName,
        client_recommendation: rating.clientRecommendation,
      });
      return !error;
    } catch (err) {
      console.error("[Supabase] createRating failed:", err);
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
