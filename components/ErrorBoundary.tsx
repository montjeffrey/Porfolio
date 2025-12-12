"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to error reporting service in production
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-bg-elevated rounded-2xl p-8 border border-primary/20 text-center">
            <div className="flex justify-center mb-6">
              <AlertTriangle className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-3xl font-serif text-secondary mb-4">
              Something Went Wrong
            </h1>
            <p className="text-secondary/80 mb-6 leading-relaxed">
              We encountered an unexpected error. Please try refreshing the page or return to the home page.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="bg-bg-dark rounded-lg p-4 mb-6 text-left">
                <p className="text-red-400 font-mono text-sm mb-2">
                  {this.state.error.name}: {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <pre className="text-red-300/80 font-mono text-xs overflow-x-auto">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-bg-dark rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border-2 border-primary/30 hover:border-primary text-secondary rounded-lg font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <Home className="w-5 h-5" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

