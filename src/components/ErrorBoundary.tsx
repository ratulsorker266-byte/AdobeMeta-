import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React application error:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-400 mb-4">
              AdobeMeta Pro encountered an unexpected issue while loading the workspace.
            </p>
            {this.state.error?.message && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 mb-6 text-left text-xs font-mono text-rose-300 break-words max-h-32 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg w-full"
              >
                <RefreshCw className="w-4 h-4" />
                Reload AdobeMeta Pro
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('custom_bg');
                    sessionStorage.clear();
                  } catch (e) {}
                  window.location.reload();
                }}
                className="text-xs text-slate-400 hover:text-slate-200 py-2 transition"
              >
                Clear Cache & Reload Clean State
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
