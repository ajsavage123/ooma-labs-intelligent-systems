import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Project, Stage, LogEntry } from "../../types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ToolGrid } from "@/components/ToolCard";
import { CheckCircle, Circle } from "lucide-react";

interface LogFormValues {
  date: string;
  team: string;
  description: string;
}

const logSchema = z.object({
  date: z.string().min(1),
  team: z.string().min(1),
  description: z.string().min(1),
});

const stageToolLinks: Record<string, { name: string; url: string }[]> = {
  "Ideology & Concept": [
    { name: "Perplexity AI", url: "https://www.perplexity.ai" },
    { name: "ChatGPT", url: "https://chat.openai.com" },
    { name: "Claude AI", url: "https://claude.ai" },
    { name: "Miro", url: "https://miro.com" },
    { name: "Notion", url: "https://www.notion.so" },
    { name: "Google Docs", url: "https://docs.google.com" },
    { name: "Whimsical", url: "https://whimsical.com" },
    { name: "MindMeister", url: "https://www.mindmeister.com" },
    { name: "FigJam", url: "https://www.figma.com/figjam" },
  ],
  Research: [
    { name: "Perplexity AI", url: "https://www.perplexity.ai" },
    { name: "ChatGPT", url: "https://chat.openai.com" },
    { name: "Claude AI", url: "https://claude.ai" },
    { name: "Google Scholar", url: "https://scholar.google.com" },
    { name: "Statista", url: "https://www.statista.com" },
    { name: "Crunchbase", url: "https://www.crunchbase.com" },
    { name: "SimilarWeb", url: "https://www.similarweb.com" },
    { name: "Google Trends", url: "https://trends.google.com" },
    { name: "Notion", url: "https://www.notion.so" },
  ],
  Development: [
    { name: "GitHub", url: "https://github.com" },
    { name: "GitLab", url: "https://gitlab.com" },
    { name: "Bitbucket", url: "https://bitbucket.org" },
    { name: "Visual Studio Code", url: "https://code.visualstudio.com" },
    { name: "Cursor AI", url: "https://www.cursor.so" },
    { name: "Figma", url: "https://www.figma.com" },
    { name: "Postman", url: "https://www.postman.com" },
    { name: "Supabase", url: "https://supabase.com" },
    { name: "Firebase", url: "https://firebase.google.com" },
    { name: "Docker", url: "https://www.docker.com" },
    { name: "Node.js", url: "https://nodejs.org" },
  ],
  "Deployment / Launch": [
    { name: "Vercel", url: "https://vercel.com" },
    { name: "Netlify", url: "https://www.netlify.com" },
    { name: "AWS", url: "https://aws.amazon.com" },
    { name: "Google Cloud", url: "https://cloud.google.com" },
    { name: "Azure", url: "https://azure.microsoft.com" },
    { name: "Docker", url: "https://www.docker.com" },
    { name: "Cloudflare", url: "https://www.cloudflare.com" },
    { name: "Railway", url: "https://railway.app" },
    { name: "Render", url: "https://render.com" },
  ],
  "Business Strategy & Marketing": [
    { name: "Canva", url: "https://www.canva.com" },
    { name: "Google Analytics", url: "https://analytics.google.com" },
    { name: "LinkedIn", url: "https://www.linkedin.com" },
    { name: "HubSpot", url: "https://www.hubspot.com" },
    { name: "Mailchimp", url: "https://mailchimp.com" },
    { name: "Hootsuite", url: "https://hootsuite.com" },
    { name: "Buffer", url: "https://buffer.com" },
    { name: "Notion", url: "https://www.notion.so" },
  ],
  "Customer Feedback & Improvements": [
    { name: "Google Forms", url: "https://forms.google.com" },
    { name: "Typeform", url: "https://www.typeform.com" },
    { name: "Hotjar", url: "https://www.hotjar.com" },
    { name: "SurveyMonkey", url: "https://www.surveymonkey.com" },
    { name: "Zendesk", url: "https://www.zendesk.com" },
    { name: "Intercom", url: "https://www.intercom.com" },
    { name: "Notion", url: "https://www.notion.so" },
  ],
};

function getTemplateForStage(name: string): string {
  switch (name) {
    case "Ideology & Concept":
      return "Project Summary, Problem Description, Proposed Solution, Target Users, Core Features, Idea Brainstorming Notes, Concept Improvements, Initial Technical Thoughts";
    case "Research":
      return "Market Research, Competitor Analysis, Industry Insights, Technology Requirements, Technical Feasibility, Potential Risks, Research Findings";
    case "Development":
      return "System Architecture, Database Design, Frontend Development, Backend Development, API Integrations, Testing & Bug Fixes, Development Progress Log";
    case "Deployment / Launch":
      return "Infrastructure Setup, Hosting Environment, Deployment Steps, Version Release Notes, System Monitoring, Launch Updates";
    case "Business Strategy & Marketing":
      return "Business Model, Target Market, Customer Segments, Marketing Strategy, Partnership Opportunities, Revenue Strategy, Growth Plan";
    case "Customer Feedback & Improvements":
      return "User Feedback, Bug Reports, Feature Requests, Usage Observations, Improvement Plan, Next Version Ideas";
    default:
      return "";
  }
}

const ProjectPage: React.FC = () => {
  const { state, dispatch } = useAuth();
  const { id } = useParams<{ id: string }>();
  const project = state.projects.find((p) => p.id === id);
  const [activeStageLog, setActiveStageLog] = useState<Stage | null>(null);
  const [activeLog, setActiveLog] = useState<LogEntry | null>(null);
  const logForm = useForm<LogFormValues>({
    resolver: zodResolver(logSchema),
    defaultValues: { date: "", team: "", description: "" },
  });

  if (!project) {
    return <p>Project not found.</p>;
  }

  const handleAddLog = (values: LogFormValues) => {
    if (!activeStageLog) return;
    let updatedStages;
    if (activeLog) {
      // editing existing
      updatedStages = project.stages.map((s) =>
        s.id === activeStageLog.id
          ? {
              ...s,
              logs: s.logs.map((l) =>
                l.id === activeLog.id
                  ? { ...l, date: values.date, team: values.team, description: values.description }
                  : l
              ),
            }
          : s
      );
    } else {
      const newLog: LogEntry = {
        id: `${Date.now()}`,
        date: values.date,
        team: values.team,
        description: values.description,
      };
      updatedStages = project.stages.map((s) =>
        s.id === activeStageLog.id ? { ...s, logs: [...s.logs, newLog] } : s
      );
    }
    dispatch({ type: "UPDATE_PROJECT", payload: { id: project.id, stages: updatedStages, lastUpdated: new Date().toISOString() } });
    toast.success(activeLog ? "Log entry updated" : "Log entry added");
    setActiveStageLog(null);
    setActiveLog(null);
    logForm.reset();
  };

  const handleSubmitForApproval = () => {
    dispatch({ type: "UPDATE_PROJECT", payload: { id: project.id, status: "pending_approval" } });
    toast.success("Project submitted for product approval");
  };

  const progressIndicator = () => {
    const totalStages = project.stages.length;
    const progressPercent = ((project.currentStageIndex + 1) / totalStages) * 100;

    return (
      <div className="mb-8">
        {/* Progress Summary */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs tracking-widest uppercase text-foreground/60 font-medium mb-1">Project Progress</p>
            <p className="text-sm text-foreground">
              <span className="font-semibold">{project.currentStageIndex + 1}</span>
              <span className="text-foreground/60"> of {totalStages} stages completed</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-serif font-bold text-primary">{Math.round(progressPercent)}%</p>
            <p className="text-xs text-foreground/60">Complete</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="relative h-2 bg-border/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Stage Indicators */}
          <div className="flex items-center justify-between px-1">
            {project.stages.map((s, idx) => {
              const isCompleted = idx < project.currentStageIndex;
              const isCurrent = idx === project.currentStageIndex;
              const stagePercent = (idx / (totalStages - 1)) * 100;

              return (
                <div
                  key={s.id}
                  className="flex flex-col items-center"
                  style={{ position: "relative", left: `${stagePercent}%` }}
                >
                  <div
                    className={`flex items-center justify-center rounded-full transition-all duration-300 mb-2 ${
                      isCompleted || isCurrent
                        ? "w-8 h-8 bg-primary/20 text-primary border border-primary/50"
                        : "w-6 h-6 bg-border/50 text-foreground/40"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle size={16} />
                    ) : isCurrent ? (
                      <Circle size={16} className="animate-pulse" />
                    ) : (
                      <Circle size={16} />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-foreground/50 max-w-[60px] line-clamp-1">
                      {s.name.split(" ").slice(0, 2).join(" ")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header & Progress */}
      <div className="sticky top-0 z-40 border-b border-border/20 backdrop-blur-xl bg-background/80">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6">
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">{project.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${project.status === 'completed' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'}`}>
                {project.status === 'in_progress' ? 'Active' : project.status === 'completed' ? 'Completed' : 'Pending'}
              </span>
              <span className="text-sm text-foreground/60">
                Stage {project.currentStageIndex + 1} of {project.stages.length}
              </span>
            </div>
          </div>
          {progressIndicator()}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        <div className="space-y-6">
          {project.stages.map((stage, idx) => {
            const isCurrentStage = idx === project.currentStageIndex;
            const isCompleted = idx < project.currentStageIndex;
            
            return (
              <div
                key={stage.id}
                className={`rounded-lg border transition-all ${
                  isCurrentStage
                    ? "border-primary/50 bg-primary/5 shadow-lg"
                    : isCompleted
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-border/50 bg-card/30"
                }`}
              >
                {/* Stage Header */}
                <div className={`px-6 py-4 border-b ${isCurrentStage ? 'border-primary/20 bg-primary/10' : 'border-border/20 bg-card/50'}`}>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      {isCompleted && <CheckCircle size={20} className="text-green-500" />}
                      {isCurrentStage && <Circle size={20} className="text-primary animate-pulse" />}
                      {!isCompleted && !isCurrentStage && <Circle size={20} className="text-foreground/30" />}
                      <h2 className="text-lg font-semibold text-foreground">{stage.name}</h2>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      <Button
                        size="sm"
                        onClick={() => setActiveStageLog(stage)}
                        variant={isCurrentStage ? "default" : "outline"}
                        className="text-xs"
                      >
                        Add Notes
                      </Button>
                      {isCurrentStage && project.status === "in_progress" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const nextIndex = idx + 1;
                            const updates: Partial<Project> = { lastUpdated: new Date().toISOString() };
                            if (nextIndex >= project.stages.length) {
                              updates.currentStageIndex = idx;
                              updates.status = "completed";
                            } else {
                              updates.currentStageIndex = nextIndex;
                            }
                            dispatch({ type: "UPDATE_PROJECT", payload: { id: project.id, ...updates } });
                          }}
                          className="text-xs"
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stage Content */}
                <div className="px-6 py-6">
                  {/* Tools Section */}
                  {(stageToolLinks[stage.name] || []).length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold mb-4 text-foreground">Available Tools</h3>
                      <ToolGrid tools={stageToolLinks[stage.name] || []} size="sm" />
                    </div>
                  )}

                  {/* Activity Logs Section */}
                  {stage.logs.length > 0 && (
                    <div className={stage.logs.length > 0 ? "mt-8 pt-6 border-t border-border/20" : ""}>
                      <h3 className="text-sm font-semibold mb-4 text-foreground">
                        Notes ({stage.logs.length})
                      </h3>
                      <div className="space-y-3">
                        {stage.logs.map((log) => (
                          <div
                            key={log.id}
                            onClick={() => {
                              setActiveStageLog(stage);
                              setActiveLog(log);
                              logForm.setValue("date", log.date);
                              logForm.setValue("team", log.team);
                              logForm.setValue("description", log.description);
                            }}
                            className="p-4 bg-card/40 rounded border border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer group"
                          >
                            <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium px-2 py-1 bg-primary/20 text-primary rounded">
                                  {log.date}
                                </span>
                                <span className="text-xs text-foreground/60">{log.team}</span>
                              </div>
                            </div>
                            <p className="text-sm text-foreground/70 line-clamp-2 group-hover:text-foreground/90">
                              {log.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {stage.logs.length === 0 && (
                    <div className="py-6 text-center">
                      <p className="text-sm text-foreground/50">
                        No notes yet. Click "Add Notes" to document progress.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        {project.status === "completed" && (
          <div className="mt-12 flex justify-center">
            <Button
              onClick={handleSubmitForApproval}
              size="default"
              className="px-8"
            >
              Submit for Product Approval
            </Button>
          </div>
        )}
      </div>

      {/* log dialog */}
      <Dialog open={!!activeStageLog} onOpenChange={() => setActiveStageLog(null)}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="pb-4 sm:pb-6 border-b border-border/20">
            <div>
              <DialogTitle className="text-xl sm:text-2xl mb-2">{activeLog ? "Edit Note" : "Add Note"}</DialogTitle>
              {activeStageLog && (
                <p className="text-xs sm:text-sm text-foreground/60">
                  <span className="font-medium text-primary">{activeStageLog.name}</span>
                  {activeLog && (
                    <span className="ml-2">• {activeLog.date}</span>
                  )}
                </p>
              )}
            </div>
          </DialogHeader>

          <Form {...logForm}>
            <form onSubmit={logForm.handleSubmit(handleAddLog)} className="space-y-4 sm:space-y-6 py-2">
              {/* Template Guidance */}
              {activeStageLog && (
                <div className="p-3 sm:p-4 bg-primary/5 border border-primary/20 rounded-lg text-xs sm:text-sm">
                  <p className="text-[10px] sm:text-xs tracking-widest uppercase font-semibold text-primary mb-2">Suggested Topics</p>
                  <p className="text-foreground/70 leading-relaxed line-clamp-3">
                    {getTemplateForStage(activeStageLog.name)}
                  </p>
                </div>
              )}

              {/* Form Fields - Stack on mobile, 2 cols on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={logForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs tracking-widest uppercase">Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="rounded-md text-sm" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={logForm.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs tracking-widest uppercase">Team / Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Frontend" {...field} className="rounded-md text-sm" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description Field */}
              <FormField
                control={logForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs tracking-widest uppercase">Update Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Document your progress..."
                        {...field}
                        className="min-h-[100px] sm:min-h-[150px] rounded-md resize-none text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Action Buttons - Stack on mobile */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border/20">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActiveStageLog(null);
                    setActiveLog(null);
                    logForm.reset();
                  }}
                  className="flex-1 text-sm sm:text-base"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 text-sm sm:text-base">
                  {activeLog ? "Update" : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectPage;