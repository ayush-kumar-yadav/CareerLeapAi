"use client";

import React, { useEffect, useMemo, useState } from "react";

type JobItem = {
  id: number;
  user_id?: number;
  title: string;
  company?: string | null;
  location?: string | null;
  description?: string | null;
  created_at?: string;
};

type JobsResponse = {
  jobs: JobItem[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("token") : null), []);

  useEffect(() => {
    let cancelled = false;
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/v1/jobs`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.detail || `Failed to load jobs (${res.status})`);
        }
        const data = (await res.json()) as JobsResponse;
        if (!cancelled) {
          setJobs(data.jobs || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load jobs");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchJobs();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const truncateDescription = (text: string | null | undefined, maxLength: number = 150): string => {
    if (!text) return "No description available.";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Job Recommendations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover opportunities that match your profile
          </p>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-muted-foreground" />
            Loading job recommendations...
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
            <p className="text-sm font-medium">Error</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No job recommendations available at the moment.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground">
                    {job.title}
                  </h2>
                  {job.company && (
                    <p className="text-sm font-medium text-muted-foreground">
                      {job.company}
                    </p>
                  )}
                  {job.location && (
                    <p className="text-xs text-muted-foreground">
                      📍 {job.location}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {truncateDescription(job.description)}
                  </p>
                </div>

                {job.created_at && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Posted: {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
