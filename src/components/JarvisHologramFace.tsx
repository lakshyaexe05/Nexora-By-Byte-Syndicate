import React, { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { JarvisState } from '../types';

export interface JarvisHologramFaceProps {
  size?: 'sm' | 'md' | 'lg' | 'hero' | number;
  state?: JarvisState;
  audioLevel?: number;
  isSpeaking?: boolean;
  isListening?: boolean;
  isProcessing?: boolean;
  isTyping?: boolean;
  interactiveParallax?: boolean;
  className?: string;
  onClick?: () => void;
  showStatusBadge?: boolean;
}

/** Animated amber/cyan energy core for the NEXUS main hologram. */
export const JarvisHologramFace: React.FC<JarvisHologramFaceProps> = ({
  size = 'hero', state = 'idle', audioLevel = 0, isSpeaking = false,
  isListening = false, isProcessing = false, isTyping = false,
  interactiveParallax = true, className = '', onClick, showStatusBadge = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ state, audioLevel, isSpeaking, isListening, isProcessing, isTyping });
  stateRef.current = { state, audioLevel, isSpeaking, isListening, isProcessing, isTyping };
  const rippleRef = useRef(0);

  let pixelSize = 380;
  if (typeof size === 'number') pixelSize = size;
  else if (size === 'sm') pixelSize = 96;
  else if (size === 'md') pixelSize = 180;
  else if (size === 'lg') pixelSize = 280;
  const isMiniature = pixelSize <= 140;

  const handleClick = useCallback(() => {
    rippleRef.current = performance.now() * 0.001;
    onClick?.();
  }, [onClick]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    camera.position.set(0, 0, 4.1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;';
    container.appendChild(renderer.domElement);

    const root = new THREE.Group(); scene.add(root);
    const coreGroup = new THREE.Group(); root.add(coreGroup);
    const disposeGeometries: THREE.BufferGeometry[] = [];
    const disposeMaterials: THREE.Material[] = [];
    const gold = new THREE.Color(0xffa51f);
    const goldHot = new THREE.Color(0xffd879);
    const cyan = new THREE.Color(0x27dfff);

    const mat = (color: THREE.ColorRepresentation, opacity = 1, additive = true) => {
      const m = new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, wireframe: true, depthWrite: false, blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending });
      disposeMaterials.push(m); return m;
    };
    const lineMat = (color: THREE.ColorRepresentation, opacity: number) => {
      const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
      disposeMaterials.push(m); return m;
    };

    // Layered spherical lattice, intentionally abstract: no head or face geometry.
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(0.72, 3), mat(0xffa51f, 0.44));
    coreGroup.add(shell); disposeGeometries.push(shell.geometry);
    const innerShell = new THREE.Mesh(new THREE.IcosahedronGeometry(0.53, 2), mat(0xffc75a, 0.34));
    innerShell.rotation.set(0.4, 0.15, 0.2); coreGroup.add(innerShell); disposeGeometries.push(innerShell.geometry);
    const innerCore = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 18), new THREE.MeshBasicMaterial({ color: 0xff9d1b, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false }));
    coreGroup.add(innerCore); disposeGeometries.push(innerCore.geometry); disposeMaterials.push(innerCore.material);

    // Fine meridian/latitude lattice adds a dense technical hologram surface.
    const grid = new THREE.Mesh(new THREE.SphereGeometry(0.735, 28, 18), mat(0xffb12b, 0.23));
    grid.rotation.set(0.2, 0.3, -0.1); coreGroup.add(grid); disposeGeometries.push(grid.geometry);

    const rings: THREE.Mesh[] = [];
    const ringDefs = [
      { r: 0.9, tube: 0.008, color: 0xffb332, rot: [0.5, 0.1, 0.15] as [number, number, number] },
      { r: 1.02, tube: 0.004, color: 0x23d9ff, rot: [1.1, 0.4, 0.7] as [number, number, number] },
      { r: 0.84, tube: 0.005, color: 0xff8e16, rot: [0.1, 1.05, 0.35] as [number, number, number] },
      { r: 1.12, tube: 0.0035, color: 0x2abfff, rot: [0.75, 0.2, 1.2] as [number, number, number] },
    ];
    ringDefs.forEach((d, i) => {
      const geometry = new THREE.TorusGeometry(d.r, d.tube, 5, isMiniature ? 64 : 144);
      const material = lineMat(d.color, i % 2 ? 0.65 : 0.78);
      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.set(...d.rot); ring.userData.baseRotation = [...d.rot];
      root.add(ring); rings.push(ring); disposeGeometries.push(geometry);
    });

    // Irregular segmented circuitry: broken radial arcs and tiny rectangular traces.
    // These details give the core the dense, mechanical hologram look of the reference.
    const circuitGroup = new THREE.Group(); root.add(circuitGroup);
    const circuitMats = [lineMat(0xffa51f, 0.76), lineMat(0xffd36a, 0.58), lineMat(0xff7a12, 0.46)];
    const circuitGeometries: THREE.BufferGeometry[] = [];
    const addSegment = (pts: THREE.Vector3[], material: THREE.LineBasicMaterial) => {
      const g = new THREE.BufferGeometry().setFromPoints(pts); circuitGeometries.push(g);
      const line = new THREE.Line(g, material); circuitGroup.add(line);
    };
    for (let band = 0; band < 7; band++) {
      const radius = 0.58 + band * 0.075;
      const segments = 13 + band * 2;
      for (let j = 0; j < segments; j++) {
        if (Math.random() < 0.22) continue; // intentional broken arcs
        const start = (j / segments) * Math.PI * 2 + band * 0.19 + Math.random() * 0.035;
        const span = (Math.PI * 2 / segments) * (0.28 + Math.random() * 0.58);
        const z = (Math.random() - 0.5) * 0.42;
        const pts: THREE.Vector3[] = [];
        const n = 3 + Math.floor(Math.random() * 4);
        for (let q = 0; q <= n; q++) {
          const a = start + span * q / n;
          const r = radius + (q % 2 ? 0.012 : 0);
          pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r * (0.72 + band * 0.025), z));
        }
        addSegment(pts, circuitMats[(band + j) % circuitMats.length]);
        // Small circuit stubs branching out from selected arc endpoints.
        if (j % 3 === 0) {
          const a = start + span; const r1 = radius; const r2 = radius + 0.045 + Math.random() * 0.055;
          addSegment([new THREE.Vector3(Math.cos(a)*r1, Math.sin(a)*r1*0.75, z), new THREE.Vector3(Math.cos(a)*r2, Math.sin(a)*r2*0.75, z), new THREE.Vector3(Math.cos(a+0.035)*r2, Math.sin(a+0.035)*r2*0.75, z)], circuitMats[(j + band + 1) % circuitMats.length]);
        }
      }
    }
    // Floating translucent data plates suspended at different depths.
    const plateGroup = new THREE.Group(); root.add(plateGroup);
    for (let i = 0; i < (isMiniature ? 3 : 9); i++) {
      const w = 0.055 + Math.random() * 0.11, h = 0.035 + Math.random() * 0.09;
      const x = (Math.random() - 0.5) * 1.55, y = (Math.random() - 0.5) * 1.55, z = (Math.random() - 0.5) * 0.55;
      const points = [new THREE.Vector3(x-w,y-h,z), new THREE.Vector3(x+w,y-h,z), new THREE.Vector3(x+w,y+h,z), new THREE.Vector3(x-w,y+h,z), new THREE.Vector3(x-w,y-h,z)];
      const g = new THREE.BufferGeometry().setFromPoints(points); disposeGeometries.push(g);
      const plate = new THREE.Line(g, lineMat(i % 3 === 0 ? 0x63dfff : 0xffb332, 0.22 + Math.random()*0.25));
      plate.userData.floatPhase = Math.random() * Math.PI * 2; plateGroup.add(plate);
    }

    // Orbiting data beads on two orbital tracks.
    const beadGroup = new THREE.Group(); root.add(beadGroup);
    const beadGeometry = new THREE.SphereGeometry(0.014, 6, 5); disposeGeometries.push(beadGeometry);
    for (let i = 0; i < (isMiniature ? 14 : 34); i++) {
      const bead = new THREE.Mesh(beadGeometry, new THREE.MeshBasicMaterial({ color: i % 4 === 0 ? 0x48eaff : 0xffc04c, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending }));
      disposeMaterials.push(bead.material);
      const a = (i / (isMiniature ? 14 : 34)) * Math.PI * 2;
      const r = i % 2 ? 1.01 : 0.88;
      bead.position.set(Math.cos(a) * r, Math.sin(a) * r * 0.76, Math.sin(a * 2) * 0.19);
      bead.userData = { angle: a, radius: r, track: i % 2 };
      beadGroup.add(bead);
    }

    // Curved blue energy filaments wrap around the sphere in 3D.
    const energyGroup = new THREE.Group(); root.add(energyGroup);
    const energyCurves: THREE.Line[] = [];
    for (let k = 0; k < 5; k++) {
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j <= 150; j++) {
        const t = j / 150 * Math.PI * 2;
        const lat = -0.8 + k * 0.4;
        const r = 0.76 + 0.06 * Math.sin(t * 3 + k);
        pts.push(new THREE.Vector3(Math.cos(t + k * 0.45) * r * Math.cos(lat), Math.sin(t * 1.25 + k * 0.65) * 0.64, Math.sin(t + k * 0.45) * r * Math.cos(lat)));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(pts); disposeGeometries.push(geometry);
      const line = new THREE.Line(geometry, lineMat(k % 2 ? 0x20dfff : 0x65aaff, k % 2 ? 0.78 : 0.52));
      line.rotation.set(k * 0.41, k * 0.63, k * 0.2); energyGroup.add(line); energyCurves.push(line);
    }

    // High-count particle shell, each point has a different orbit phase and radius.
    const count = isMiniature ? 650 : 2800;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const radii = new Float32Array(count);
    const particleColors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / Math.max(1, count - 1)) * 2;
      const radiusXZ = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = Math.PI * (3 - Math.sqrt(5)) * i;
      const r = 0.77 + Math.random() * 0.36;
      positions[i * 3] = Math.cos(theta) * radiusXZ * r;
      positions[i * 3 + 1] = y * r;
      positions[i * 3 + 2] = Math.sin(theta) * radiusXZ * r;
      phases[i] = Math.random() * Math.PI * 2; radii[i] = r;
      const c = Math.random() > 0.83 ? cyan : (Math.random() > 0.5 ? goldHot : gold);
      particleColors[i * 3] = c.r; particleColors[i * 3 + 1] = c.g; particleColors[i * 3 + 2] = c.b;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    particleGeometry.setAttribute('aColor', new THREE.BufferAttribute(particleColors, 3));
    disposeGeometries.push(particleGeometry);
    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPulse: { value: 0 }, uPixelRatio: { value: dpr } },
      vertexShader: `attribute float aPhase; attribute vec3 aColor; uniform float uTime; uniform float uPulse; uniform float uPixelRatio; varying vec3 vColor; varying float vAlpha; void main(){ vec3 p=position; float t=uTime; float ph=aPhase; p.x += sin(t*0.75+ph)*0.018; p.y += cos(t*0.9+ph*1.7)*0.02; p.z += sin(t*0.6+ph*0.8)*0.018; vec4 mv=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mv; gl_PointSize=(1.0+mod(ph*3.0,2.2)+uPulse*1.8)*uPixelRatio*(3.3/-mv.z); vColor=aColor; vAlpha=0.48+0.38*(0.5+0.5*sin(t*2.2+ph))+uPulse*0.22; }`,
      fragmentShader: `varying vec3 vColor; varying float vAlpha; void main(){ float d=length(gl_PointCoord-vec2(0.5)); if(d>0.5) discard; float glow=pow(1.0-d*2.0,2.0); gl_FragColor=vec4(vColor,glow*vAlpha); }`,
    });
    disposeMaterials.push(particleMaterial);
    const particles = new THREE.Points(particleGeometry, particleMaterial); particles.frustumCulled = false; root.add(particles);

    // Short bright sparks shoot outward and curve back toward the energy shell.
    const sparkCount = isMiniature ? 90 : 360;
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkPhase = new Float32Array(sparkCount);
    for (let i = 0; i < sparkCount; i++) {
      const a = Math.random() * Math.PI * 2; const b = Math.acos(2 * Math.random() - 1); const r = 0.82 + Math.random() * 0.42;
      sparkPositions[i * 3] = r * Math.sin(b) * Math.cos(a);
      sparkPositions[i * 3 + 1] = r * Math.cos(b);
      sparkPositions[i * 3 + 2] = r * Math.sin(b) * Math.sin(a);
      sparkPhase[i] = Math.random() * Math.PI * 2;
    }
    const sparkGeometry = new THREE.BufferGeometry();
    sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    sparkGeometry.setAttribute('aPhase', new THREE.BufferAttribute(sparkPhase, 1));
    disposeGeometries.push(sparkGeometry);
    const sparkMaterial = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: dpr } },
      vertexShader: `attribute float aPhase; uniform float uTime; uniform float uPixelRatio; varying float vA; void main(){ float t=mod(uTime*0.32+aPhase,6.28318); vec3 p=position*(0.93+0.12*sin(t*2.0)); p += normalize(position)*0.05*sin(t*1.4+aPhase); vec4 mv=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mv; gl_PointSize=(1.0+1.8*(0.5+0.5*sin(t*3.0)))*uPixelRatio*(3.2/-mv.z); vA=0.25+0.7*(0.5+0.5*sin(t*4.0+aPhase)); }`,
      fragmentShader: `uniform float uTime; varying float vA; void main(){float d=length(gl_PointCoord-vec2(0.5));if(d>0.5)discard;gl_FragColor=vec4(0.24,0.82,1.0,pow(1.0-d*2.0,2.0)*vA);}`,
    });
    disposeMaterials.push(sparkMaterial);
    const sparks = new THREE.Points(sparkGeometry, sparkMaterial); sparks.frustumCulled = false; root.add(sparks);

    // Soft halo behind the core.
    const halo = new THREE.Mesh(new THREE.SphereGeometry(1.08, 20, 16), new THREE.MeshBasicMaterial({ color: 0xff8f17, transparent: true, opacity: 0.035, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }));
    root.add(halo); disposeGeometries.push(halo.geometry); disposeMaterials.push(halo.material);

    let width = Math.min(pixelSize, container.clientWidth || pixelSize);
    const resize = () => { width = Math.max(1, Math.min(pixelSize, container.clientWidth || pixelSize)); renderer.setSize(width, width); camera.aspect = 1; camera.updateProjectionMatrix(); };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(container);
    let targetX = 0, targetY = 0, rotX = 0, rotY = 0;
    const onPointer = (e: MouseEvent) => {
      if (!interactiveParallax || reduced) return;
      const rect = container.getBoundingClientRect();
      targetY = THREE.MathUtils.clamp(((e.clientX - rect.left) / rect.width - 0.5) * 0.42, -0.22, 0.22);
      targetX = THREE.MathUtils.clamp(((e.clientY - rect.top) / rect.height - 0.5) * -0.28, -0.15, 0.15);
    };
    window.addEventListener('mousemove', onPointer, { passive: true });
    let visible = true;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); io.observe(container);
    const start = performance.now(); let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = (performance.now() - start) * 0.001;
      const s = stateRef.current;
      const voice = THREE.MathUtils.clamp(Math.max(s.audioLevel, s.isSpeaking ? 0.22 : 0), 0, 1);
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.1) + voice * 0.8;
      rotX = THREE.MathUtils.lerp(rotX, targetX, 0.045);
      rotY = THREE.MathUtils.lerp(rotY, targetY, 0.045);
      root.rotation.x = rotX + (reduced ? 0 : Math.sin(t * 0.31) * 0.035);
      root.rotation.y = rotY + (reduced ? 0 : t * 0.09);
      root.rotation.z = reduced ? 0 : Math.sin(t * 0.22) * 0.025;
      coreGroup.rotation.y = t * 0.16; coreGroup.rotation.x = Math.sin(t * 0.32) * 0.1;
      shell.rotation.set(t * 0.08, -t * 0.12, t * 0.05);
      innerShell.rotation.set(0.4 + t * 0.14, 0.15 - t * 0.18, 0.2 + t * 0.1);
      grid.rotation.y = -t * 0.12; grid.rotation.x = 0.2 + Math.sin(t * 0.28) * 0.12;
      rings.forEach((ring, i) => {
        ring.rotation.x += (i % 2 ? -1 : 1) * 0.0018 * (reduced ? 0 : 1);
        ring.rotation.y += (i % 2 ? 1 : -1) * 0.0013 * (reduced ? 0 : 1);
        ring.rotation.z += (i % 2 ? -1 : 1) * 0.0019 * (reduced ? 0 : 1);
        const base = i % 2 ? 0.97 : 1;
        ring.scale.setScalar(base + Math.sin(t * 1.7 + i) * 0.018 + voice * 0.025);
      });
      circuitGroup.rotation.y = -t * 0.055;
      circuitGroup.rotation.z = Math.sin(t * 0.23) * 0.025;
      circuitGroup.scale.setScalar(1 + Math.sin(t * 1.8) * 0.012 + voice * 0.018);
      plateGroup.children.forEach((obj, i) => {
        const plate = obj as THREE.Line;
        plate.position.y = Math.sin(t * 0.55 + (plate.userData.floatPhase as number)) * 0.025;
        (plate.material as THREE.LineBasicMaterial).opacity = 0.18 + 0.18 * (0.5 + 0.5 * Math.sin(t * 1.7 + i));
      });
      energyGroup.rotation.y = -t * 0.17; energyGroup.rotation.x = Math.sin(t * 0.37) * 0.12;
      energyCurves.forEach((line, i) => { line.rotation.z += (i % 2 ? -1 : 1) * 0.0015; (line.material as THREE.LineBasicMaterial).opacity = 0.4 + 0.26 * (0.5 + 0.5 * Math.sin(t * 2.6 + i)) + voice * 0.18; });
      beadGroup.children.forEach((obj) => {
        const bead = obj as THREE.Mesh; const d = bead.userData as { angle: number; radius: number; track: number };
        const a = d.angle + t * (d.track ? -0.36 : 0.48);
        bead.position.set(Math.cos(a) * d.radius, Math.sin(a) * d.radius * 0.76, Math.sin(a * 2 + t * 0.4) * 0.2);
      });
      particles.rotation.y = -t * 0.04;
      particleMaterial.uniforms.uTime.value = t;
      particleMaterial.uniforms.uPulse.value = pulse * 0.28 + voice * 0.6;
      sparkMaterial.uniforms.uTime.value = t;
      innerCore.scale.setScalar(1 + pulse * 0.11 + voice * 0.1);
      (innerCore.material as THREE.MeshBasicMaterial).opacity = 0.07 + pulse * 0.06 + voice * 0.1;
      halo.scale.setScalar(1.0 + pulse * 0.045 + voice * 0.035);
      (halo.material as THREE.MeshBasicMaterial).opacity = 0.025 + pulse * 0.018 + voice * 0.03;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf); window.removeEventListener('mousemove', onPointer); ro.disconnect(); io.disconnect();
      circuitGeometries.forEach(g => g.dispose());
      disposeGeometries.forEach(g => g.dispose()); disposeMaterials.forEach(m => m.dispose()); renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [pixelSize, interactiveParallax, isMiniature]);

  return (
    <div ref={containerRef} onClick={handleClick} className={`relative select-none flex items-center justify-center cursor-pointer w-full aspect-square ${className}`} style={{ maxWidth: pixelSize, maxHeight: pixelSize }} role="img" aria-label="JARVIS animated holographic energy core">
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600/15 via-cyan-500/10 to-transparent blur-2xl pointer-events-none" style={{ transform: 'scale(0.9)' }} />
      {showStatusBadge && !isMiniature && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#0A0D14]/90 border border-amber-500/25 text-[11px] font-mono text-amber-300 flex items-center gap-2 shadow-[0_0_12px_rgba(245,158,11,0.15)] whitespace-nowrap z-10 pointer-events-none">
          <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-ping' : isProcessing ? 'bg-orange-400 animate-spin' : isListening ? 'bg-cyan-300 shadow-[0_0_8px_#67e8f9] animate-pulse' : 'bg-amber-400/80 shadow-[0_0_6px_#fbbf24]'}`} />
          <span className="font-semibold tracking-wider uppercase text-[10px]">{isSpeaking ? 'Transmitting Voice' : isProcessing ? 'Neural Synthesis' : isListening ? 'Listening Active' : isTyping ? 'Cognitive Focus' : state === 'success' ? 'Objective Complete' : 'JARVIS Online'}</span>
        </div>
      )}
    </div>
  );
};

export default JarvisHologramFace;
