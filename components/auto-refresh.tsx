"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const REFRESH_SECONDS = 60;

export function AutoRefresh() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(REFRESH_SECONDS);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          router.refresh();
          return REFRESH_SECONDS;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [router]);

  return <span className="refresh-chip">次の更新まで {seconds}秒</span>;
}
