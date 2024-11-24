"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Loader } from "lucide-react";

export const ProtectedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <Loader className="justify-self-center h-6 w-6 animate-spin " />;
  }

  return isAuthenticated ? <>{children}</> : null;
};
