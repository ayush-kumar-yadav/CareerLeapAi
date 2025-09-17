"use client";

import React, { useState, FormEvent } from "react";

type UploadResponse = {
  extracted_text: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

export default function ResumeUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setExtractedText("");
    const selected = e.target.files?.[0] || null;
    setFile(selected || null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setExtractedText("");

    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are supported.");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/upload_resume`, {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const contentType = res.headers.get("content-type") || "";

      if (!res.ok) {
        if (contentType.includes("application/json")) {
          const data = await res.json();
          throw new Error(
            data?.detail || data?.error || `Upload failed with status ${res.status}`
          );
        } else {
          const text = await res.text();
          throw new Error(text || `Upload failed with status ${res.status}`);
        }
      }

      const data = (await res.json()) as UploadResponse;
      setExtractedText(data.extracted_text || "");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold mb-6">Upload Resume (PDF)</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg border border-muted p-4">
            <label htmlFor="resume" className="block text-sm font-medium mb-2">
              Select your PDF resume
            </label>
            <input
              id="resume"
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
            />
            {file && (
              <p className="mt-2 text-xs text-muted-foreground">
                Selected: {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!file || isLoading}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
            )}
            {isLoading ? "Uploading..." : "Upload & Extract"}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
            <p className="text-sm font-medium">Error</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {extractedText && (
          <div className="mt-6">
            <h2 className="mb-2 text-lg font-medium">Extracted Text</h2>
            <textarea
              readOnly
              value={extractedText}
              className="h-64 w-full resize-y rounded-md border bg-muted p-3 text-sm leading-relaxed"
            />
          </div>
        )}
      </div>
    </div>
  );
}


