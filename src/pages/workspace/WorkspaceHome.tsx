import React, { useState } from "react";
import { useAuth, makeProject } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Stage } from "../../types";
import { toast } from "sonner";
import { Plus, FolderOpen, Users, Calendar, TrendingUp } from "lucide-react";

const projectSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  owner: z.string().min(1),
  teamMembers: z.string().optional(),
});

type FormValues = z.infer<typeof projectSchema>;

// generate default template stages
function defaultStages(): Stage[] {
  const names = [
    "Ideology & Concept",
    "Research",
    "Development",
    "Deployment / Launch",
    "Business Strategy & Marketing",
    "Customer Feedback & Improvements",
  ];
  return names.map((n) => ({ id: n, name: n, logs: [] } as Stage));
}

const WorkspaceHome: React.FC = () => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: "", description: "", owner: state.currentUser?.name || "", teamMembers: "" },
  });

  const onSubmit = (values: FormValues) => {
    const project = makeProject({
      name: values.name,
      description: values.description,
      owner: values.owner,
      teamMembers: values.teamMembers ? values.teamMembers.split(",").map((s) => s.trim()) : [],
      stages: defaultStages(),
    });
    dispatch({ type: "ADD_PROJECT", payload: project });
    toast.success("Project created");
    setIsDialogOpen(false);
    navigate(`projects/${project.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="sticky top-0 z-40 border-b border-border/20 backdrop-blur-xl bg-background/80">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Your Projects</h1>
              <p className="text-sm text-foreground/60 mt-1">
                {state.projects.length === 0 ? "Create your first project to get started" : `Managing ${state.projects.length} project${state.projects.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <Button
              onClick={() => setIsDialogOpen(true)}
              size="sm"
              className="w-full sm:w-auto gap-2"
            >
              <Plus size={18} />
              <span>New Project</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        {state.projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FolderOpen size={56} className="text-foreground/30 mb-4" />
            <p className="text-lg text-foreground/60 mb-6">No projects yet</p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              size="default"
              className="gap-2"
            >
              <Plus size={18} />
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.projects.map((proj) => (
              <Link
                key={proj.id}
                to={`projects/${proj.id}`}
                className="group relative rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Background Gradient Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Content */}
                <div className="relative p-6 bg-card/50 backdrop-blur-sm">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold ${
                      proj.status === "completed"
                        ? "bg-green-500/20 text-green-600 dark:text-green-400"
                        : proj.status === "pending_approval"
                        ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                        : "bg-primary/20 text-primary"
                    }`}>
                      <TrendingUp size={14} />
                      {proj.status === "in_progress" ? "In Progress" : proj.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  {/* Project Title */}
                  <h2 className="text-lg font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {proj.name}
                  </h2>

                {/* Project Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-foreground/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Stage: <span className="font-semibold text-foreground">{proj.stages[proj.currentStageIndex]?.name}</span></span>
                  </div>
                  
                  {proj.teamMembers.length > 0 && (
                    <div className="flex items-start gap-2 text-xs text-foreground/60">
                      <Users size={14} className="mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{proj.teamMembers.join(", ")}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-foreground/60">
                    <Calendar size={14} />
                    <span>Updated {new Date(proj.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-4 border-t border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground/60">Progress</span>
                    <span className="text-xs font-semibold text-foreground">
                      {Math.round(((proj.currentStageIndex + 1) / proj.stages.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-border/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/50 transition-all duration-300"
                      style={{ width: `${((proj.currentStageIndex + 1) / proj.stages.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>

      {/* Create Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create New Project</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Mobile App v2.0" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="What is this project about?" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Owner *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teamMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Members</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Comma separated (optional)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Create Project
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkspaceHome;