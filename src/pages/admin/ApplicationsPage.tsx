import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { PartnershipRequest, Designation } from "../../types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Briefcase, User, Check, X, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<PartnershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('partnership_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to fetch applications");
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  const handleApprove = async (app: PartnershipRequest) => {
    setProcessingId(app.id);
    try {
      // 1. Generate random password
      const password = Math.random().toString(36).slice(-8);
      const username = app.name.split(' ')[0].toLowerCase() + Math.floor(Math.random() * 1000);
      const email = `${username}@oomalabs.com`;

      // 2. Map interest to designation
      let designation: Designation = "Innovation & Research Team";
      if (app.interest === "developer_engineer") designation = "Developer & Engineering Team";
      if (app.interest === "business_marketing") designation = "Business Strategy & Marketing Team";

      // 3. Note: Supabase Client SDK cannot create Auth users directly from the client without
      // service role permissions (which must NOT be used on frontend).
      // The admin will need to manually create the user account in Supabase Dashboard
      // or set up a Supabase Edge Function to automate this.
      // For now, we will update the partnership_requests status and assume the Auth user
      // will be provisioned by the admin before sending the credentials.

      const { error: updateError } = await supabase
        .from('partnership_requests')
        .update({ status: 'approved' })
        .eq('id', app.id);

      if (updateError) throw updateError;

      // 4. Send Approval Email via EmailJS
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_APPROVAL_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        emailjs.init(publicKey);
        await emailjs.send(serviceId, templateId, {
          to_email: app.email,
          partner_name: app.name,
          workspace_link: window.location.origin + "/login",
          username: email,
          password: password,
          designation: designation,
        });
      }

      toast.success(`Application for ${app.name} approved and email sent.`);
      fetchApplications();
    } catch (error: any) {
      toast.error(error.message || "Approval failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from('partnership_requests')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (error) {
      toast.error("Failed to reject application");
    } else {
      toast.success("Application rejected");
      fetchApplications();
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Partnership Applications</h1>

      {applications.length === 0 ? (
        <p className="text-center opacity-50">No applications found.</p>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <div key={app.id} className="glass-dark p-6 rounded-2xl border border-border flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {app.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{app.name}</h3>
                    <p className="text-sm opacity-60 flex items-center gap-1"><Mail size={14} /> {app.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block opacity-50 text-xs uppercase font-bold tracking-wider">Expertise</span>
                    {app.expertise}
                  </div>
                  <div>
                    <span className="block opacity-50 text-xs uppercase font-bold tracking-wider">Interest</span>
                    {app.interest.replace('_', ' & ')}
                  </div>
                </div>

                <div>
                  <span className="block opacity-50 text-xs uppercase font-bold tracking-wider">Reason</span>
                  <p className="text-sm">{app.reason || 'No reason provided.'}</p>
                </div>
              </div>

              <div className="flex flex-row md:flex-col justify-end gap-3 min-w-[150px]">
                {app.status === 'pending' ? (
                  <>
                    <Button
                      onClick={() => handleApprove(app)}
                      disabled={processingId === app.id}
                      className="bg-green-600 hover:bg-green-700 text-white gap-2"
                    >
                      {processingId === app.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(app.id)}
                      variant="outline"
                      className="border-red-500/50 text-red-500 hover:bg-red-500/10 gap-2"
                    >
                      <X size={16} />
                      Reject
                    </Button>
                  </>
                ) : (
                  <div className={`text-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                    app.status === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {app.status}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
