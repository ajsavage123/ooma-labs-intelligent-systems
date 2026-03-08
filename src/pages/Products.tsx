import React from "react";
import { useAuth } from "../context/AuthContext";

const ProductsPage: React.FC = () => {
  const { state } = useAuth();
  const products = state.products;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/20 backdrop-blur-xl bg-background/80">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">Ooma Labs Products</h1>
          <p className="text-foreground/60">Approved products from our partner ecosystem</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-lg text-foreground/60">No products published yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="group glass p-6 rounded-lg hover:border-primary/50 transition-all duration-300">
                <h2 className="text-xl font-serif font-bold text-foreground mb-2">{p.name}</h2>
                <p className="text-sm text-foreground/70 mb-4">{p.description}</p>
                <div className="space-y-2">
                  <p className="text-xs text-primary/80">
                    <strong>Status:</strong> {p.launchStatus}
                  </p>
                  {p.team.length > 0 && (
                    <p className="text-xs text-foreground/60">
                      <strong>Team:</strong> {p.team.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;