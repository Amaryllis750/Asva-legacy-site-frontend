"use client";

import { useEffect, useState } from "react";
import { Users, Loader2, Check, Clock } from "lucide-react";
import { authFetch } from "@/lib/api";
import { API_URL } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Team {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

interface JoinRequest {
  id: number;
  team: number;
  team_name: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function JoinTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamsRes, requestsRes] = await Promise.all([
          authFetch(`${API_URL}/api/cms/teams`),
          authFetch(`${API_URL}/api/cms/teams/join`),
        ]);
        const teamsData = await teamsRes.json();
        const requestsData = await requestsRes.json();
        setTeams(teamsData);
        setRequests(requestsData);
      } catch {
        setError("Failed to load teams.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getRequestForTeam = (teamId: number) =>
    requests.find((r) => r.team === teamId);

  const handleJoin = async (teamId: number) => {
    setJoining(teamId);
    try {
      const res = await authFetch(`${API_URL}/api/cms/teams/join`, {
        method: "POST",
        body: JSON.stringify({ team: teamId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail ?? "Failed to send join request.");
        return;
      }

      setRequests((prev) => [...prev, data]);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setJoining(null);
    }
  };

  const statusBadge = (status: JoinRequest["status"]) => {
    if (status === "APPROVED")
      return (
        <span className="flex items-center gap-1 text-[10px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1">
          <Check size={10} /> Approved
        </span>
      );

    if (status === "PENDING")
      return (
        <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1">
          <Clock size={10} /> Pending
        </span>
      );

    return (
      <span className="text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-2.5 py-1">
        Rejected
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Join a Team</h2>
        <p className="text-sm text-gray-400">
          Pick a department you want to contribute to
        </p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

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

      {/* Teams */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {teams.map((t) => {
          const request = getRequestForTeam(t.id);

          return (
            <div
              key={t.id}
              className={cn(
                "bg-zinc-900 border rounded-2xl p-5 flex flex-col gap-4 transition-all hover:shadow-md",
                request?.status === "APPROVED"
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-white/10 hover:border-green-500/30"
              )}
            >
              {/* Top */}
              <div className="flex items-start justify-between gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Users size={16} className="text-purple-400" />
                </div>

                {request && statusBadge(request.status)}
              </div>

              {/* Content */}
              <div>
                <h3 className="font-semibold text-white">{t.name}</h3>
                {t.description && (
                  <p className="text-sm text-gray-400 mt-1">
                    {t.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              {!request && (
                <Button
                  onClick={() => handleJoin(t.id)}
                  disabled={joining === t.id}
                  className="mt-1 bg-green-500 hover:bg-green-600 text-white rounded-xl"
                >
                  {joining === t.id && (
                    <Loader2 size={14} className="animate-spin mr-2" />
                  )}
                  {joining === t.id ? "Sending..." : "Request to Join"}
                </Button>
              )}

              {request?.status === "REJECTED" && (
                <Button
                  onClick={() => handleJoin(t.id)}
                  disabled={joining === t.id}
                  variant="secondary"
                  className="mt-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl"
                >
                  {joining === t.id && (
                    <Loader2 size={14} className="animate-spin mr-2" />
                  )}
                  Try Again
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}