import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import WorkspaceHome from "./WorkspaceHome";
import ProjectPage from "./ProjectPage";

const WorkspaceRoutes: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    // We use a small delay or useEffect to avoid React warning about navigating during render
    React.useEffect(() => {
      toast("You need to login before accessing the workspace", {
        action: { label: "Login", onClick: () => navigate("/login") },
      });
      navigate("/login");
    }, []);
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 glass-dark">
        <Link to="." className="font-bold">
          Ooma Workspace
        </Link>
      </header>
      <main className="p-6">
        <Routes>
          <Route path="" element={<WorkspaceHome />} />
          <Route path="projects/:id" element={<ProjectPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default WorkspaceRoutes;
