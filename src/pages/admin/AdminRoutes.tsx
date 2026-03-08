import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import ApplicationsPage from "./ApplicationsPage.tsx";
import ProductsApprovalPage from "./ProductsApprovalPage.tsx";
import ProjectsOverviewPage from "./ProjectsOverviewPage.tsx";

const AdminRoutes: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();

  // simple guard
  if (!state.currentUser || state.currentUser.role !== "admin") {
    toast("Admin access required");
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 glass-dark flex gap-6">
        <Link to="applications" className="underline">
          Partnership Applications
        </Link>
        <Link to="projects" className="underline">
          All Projects
        </Link>
        <Link to="products" className="underline">
          Product Approvals
        </Link>
      </header>
      <main className="p-6">
        <Routes>
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="projects" element={<ProjectsOverviewPage />} />
          <Route path="products" element={<ProductsApprovalPage />} />
          <Route path="*" element={<ApplicationsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminRoutes;
