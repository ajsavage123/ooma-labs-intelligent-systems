import {
  Brain,
  Lightbulb,
  GitBranch,
  FileText,
  BarChart3,
  TrendingUp,
  Search,
  BookOpen,
  Layers,
  Github,
  Code2,
  Figma,
  Zap,
  Cloud,
  Server,
  Database,
  Network,
  Settings,
  Shield,
  Wifi,
  Package,
  Rocket,
  Globe,
  PieChart,
  MessageSquare,
  Share2,
  Users,
  Target,
  CheckCircle,
  HelpCircle,
  Edit,
  Mail,
  Calendar,
  Clock,
  Eye,
  Maximize,
  Radio,
  AlertCircle,
  Info,
  Box,
  Terminal,
  Coffee,
  Brush,
  Type,
  LucideIcon,
} from "lucide-react";

// Comprehensive tool name to icon mapping
export const toolIconMap: Record<string, LucideIcon> = {
  // AI & Research Tools
  "Perplexity AI": Brain,
  "ChatGPT": Brain,
  "Claude AI": Brain,
  "Claude": Brain,
  "Google Scholar": BookOpen,
  "Google Trends": TrendingUp,
  Statista: BarChart3,
  Crunchbase: Database,
  SimilarWeb: BarChart3,

  // Development Tools
  GitHub: Github,
  GitLab: Github,
  Bitbucket: Github,
  "Visual Studio Code": Code2,
  VSCode: Code2,
  "Cursor AI": Code2,
  Cursor: Code2,
  Figma: Figma,
  FigJam: Figma,
  Postman: Network,
  Docker: Box,
  "Node.js": Code2,
  npm: Package,
  yarn: Package,

  // Database & Backend
  Supabase: Database,
  Firebase: Database,
  MongoDB: Database,
  PostgreSQL: Database,
  MySQL: Database,

  // Deployment Tools
  Vercel: Rocket,
  Netlify: Rocket,
  AWS: Cloud,
  "Amazon Web Services": Cloud,
  "Google Cloud": Cloud,
  Azure: Cloud,
  Cloudflare: Shield,
  Railway: Rocket,
  Render: Rocket,
  Heroku: Rocket,

  // Tools & Productivity
  Notion: FileText,
  "Google Docs": FileText,
  "Google Sheets": BarChart3,
  Miro: Layers,
  Whimsical: Lightbulb,
  MindMeister: Brain,

  // Marketing & Analytics
  Canva: Brush,
  "Google Analytics": BarChart3,
  LinkedIn: Share2,
  HubSpot: Target,
  Mailchimp: Mail,
  Hootsuite: Share2,
  Buffer: Share2,

  // Feedback & Forms
  "Google Forms": FileText,
  Typeform: FileText,
  Hotjar: Eye,
  SurveyMonkey: MessageSquare,
  Zendesk: MessageSquare,
  Intercom: MessageSquare,

  // Default fallback
  default: Zap,
};

export const getToolIcon = (toolName: string): LucideIcon => {
  return toolIconMap[toolName] || toolIconMap.default;
};

export const getToolColor = (toolName: string): string => {
  // Color mapping for visual diversity
  const colorMap: Record<string, string> = {
    // AI tools
    "Perplexity AI": "from-purple-500 to-pink-500",
    ChatGPT: "from-green-500 to-emerald-500",
    "Claude AI": "from-amber-500 to-orange-500",
    Claude: "from-amber-500 to-orange-500",

    // Development
    GitHub: "from-gray-700 to-black",
    GitLab: "from-orange-600 to-red-600",
    Docker: "from-blue-400 to-blue-600",
    Figma: "from-pink-500 to-rose-500",
    Postman: "from-orange-500 to-red-500",

    // Deployment
    Vercel: "from-gray-800 to-black",
    AWS: "from-orange-500 to-yellow-500",
    "Google Cloud": "from-blue-500 to-cyan-500",
    Azure: "from-blue-600 to-sky-500",

    // Analytics
    "Google Analytics": "from-blue-500 to-indigo-600",
    Canva: "from-blue-400 to-cyan-400",
    LinkedIn: "from-blue-600 to-blue-700",

    // Feedback
    "Google Forms": "from-blue-500 to-indigo-500",
    Typeform: "from-purple-500 to-indigo-500",
  };

  // Hash-based color assignment for unmapped tools
  if (!colorMap[toolName]) {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-emerald-500",
      "from-red-500 to-pink-500",
      "from-yellow-500 to-orange-500",
      "from-indigo-500 to-purple-500",
      "from-teal-500 to-cyan-500",
      "from-rose-500 to-pink-500",
    ];
    
    // Simple hash to pick a color consistently
    let hash = 0;
    for (let i = 0; i < toolName.length; i++) {
      hash = ((hash << 5) - hash) + toolName.charCodeAt(i);
      hash = hash & hash;
    }
    return colors[Math.abs(hash) % colors.length];
  }

  return colorMap[toolName];
};
