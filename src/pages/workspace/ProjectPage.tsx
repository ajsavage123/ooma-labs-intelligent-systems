import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Project, ProjectStage, Designation } from "../../types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  CheckCircle,
  Circle,
  ExternalLink,
  Github,
  FileText,
  Layout,
  Code,
  BarChart,
  ArrowRight,
  TrendingUp,
  Clock,
  Activity
} from "lucide-react";
import ActivityFeed from "@/components/ActivityFeed";

const teamStages: Record<Designation, ProjectStage[]> = {
  "Innovation & Research Team": ["Ideology & Concept", "Research"],
  "Developer & Engineering Team": ["Development", "Deployment"],
  "Business Strategy & Marketing Team": ["Business Strategy", "Marketing Planning", "Customer Feedback"]
};

const teamTools: Record<Designation, { name: string; url: string; icon?: string }[]> = {
  "Innovation & Research Team": [
    { name: "Perplexity AI", url: "https://www.perplexity.ai" },
    { name: "ChatGPT", url: "https://chat.openai.com" },
    { name: "Claude AI", url: "https://claude.ai" },
    { name: "Miro", url: "https://miro.com" },
    { name: "Google Docs", url: "https://docs.google.com" },
  ],
  "Developer & Engineering Team": [
    { name: "GitHub", url: "https://github.com" },
    { name: "VS Code", url: "https://code.visualstudio.com" },
    { name: "Postman", url: "https://www.postman.com" },
    { name: "Docker", url: "https://www.docker.com" },
    { name: "Supabase", url: "https://supabase.com" },
  ],
  "Business Strategy & Marketing Team": [
    { name: "Canva", url: "https://www.canva.com" },
    { name: "Google Analytics", url: "https://analytics.google.com" },
    { name: "LinkedIn", url: "https://www.linkedin.com" },
    { name: "HubSpot", url: "https://www.hubspot.com" },
    { name: "Mailchimp", url: "https://mailchimp.com" },
  ]
};

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Designation | null>(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error("Project not found");
      navigate("/workspace");
    } else {
      setProject(data);
    }
    setLoading(false);
  };

  const logTimeline = async (updateText: string, stage: string) => {
    if (!project || !profile) return;

    await supabase.from('timeline_logs').insert({
      project_id: project.id,
      user_name: profile.username,
      designation: selectedRole || profile.designation || 'Unknown',
      stage: stage,
      update_text: updateText
    });
  };

  const handleStageSubmit = async (currentStage: ProjectStage) => {
    if (!project || !selectedRole) return;

    let nextStage: ProjectStage | "Admin Review" = currentStage;
    let nextProgress = project.progress;

    if (selectedRole === "Innovation & Research Team") {
      if (currentStage === "Ideology & Concept") {
        nextStage = "Research";
        nextProgress = 15;
      } else if (currentStage === "Research") {
        nextStage = "Development";
        nextProgress = 33;
      }
    } else if (selectedRole === "Developer & Engineering Team") {
      if (currentStage === "Development") {
        nextStage = "Deployment";
        nextProgress = 50;
      } else if (currentStage === "Deployment") {
        nextStage = "Business Strategy";
        nextProgress = 66;
      }
    } else if (selectedRole === "Business Strategy & Marketing Team") {
      if (currentStage === "Business Strategy") {
        nextStage = "Marketing Planning";
        nextProgress = 75;
      } else if (currentStage === "Marketing Planning") {
        nextStage = "Customer Feedback";
        nextProgress = 90;
      } else if (currentStage === "Customer Feedback") {
        nextStage = "Admin Review";
        nextProgress = 100;
      }
    }

    const { error } = await supabase
      .from('projects')
      .update({ current_stage: nextStage, progress: nextProgress })
      .eq('id', project.id);

    if (error) {
      toast.error("Failed to update stage");
    } else {
      await logTimeline(`${currentStage} completed and submitted.`, currentStage);
      toast.success(`Project moved to ${nextStage}`);
      fetchProject();
    }
  };

  if (loading) return <div className="p-10 text-center">Loading project...</div>;
  if (!project) return null;

  if (!selectedRole) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Team Role</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["Innovation & Research Team", "Developer & Engineering Team", "Business Strategy & Marketing Team"] as Designation[]).map((role) => (
            <div
              key={role}
              onClick={() => setSelectedRole(role)}
              className="p-8 glass-dark border border-border hover:border-primary transition-all cursor-pointer rounded-2xl flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {role.includes("Innovation") && <Layout className="text-primary" />}
                {role.includes("Developer") && <Code className="text-primary" />}
                {role.includes("Business") && <BarChart className="text-primary" />}
              </div>
              <h3 className="font-bold mb-2">{role}</h3>
              <p className="text-sm text-foreground/60">Access relevant stages and tools for your team.</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isRoleAuthorized = selectedRole === profile?.designation || profile?.role === 'admin';
  const availableStages = teamStages[selectedRole];
  const tools = teamTools[selectedRole];

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      {/* Project Info Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button onClick={() => setSelectedRole(null)} className="text-sm text-primary mb-2 flex items-center gap-1">
            <Clock size={14} /> Change Role View
          </button>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-foreground/60">{project.description}</p>
        </div>
        <div className="flex gap-3">
          {project.drive_link && (
            <Button variant="outline" size="sm" onClick={() => window.open(project.drive_link, '_blank')} className="gap-2">
              <FileText size={16} /> Notes
            </Button>
          )}
          {selectedRole === "Developer & Engineering Team" && project.github_link && (
            <Button variant="outline" size="sm" onClick={() => window.open(project.github_link, '_blank')} className="gap-2">
              <Github size={16} /> Repository
            </Button>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-12 glass-dark p-6 rounded-2xl border border-border">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">Global Progress</span>
          <span className="text-sm font-bold text-primary">{project.progress}%</span>
        </div>
        <div className="w-full h-3 bg-border/30 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${project.progress}%` }} />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-primary" />
          <span className="text-sm">Current Stage: <strong>{project.current_stage}</strong></span>
        </div>
      </div>

      {/* Stage Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Layout size={20} className="text-primary" /> Team Stages
          </h2>
          {availableStages.map((stage) => {
            const isCurrent = project.current_stage === stage;
            const isCompleted = project.progress > (
              stage === "Ideology & Concept" ? 0 :
              stage === "Research" ? 15 :
              stage === "Development" ? 33 :
              stage === "Deployment" ? 50 :
              stage === "Business Strategy" ? 66 :
              stage === "Marketing Planning" ? 75 :
              stage === "Customer Feedback" ? 90 : 100
            );

            return (
              <div
                key={stage}
                className={`p-6 rounded-2xl border transition-all ${
                  isCurrent ? "border-primary bg-primary/5 shadow-lg" : "border-border/50 bg-card/30 opacity-60"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    {isCompleted ? <CheckCircle className="text-green-500" size={20} /> : <Circle className={isCurrent ? "text-primary animate-pulse" : "text-foreground/30"} size={20} />}
                    <h3 className="font-bold">{stage}</h3>
                  </div>
                  {isCurrent && isRoleAuthorized && (
                    <Button size="sm" onClick={() => handleStageSubmit(stage)} className="gap-2">
                      Submit Stage <ArrowRight size={14} />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="text-sm text-foreground/70">
                    {stage === "Ideology & Concept" && "Define the core idea, problem, and solution."}
                    {stage === "Research" && "Conduct market research and technical feasibility studies."}
                    {stage === "Development" && "Build the minimum viable product and core features."}
                    {stage === "Deployment" && "Deploy to production and prepare for launch."}
                    {stage === "Business Strategy" && "Develop business models and go-to-market plans."}
                    {stage === "Marketing Planning" && "Create marketing campaigns and brand assets."}
                    {stage === "Customer Feedback" && "Gather user insights and iterate based on data."}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-8">
          {/* Tools Section */}
          <div className="glass-dark p-6 rounded-2xl border border-border">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Code size={20} className="text-primary" /> Team Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-background/50 border border-border/50 rounded-xl flex items-center justify-between hover:border-primary transition-all group"
                >
                  <span className="font-medium text-sm">{tool.name}</span>
                  <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          {/* Project Activity Feed */}
          <div className="glass-dark p-6 rounded-2xl border border-border">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity size={20} className="text-primary" /> Project Updates
            </h2>
            <ActivityFeed projectId={project.id} limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
