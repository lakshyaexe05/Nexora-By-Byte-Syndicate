import React, { useEffect, useRef, useState } from 'react';

interface CinematicPortalProps {
  className?: string;
}

export const CinematicPortal: React.FC<CinematicPortalProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isReducedMotion || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Normalized coordinates from -1 to 1 relative to container center
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isReducedMotion]);

  // Interactive Cosmic Vortex & Floating Embers Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 600);
    let height = (canvas.height = 600);

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = 600;
      height = canvas.height = 600;
    };
    resize();

    // Particle system: swirling portal stars and rising atmospheric embers
    interface Particle {
      x: number;
      y: number;
      radius: number;
      angle: number;
      dist: number;
      speed: number;
      color: string;
      alpha: number;
      type: 'vortex' | 'ember';
      vy?: number;
    }

    const particles: Particle[] = [];
    const particleCount = isReducedMotion ? 25 : 85;

    for (let i = 0; i < particleCount; i++) {
      const isEmber = i % 3 === 0;
      particles.push({
        x: width / 2,
        y: height / 2,
        radius: isEmber ? Math.random() * 1.8 + 0.8 : Math.random() * 1.5 + 0.5,
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * 180 + 20,
        speed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        color: Math.random() > 0.4 ? '#B4F000' : Math.random() > 0.5 ? '#38BDF8' : '#FFFFFF',
        alpha: Math.random() * 0.7 + 0.2,
        type: isEmber ? 'ember' : 'vortex',
        vy: -(Math.random() * 0.4 + 0.2),
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // 1. Deep Celestial Vortex Gradient Core
      const coreGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 210);
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      coreGrad.addColorStop(0.15, 'rgba(180, 240, 0, 0.85)');
      coreGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.65)');
      coreGrad.addColorStop(0.65, 'rgba(30, 41, 75, 0.5)');
      coreGrad.addColorStop(0.95, 'rgba(10, 15, 30, 0.2)');
      coreGrad.addColorStop(1, 'rgba(6, 8, 13, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 210, 0, Math.PI * 2);
      ctx.fill();

      // 2. Swirling Light Spirals inside the vortex
      const spiralCount = 3;
      for (let s = 0; s < spiralCount; s++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(time * (s % 2 === 0 ? 0.3 : -0.2) + (s * Math.PI * 2) / spiralCount);
        const spiralGrad = ctx.createLinearGradient(-150, 0, 150, 0);
        spiralGrad.addColorStop(0, 'transparent');
        spiralGrad.addColorStop(0.5, s === 0 ? 'rgba(180, 240, 0, 0.25)' : 'rgba(56, 189, 248, 0.3)');
        spiralGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = spiralGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, 160 + Math.sin(time + s) * 10, 45, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Render Particles (Swirling vortex stars & rising atmospheric embers)
      particles.forEach((p) => {
        if (p.type === 'vortex') {
          p.angle += p.speed;
          // Inward / outward drift
          const currentDist = p.dist + Math.sin(time + p.angle * 2) * 8;
          const px = cx + Math.cos(p.angle) * currentDist;
          const py = cy + Math.sin(p.angle) * (currentDist * 0.92);

          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * (0.6 + Math.sin(time * 2 + p.angle) * 0.4);
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
        } else {
          // Floating ember moving gently upward
          p.angle += 0.005;
          p.y += p.vy || -0.3;
          p.x += Math.sin(p.y * 0.02 + time) * 0.4;

          if (p.y < 40) {
            p.y = height - 80;
            p.x = cx + (Math.random() - 0.5) * 320;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * (0.5 + Math.sin(time + p.y) * 0.3);
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
        }
      });

      if (!isReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isReducedMotion]);

  // Subtle parallax offsets
  const portalX = isReducedMotion ? 0 : mousePos.x * 12;
  const portalY = isReducedMotion ? 0 : mousePos.y * 10;
  const foregroundX = isReducedMotion ? 0 : -mousePos.x * 18;
  const foregroundY = isReducedMotion ? 0 : -mousePos.y * 12;

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[620px] aspect-[4/4] select-none flex items-center justify-center overflow-visible ${className}`}
    >
      {/* Background Deep Cosmic Nebulae Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#38BDF8]/15 via-[#B4F000]/12 to-indigo-950/30 blur-[130px] mix-blend-screen animate-pulse" />
      </div>

      {/* Volumetric God-Rays Beaming from Center */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out flex items-center justify-center"
        style={{ transform: `translate3d(${portalX * 0.4}px, ${portalY * 0.4}px, 0)` }}
      >
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(180,240,0,0.12)_0%,_rgba(56,189,248,0.08)_35%,_transparent_70%)]" />
      </div>

      {/* Layer 1: Distant Jagged Mountain Ridge Silhouettes (Background) */}
      <div
        className="absolute inset-x-0 bottom-4 h-48 pointer-events-none transition-transform duration-500 ease-out z-0"
        style={{ transform: `translate3d(${portalX * 0.3}px, ${portalY * 0.2}px, 0)` }}
      >
        <svg
          viewBox="0 0 600 200"
          className="w-full h-full text-[#080C16] preserve-3d"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="distMountainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#131B2E" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#06080D" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <path
            d="M0,200 L0,140 L35,110 L90,145 L150,90 L210,130 L270,75 L330,120 L400,65 L470,115 L530,85 L600,135 L600,200 Z"
            fill="url(#distMountainGrad)"
          />
        </svg>
      </div>

      {/* Layer 2: The Monumental Futuristic Sci-Fi Stargate Portal (Main Subject) */}
      <div
        className="relative w-[92%] h-[92%] flex items-center justify-center transition-transform duration-300 ease-out z-10"
        style={{ transform: `translate3d(${portalX}px, ${portalY}px, 0)` }}
      >
        {/* Active Cosmic Vortex Canvas inside opening */}
        <div className="absolute w-[68%] h-[68%] rounded-full overflow-hidden shadow-[inset_0_0_60px_rgba(180,240,0,0.4),0_0_80px_rgba(56,189,248,0.3)]">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover scale-110"
          />
          {/* Inner atmospheric horizon haze */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080D]/60 via-transparent to-black/20 pointer-events-none" />
        </div>

        {/* Outer Heavy Sci-Fi Portal Ring (Architectural Titanium Bevels) */}
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full relative z-10 drop-shadow-[0_0_45px_rgba(180,240,0,0.3)]"
        >
          <defs>
            {/* Dark Metallic Texture Gradients */}
            <linearGradient id="metalBevelDark" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2A3347" />
              <stop offset="35%" stopColor="#141A29" />
              <stop offset="70%" stopColor="#0B0F19" />
              <stop offset="100%" stopColor="#1E2738" />
            </linearGradient>

            <linearGradient id="metalBevelInner" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3E4C66" />
              <stop offset="50%" stopColor="#151D2B" />
              <stop offset="100%" stopColor="#0B101C" />
            </linearGradient>

            {/* Glowing Conduit Gradient */}
            <linearGradient id="conduitGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#B4F000" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            {/* Radial Rim Highlight */}
            <radialGradient id="rimGlow" cx="50%" cy="50%" r="50%">
              <stop offset="85%" stopColor="transparent" />
              <stop offset="94%" stopColor="rgba(180, 240, 0, 0.4)" />
              <stop offset="100%" stopColor="rgba(56, 189, 248, 0.6)" />
            </radialGradient>
          </defs>

          {/* 1. Outer Massive Structural Rim */}
          <circle
            cx="250"
            cy="250"
            r="234"
            fill="none"
            stroke="url(#metalBevelDark)"
            strokeWidth="14"
          />

          {/* Outer Segmented Grip Plates */}
          <circle
            cx="250"
            cy="250"
            r="244"
            fill="none"
            stroke="#101726"
            strokeWidth="6"
            strokeDasharray="24 18"
          />

          {/* 2. Conduit Power Ring (Electric Lime / Cyan Conduits) */}
          <circle
            cx="250"
            cy="250"
            r="224"
            fill="none"
            stroke="url(#conduitGlow)"
            strokeWidth="3.5"
            strokeDasharray="45 15 15 15 70 20"
            className="animate-pulse"
          />

          {/* 3. Deep Beveled Middle Ring */}
          <circle
            cx="250"
            cy="250"
            r="205"
            fill="none"
            stroke="url(#metalBevelInner)"
            strokeWidth="24"
          />

          {/* Engraved Hydraulic Joint Accents around the ring */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 250 250)`}>
              {/* Outer structural locking clamp */}
              <rect
                x="245"
                y="14"
                width="10"
                height="16"
                rx="2"
                fill="#2E3A52"
                stroke="#3E4C66"
                strokeWidth="1"
              />
              {/* Inner luminous emitter nodule */}
              <circle
                cx="250"
                cy="38"
                r="3.5"
                fill={deg % 60 === 0 ? '#B4F000' : '#38BDF8'}
                filter="drop-shadow(0 0 5px rgba(180,240,0,0.8))"
              />
              {/* Radial tick markers */}
              <line
                x1="250"
                y1="52"
                x2="250"
                y2="64"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.5"
              />
            </g>
          ))}

          {/* 4. Rotating Gyroscopic Tech Grid Ring */}
          <circle
            cx="250"
            cy="250"
            r="188"
            fill="none"
            stroke="rgba(180, 240, 0, 0.5)"
            strokeWidth="1.5"
            strokeDasharray="8 12"
            className={isReducedMotion ? '' : 'animate-spin'}
            style={{ animationDuration: '90s' }}
          />

          {/* 5. Inner Horizon Aperture Blade Rim */}
          <circle
            cx="250"
            cy="250"
            r="174"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeDasharray="90 30"
          />
          <circle
            cx="250"
            cy="250"
            r="170"
            fill="none"
            stroke="url(#rimGlow)"
            strokeWidth="6"
          />

          {/* Inner Light Flare Nodes */}
          <circle cx="250" cy="80" r="4.5" fill="#B4F000" className="drop-shadow-[0_0_8px_#B4F000]" />
          <circle cx="80" cy="250" r="4.5" fill="#38BDF8" className="drop-shadow-[0_0_8px_#38BDF8]" />
          <circle cx="420" cy="250" r="4.5" fill="#38BDF8" className="drop-shadow-[0_0_8px_#38BDF8]" />
          <circle cx="250" cy="420" r="4.5" fill="#B4F000" className="drop-shadow-[0_0_8px_#B4F000]" />
        </svg>

        {/* Lower Atmospheric Horizon Light Bleed */}
        <div className="absolute bottom-6 w-3/4 h-16 bg-gradient-to-t from-[#B4F000]/25 via-sky-400/15 to-transparent blur-xl pointer-events-none" />
      </div>

      {/* Layer 3: Dramatic Rocky Terrain & Cliffs (Midground) */}
      <div
        className="absolute inset-x-0 bottom-0 h-44 pointer-events-none transition-transform duration-300 ease-out z-20"
        style={{ transform: `translate3d(${foregroundX * 0.5}px, ${foregroundY * 0.3}px, 0)` }}
      >
        <svg
          viewBox="0 0 600 180"
          className="w-full h-full text-[#080B14]"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="midRockGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#151C2C" />
              <stop offset="100%" stopColor="#06080D" />
            </linearGradient>
          </defs>
          {/* Jagged rocky ground ridges */}
          <path
            d="M0,180 L0,110 L45,85 L105,125 L165,70 L230,110 L310,65 L380,105 L450,55 L520,95 L600,60 L600,180 Z"
            fill="url(#midRockGrad)"
          />
          {/* Electric lime / cyan rim highlights reflecting off cliff edges */}
          <path
            d="M165,70 L230,110 M310,65 L380,105 M450,55 L520,95"
            stroke="rgba(180, 240, 0, 0.45)"
            strokeWidth="1.8"
            fill="none"
          />
        </svg>
      </div>

      {/* Layer 4: Foreground Heavy Boulders & Explorer Human Silhouette (Extreme Sense of Scale) */}
      <div
        className="absolute inset-x-0 bottom-0 h-36 pointer-events-none transition-transform duration-200 ease-out z-30"
        style={{ transform: `translate3d(${foregroundX}px, ${foregroundY}px, 0)` }}
      >
        <svg
          viewBox="0 0 600 150"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="foreRockGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0C101A" />
              <stop offset="100%" stopColor="#040508" />
            </linearGradient>
          </defs>

          {/* Foreground rocky ledge (left and right) */}
          <path
            d="M0,150 L0,70 L60,45 L130,85 L190,40 L260,80 L290,150 Z"
            fill="url(#foreRockGrad)"
          />
          <path
            d="M310,150 L340,75 L410,40 L480,80 L540,35 L600,60 L600,150 Z"
            fill="url(#foreRockGrad)"
          />

          {/* Central Cliff Overlook where the traveler stands */}
          <path
            d="M240,150 L270,70 L300,65 L330,70 L360,150 Z"
            fill="#05070B"
          />

          {/* Rim light highlight along top edge of rocks */}
          <path
            d="M270,70 L300,65 L330,70"
            stroke="#B4F000"
            strokeWidth="1.5"
            strokeOpacity="0.7"
            fill="none"
          />

          {/* Lone Human Explorer Silhouette (Standing on cliff, looking up at the monumental gateway) */}
          <g transform="translate(294, 28) scale(0.72)">
            {/* Head / Helmet with subtle visor glint */}
            <ellipse cx="8" cy="8" rx="4" ry="4.5" fill="#040609" />
            <ellipse cx="9" cy="8" rx="1.5" ry="1" fill="#38BDF8" opacity="0.85" />
            
            {/* Neck & Shoulders */}
            <path d="M4,13 L12,13 L15,20 L1,20 Z" fill="#040609" />
            
            {/* Torso & Traveler Jacket */}
            <path d="M1,20 L15,20 L13,38 L3,38 Z" fill="#040609" />
            
            {/* Backpack / Gear Pack on back */}
            <rect x="-1" y="21" width="4" height="13" rx="2" fill="#020305" />
            
            {/* Arms at side / slight gesture */}
            <path d="M2,20 L-1,34 L1,35 L4,22 Z" fill="#040609" />
            <path d="M14,20 L17,34 L15,35 L12,22 Z" fill="#040609" />
            
            {/* Legs standing firm on cliff rock */}
            <path d="M3,38 L1,54 L4,54 L7,38 Z" fill="#040609" />
            <path d="M9,38 L12,54 L15,54 L13,38 Z" fill="#040609" />
            
            {/* Subtle portal rim light reflecting on explorer silhouette */}
            <path
              d="M13,8 C13,4 10,3 8,3 M15,20 L15,38 L13,54"
              stroke="#B4F000"
              strokeWidth="0.8"
              strokeOpacity="0.8"
              fill="none"
            />
          </g>
        </svg>

        {/* Ambient Ground Mist / Volumetric Fog */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#06080D] via-[#06080D]/80 to-transparent pointer-events-none" />
      </div>

    </div>
  );
};
