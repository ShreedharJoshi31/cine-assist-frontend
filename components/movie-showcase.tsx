"use client";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const movies = [
  {
    id: 1,
    title: "Oppenheimer",
    poster: "/placeholder.svg?height=400&width=300",
  },
  { id: 2, title: "Barbie", poster: "/placeholder.svg?height=400&width=300" },
  {
    id: 3,
    title: "Mission: Impossible - Dead Reckoning Part One",
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 4,
    title: "Guardians of the Galaxy Vol. 3",
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 5,
    title: "The Super Mario Bros. Movie",
    poster: "/placeholder.svg?height=400&width=300",
  },
  {
    id: 6,
    title: "Spider-Man: Across the Spider-Verse",
    poster: "/placeholder.svg?height=400&width=300",
  },
];

export function MovieShowcase() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 p-8">
        {movies.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-center">
              <p className="text-white text-center p-4 font-bold">
                {movie.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
