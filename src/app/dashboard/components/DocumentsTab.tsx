"use client";

import { useEffect, useState } from "react";
import { FileText, ExternalLink } from "lucide-react";
import { authFetch } from "@/lib/api";
import { API_URL } from "@/lib/config";
import { Button } from "@/components/ui/button";

interface Document {
  id: number;
  title: string;
  url: string;
  description: string;
  team: number | null;
  created_at: string;
}

export default function DocumentsTab() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authFetch(`${API_URL}/api/cms/documents`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setDocuments(data);
      } catch {
        setError("Failed to load documents.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Documents</h2>
        <p className="text-sm text-gray-400">
          Files and resources shared by ASVA
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-zinc-900 border border-white/10 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Empty */}
      {!loading && !error && documents.length === 0 && (
        <p className="text-sm text-gray-500">
          No documents uploaded yet.
        </p>
      )}

      {/* Documents */}
      <div className="flex flex-col gap-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-4 transition-all duration-300 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-0.5"
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-red-400" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">
                {doc.title}
              </p>

              {doc.description && (
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {doc.description}
                </p>
              )}

              <p className="text-xs text-gray-500 mt-0.5">
                {new Date(doc.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Action */}
            <Button
              size="sm"
              variant="outline"
              className="border-white/10 text-gray-300 hover:text-white"
              asChild
            >
              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                Open <ExternalLink size={12} />
              </a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}