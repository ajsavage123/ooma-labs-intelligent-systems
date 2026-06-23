# Ooma Labs Intelligent Systems

Strategic tech engineering firm building purposeful, premium platforms that bridge efficiency gaps in complex business operations. We specialize in custom software, responsive web/mobile applications, and scalable AI automations.

---

## 🚀 Key Features

- **Premium UI/UX Design**: Highly responsive interfaces built with React, Tailwind CSS, Framer Motion, and shadcn/ui.
- **Interactive Lead Generation**: Integrated widgets including a Quote Chat Widget, Exit Intent Modals, and a WhatsApp Widget for instant communication.
- **Ooma Partner Workspace**: A private portal (`/workspace`) for approved partners to track project milestones, manage pipelines, access developer utilities, and monitor application progress.
- **Partnership & Freelance Onboarding**: Custom application channels for prospective partners (`/partnership`) and freelance professionals (`/freelance`).
- **SEO & Performance Optimized**: Fully configured with JSON-LD schemas (Organization & Local Business), optimized open graph tags, canonical references, and fast page-load assets.

---

## 🛠️ Technology Stack

- **Framework**: [React 18](https://react.dev/) with [Vite](https://vitejs.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Three.js](https://threejs.org/) (for 3D visual elements)
- **State Management**: React Context (Auth) & [TanStack Query](https://tanstack.com/query/latest)
- **Routing**: [React Router DOM v6](https://reactrouter.com/en/main)
- **Build / Tooling**: ESLint, PostCSS, and Vitest for testing

---

## 💻 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) and [npm](https://www.npmjs.com/) (or [Bun](https://bun.sh/)) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ajsavage123/ooma-labs-intelligent-systems.git
   cd ooma-labs-intelligent-systems
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🌐 Deployment & Domains

The application is deployed on **Vercel** with the following production setup:

- **Custom Domain**: [https://www.oomalabs.com](https://www.oomalabs.com)
- **SEO Domain Unification**: Host-based redirects configured in `vercel.json` automatically redirect traffic from the default `oomalabs.vercel.app` domain to the canonical `https://www.oomalabs.com` domain using a permanent (301) redirect.
