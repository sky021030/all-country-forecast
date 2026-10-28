"use client";

import { useEffect, type CSSProperties } from "react";

export function VirtualMotion() {
  useEffect(() => {
    let frame = 0;
    const update = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        document.documentElement.style.setProperty("--virtual-x", x.toFixed(3));
        document.documentElement.style.setProperty("--virtual-y", y.toFixed(3));
      });
    };
    window.addEventListener("pointermove", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", update);
    };
  }, []);

  return (
    <div className="virtual-motion-layer" aria-hidden="true">
      {Array.from({ length: 18 }, (_, index) => (
        <i key={index} style={{
          "--particle-x": `${(index * 37 + 9) % 100}%`,
          "--particle-y": `${(index * 23 + 12) % 92}%`,
          "--particle-delay": `${(index % 7) * -0.8}s`,
        } as CSSProperties} />
      ))}
    </div>
  );
}
