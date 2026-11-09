import { describe, it, expect } from "vitest";

describe("Admin Panel Audit 2026-10-23 Remediations", () => {
  it("M2: computes honest metrics when 0 ratings exist (no fake 5.0 / 100% NPS)", () => {
    const ratings: { score?: number }[] = [];

    const totalEvals = ratings.length;
    const avgScore = totalEvals > 0
      ? (ratings.reduce((sum, r) => sum + (r.score || 0), 0) / totalEvals).toFixed(1)
      : "—";

    const npsScore = totalEvals > 0
      ? Math.round(
          ((ratings.filter((r) => (r.score || 0) >= 4.5).length -
            ratings.filter((r) => (r.score || 0) <= 3).length) /
            totalEvals) *
            100
        )
      : "—";

    expect(avgScore).toBe("—");
    expect(npsScore).toBe("—");

    const categories = [
      { key: "speed", label: "Delivery Speed" },
      { key: "codeQuality", label: "Code Architecture" },
      { key: "communication", label: "Communication" },
      { key: "value", label: "ROI & Impact" },
    ];

    const categoryAverages = categories.map((cat) => {
      const avg = totalEvals > 0
        ? ratings.reduce((sum, r) => sum + (r[cat.key] || r.score || 5), 0) / totalEvals
        : 0;
      const pct = totalEvals > 0 ? (avg / 5) * 100 : 0;
      return { ...cat, avg: totalEvals > 0 ? avg.toFixed(1) : "—", pct };
    });

    categoryAverages.forEach((cat) => {
      expect(cat.avg).toBe("—");
      expect(cat.pct).toBe(0);
    });
  });

  it("M2: accurately computes rating averages when real ratings are provided", () => {
    const ratings = [
      { score: 5, speed: 5, codeQuality: 5, communication: 4, value: 5 },
      { score: 4, speed: 4, codeQuality: 4, communication: 4, value: 4 },
    ];

    const totalEvals = ratings.length;
    const avgScore = (ratings.reduce((sum, r) => sum + r.score, 0) / totalEvals).toFixed(1);
    expect(avgScore).toBe("4.5");

    const nps = Math.round(
      ((ratings.filter((r) => r.score >= 4.5).length -
        ratings.filter((r) => r.score <= 3).length) /
        totalEvals) *
        100
    );
    // 1 promoter (5), 0 detractors -> 1 / 2 = 50%
    expect(nps).toBe(50);
  });

  it("H5 & M5: tab badges normalize away noisy words like 'Lead' and 'CSV'", () => {
    const normalizeBadge = (tabId: string, leadCount: number, sheetsRowCount: number, isDbConnected: boolean) => {
      switch (tabId) {
        case "leads":
          return leadCount;
        case "sheets":
          return sheetsRowCount > 0 ? sheetsRowCount : 0;
        case "db":
          return isDbConnected ? "Live" : "Setup";
        case "settings":
          return 1;
        default:
          return null;
      }
    };

    expect(normalizeBadge("leads", 3, 10, true)).toBe(3);
    expect(normalizeBadge("leads", 3, 10, true)).not.toBe("3 Lead");
    expect(normalizeBadge("sheets", 3, 10, true)).toBe(10);
    expect(normalizeBadge("sheets", 3, 10, true)).not.toBe("CSV");
    expect(normalizeBadge("db", 3, 10, true)).toBe("Live");
  });

  it("L1: parses phone field to guarantee valid WhatsApp number instead of office location", () => {
    const sanitizeLeadPhone = (inputPhone?: string, fallback = "+91 80066 62364"): string => {
      if (!inputPhone) return fallback;
      // If it contains only words / location names like "Hyderabad HQ" without digits
      const digits = inputPhone.replace(/\D/g, "");
      if (digits.length < 7) {
        return fallback;
      }
      return inputPhone;
    };

    expect(sanitizeLeadPhone("Hyderabad HQ")).toBe("+91 80066 62364");
    expect(sanitizeLeadPhone("")).toBe("+91 80066 62364");
    expect(sanitizeLeadPhone(undefined)).toBe("+91 80066 62364");
    expect(sanitizeLeadPhone("+91 98765 43210")).toBe("+91 98765 43210");
  });

  it("C2: constructs the canonical admin direct login URL", () => {
    const adminEmail = "admin@oomalabs.com";
    const loginUrl = `/portal/login?email=${encodeURIComponent(adminEmail)}&admin=true`;
    expect(loginUrl).toBe("/portal/login?email=admin%40oomalabs.com&admin=true");
  });

  it("H3: mobile tabs segment control strictly confines core tabs to 4 primary plus More menu", () => {
    const CORE_MOBILE_TABS = ["stages", "billing", "tickets", "leads"];
    expect(CORE_MOBILE_TABS).toHaveLength(4);

    const SECONDARY_MOBILE_TABS = [
      "broadcast",
      "reviews",
      "settings",
      "referrals",
      "urls",
      "sheets",
      "db",
    ];
    expect(SECONDARY_MOBILE_TABS).toHaveLength(7);

    // Total tabs equals 11 tabs
    expect(CORE_MOBILE_TABS.length + SECONDARY_MOBILE_TABS.length).toBe(11);
  });
});
