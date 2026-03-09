import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Project, TimelineLog } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, TrendingUp, Activity, CheckCircle, PieChart } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const ProjectsOverviewPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: projData, error: projError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!projError) {
      setProjects(projData || []);
    }
    setLoading(false);
  };

  const getStats = () => {
    const activeProjects = projects.length;
    const researchCount = projects.filter(p => p.current_stage === 'Research' || p.current_stage === 'Ideology & Concept').length;
    const developmentCount = projects.filter(p => p.current_stage === 'Development' || p.current_stage === 'Deployment').length;
    const launchCount = projects.filter(p => p.current_stage === 'Business Strategy' || p.current_stage === 'Marketing Planning' || p.current_stage === 'Customer Feedback' || p.current_stage === 'Admin Review').length;

    return { activeProjects, researchCount, developmentCount, launchCount };
  };

  const stats = getStats();

  if (loading) return <div className="p-10 text-center text-sm opacity-50">Loading project overview...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Ooma Labs Innovation Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="glass-dark border-border shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-60 flex items-center gap-2 tracking-widest uppercase">
              <TrendingUp size={16} className="text-primary" /> Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeProjects}</div>
          </CardContent>
        </Card>
        <Card className="glass-dark border-border shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-60 flex items-center gap-2 tracking-widest uppercase">
              <Activity size={16} className="text-primary" /> Research Phase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.researchCount}</div>
          </CardContent>
        </Card>
        <Card className="glass-dark border-border shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-60 flex items-center gap-2 tracking-widest uppercase">
              <PieChart size={16} className="text-primary" /> Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.developmentCount}</div>
          </CardContent>
        </Card>
        <Card className="glass-dark border-border shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-60 flex items-center gap-2 tracking-widest uppercase">
              <CheckCircle size={16} className="text-primary" /> Launch Phase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.launchCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <div className="glass-dark rounded-3xl border border-border overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-border/50 flex justify-between items-center">
          <h2 className="text-xl font-bold">All Projects</h2>
          <span className="text-xs tracking-widest uppercase font-bold text-primary">Monitoring {projects.length} Pipelines</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/20 text-xs tracking-widest uppercase font-bold text-foreground/40">
                <th className="px-8 py-6">Project Name</th>
                <th className="px-8 py-6">Current Stage</th>
                <th className="px-8 py-6">Progress</th>
                <th className="px-8 py-6">Last Update</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-bold text-sm">{proj.name}</div>
                    <div className="text-xs text-foreground/50 line-clamp-1">{proj.description}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {proj.current_stage}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 bg-border/30 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${proj.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold">{proj.progress}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs text-foreground/50">
                    {new Date(proj.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link
                      to={`/workspace/projects/${proj.id}`}
                      className="text-xs tracking-widest uppercase font-bold text-primary hover:underline"
                    >
                      View Full Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectsOverviewPage;
