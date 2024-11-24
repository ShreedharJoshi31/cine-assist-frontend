"use client";

import { useState, useEffect } from "react";
import { createEvents } from "@/lib/events";

const Loader = () => (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
    <div className="relative">
      {/* <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-black animate-spin"></div> */}
      {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-t-8 border-b-8 border-gray-300 animate-spin animation-delay-150"></div> */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-t-8 border-b-8 border-gray-300 animate-spin animation-delay-300"></div>
    </div>
  </div>
);

// Create a custom events handler
const events = createEvents();

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show loader before navigation starts
    const handleStart = () => {
      setLoading(true);
    };

    // Hide loader when navigation completes
    const handleStop = () => {
      setLoading(false);
    };

    events.on("routeChangeStart", handleStart);
    events.on("routeChangeComplete", handleStop);
    events.on("routeChangeError", handleStop);

    return () => {
      events.off("routeChangeStart", handleStart);
      events.off("routeChangeComplete", handleStop);
      events.off("routeChangeError", handleStop);
    };
  }, []);

  return (
    <>
      {loading && <Loader />}
      {children}
    </>
  );
}
