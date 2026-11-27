"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { PLATFORMS, type PlatformId } from "@/src/data/presets";

export function PlatformHandoff({ onSelect }: { onSelect: (id: PlatformId) => void }) {
  const params = useSearchParams();
  const requested = params?.get("platform") ?? null;
  const consumed = useRef<string | null>(null);
  useEffect(() => {
    const platform = PLATFORMS.find((entry) => entry.id === requested);
    if (platform && consumed.current !== requested) {
      consumed.current = requested;
      onSelect(platform.id);
    }
  }, [requested, onSelect]);
  return null;
}
