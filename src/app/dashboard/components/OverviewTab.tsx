"use client";

import { useEffect, useState } from "react";
import {
  ChevronRight,
  FileText,
  Link2,
  Briefcase,
  Award,
  Users,
  Megaphone
} from "lucide-react";

import { authFetch } from "@/lib/api";
import { API_URL } from "@/lib/config";
import { Tab } from "@/app/join/components/types";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Props = { onNavigate: (tab: Tab) => void };

export default function OverviewTab({ onNavigate }: Props) {
  const [counts, setCounts] = useState({
    documents: 0,
    links: 0,
    internships: 0,
    certificates: 0,
  });

  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [docsRes, linksRes, internRes, certsRes, eventsRes] =
          await Promise.all([
            authFetch(`${API_URL}/api/cms/documents`),
            authFetch(`${API_URL}/api/cms/links`),
            authFetch(`${API_URL}/api/cms/internships`),
            authFetch(`${API_URL}/api/cms/certificates`),
            authFetch(`${API_URL}/api/cms/events`),
          ]);

        const [docs, links, internships, certs, events] = await Promise.all([
          docsRes.json(),
          linksRes.json(),
          internRes.json(),
          certsRes.json(),
          eventsRes.json(),
        ]);

        setCounts({
          documents: docs.length,
          links: links.length,
          internships: internships.length,
          certificates: certs.length,
        });

        setRecentDocs(docs.slice(0, 3));
        setRecentEvents(events.slice(0, 3));
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = [
    {
      label: "Documents",
      value: counts.documents,
      icon: FileText,
      tab: "documents" as Tab,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Links",
      value: counts.links,
      icon: Link2,
      tab: "links" as Tab,
      color: "text-teal-400",
      bg: "bg-teal-500/10",
    },
    {
      label: "Internships",
      value: counts.internships,
      icon: Briefcase,
      tab: "internships" as Tab,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Certificates",
      value: counts.certificates,
      icon: Award,
      tab: "certificates" as Tab,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "Teams",
      value: null,
      icon: Users,
      tab: "teams" as Tab,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* HERO CARD */}
      <Card className="relative overflow-hidden border-zinc-800 bg-zinc-950 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-purple-500/10 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-green-400 text-sm font-medium">
              Welcome back 👋
            </p>
            <h2 className="text-2xl font-semibold text-white mt-1">
              ASVA Member Dashboard
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Access documents, opportunities, and updates.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">
              Active Member
            </span>
          </div>
        </div>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;

          return (
            <Card
              key={s.label}
              onClick={() => onNavigate(s.tab)}
              className="cursor-pointer border-zinc-800 bg-zinc-950 p-5 hover:border-green-500/40 transition group"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  s.bg,
                  s.color,
                )}
              >
                <Icon size={18} />
              </div>

              <div className="mt-3">
                <p className="text-2xl font-semibold text-white">
                  {loading ? "—" : (s.value ?? "→")}
                </p>
                <p className="text-xs text-zinc-400">{s.label}</p>
              </div>

              <div className="flex items-center gap-1 text-green-400 text-xs opacity-0 group-hover:opacity-100 transition mt-2">
                View <ChevronRight size={12} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT DOCS */}
        <Card className="border-zinc-800 bg-zinc-950 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white">Recent Documents</h3>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("documents")}
              className="text-green-400 hover:text-green-300"
            >
              See all <ChevronRight size={14} />
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {loading &&
              [1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 bg-zinc-900 rounded-lg" />
              ))}

            {!loading && recentDocs.length === 0 && (
              <p className="text-sm text-zinc-500">No documents yet.</p>
            )}

            {recentDocs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <FileText size={14} className="text-red-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{doc.title}</p>
                  <p className="text-xs text-zinc-500">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* RECENT EVENTS */}
        <Card className="border-zinc-800 bg-zinc-950 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium text-sm">
              {" "}
              Explore All Events{" "}
            </h3>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("events")}
              className="text-green-400 hover:text-green-300"
            >
              See all <ChevronRight size={14} />
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {loading &&
              [1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 bg-zinc-900 rounded-lg" />
              ))}

            {!loading && recentEvents.length === 0 && (
              <p className="text-sm text-zinc-500">No events yet.</p>
            )}

            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Megaphone size={14} className="text-orange-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{event.title}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* JOIN TEAM CTA */}
        <Card className="border-zinc-800 bg-gradient-to-br from-green-500/10 via-zinc-950 to-purple-500/10 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">
              Join an ASVA Team
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              Software, Hardware, Creative, PR & more
            </p>
          </div>

          <Button
            onClick={() => onNavigate("teams")}
            className="mt-6 bg-green-500 hover:bg-green-600 text-black font-medium"
          >
            Explore Teams
          </Button>
        </Card>
      </div>
    </div>
  );
}
