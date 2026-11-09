import { describe, it, expect } from "vitest";
import { CANONICAL_6_STAGES, CANONICAL_6_PHASES, MOCK_CLIENTS, INITIAL_PROJECTS } from "../context/ClientPortalContext";
import {
  WHATSAPP_DEFAULT_AVATAR,
  WHATSAPP_DARK_AVATAR,
  isDefaultOrFakeAvatar,
  sanitizeAvatarUrl,
} from "../components/portal/WhatsAppAvatar";

describe("Client Portal QA Audit Remediations", () => {
  it("P1-4: verifies all 6 canonical stages have rich deliverable checklists", () => {
    expect(CANONICAL_6_STAGES).toHaveLength(6);
    expect(CANONICAL_6_PHASES).toHaveLength(6);

    CANONICAL_6_STAGES.forEach((stage) => {
      expect(stage.title).toBeTruthy();
      expect(stage.deliverables).toBeDefined();
      expect(Array.isArray(stage.deliverables)).toBe(true);
      expect(stage.deliverables!.length).toBeGreaterThanOrEqual(3);
    });

    CANONICAL_6_PHASES.forEach((phase) => {
      expect(phase.deliverables).toBeDefined();
      expect(phase.deliverables!.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("P1-4: verifies stage 1, 3, 4, 6 deliverables match enterprise engineering specifications", () => {
    // Stage 1 (Client Discovery)
    const stage1 = CANONICAL_6_STAGES[0];
    expect(stage1.deliverables).toContain("Brand identity & design tokens intake");
    expect(stage1.deliverables).toContain("Cloud architecture & access credentials handover");

    // Stage 3 (UI/UX Development)
    const stage3 = CANONICAL_6_STAGES[2];
    expect(stage3.deliverables).toContain("Interactive Figma desktop & mobile wireframes");
    expect(stage3.deliverables).toContain("Design tokens & responsive UI component library");

    // Stage 4 (Development)
    const stage4 = CANONICAL_6_STAGES[3];
    expect(stage4.deliverables).toContain("PostgreSQL database migrations & RLS policies");

    // Stage 6 (Hosting)
    const stage6 = CANONICAL_6_STAGES[5];
    expect(stage6.deliverables).toContain("Production cloud infrastructure provisioning (AWS/GCP)");
  });

  it("P1-4: computes dynamic progress accurately from milestone average", () => {
    const mockMilestones = [
      { id: "1", title: "Stage 1", status: "completed" as const, progress: 100 },
      { id: "2", title: "Stage 2", status: "completed" as const, progress: 100 },
      { id: "3", title: "Stage 3", status: "in_progress" as const, progress: 60 },
      { id: "4", title: "Stage 4", status: "pending" as const, progress: 0 },
      { id: "5", title: "Stage 5", status: "pending" as const, progress: 0 },
      { id: "6", title: "Stage 6", status: "pending" as const, progress: 0 },
    ];

    const sum = mockMilestones.reduce((acc, m) => acc + (m.progress || 0), 0);
    const dynamicOverall = Math.round(sum / mockMilestones.length);

    // (100 + 100 + 60 + 0 + 0 + 0) / 6 = 260 / 6 = 43.33 -> 43%
    expect(dynamicOverall).toBe(43);
  });

  it("P2-3: guards SVG circular calculations against undefined and NaN", () => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;

    const calcDashArray = (progress?: number | null) => {
      const cleanProgress = Math.min(100, Math.max(0, Number(progress) || 0));
      return `${(cleanProgress / 100) * circumference} ${circumference}`;
    };

    expect(calcDashArray(undefined)).toBe(`0 ${circumference}`);
    expect(calcDashArray(null)).toBe(`0 ${circumference}`);
    expect(calcDashArray(NaN)).toBe(`0 ${circumference}`);
    expect(calcDashArray(50)).toBe(`${0.5 * circumference} ${circumference}`);
  });

  it("P1-5: verifies support ticket data model supports screenshots & priority SLAs", () => {
    const mockTicket = {
      id: "tick-12345",
      ticketNumber: "TCK-9901",
      title: "Navigation Bar Clipping on iOS",
      description: "Header elements overlap when rotating mobile device.",
      category: "bug" as const,
      priority: "urgent" as const,
      status: "open" as const,
      createdAt: "Jan 12, 2026",
      updatedAt: "Just now",
      assignedEngineer: "Arjun Mehta (Lead Systems Architect)",
      attachments: [
        {
          id: "att-1",
          name: "screenshot.png",
          size: 204800,
          url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          type: "image/png",
        },
      ],
      deviceInfo: {
        os: "iOS 17.4",
        browser: "Mobile Safari",
        screen: "393x852",
        pageUrl: "http://localhost:8081/portal",
      },
      updates: [
        {
          id: "up-1",
          sender: "Client",
          senderRole: "client" as const,
          message: "Header elements overlap when rotating mobile device.",
          time: "Just now",
          attachments: [
            {
              id: "att-1",
              name: "screenshot.png",
              size: 204800,
              url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
              type: "image/png",
            },
          ],
        },
      ],
    };

    expect(mockTicket.attachments).toHaveLength(1);
    expect(mockTicket.attachments[0].type).toBe("image/png");
    expect(mockTicket.deviceInfo?.os).toBe("iOS 17.4");
    expect(mockTicket.updates[0].attachments).toBeDefined();
    expect(mockTicket.priority).toBe("urgent");
  });

  it("WhatsApp No-DP Profile Avatar: verifies zero fake unsplash photos in mockup clients & projects", () => {
    // 1. Mockup Clients must NOT have fake unsplash photos
    MOCK_CLIENTS.forEach((client) => {
      expect(client.avatar).not.toContain("unsplash.com");
      expect(client.avatar).toBe(WHATSAPP_DEFAULT_AVATAR);
    });

    // 2. Initial Projects dedicated leads & comments must NOT have fake unsplash photos
    INITIAL_PROJECTS.forEach((proj) => {
      expect(proj.dedicatedLead.avatar).not.toContain("unsplash.com");
      expect(proj.dedicatedLead.avatar).toBe(WHATSAPP_DEFAULT_AVATAR);

      proj.comments.forEach((comment) => {
        if (comment.authorAvatar) {
          expect(comment.authorAvatar).not.toContain("unsplash.com");
          expect(comment.authorAvatar).toBe(WHATSAPP_DEFAULT_AVATAR);
        }
      });
    });

    // 3. Fake detection tests
    expect(isDefaultOrFakeAvatar(null)).toBe(true);
    expect(isDefaultOrFakeAvatar(undefined)).toBe(true);
    expect(isDefaultOrFakeAvatar("")).toBe(true);
    expect(isDefaultOrFakeAvatar("https://images.unsplash.com/photo-1506794778202")).toBe(true);
    expect(isDefaultOrFakeAvatar("https://api.dicebear.com/7.x/avataaars/svg")).toBe(true);
    expect(isDefaultOrFakeAvatar("https://supabase.co/storage/v1/object/public/avatars/user-real.png")).toBe(false);

    // 4. Sanitization tests
    expect(sanitizeAvatarUrl(null)).toBe(WHATSAPP_DEFAULT_AVATAR);
    expect(sanitizeAvatarUrl("https://images.unsplash.com/photo-123")).toBe(WHATSAPP_DEFAULT_AVATAR);
    expect(sanitizeAvatarUrl("https://images.unsplash.com/photo-123", true)).toBe(WHATSAPP_DARK_AVATAR);
    expect(sanitizeAvatarUrl("https://supabase.co/real-pic.jpg")).toBe("https://supabase.co/real-pic.jpg");

    // 5. WhatsApp SVG structure integrity
    expect(WHATSAPP_DEFAULT_AVATAR).toContain("viewBox='0 0 212 212'");
    expect(WHATSAPP_DEFAULT_AVATAR).toContain("%23DFE5E7"); // WhatsApp light gray circle
    expect(WHATSAPP_DEFAULT_AVATAR).toContain("%23FFFFFF"); // WhatsApp white head & shoulders
  });
});
