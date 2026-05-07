"use client";

import { useMemo } from "react";
import { HorseKeyedVideo } from "@/components/horse-keyed-video";

type Props = {
  className?: string;
};

export function MechaHorseImage({ className }: Props) {
  const videoSrc = useMemo(() => "/horse/horse-run.mp4", []);

  return (
    <div className={["horse-video-only", className ?? ""].join(" ")} aria-hidden="true">
      <HorseKeyedVideo
        className="horse-video"
        src={videoSrc}
        flipX
        whiteThreshold={232}
        whiteTolerance={34}
      />
    </div>
  );
}

