import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { API_URL } from "@/lib/config";

export type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  image_url: string;
  description: string;
  is_expired: boolean;
};

async function getEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${API_URL}/api/cms/events`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-10 py-12">

      {/* Back button */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">
          Upcoming Events
        </h1>

        <p className="text-gray-400 mt-2 text-sm">
          Stay updated with all ASVA activities and programs
        </p>
      </div>

      {/* Events Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {events.length === 0 && (
          <p className="text-gray-500 text-sm">
            No upcoming events at the moment.
          </p>
        )}

        {events.map((event) => (
          <div
            key={event.id}
            className="group bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden hover:border-green-400/30 transition-all"
          >
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden bg-zinc-800">

              {event.image_url ? (
                <Image
                  src={event.image_url}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                  No image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col gap-3">
              <h2 className="font-semibold text-lg">
                {event.title}
              </h2>

              <p className="text-sm text-gray-400">
                {event.description}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <span>
                  📅 {new Date(event.date).toDateString()}
                </span>

                {event.location && (
                  <span>📍 {event.location}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}