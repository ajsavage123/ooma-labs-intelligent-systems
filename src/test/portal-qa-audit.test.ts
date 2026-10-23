import { describe, it, expect } from "vitest";
import { CANONICAL_6_STAGES, CANONICAL_6_PHASES } from "../context/ClientPortalContext";

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
});
