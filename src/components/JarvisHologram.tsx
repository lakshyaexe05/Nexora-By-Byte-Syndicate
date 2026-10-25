import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { JarvisState } from '../types';

export interface JarvisHologramProps {
  size?: 'sm' | 'md' | 'lg' | 'hero' | number;
  state?: JarvisState;
  audioLevel?: number; // 0.0 to 1.0 (driven by voice amplitude)
  interactiveParallax?: boolean;
  className?: string;
  onClick?: () => void;
  showStatusBadge?: boolean;
}

/**
 * JARVIS Hologram
 * Intricate 3D orange-gold holographic intelligence featuring:
 * - Concentric multi-axis orbital rings with segmented technical tracks & radial markings
 * - Multi-tier amber particle systems (orbital belt, spherical grid lattice, core flux)
 * - Multi-layer pulsing central energy core with radiating acoustic waves
 * - Dynamic scanning arcs and traveling data signals
 * - Real-time audio-reactivity (core amplitude scaling, pulse brightness, rotation acceleration)
 * - Desktop pointer parallax interaction and GPU-efficient Three.js lifecycle
 */
export const JarvisHologram: React.FC<JarvisHologramProps> = ({
  size = 'hero',
  state = 'idle',
  audioLevel = 0,
  interactiveParallax = true,
  className = '',
  onClick,
  showStatusBadge = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<JarvisState>(state);
  const audioLevelRef = useRef<number>(audioLevel);
  const targetAudioRef = useRef<number>(audioLevel);

  stateRef.current = state;
  targetAudioRef.current = audioLevel;

  // Resolve pixel dimensions
  let pixelSize = 340;
  if (typeof size === 'number') {
    pixelSize = size;
  } else {
    switch (size) {
      case 'sm':
        pixelSize = 88;
        break;
      case 'md':
        pixelSize = 160;
        break;
      case 'lg':
        pixelSize = 260;
        break;
      case 'hero':
      default:
        pixelSize = 380;
        break;
    }
  }

  const isMiniature = pixelSize <= 120;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect software rendering
    const isSoftwareGl = (() => {
      try {
        const testCanvas = document.createElement('canvas');
        const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : (gl as any).RENDERER;
        const gpu = String((gl as any).getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const width = pixelSize;
    const height = pixelSize;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // Master Hologram Group
    const hologramGroup = new THREE.Group();
    scene.add(hologramGroup);

    // DISPOSAL REGISTRY
    const disposables: { geometries: THREE.BufferGeometry[]; materials: THREE.Material[]; textures: THREE.Texture[] } = {
      geometries: [],
      materials: [],
      textures: [],
    };

    const regGeom = <T extends THREE.BufferGeometry>(g: T): T => {
      disposables.geometries.push(g);
      return g;
    };
    const regMat = <T extends THREE.Material>(m: T): T => {
      disposables.materials.push(m);
      return m;
    };

    // 3. COLOR PALETTE DEFINITIONS
    const COLOR_CORE_WHITE = new THREE.Color(0xfff9e6);
    const COLOR_AMBER_BRIGHT = new THREE.Color(0xffa726);
    const COLOR_GOLD_PALE = new THREE.Color(0xffd54f);
    const COLOR_ORANGE_MOLTEN = new THREE.Color(0xff5722);
    const COLOR_DEEP_AMBER = new THREE.Color(0xe65100);

    // Helper: Procedural Glow Texture for Particles & Core
    const createGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.25, 'rgba(255, 179, 0, 0.9)');
        gradient.addColorStop(0.6, 'rgba(255, 87, 34, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      disposables.textures.push(tex);
      return tex;
    };

    const glowTexture = createGlowTexture();

    // 4. CENTRAL ENERGY CORE
    const coreGroup = new THREE.Group();
    hologramGroup.add(coreGroup);

    // 4.1 Inner Bright Core Sphere
    const innerCoreGeom = regGeom(new THREE.SphereGeometry(isMiniature ? 0.22 : 0.26, 32, 32));
    const innerCoreMat = regMat(
      new THREE.MeshBasicMaterial({
        color: COLOR_CORE_WHITE,
        transparent: true,
        opacity: 0.95,
      })
    );
    const innerCoreMesh = new THREE.Mesh(innerCoreGeom, innerCoreMat);
    coreGroup.add(innerCoreMesh);

    // 4.2 Core Plasma Wireframe / Hex Cage
    const cageGeom = regGeom(new THREE.IcosahedronGeometry(0.38, isMiniature ? 1 : 2));
    const cageMat = regMat(
      new THREE.MeshBasicMaterial({
        color: COLOR_AMBER_BRIGHT,
        wireframe: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      })
    );
    const cageMesh = new THREE.Mesh(cageGeom, cageMat);
    coreGroup.add(cageMesh);

    // 4.3 Outward Expanding Pulse Wave Rings
    const waveCount = isMiniature ? 2 : 4;
    const waveRings: { mesh: THREE.Mesh; scale: number; baseSpeed: number }[] = [];
    for (let i = 0; i < waveCount; i++) {
      const ringGeom = regGeom(new THREE.RingGeometry(0.38, 0.41, 48));
      const ringMat = regMat(
        new THREE.MeshBasicMaterial({
          color: COLOR_GOLD_PALE,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
        })
      );
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      coreGroup.add(ringMesh);
      waveRings.push({
        mesh: ringMesh,
        scale: 1 + i * (1.2 / waveCount),
        baseSpeed: 0.6 + i * 0.1,
      });
    }

    // 5. CONCENTRIC ORBITAL RINGS & SEGMENTED TECHNICAL TRACKS
    const ringsGroup = new THREE.Group();
    hologramGroup.add(ringsGroup);

    interface OrbitalRing {
      group: THREE.Group;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
    }
    const orbitalRings: OrbitalRing[] = [];

    // Helper: Segmented Circle Arc
    const createSegmentedArc = (radius: number, segments: number, gapRatio: number = 0.2) => {
      const geom = new THREE.BufferGeometry();
      const positions: number[] = [];
      const totalSteps = segments * 32;
      const anglePerSegment = (Math.PI * 2) / segments;
      const activeAngle = anglePerSegment * (1 - gapRatio);

      for (let s = 0; s < segments; s++) {
        const startAngle = s * anglePerSegment;
        const steps = 24;
        for (let i = 0; i < steps; i++) {
          const a1 = startAngle + (i / steps) * activeAngle;
          const a2 = startAngle + ((i + 1) / steps) * activeAngle;
          positions.push(Math.cos(a1) * radius, Math.sin(a1) * radius, 0);
          positions.push(Math.cos(a2) * radius, Math.sin(a2) * radius, 0);
        }
      }

      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      return regGeom(geom);
    };

    // Helper: Radial Technical Tick Marks
    const createTickMarks = (radius: number, tickCount: number, tickLength: number = 0.05) => {
      const geom = new THREE.BufferGeometry();
      const positions: number[] = [];
      for (let i = 0; i < tickCount; i++) {
        const angle = (i / tickCount) * Math.PI * 2;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        positions.push(cos * radius, sin * radius, 0);
        positions.push(cos * (radius + tickLength), sin * (radius + tickLength), 0);
      }
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      return regGeom(geom);
    };

    // 5.1 Ring Layer 1: Primary Equatorial Technical Track (Radius 0.72)
    {
      const rGroup = new THREE.Group();
      const arcGeom = createSegmentedArc(0.72, 4, 0.15);
      const arcMat = regMat(
        new THREE.LineBasicMaterial({
          color: COLOR_AMBER_BRIGHT,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
        })
      );
      rGroup.add(new THREE.LineSegments(arcGeom, arcMat));

      if (!isMiniature) {
        const ticksGeom = createTickMarks(0.74, 24, 0.035);
        const ticksMat = regMat(
          new THREE.LineBasicMaterial({
            color: COLOR_GOLD_PALE,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
          })
        );
        rGroup.add(new THREE.LineSegments(ticksGeom, ticksMat));
      }

      ringsGroup.add(rGroup);
      orbitalRings.push({ group: rGroup, rotSpeedX: 0.05, rotSpeedY: 0.35, rotSpeedZ: 0.08 });
    }

    // 5.2 Ring Layer 2: Inclined Polar Orbital Ring (Radius 0.95, Tilted 65 deg)
    {
      const rGroup = new THREE.Group();
      rGroup.rotation.x = THREE.MathUtils.degToRad(65);
      rGroup.rotation.z = THREE.MathUtils.degToRad(20);

      const arcGeom = createSegmentedArc(0.95, 6, 0.12);
      const arcMat = regMat(
        new THREE.LineBasicMaterial({
          color: COLOR_GOLD_PALE,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
        })
      );
      rGroup.add(new THREE.LineSegments(arcGeom, arcMat));

      // Orbiting node points on this ring
      const nodeCount = isMiniature ? 2 : 3;
      const nodeGeom = regGeom(new THREE.BufferGeometry());
      const nodePos = new Float32Array(nodeCount * 3);
      for (let i = 0; i < nodeCount; i++) {
        const a = (i / nodeCount) * Math.PI * 2;
        nodePos[i * 3] = Math.cos(a) * 0.95;
        nodePos[i * 3 + 1] = Math.sin(a) * 0.95;
        nodePos[i * 3 + 2] = 0;
      }
      nodeGeom.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
      const nodeMat = regMat(
        new THREE.PointsMaterial({
          color: COLOR_CORE_WHITE,
          size: isMiniature ? 0.06 : 0.09,
          map: glowTexture,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      rGroup.add(new THREE.Points(nodeGeom, nodeMat));

      ringsGroup.add(rGroup);
      orbitalRings.push({ group: rGroup, rotSpeedX: 0.2, rotSpeedY: -0.28, rotSpeedZ: -0.15 });
    }

    // 5.3 Ring Layer 3: Segmented Reticle Astrolabe (Radius 1.18, Tilted -40 deg)
    {
      const rGroup = new THREE.Group();
      rGroup.rotation.y = THREE.MathUtils.degToRad(-40);
      rGroup.rotation.x = THREE.MathUtils.degToRad(35);

      const arcGeom = createSegmentedArc(1.18, 8, 0.18);
      const arcMat = regMat(
        new THREE.LineBasicMaterial({
          color: COLOR_ORANGE_MOLTEN,
          transparent: true,
          opacity: 0.75,
          blending: THREE.AdditiveBlending,
        })
      );
      rGroup.add(new THREE.LineSegments(arcGeom, arcMat));

      if (!isMiniature) {
        const ticksGeom = createTickMarks(1.15, 36, -0.04);
        const ticksMat = regMat(
          new THREE.LineBasicMaterial({
            color: COLOR_AMBER_BRIGHT,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
          })
        );
        rGroup.add(new THREE.LineSegments(ticksGeom, ticksMat));
      }

      ringsGroup.add(rGroup);
      orbitalRings.push({ group: rGroup, rotSpeedX: -0.15, rotSpeedY: 0.22, rotSpeedZ: 0.3 });
    }

    // 5.4 Ring Layer 4: Outer Great Circle Horizon Ring (Radius 1.38, Gyroscopic Drift)
    {
      const rGroup = new THREE.Group();
      rGroup.rotation.z = THREE.MathUtils.degToRad(-55);

      const circleGeom = regGeom(new THREE.RingGeometry(1.36, 1.38, isMiniature ? 48 : 72));
      const circleMat = regMat(
        new THREE.MeshBasicMaterial({
          color: COLOR_DEEP_AMBER,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45,
          blending: THREE.AdditiveBlending,
        })
      );
      rGroup.add(new THREE.Mesh(circleGeom, circleMat));

      // 4 Traveling Satellite Beacons
      const beaconCount = 4;
      const beaconGeom = regGeom(new THREE.BufferGeometry());
      const beaconPos = new Float32Array(beaconCount * 3);
      for (let i = 0; i < beaconCount; i++) {
        const a = (i / beaconCount) * Math.PI * 2;
        beaconPos[i * 3] = Math.cos(a) * 1.37;
        beaconPos[i * 3 + 1] = Math.sin(a) * 1.37;
        beaconPos[i * 3 + 2] = 0;
      }
      beaconGeom.setAttribute('position', new THREE.BufferAttribute(beaconPos, 3));
      const beaconMat = regMat(
        new THREE.PointsMaterial({
          color: COLOR_GOLD_PALE,
          size: isMiniature ? 0.08 : 0.11,
          map: glowTexture,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      rGroup.add(new THREE.Points(beaconGeom, beaconMat));

      ringsGroup.add(rGroup);
      orbitalRings.push({ group: rGroup, rotSpeedX: 0.08, rotSpeedY: -0.14, rotSpeedZ: 0.18 });
    }

    // 6. COHERENT HOLOGRAPHIC PARTICLE SYSTEMS
    // 6.1 Spherical Fibonacci Lattice Shell
    const shellParticleCount = isMiniature ? 320 : 1200;
    const shellGeom = regGeom(new THREE.BufferGeometry());
    const shellPositions = new Float32Array(shellParticleCount * 3);
    const shellColors = new Float32Array(shellParticleCount * 3);

    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle
    for (let i = 0; i < shellParticleCount; i++) {
      const y = 1 - (i / (shellParticleCount - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const r = 1.35 + (Math.sin(i * 0.2) * 0.08); // Slight organic depth modulation
      shellPositions[i * 3] = Math.cos(theta) * radiusAtY * r;
      shellPositions[i * 3 + 1] = y * r;
      shellPositions[i * 3 + 2] = Math.sin(theta) * radiusAtY * r;

      // Color variation between gold, amber and molten orange
      const mixRatio = Math.sin(i * 0.3) * 0.5 + 0.5;
      const c = new THREE.Color().lerpColors(COLOR_ORANGE_MOLTEN, COLOR_GOLD_PALE, mixRatio);
      shellColors[i * 3] = c.r;
      shellColors[i * 3 + 1] = c.g;
      shellColors[i * 3 + 2] = c.b;
    }

    shellGeom.setAttribute('position', new THREE.BufferAttribute(shellPositions, 3));
    shellGeom.setAttribute('color', new THREE.BufferAttribute(shellColors, 3));

    const shellMat = regMat(
      new THREE.PointsMaterial({
        size: isMiniature ? 0.035 : 0.048,
        vertexColors: true,
        map: glowTexture,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const shellPoints = new THREE.Points(shellGeom, shellMat);
    hologramGroup.add(shellPoints);

    // 6.2 Orbital Swarm Belt Particles
    const swarmCount = isMiniature ? 160 : 600;
    const swarmGeom = regGeom(new THREE.BufferGeometry());
    const swarmPositions = new Float32Array(swarmCount * 3);
    const swarmRadii: number[] = [];
    const swarmAngles: number[] = [];
    const swarmSpeeds: number[] = [];

    for (let i = 0; i < swarmCount; i++) {
      const rad = 0.55 + Math.random() * 0.85;
      const ang = Math.random() * Math.PI * 2;
      const spd = (0.2 + Math.random() * 0.6) * (Math.random() > 0.5 ? 1 : -1);
      const zOffset = (Math.random() - 0.5) * 0.35;

      swarmRadii.push(rad);
      swarmAngles.push(ang);
      swarmSpeeds.push(spd);

      swarmPositions[i * 3] = Math.cos(ang) * rad;
      swarmPositions[i * 3 + 1] = Math.sin(ang) * rad * 0.4;
      swarmPositions[i * 3 + 2] = zOffset;
    }
    swarmGeom.setAttribute('position', new THREE.BufferAttribute(swarmPositions, 3));

    const swarmMat = regMat(
      new THREE.PointsMaterial({
        color: COLOR_AMBER_BRIGHT,
        size: isMiniature ? 0.04 : 0.055,
        map: glowTexture,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    const swarmPoints = new THREE.Points(swarmGeom, swarmMat);
    hologramGroup.add(swarmPoints);

    // 7. SWEEPING RADAR / SCANNING ARC BEAM
    const scanGroup = new THREE.Group();
    hologramGroup.add(scanGroup);

    const scanArcGeom = regGeom(new THREE.RingGeometry(0.35, 1.4, 24, 1, 0, Math.PI * 0.25));
    const scanArcMat = regMat(
      new THREE.MeshBasicMaterial({
        color: COLOR_ORANGE_MOLTEN,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
      })
    );
    const scanArcMesh = new THREE.Mesh(scanArcGeom, scanArcMat);
    scanGroup.add(scanArcMesh);

    // 8. INTERACTIVE POINTER PARALLAX
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    const handlePointerMove = (e: PointerEvent) => {
      if (!interactiveParallax || prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const ndcX = (e.clientX - centerX) / (window.innerWidth / 2);
      const ndcY = (e.clientY - centerY) / (window.innerHeight / 2);

      targetRotY = THREE.MathUtils.clamp(ndcX * 0.4, -0.45, 0.45);
      targetRotX = THREE.MathUtils.clamp(-ndcY * 0.35, -0.35, 0.35);
    };

    if (interactiveParallax && typeof window !== 'undefined') {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    // 9. ANIMATION LOOP & AUDIO-REACTIVE ENGINE
    const clock = new THREE.Clock();
    let animationFrameId: number;
    let isVisible = true;

    // Visibility observer to save GPU when scrolled away
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Smooth audio level lerp
      audioLevelRef.current = THREE.MathUtils.lerp(
        audioLevelRef.current,
        targetAudioRef.current,
        delta * 12
      );
      const currentAudio = audioLevelRef.current;

      const currentState = stateRef.current;
      const isSpeaking = currentState === 'speaking' || currentAudio > 0.05;
      const isListening = currentState === 'listening';
      const isProcessing = currentState === 'processing' || currentState === 'thinking' || currentState === 'acting';

      // Multipliers based on state
      let speedMult = 1.0;
      let coreScaleBase = 1.0;
      let glowMultiplier = 1.0;

      if (isProcessing) {
        speedMult = 2.4;
        glowMultiplier = 1.4;
        coreScaleBase = 1.08;
      } else if (isSpeaking) {
        speedMult = 1.4 + currentAudio * 1.8;
        glowMultiplier = 1.2 + currentAudio * 1.6;
        coreScaleBase = 1.0 + currentAudio * 0.55;
      } else if (isListening) {
        speedMult = 0.85;
        glowMultiplier = 1.15;
      }

      if (prefersReducedMotion) {
        speedMult *= 0.2;
      }

      // 1. Pointer Parallax Smoothing
      currentRotX = THREE.MathUtils.lerp(currentRotX, targetRotX, delta * 3.5);
      currentRotY = THREE.MathUtils.lerp(currentRotY, targetRotY, delta * 3.5);
      hologramGroup.rotation.x = currentRotX;
      hologramGroup.rotation.y = currentRotY;

      // 2. Orbital Rings Rotation
      orbitalRings.forEach((ring, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        ring.group.rotation.x += ring.rotSpeedX * delta * speedMult * dir;
        ring.group.rotation.y += ring.rotSpeedY * delta * speedMult;
        ring.group.rotation.z += ring.rotSpeedZ * delta * speedMult;
      });

      // 3. Central Core Dynamics
      const corePulse = Math.sin(time * 3.5) * 0.05;
      coreGroup.scale.setScalar(coreScaleBase + corePulse);
      cageMesh.rotation.y += delta * 0.8 * speedMult;
      cageMesh.rotation.x += delta * 0.5 * speedMult;
      innerCoreMat.opacity = Math.min(1.0, 0.85 + corePulse + currentAudio * 0.4);

      // 4. Acoustic Pulse Shockwaves
      waveRings.forEach((w) => {
        w.scale += delta * w.baseSpeed * (isSpeaking ? 2.2 : isProcessing ? 1.8 : 1.0);
        if (w.scale > 3.2) {
          w.scale = 1.0;
        }
        w.mesh.scale.set(w.scale, w.scale, 1);
        const mat = w.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, (1 - (w.scale - 1) / 2.2) * 0.6 * glowMultiplier);
      });

      // 5. Spherical Shell Rotation
      shellPoints.rotation.y += delta * 0.12 * speedMult;
      shellPoints.rotation.x = Math.sin(time * 0.4) * 0.08;

      // 6. Orbital Swarm Positions Update
      const swarmPosAttr = swarmGeom.attributes.position as THREE.BufferAttribute;
      const positions = swarmPosAttr.array as Float32Array;
      for (let i = 0; i < swarmCount; i++) {
        swarmAngles[i] += swarmSpeeds[i] * delta * speedMult;
        const rad = swarmRadii[i] + (isSpeaking ? Math.sin(time * 8 + i) * currentAudio * 0.1 : 0);
        positions[i * 3] = Math.cos(swarmAngles[i]) * rad;
        positions[i * 3 + 1] = Math.sin(swarmAngles[i]) * rad * 0.4;
      }
      swarmPosAttr.needsUpdate = true;

      // 7. Scanning Arc Sweep
      scanGroup.rotation.z += delta * (isProcessing ? 3.5 : isListening ? 1.8 : 1.1) * speedMult;
      scanArcMat.opacity = 0.12 + Math.sin(time * 2.5) * 0.06 + (isListening ? 0.1 : 0);

      renderer.render(scene, camera);
    };

    animate();

    // 10. CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();

      if (interactiveParallax && typeof window !== 'undefined') {
        window.removeEventListener('pointermove', handlePointerMove);
      }

      disposables.geometries.forEach((g) => g.dispose());
      disposables.materials.forEach((m) => m.dispose());
      disposables.textures.forEach((t) => t.dispose());

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [pixelSize, isMiniature, interactiveParallax]);

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      {/* Amber Atmospheric Ambient Back-Glow */}
      <div
        className={`absolute rounded-full pointer-events-none transition-all duration-500 ${
          isMiniature
            ? 'w-20 h-20 bg-amber-500/20 blur-[18px]'
            : 'w-72 h-72 sm:w-88 sm:h-88 bg-gradient-to-tr from-amber-600/25 via-orange-500/20 to-yellow-500/10 blur-[48px]'
        }`}
      />

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full relative z-10 flex items-center justify-center"
      />

      {/* Optional Status Overlay Badge */}
      {showStatusBadge && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#080B13]/90 border border-amber-500/30 backdrop-blur-md text-[10px] font-mono text-amber-300 flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,167,38,0.25)] whitespace-nowrap z-20 pointer-events-none">
          <span
            className={`w-2 h-2 rounded-full ${
              state === 'speaking' || (audioLevel && audioLevel > 0.05)
                ? 'bg-amber-400 shadow-[0_0_8px_#FFA726] animate-ping'
                : state === 'listening'
                ? 'bg-orange-400 shadow-[0_0_8px_#FF5722] animate-pulse'
                : state === 'processing'
                ? 'bg-yellow-300 shadow-[0_0_8px_#FFD54F] animate-spin'
                : 'bg-amber-400 shadow-[0_0_6px_#FFA726]'
            }`}
          />
          <span className="font-semibold tracking-wider">
            {state === 'speaking'
              ? 'JARVIS · TRANSMITTING'
              : state === 'listening'
              ? 'JARVIS · LISTENING'
              : state === 'processing'
              ? 'JARVIS · COMPUTING'
              : 'JARVIS · ONLINE'}
          </span>
        </div>
      )}
    </div>
  );
};

export default JarvisHologram;
