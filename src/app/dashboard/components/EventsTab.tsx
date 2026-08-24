import { useEffect, useState } from "react";
import { Event } from "@/app/events/page";
import { authFetch } from "@/lib/api";
import Image from "next/image";
import { API_URL } from "@/lib/config";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventsTab() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authFetch(`${API_URL}/api/cms/events`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setEvents(data);
      } catch {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* header */}
      <div>
        <h2 className="text-gray-900 text-xl font-bold">Events</h2>
        <p className="text-gray-500 text-sm">
          {" "}
          Stay updated with all ASVA activities and programs{" "}
        </p>
      </div>

      {/* loading */}
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

      {/* Error  */}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* No events */}
      {!loading && !error && events.length === 0 && (
        <p className="text-gray-500 text-sm"> No Upcoming Events </p>
      )}

      {/* Events */}
      <div className="grid grid-cols-3 gap-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-zinc-900 border border-black/10 rounded-2xl overflow-hidden hover:border-green-400/30 transition-all"
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
              <h2 className="font-semibold text-lg text-white">{event.title}</h2>

              <p className="text-sm text-gray-400">{event.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <span>📅 {new Date(event.date).toDateString()}</span>

                {event.location && <span>📍 {event.location}</span>}
              </div>

              <div>
                <Button className="mt-1 bg-green-500 hover:bg-green-600 text-white rounded-xl"> Register <MoveRight size={10} fontWeight="normal" /> </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
