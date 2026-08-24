"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Link2,
  Briefcase,
  Award,
  Users,
  LogOut,
  X,
  Megaphone
} from "lucide-react";

import { useRouter } from "next/navigation";
import { Tab } from "@/app/join/components/types";
import { API_URL } from "@/lib/config";

import { Button } from "@/components/ui/button";

const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "links", label: "Links", icon: Link2 },
  { id: "internships", label: "Internships", icon: Briefcase },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "teams", label: "Join Teams", icon: Users },
  {id: "events", label: "Events", icon: Megaphone}
];

export default function Sidebar({
  active,
  onSelect,
  open,
  onClose,
}: any) {
  const router = useRouter();

  const handleLogout = async () => {
    const refreshToken = document.cookie
      .split("; ")
      .find((r) => r.startsWith("refresh_token="))
      ?.split("=")[1];

    const accessToken = document.cookie
      .split("; ")
      .find((r) => r.startsWith("access_token="))
      ?.split("=")[1];

    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {}),
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
    } catch {
      // ignore
    }

    document.cookie = "access_token=; path=/; max-age=0";
    document.cookie = "refresh_token=; path=/; max-age=0";

    router.replace("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-72 z-40 flex flex-col",
          "bg-zinc-950 border-r border-zinc-800",
          "transition-transform",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800">
          <h1 className="text-white font-semibold tracking-wide">ASVA</h1>

          <button
            onClick={onClose}
            className="lg:hidden text-zinc-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.id);
                  onClose();
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition",
                  "hover:bg-zinc-900",
                  isActive
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                <Icon size={16} />
                {item.label}

                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-zinc-800">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={14} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}