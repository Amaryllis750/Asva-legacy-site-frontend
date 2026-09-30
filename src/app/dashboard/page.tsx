"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Sidebar from "./components/Sidebar";
import OverviewTab from "./components/OverviewTab";
import DocumentsTab from "./components/DocumentsTab";
import LinksTab from "./components/LinksTab";
import InternshipsTab from "./components/IntershipsTab";
import CertificatesTab from "./components/CertificatesTab";
import JoinTeams from "./components/JoinTeams";
import { Tab } from "@/app/join/components/types";
import EventsTab from "./components/EventsTab";
import { API_URL } from "@/lib/config";
import { authFetch } from "@/lib/api";
import * as reactDynamic from "next/dynamic";
const IncompletePayment = reactDynamic.default(() => import('./components/IncompletePayment').then((c)=> c.default), {ssr: false})


export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileActive, setIsProfileActive] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const tabTitles: Record<Tab, string> = {
    overview: "Dashboard",
    documents: "Documents",
    links: "Links",
    internships: "Internships",
    certificates: "Certificates",
    teams: "Join Teams",
    events: "Events",
  };

  const tabParam = searchParams.get("tab") as Tab;
  const activeTab: Tab = tabParam || "overview";

  const handleTabSelect = (newTab: Tab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.push(`${pathname}?${params}`, { scroll: false });
  };

  useEffect(() => {
    async function getProfile() {
      try {
        const response = await authFetch(`${API_URL}/api/me/profile`);
        const profile = await response.json();
        const is_active: boolean = profile.is_active;
        setIsProfileActive(is_active);
      } catch {
        // silent fail
      }
    }
    getProfile();
  }, []);

  
  return isProfileActive ? (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        active={activeTab}
        onSelect={handleTabSelect}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar — mobile only */}
        <header className="lg:hidden h-14 bg-white border-b border-gray-100 px-4 flex items-center gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu size={22} />
          </button>
          <h1 className="font-semibold text-gray-900 text-sm capitalize">
            {tabTitles[activeTab]}
          </h1>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === "overview" && (
            <OverviewTab onNavigate={handleTabSelect} />
          )}
          {activeTab === "documents" && <DocumentsTab />}
          {activeTab === "links" && <LinksTab />}
          {activeTab === "internships" && <InternshipsTab />}
          {activeTab === "certificates" && <CertificatesTab />}
          {activeTab === "teams" && <JoinTeams />}
          {activeTab == "events" && <EventsTab />}
        </main>
      </div>
    </div>
  ) : (
    <IncompletePayment email={"daniel@gmail.com"}/>
  )
}
