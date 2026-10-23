import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught application error:", error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public handleBackToPortal = () => {
    window.location.href = "/portal";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#18181b] border border-[#27272a] rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Something went wrong loading this screen
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              An unexpected render issue occurred. Your project data is secure. Please refresh or navigate back to your dashboard.
            </p>
            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-[#121316] border border-[#27272a] text-[11px] text-zinc-400 font-mono text-left max-h-24 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <Button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs h-10 rounded-xl font-bold gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={this.handleBackToPortal}
                className="w-full sm:flex-1 bg-[#121316] hover:bg-[#202024] border-[#27272a] text-zinc-300 text-xs h-10 rounded-xl font-semibold gap-2"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Back to Portal</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
