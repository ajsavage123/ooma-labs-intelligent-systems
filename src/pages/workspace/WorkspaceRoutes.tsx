import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import WorkspaceHome from "./WorkspaceHome";
import ProjectPage from "./ProjectPage";

const WorkspaceRoutes: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  if (!state.currentUser) {
    toast("You need to login before accessing the workspace", {
      action: { label: "Login", onClick: () => navigate("/login") },
    });
    navigate("/");
    return null;
  }
  if (!state.currentUser.workspace_access) {
    toast(
      "Ooma Workspace is available only for approved partners.",
      {
        action: { label: "Apply for Partnership", onClick: () => navigate("/partnership") },
      }
    );
    navigate("/");
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
