"use client";

import { useEffect, useState } from "react";
import { Link2, ExternalLink } from "lucide-react";
import { authFetch } from "@/lib/api";
import { API_URL } from "@/lib/config";

interface Link {
  id: number;
  title: string;
  url: string;
  description: string;
  team: number | null;
  created_at: string;
}

export default function LinksTab() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await authFetch(`${API_URL}/api/cms/links`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setLinks(data);
      } catch {
        setError("Failed to load links.");
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Links</h2>
        <p className="text-sm text-gray-400">
          Useful resources and portals shared by ASVA
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-zinc-900 border border-white/10 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Empty */}
      {!loading && !error && links.length === 0 && (
        <p className="text-sm text-gray-500">No links shared yet.</p>
      )}

      {/* Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-900 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 hover:border-green-500/30 hover:shadow-md transition-all group"
          >
            {/* Top */}
            <div className="flex items-start justify-between gap-2">
              <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Link2 size={16} className="text-green-400" />
              </div>

              <ExternalLink
                size={14}
                className="text-gray-500 group-hover:text-green-400 transition-colors mt-1"
              />
            </div>

            {/* Content */}
            <div>
              <p className="font-semibold text-white text-sm">
                {link.title}
              </p>

              {link.description && (
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  {link.description}
                </p>
              )}

              <p className="text-xs text-gray-500 truncate mt-2">
                {link.url}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}