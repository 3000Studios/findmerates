import React, { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";

type WallpaperVariant =
  | "home"
  | "rates"
  | "stories"
  | "calculators"
  | "pro"
  | "signup"
  | "default";

function pickVariant(pathname: string): WallpaperVariant {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/rates")) return "rates";
  if (pathname.startsWith("/stories")) return "stories";
  if (pathname.startsWith("/calculators")) return "calculators";
  if (pathname.startsWith("/pro")) return "pro";
  if (pathname.startsWith("/signup")) return "signup";
  return "default";
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function project(
  x: number,
  y: number,
  z: number,
  cx: number,
  cy: number,
  scale: number,
) {
  const depth = 3.25;
  const p = 1 / (depth - z);
  return { x: cx + x * p * scale, y: cy + y * p * scale, p };
}

function rotateY(x: number, z: number, a: number) {
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  return { x: x * ca + z * sa, z: -x * sa + z * ca };
}

function rotateX(y: number, z: number, a: number) {
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  return { y: y * ca - z * sa, z: y * sa + z * ca };
}

function buildObject(variant: WallpaperVariant) {
  // Return points + edges in normalized 3D space.
  if (variant === "rates") {
    // Bar chart wireframe
    const points: Array<[number, number, number]> = [];
    const edges: Array<[number, number]> = [];
    const bars = [0.6, 0.85, 0.5, 0.95, 0.7];
    let idx = 0;
    for (let i = 0; i < bars.length; i++) {
      const x0 = -1.1 + i * 0.55;
      const x1 = x0 + 0.32;
      const y0 = -0.9;
      const y1 = y0 + bars[i] * 1.6;
      const z0 = -0.25;
      const z1 = 0.25;
      const cube: Array<[number, number, number]> = [
        [x0, y0, z0],
        [x1, y0, z0],
        [x1, y1, z0],
        [x0, y1, z0],
        [x0, y0, z1],
        [x1, y0, z1],
        [x1, y1, z1],
        [x0, y1, z1],
      ];
      points.push(...cube);
      const e = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7],
      ] as Array<[number, number]>;
      e.forEach(([a, b]) => edges.push([idx + a, idx + b]));
      idx += 8;
    }
    return { points, edges };
  }

  if (variant === "calculators") {
    // Calculator slab
    const points: Array<[number, number, number]> = [
      [-1.1, -0.9, -0.25],
      [1.1, -0.9, -0.25],
      [1.1, 0.9, -0.25],
      [-1.1, 0.9, -0.25],
      [-1.1, -0.9, 0.25],
      [1.1, -0.9, 0.25],
      [1.1, 0.9, 0.25],
      [-1.1, 0.9, 0.25],
      // screen inset
      [-0.75, 0.55, 0.26],
      [0.75, 0.55, 0.26],
      [0.75, 0.05, 0.26],
      [-0.75, 0.05, 0.26],
    ];
    const edges: Array<[number, number]> = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
      [8, 9],
      [9, 10],
      [10, 11],
      [11, 8],
    ];
    return { points, edges };
  }

  if (variant === "stories") {
    // Newspaper-like folded rectangle
    const points: Array<[number, number, number]> = [
      [-1.15, -0.85, 0],
      [1.15, -0.85, 0],
      [1.15, 0.85, 0],
      [-1.15, 0.85, 0],
      [0.0, -0.85, 0.35],
      [0.0, 0.85, 0.35],
    ];
    const edges: Array<[number, number]> = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [1, 4],
      [2, 5],
      [4, 5],
      [4, 0],
      [5, 3],
    ];
    return { points, edges };
  }

  if (variant === "pro") {
    // Credit-card slab
    const points: Array<[number, number, number]> = [
      [-1.2, -0.65, -0.2],
      [1.2, -0.65, -0.2],
      [1.2, 0.65, -0.2],
      [-1.2, 0.65, -0.2],
      [-1.2, -0.65, 0.2],
      [1.2, -0.65, 0.2],
      [1.2, 0.65, 0.2],
      [-1.2, 0.65, 0.2],
      // chip
      [-0.75, 0.2, 0.21],
      [-0.25, 0.2, 0.21],
      [-0.25, -0.1, 0.21],
      [-0.75, -0.1, 0.21],
    ];
    const edges: Array<[number, number]> = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
      [8, 9],
      [9, 10],
      [10, 11],
      [11, 8],
    ];
    return { points, edges };
  }

  if (variant === "signup") {
    // Shield outline
    const points: Array<[number, number, number]> = [];
    const edges: Array<[number, number]> = [];
    const steps = 18;
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const x = Math.cos(t) * 0.95;
      const y = Math.sin(t) * 0.8 + 0.15;
      const z = Math.sin(t * 2) * 0.12;
      points.push([x, y, z]);
      edges.push([i, (i + 1) % steps]);
    }
    points.push([0, -1.1, 0.18]);
    edges.push([Math.floor(steps * 0.75), steps]);
    edges.push([Math.floor(steps * 0.25), steps]);
    return { points, edges };
  }

  // Default/home: torus-ish loop (finance loop)
  const points: Array<[number, number, number]> = [];
  const edges: Array<[number, number]> = [];
  const ring = 42;
  for (let i = 0; i < ring; i++) {
    const t = (i / ring) * Math.PI * 2;
    const x = Math.cos(t) * 1.05;
    const y = Math.sin(t) * 0.75;
    const z = Math.sin(t * 2) * 0.35;
    points.push([x, y, z]);
    edges.push([i, (i + 1) % ring]);
  }
  // add an arrow cue
  points.push([1.3, 0.0, 0.0]);
  points.push([0.98, 0.18, 0.0]);
  points.push([0.98, -0.18, 0.0]);
  edges.push([ring, ring + 1], [ring, ring + 2], [ring + 1, ring + 2]);
  return { points, edges };
}

export default function LiveWallpaper() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const location = useLocation();

  const variant = useMemo(() => pickVariant(location.pathname), [location.pathname]);
  const obj = useMemo(() => buildObject(variant), [variant]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      w = Math.max(1, window.innerWidth);
      h = Math.max(1, window.innerHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / Math.max(1, w)) * 2 - 1;
      mouseRef.current.y = (e.clientY / Math.max(1, h)) * 2 - 1;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse, { passive: true });

    let t0 = performance.now();
    let rotX = 0;
    let rotY = 0;

    const render = (t: number) => {
      const dt = Math.min(0.032, (t - t0) / 1000);
      t0 = t;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      rotY = lerp(rotY, mx * 0.55, 0.04);
      rotX = lerp(rotX, -my * 0.35, 0.04);

      ctx.clearRect(0, 0, w, h);

      // background glow gradients (behind)
      const g0 = ctx.createRadialGradient(w * 0.25, h * 0.25, 0, w * 0.25, h * 0.25, Math.min(w, h) * 0.6);
      g0.addColorStop(0, "rgba(10,180,214,0.14)");
      g0.addColorStop(1, "rgba(10,180,214,0)");
      ctx.fillStyle = g0;
      ctx.fillRect(0, 0, w, h);

      const g1 = ctx.createRadialGradient(w * 0.78, h * 0.2, 0, w * 0.78, h * 0.2, Math.min(w, h) * 0.55);
      g1.addColorStop(0, "rgba(24,214,123,0.10)");
      g1.addColorStop(1, "rgba(24,214,123,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(w * 0.78, h * 0.8, 0, w * 0.78, h * 0.8, Math.min(w, h) * 0.6);
      g2.addColorStop(0, "rgba(245,176,42,0.10)");
      g2.addColorStop(1, "rgba(245,176,42,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // object placement (always behind content)
      const cx = w * 0.82;
      const cy = h * 0.34;
      const scale = Math.min(w, h) * 0.22;

      // animate
      const spin = t * 0.00045;
      const ax = rotX + Math.sin(spin * 0.7) * 0.06;
      const ay = rotY + spin;

      // project points
      const pts2 = obj.points.map(([x0, y0, z0]) => {
        const ry = rotateY(x0, z0, ay);
        const rx = rotateX(y0, ry.z, ax);
        return project(ry.x, rx.y, rx.z, cx, cy, scale);
      });

      // edges
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.beginPath();
      for (const [a, b] of obj.edges) {
        const p0 = pts2[a];
        const p1 = pts2[b];
        if (!p0 || !p1) continue;
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
      }
      ctx.stroke();

      // points glow
      for (const p of pts2) {
        const r = 1.2 + p.p * 1.8;
        ctx.fillStyle = "rgba(255,255,255,0.28)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // subtle drift
      rotY += dt * 0.04;

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [obj.edges, obj.points]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}

