import React, { useEffect, useRef, useState } from "react";
import { searchPexelsVideos, searchUnsplashPhotos, type MediaItem } from "../lib/media";
import { cn } from "../lib/utils";

type Props = {
  query: string;
  fallbackQuery?: string;
  className?: string;
  overlayClassName?: string;
  children?: React.ReactNode;
  posterOnly?: boolean;
};

function isCoarsePointer(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

export default function HeroVideo({
  query,
  fallbackQuery,
  className,
  overlayClassName,
  children,
  posterOnly = false,
}: Props) {
  const [video, setVideo] = useState<MediaItem | null>(null);
  const [poster, setPoster] = useState<MediaItem | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Pull poster (still) first so the hero always paints; mobile/coarse pointers stay on still to save data.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stills = await searchUnsplashPhotos(fallbackQuery || query, 3);
      if (!cancelled && stills.length) setPoster(stills[0]);
    })();
    return () => {
      cancelled = true;
    };
  }, [query, fallbackQuery]);

  useEffect(() => {
    if (posterOnly) return;
    if (typeof window !== "undefined" && isCoarsePointer()) return;
    let cancelled = false;
    (async () => {
      const vids = await searchPexelsVideos(query, 5);
      if (cancelled) return;
      if (vids.length) setVideo(vids[0]);
    })();
    return () => {
      cancelled = true;
    };
  }, [query, posterOnly]);

  const showVideo = video && !videoFailed;

  if (!poster && !showVideo) {
    return <div className={cn("absolute inset-0", className)} aria-hidden="true" />;
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      {poster && (
        <img
          src={poster.url}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
        />
      )}
      {showVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={video!.url}
          poster={poster?.url || video!.thumb}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoFailed(true)}
        />
      )}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-brand-900/70 via-brand-900/55 to-brand-900/85",
          overlayClassName,
        )}
      />
      {children}
      {(showVideo ? video : poster) && (
        <a
          href={(showVideo ? video! : poster!).credit.sourceUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="absolute bottom-2 right-2 z-10 rounded-full bg-black/55 px-3 py-1 text-[10px] font-medium text-white/85 backdrop-blur hover:bg-black/75"
        >
          {showVideo ? "Video" : "Photo"} by{" "}
          <span className="underline-offset-2 hover:underline">
            {(showVideo ? video! : poster!).credit.name}
          </span>{" "}
          on {(showVideo ? video! : poster!).credit.sourceName}
        </a>
      )}
    </div>
  );
}
