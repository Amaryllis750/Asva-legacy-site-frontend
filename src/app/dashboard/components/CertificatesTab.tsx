"use client";

import { useEffect, useState } from "react";
import { Award, ExternalLink } from "lucide-react";
import { authFetch } from "@/lib/api";
import { API_URL } from "@/lib/config";
import { Button } from "@/components/ui/button";

interface Certificate {
  id: number;
  title: string;
  description: string;
  url: string;
  issued_at: string;
}

export default function CertificatesTab() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authFetch(`${API_URL}/api/cms/certificates`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setCertificates(data);
      } catch {
        setError("Failed to load certificates.");
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
        <h2 className="text-xl font-bold text-gray-900">Certificates</h2>
        <p className="text-sm text-gray-400">
          Your ASVA achievements and recognitions
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
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
      {!loading && !error && certificates.length === 0 && (
        <p className="text-sm text-gray-500">
          No certificates issued yet.
        </p>
      )}

      {/* Certificates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-zinc-950 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 transition-all hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Award size={18} className="text-green-400" />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {cert.title}
                </p>
                {cert.description && (
                  <p className="text-xs text-gray-400 mt-1">
                    {cert.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Issued: {new Date(cert.issued_at).toLocaleDateString()}
              </span>

              {cert.url && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-white/10 text-gray-300 hover:text-white"
                  asChild
                >
                  <a href={cert.url} target="_blank">
                    View <ExternalLink size={12} />
                  </a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}