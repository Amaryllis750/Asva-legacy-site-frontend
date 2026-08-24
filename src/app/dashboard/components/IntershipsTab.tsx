"use client";

import { useEffect, useState } from "react";
import { Briefcase, ExternalLink, Clock } from "lucide-react";
import { authFetch } from "@/lib/api";
import { API_URL } from "@/lib/config";
import { Button } from "@/components/ui/button";

interface Internship {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  apply_url: string;
  deadline: string;
  team: number | null;
  created_at: string;
}

export default function InternshipsTab() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authFetch(`${API_URL}/api/cms/internships`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setInternships(data);
      } catch {
        setError("Failed to load internships.");
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
        <h2 className="text-xl font-bold text-gray-900">Internships</h2>
        <p className="text-sm text-gray-400">
          Opportunities curated by ASVA for members
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-zinc-900 border border-white/10 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Empty */}
      {!loading && !error && internships.length === 0 && (
        <p className="text-sm text-gray-500">
          No internships posted yet.
        </p>
      )}

      {/* Content */}
      <div className="flex flex-col gap-4">
        {internships.map((job) => (
          <div
            key={job.id}
            className="bg-zinc-950 border border-white/10 rounded-2xl px-6 py-5 transition-all duration-300 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">

              {/* Left */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Briefcase size={16} className="text-amber-400" />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    {job.title}
                  </p>

                  <p className="text-sm text-gray-400 mt-0.5">
                    {job.company}
                    {job.location ? ` · ${job.location}` : ""}
                  </p>

                  {job.description && (
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-md">
                      {job.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col items-end gap-2 shrink-0">

                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={11} />
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </span>

                <Button
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                  asChild
                >
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply <ExternalLink size={12} />
                  </a>
                </Button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}