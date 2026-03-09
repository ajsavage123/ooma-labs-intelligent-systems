import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Project } from "../../types";
import { toast } from "sonner";
import { Plus, FolderOpen, Users, Calendar, TrendingUp, Layout, Activity } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ActivityFeed from "@/components/ActivityFeed";

const projectSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  teamMembers: z.string().optional(),
  drive_link: z.string().url("Must be a valid URL"),
});

type FormValues = z.infer<typeof projectSchema>;

const WorkspaceHome: React.FC = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to fetch projects");
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { name: "", description: "", teamMembers: "", drive_link: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: values.name,
          description: values.description,
          team_members: values.teamMembers,
          drive_link: values.drive_link,
          current_stage: 'Ideology & Concept',
          progress: 0,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Project created");
      setIsDialogOpen(false);
      fetchProjects();
      navigate(`projects/${data.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create project");
    }
  };

  const showCreateButton = profile?.designation === "Innovation & Research Team" || profile?.role === "admin";

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="sticky top-0 z-40 border-b border-border/20 backdrop-blur-xl bg-background/80">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Project Timeline Dashboard</h1>
              <p className="text-sm text-foreground/60 mt-1">
                {loading ? "Loading projects..." : projects.length === 0 ? "No projects found" : `Managing ${projects.length} project${projects.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            {showCreateButton && (
              <Button
                onClick={() => setIsDialogOpen(true)}
                size="sm"
                className="w-full sm:w-auto gap-2"
              >
                <Plus size={18} />
                <span>New Project</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <p>Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FolderOpen size={56} className="text-foreground/30 mb-4" />
            <p className="text-lg text-foreground/60 mb-6">No projects yet</p>
            {showCreateButton && (
              <Button
                onClick={() => setIsDialogOpen(true)}
                size="default"
                className="gap-2"
              >
                <Plus size={18} />
                Create Your First Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj) => (
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
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold bg-primary/20 text-primary">
                      <TrendingUp size={14} />
                      Active
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
                    <span>Stage: <span className="font-semibold text-foreground">{proj.current_stage}</span></span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-foreground/60">
                    <Calendar size={14} />
                    <span>Updated {new Date(proj.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-4 border-t border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground/60">Progress</span>
                    <span className="text-xs font-semibold text-foreground">
                      {proj.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-border/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/50 transition-all duration-300"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>

      {/* Activity Feed Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 border-t border-border/20">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="text-primary" size={24} />
          <h2 className="text-2xl font-bold">Global Activity Feed</h2>
        </div>
        <div className="glass-dark p-8 rounded-3xl border border-border shadow-2xl">
          <ActivityFeed limit={10} />
        </div>
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
                name="teamMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Members *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. John Doe, Jane Smith"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="drive_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Drive Folder Link *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://drive.google.com/..."
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