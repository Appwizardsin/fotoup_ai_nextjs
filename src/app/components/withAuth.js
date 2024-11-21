"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { users } from "@/services/api";

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            router.push("/login");
            return;
          }

          const userProfile = await users.getProfile();
          setUser(userProfile);
          setLoading(false);
        } catch (err) {
          console.error("Auth error:", err);
          localStorage.removeItem("token");
          router.push("/login");
        }
      };

      checkAuth();
    }, [router]);

    // if (loading) {
    //   return (
    //     <div className="min-h-screen flex items-center justify-center">
    //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    //     </div>
    //   );
    // }

    return <Component {...props} user={user} />;
  };
}
