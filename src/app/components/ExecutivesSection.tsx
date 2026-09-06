"use client";

import Image from "next/image";
import { useState } from "react";

type Executive = {
  name: string;
  role: string;
  image: string;
  objectPosition?: string;
  bio?: string;
};

const executives: Executive[] = [
  {
    name: "Fausiyah Oladejo",
    role: "President",
    image: "/fausiyah.jpeg",
    objectPosition: "object-top",
    bio: "Leads ASVA with a focus on innovation, structure, and student impact.",
  },
  {
    name: "Great Adeleke",
    role: "Vice President",
    image: "/great.PNG",
    objectPosition: "object-top",
    bio: "Supports executive coordination and drives strategic initiatives.",
  },
  {
    name: "Omile Chinaza", 
    role: "Chief of Staff", 
    image: "/chinaza.jpeg", 
    objectPosition: "object-top", 
    bio: "Coordinates executive operations and supports effective leadership across ASVA."
  },
  {
    name: "Nwankwo Kelechi",
    role: "General Secretary",
    image: "/kelechi.jpg.jpeg",
    objectPosition: "object-top",
    bio: "Manages documentation, communication, and internal organization.",
  },
  {
    name: "Samuel Loto", 
    role: "Assistant General Secretary", 
    objectPosition: "object-center", 
    image: "/samuel.jpeg", 
    bio: "Assists in documention, communication and internal organization"
  },
  {
    name: "Okon Isabella",
    role: "Financial Secretary",
    image: "/okon.jpeg",
    objectPosition: "object-top",
    bio: "Oversees financial records and accountability.",
  },
  {
    name: "Okoronkwo Daniel",
    role: "Software Director",
    image: "/daniel.jpg.jpeg",
    objectPosition: "object-top",
    bio: "Builds and maintains ASVA digital systems and platforms.",
  },
  {
    name: "Emaleku Adedamola",
    role: "Public Relations Officer",
    image: "/PRO.jpeg",
    objectPosition: "object-top",
    bio: "Handles ASVA communication and public image.",
  },
  {
    name: "Effiom-Henshaw Marshall",
    role: "Creative Director I",
    image: "/Henshaw.jpg.jpeg",
    objectPosition: "object-top",
    bio: "Leads visual identity and creative direction.",
  },
  {
    name: "Oluwole David", 
    role: "Creative Director II", 
    image: "/David.jpg.jpeg", 
    objectPosition: "object-top", 
    bio: "Supports Creative Production and branding"
  },
  {
    name: "Elijah Etukafia",
    role: "Director of External Affairs",
    image: "/elijah.jpeg",
    objectPosition: "object-center",
    bio: "Manages external partnerships and collaborations.",
  },
  {
    name: "Osasemwinhia Egharevba",
    role: "Hardware Director",
    image: "/osas.jpeg",
    objectPosition: "object-center",
    bio: "Handles hardware systems and physical infrastructure.",
  },
  {
    name: "Ajibade Benjamin", 
    role: "Innovation Head", 
    image: "/benjamin.jpeg", 
    objectPosition: "object-center", 
    bio: "Drives innovative ideas, creative problem-solving, and strategic initiatives that advance ASVA's vision and impact."
  },
  {
    name: "Ayobami Deborah",
    role: "Director of Innovation for Sciences",
    image: "/deborah.jpeg",
    objectPosition: "object-center",
    bio: "Leads scientific innovation efforts, encourages research-driven thinking, and supports initiatives that advance STEM excellence within ASVA.",
  },
  {
    name: "Owolabi Ameenat",
    role: "Director of Innovation for MHS",
    image: "/ameenat.jpeg",
    objectPosition: "object-center",
    bio: "Champions innovative ideas in MHS, connecting student needs with practical solutions that improve learning, engagement, and impact.",
  },
  {
    name: "Kuboye Oluwatowa",
    role: "Director of Innovation for MHS",
    image: "/towa.jpeg",
    objectPosition: "object-top",
    bio: "Drives creative problem-solving and forward-thinking projects within MHS, helping students translate ideas into meaningful action.",
  },
  {
    name: "Adukwe Winifred",
    role: "Director of Innovation for SMS",
    image: "/dir of inno sms.jpeg",
    objectPosition: "object-top",
    bio: "Builds innovative opportunities in SMS, empowering students to explore ideas, collaborate, and create value through strategic thinking.",
  },
  {
    name: "Ologe Glory",
    role: "Director of Innovation for Engineering",
    image: "/glory.jpeg",
    objectPosition: "object-center",
    bio: "Leads engineering-focused innovation, encouraging creativity, technical excellence, and student-led solutions that solve real challenges.",
  },
  {
    name: "Adeboye Alfred",
    role: "Director of Innovation for Pharmacy",
    image: "/alfred.jpeg",
    objectPosition: "object-top",
    bio: "Promotes innovation in pharmacy-related initiatives, bridging academic excellence with practical, impactful community and healthcare solutions.",
  },
  {
    name: "Daramola Oluwadamisi",
    role: "Head of Planning (DEVCON)",
    image: "/damisi.jpeg",
    objectPosition: "object-center",
    bio: "Coordinates strategic planning and event execution for DEVCON, ensuring seamless preparation, strong organization, and purposeful outcomes.",
  }

];

export default function ExecutivesSection() {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  return (
    <section id="execs" className="w-full bg-black py-20 px-6">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Meet the Executives
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          The leadership team driving ASVA forward
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">

        {executives.map((exec, index) => {
          const isFlipped = flippedIndex === index;

          return (
            <div
              key={index}
              className="[perspective:1000px] cursor-pointer"
              onClick={() =>
                setFlippedIndex(isFlipped ? null : index)
              }
              onMouseEnter={() => setFlippedIndex(index)}
              onMouseLeave={() => setFlippedIndex(null)}
            >
              <div
                className={`relative h-72 transition-transform duration-700 will-change-transform [transform-style:preserve-3d]
                ${isFlipped ? "[transform:rotateY(180deg)]" : ""}
                `}
              >
                {/* FRONT */}
                <div className="absolute inset-0 bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden [backface-visibility:hidden]">
                  
                  <div className="p-4 text-center">
                    <h3 className="text-white text-sm font-semibold">
                      {exec.name}
                    </h3>
                    <p className="text-green-500 text-xs mt-1">
                      {exec.role}
                    </p>
                  </div>

                  <div className="relative w-full h-44 bg-black">
                    <Image
                      src={exec.image}
                      alt={exec.name}
                      fill
                      className={`object-cover ${
                        exec.objectPosition ?? "object-center"
                      }`}
                    />
                  </div>
                </div>

                {/* BACK */}
                <div className="absolute inset-0 bg-black border border-white/10 rounded-2xl p-5 flex items-center justify-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {exec.bio}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}