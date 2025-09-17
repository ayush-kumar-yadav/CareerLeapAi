"use client";

import React, { useEffect, useMemo, useState } from "react";

type ResumeItem = {
  id: number;
  user_id?: number;
  file_name?: string | null;
  file_type?: string | null;
  file_size?: number | null;
  created_at?: string;
};

type ResumesResponse = {
  resumes: ResumeItem[];
};

type StoredAnalysisResponse = {
  resume_id: number;
  analysis: any;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

export default function MyResumesPage() {
  const [items, setItems] = useState<ResumeItem[]>([]);
  const [snippets, setSnippets] = useState<Record<number, string>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Record<number, boolean>>({});
  const [reanalyzing, setReanalyzing] = useState<Record<number, boolean>>({});

  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("token") : null), []);

  useEffect(() => {
    let cancelled = false;
    const fetchResumes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/v1/resumes`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.detail || `Failed to load resumes (${res.status})`);
        }
        const data = (await res.json()) as ResumesResponse;
        if (!cancelled) {
          setItems(data.resumes || []);
        }
        // Fetch analysis summaries for snippets (best-effort)
        const fetchSnippets = async () => {
          const updates: Record<number, string> = {};
          await Promise.all(
            (data.resumes || []).map(async (r) => {
              try {
                const ar = await fetch(`${API_URL}/api/v1/analysis/${r.id}`, {
                  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                });
                if (!ar.ok) return;
                const aj = (await ar.json()) as StoredAnalysisResponse;
                const summary: string | undefined = aj?.analysis?.summary || aj?.analysis?.text || "";
                if (summary) {
                  updates[r.id] = summary.slice(0, 200);
                }
              } catch {}
            })
          );
          if (!cancelled && Object.keys(updates).length) {
            setSnippets((prev) => ({ ...prev, ...updates }));
          }
        };
        fetchSnippets();
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load resumes");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchResumes();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const onView = async (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!snippets[id]) {
      try {
        const ar = await fetch(`${API_URL}/api/v1/analysis/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!ar.ok) return;
        const aj = (await ar.json()) as StoredAnalysisResponse;
        const summary: string | undefined = aj?.analysis?.summary || aj?.analysis?.text || "";
        if (summary) setSnippets((prev) => ({ ...prev, [id]: summary.slice(0, 200) }));
      } catch {}
    }
  };

  const onDelete = async (id: number) => {
    setActionError(null);
    setActionSuccess(null);
    setDeleting((p) => ({ ...p, [id]: true }));
    try {
      const res = await fetch(`${API_URL}/api/v1/resumes/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok) {
        const msg = contentType.includes("application/json")
          ? (await res.json()).detail || `Delete failed (${res.status})`
          : (await res.text()) || `Delete failed (${res.status})`;
        throw new Error(msg);
      }
      setItems((prev) => prev.filter((x) => x.id !== id));
      setActionSuccess("Resume deleted successfully.");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to delete resume.");
    } finally {
      setDeleting((p) => ({ ...p, [id]: false }));
    }
  };

  const onReanalyze = async (id: number) => {
    setActionError(null);
    setActionSuccess(null);
    setReanalyzing((p) => ({ ...p, [id]: true }));
    try {
      const res = await fetch(`${API_URL}/api/v1/resumes/${id}/analyze`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" },
      });
      const contentType = res.headers.get("content-type") || "";
      if (!res.ok) {
        const msg = contentType.includes("application/json")
          ? (await res.json()).detail || `Re-analyze failed (${res.status})`
          : (await res.text()) || `Re-analyze failed (${res.status})`;
        throw new Error(msg);
      }
      const data = (await res.json()) as { summary?: string };
      const summary = (data as any)?.summary || (data as any)?.analysis?.summary || "";
      if (summary) setSnippets((prev) => ({ ...prev, [id]: String(summary).slice(0, 200) }));
      setActionSuccess("Resume re-analyzed successfully.");
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to re-analyze resume.");
    } finally {
      setReanalyzing((p) => ({ ...p, [id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Resumes</h1>
          <a
            href="/upload"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Upload New
          </a>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-muted-foreground" />
            Loading resumes...
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
            <p className="text-sm font-medium">Error</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {actionError && (
          <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
            <p className="text-sm">{actionError}</p>
          </div>
        )}
        {actionSuccess && (
          <div className="mt-4 rounded-md border border-green-300 bg-green-50 p-4 text-green-700">
            <p className="text-sm">{actionSuccess}</p>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <p className="text-sm text-muted-foreground">No resumes uploaded yet.</p>
        )}

        <div className="grid grid-cols-1 gap-4">
          {items.map((r) => (
            <div key={r.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-medium">
                    {r.file_name || `Resume #${r.id}`}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Uploaded: {r.created_at ? new Date(r.created_at).toLocaleString() : "Unknown"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView(r.id)}
                    className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                  >
                    {expanded[r.id] ? "Hide" : "View"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(r.id)}
                    disabled={!!deleting[r.id]}
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    {deleting[r.id] && (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-red-400/60 border-t-red-600" />
                    )}
                    {deleting[r.id] ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onReanalyze(r.id)}
                    disabled={!!reanalyzing[r.id]}
                    className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-60"
                  >
                    {reanalyzing[r.id] && (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-muted-foreground" />
                    )}
                    {reanalyzing[r.id] ? "Re-analyzing..." : "Re-analyze"}
                  </button>
                </div>
              </div>

              {expanded[r.id] && (
                <div className="mt-3">
                  <p className="text-sm whitespace-pre-wrap">
                    {snippets[r.id] || "No snippet available."}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


