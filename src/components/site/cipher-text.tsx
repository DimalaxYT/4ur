"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const GLYPHS = "01ABCDEF#/_<>[]*+-=";

interface CipherTextProps {
  text: string;
  className?: string;
  speedMs?: number;
  replayOnHover?: boolean;
}

/**
 * Texte chiffré qui se décrypte caractère par caractère à l'entrée dans l'écran
 * (inspiré de React Bits `DecryptedText` — signature cyber 4UR).
 */
export function CipherText({
  text,
  className,
  speedMs = 24,
  replayOnHover = true,
}: CipherTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);
  const runningRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scramble = useCallback(() => {
    if (runningRef.current) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    runningRef.current = true;
    let step = 0;

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      step += 1.35;
      const revealed = Math.floor(step);
      if (revealed >= text.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        runningRef.current = false;
        setDisplay(text);
        return;
      }

      let next = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]!;
        if (ch === " " || i < revealed) {
          next += ch;
        } else {
          next += GLYPHS[(i * 7 + revealed * 3) % GLYPHS.length];
        }
      }
      setDisplay(next);
    }, speedMs);
  }, [text, speedMs]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          scramble();
          io.disconnect();
        }
      },
      { rootMargin: "-20px" }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
      runningRef.current = false;
    };
  }, [scramble]);

  return (
    <span
      ref={ref}
      onMouseEnter={replayOnHover ? scramble : undefined}
      className={cn("inline-block", className)}
    >
      {display}
    </span>
  );
}
