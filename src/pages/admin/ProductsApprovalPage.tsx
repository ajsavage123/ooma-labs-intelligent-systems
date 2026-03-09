import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Project, AdminRating } from "../../types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Star, TrendingUp, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ProductsApprovalPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [ratings, setRatings] = useState({
    problem_importance: 5,
    technical_feasibility: 5,
    market_demand: 5,
    impact_potential: 5,
    development_complexity: 5,
  });
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingProjects();
  }, []);

  const fetchPendingProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('current_stage', 'Admin Review')
      .order('created_at', { ascending: false });

    if (!error) {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const calculateScore = () => {
    const values = Object.values(ratings);
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  const handleRatingChange = (criterion: keyof typeof ratings, value: number) => {
    setRatings(prev => ({ ...prev, [criterion]: value }));
  };

  const handleSubmitEvaluation = async (action: 'approve' | 'return' | 'reject') => {
    if (!selectedProjectId) return;
    setProcessing(true);

    try {
      const score = calculateScore();

      // 1. Save Rating
      const { error: ratingError } = await supabase
        .from('admin_ratings')
        .insert({
          project_id: selectedProjectId,
          ...ratings,
          innovation_score: score,
          notes: notes
        });

      if (ratingError) throw ratingError;

      // 2. Update Project Status
      let nextStage: string = "Admin Review";
      let message = "";

      if (action === 'approve') {
        nextStage = "Official Ooma Labs Product";
        message = "Project approved as official Ooma Labs product!";
      } else if (action === 'return') {
        nextStage = "Research"; // Or back to a previous stage
        message = "Project returned for further improvements.";
      } else {
        nextStage = "Rejected";
        message = "Project rejected.";
      }

      const { error: updateError } = await supabase
        .from('projects')
        .update({ current_stage: nextStage })
        .eq('id', selectedProjectId);

      if (updateError) throw updateError;

      toast.success(message);
      setSelectedProjectId(null);
      fetchPendingProjects();
    } catch (error: any) {
      toast.error(error.message || "Evaluation failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-10 text-center opacity-50">Loading pending reviews...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Innovation Evaluation</h1>

      {projects.length === 0 ? (
        <div className="text-center py-20 glass-dark rounded-3xl border border-border">
          <CheckCircle size={48} className="text-primary/30 mx-auto mb-4" />
          <p className="opacity-50 italic">No projects currently awaiting admin review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-sm tracking-widest uppercase font-bold text-foreground/40 mb-4 flex items-center gap-2">
              <AlertCircle size={16} className="text-primary" /> Pending Review ({projects.length})
            </h2>
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedProjectId === proj.id ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/50"
                }`}
              >
                <h3 className="font-bold text-sm mb-1">{proj.name}</h3>
                <p className="text-xs opacity-60 line-clamp-1">{proj.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Progress: {proj.progress}%</span>
                  <span className="text-[10px] opacity-40">{new Date(proj.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Evaluation Form */}
          <div className="lg:col-span-2">
            {selectedProjectId ? (
              <div className="glass-dark p-8 rounded-3xl border border-border shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-start border-b border-border/20 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Evaluate Project</h2>
                    <p className="text-sm opacity-60">Score the project across 5 criteria (1-10)</p>
                  </div>
                  <div className="text-center p-4 bg-primary/10 rounded-2xl border border-primary/20">
                    <div className="text-3xl font-bold text-primary">{calculateScore().toFixed(1)}</div>
                    <div className="text-[10px] uppercase tracking-widest font-bold">Innovation Score</div>
                  </div>
                </div>

                <div className="space-y-6">
                  {Object.entries(ratings).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs tracking-widest uppercase font-bold text-foreground/70">
                          {key.replace('_', ' ')}
                        </label>
                        <span className="text-sm font-bold text-primary">{value} / 10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={value}
                        onChange={(e) => handleRatingChange(key as any, parseInt(e.target.value))}
                        className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <label className="text-xs tracking-widest uppercase font-bold text-foreground/70">Evaluation Notes</label>
                  <Textarea
                    placeholder="Add your final review comments..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border/20">
                  <Button
                    onClick={() => handleSubmitEvaluation('approve')}
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700 text-white gap-2 font-bold uppercase tracking-widest text-[10px]"
                  >
                    {processing ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle size={14} />} Approve Launch
                  </Button>
                  <Button
                    onClick={() => handleSubmitEvaluation('return')}
                    disabled={processing}
                    variant="outline"
                    className="border-primary/50 text-primary gap-2 font-bold uppercase tracking-widest text-[10px]"
                  >
                    {processing ? <Loader2 className="animate-spin" size={14} /> : <TrendingUp size={14} />} Return for Improvements
                  </Button>
                  <Button
                    onClick={() => handleSubmitEvaluation('reject')}
                    disabled={processing}
                    variant="outline"
                    className="border-red-500/50 text-red-500 gap-2 font-bold uppercase tracking-widest text-[10px]"
                  >
                    {processing ? <Loader2 className="animate-spin" size={14} /> : <XCircle size={14} />} Reject Project
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-20">
                <Star size={64} className="mb-4" />
                <p className="font-bold uppercase tracking-widest text-sm">Select a project to begin evaluation</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsApprovalPage;
