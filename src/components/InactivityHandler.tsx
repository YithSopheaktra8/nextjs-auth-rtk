"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function InactivityHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const timer = useRef<NodeJS.Timeout | null>(null);

  const logout = () => {
    fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        router.push("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(logout, 300000); // 5 minutes
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer(); // Start timer initially

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return <>{children}</>;
}
