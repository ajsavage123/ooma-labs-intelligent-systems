import React, { useEffect, useState } from "react";
import { TimelineLog } from "../types";
import { supabase } from "../lib/supabase";
import { Clock, User, Briefcase, Layout } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ActivityFeed: React.FC<{ projectId?: string; limit?: number }> = ({ projectId, limit = 10 }) => {
  const [logs, setLogs] = useState<TimelineLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();

    // Subscribe to new logs
    const channel = supabase
      .channel('timeline_logs_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'timeline_logs' }, (payload) => {
        const newLog = payload.new as TimelineLog;
        if (!projectId || newLog.project_id === projectId) {
          setLogs(prev => [newLog, ...prev].slice(0, limit));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  const fetchLogs = async () => {
    setLoading(true);
    let query = supabase
      .from('timeline_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;

    if (!error) {
      setLogs(data || []);
    }
    setLoading(false);
  };

  if (loading) return <div className="p-4 text-center text-sm opacity-50">Loading activity...</div>;
  if (logs.length === 0) return <div className="p-8 text-center text-sm opacity-50 italic">No activity recorded yet.</div>;

  return (
    <div className="space-y-6">
      {logs.map((log) => (
        <div key={log.id} className="relative pl-6 pb-6 border-l border-border/50 last:pb-0 group">
          <div className="absolute left-[-5px] top-1 w-[9px] h-[9px] rounded-full bg-primary border-2 border-background group-hover:scale-125 transition-transform" />

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs opacity-60">
              <span className="font-bold text-primary/80 uppercase tracking-wider">{log.designation}</span>
              <span>•</span>
              <span>{log.created_at ? formatDistanceToNow(new Date(log.created_at), { addSuffix: true }) : ''}</span>
            </div>

            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-bold text-sm">{log.user_name}</span>
              <span className="text-sm text-foreground/80">{log.update_text}</span>
            </div>

            <div className="mt-2 text-[11px] px-2 py-0.5 bg-primary/10 text-primary w-fit rounded uppercase tracking-widest font-semibold">
              {log.stage}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
