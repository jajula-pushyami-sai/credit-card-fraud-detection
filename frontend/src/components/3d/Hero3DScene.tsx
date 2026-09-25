import { useReducedMotion } from '@/utils/useReducedMotion';
import { VisibleCanvas } from '@/components/3d/VisibleCanvas';
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  RoundedBox, 
  ContactShadows, 
  OrbitControls,
  Text,
  Float,
  Points,
  PointMaterial
} from '@react-three/drei';
import * as THREE from 'three';

// --- Particle Field (Subtle Depth) ---
function AmbientParticles() {
  const count = 300;
  const positions = React.useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  const reducedMotion = useReducedMotion();
  useFrame((state) => {
    if (reducedMotion) return;
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.015;
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#0F766E" size={0.02} sizeAttenuation={true} depthWrite={false} opacity={0.15} />
    </Points>
  );
}

// --- The Premium 3D Card ---
function PremiumCard() {
  // Apple Card / Premium Visa Infinite vibe
  // Ceramic/Titanium Matte Finish
  const cardMaterial = new THREE.MeshPhysicalMaterial({
    color: '#0F172A', // Dark Slate
    metalness: 0.15,
    roughness: 0.6, // Matte Finish
    clearcoat: 0.1,
    clearcoatRoughness: 0.8});

  const magneticStripeMaterial = new THREE.MeshStandardMaterial({
    color: '#111827',
    metalness: 0.2,
    roughness: 0.6});

  const holoMaterial = new THREE.MeshPhysicalMaterial({
    color: '#e2e8f0',
    metalness: 1,
    roughness: 0.1,
    iridescence: 1,
    iridescenceIOR: 1.5,
    iridescenceThicknessRange: [100, 400]});

  return (
    <group>
      {/* Main Card Body */}
      {/* Real credit card ratio is ~1.586 (85.6mm x 53.98mm). Let's use 3.37 x 2.12 */}
      <RoundedBox args={[3.37, 2.12, 0.05]} radius={0.1} smoothness={8} castShadow receiveShadow material={cardMaterial}>
        
        {/* Front Elements */}
        
        {/* Metallic EMV Chip */}
        <RoundedBox args={[0.45, 0.35, 0.02]} radius={0.04} position={[-1.1, 0.3, 0.026]} castShadow>
          <meshStandardMaterial color="#D4AF37" metalness={1} roughness={0.2} />
        </RoundedBox>
        
        {/* Chip Traces */}
        <mesh position={[-1.1, 0.3, 0.037]}>
          <planeGeometry args={[0.4, 0.01]} />
          <meshStandardMaterial color="#b8860b" metalness={1} roughness={0.4} />
        </mesh>
        <mesh position={[-1.1, 0.38, 0.037]}>
          <planeGeometry args={[0.3, 0.01]} />
          <meshStandardMaterial color="#b8860b" metalness={1} roughness={0.4} />
        </mesh>
        <mesh position={[-1.1, 0.22, 0.037]}>
          <planeGeometry args={[0.3, 0.01]} />
          <meshStandardMaterial color="#b8860b" metalness={1} roughness={0.4} />
        </mesh>

        {/* Branding - Embossed Effect */}
        <Text
          position={[-1.4, -0.7, 0.026]}
          fontSize={0.25}
          color="#E2E8F0"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.1}
          fontWeight={800}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        >
          FRAUDSHIELD
        </Text>
        <Text
          position={[-1.4, -0.9, 0.026]}
          fontSize={0.12}
          color="#14B8A6"
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.2}
          fontWeight={600}
        >
          ENTERPRISE AI
        </Text>

        {/* Minimal Holographic Sticker */}
        <mesh position={[1.3, 0.7, 0.026]}>
          <circleGeometry args={[0.18, 32]} />
          <primitive object={holoMaterial} attach="material" />
        </mesh>

        {/* Back Elements */}

        {/* Magnetic Stripe */}
        <mesh position={[0, 0.5, -0.026]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[3.37, 0.35]} />
          <primitive object={magneticStripeMaterial} attach="material" />
        </mesh>

        {/* Signature Strip */}
        <mesh position={[-0.3, 0.1, -0.026]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.0, 0.25]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.1} roughness={0.9} />
        </mesh>

        {/* Fine Print */}
        <Text
          position={[0, -0.7, -0.026]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.06}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.0}
          textAlign="center"
        >
          This card is the property of FraudShield AI. Misuse is a violation of international security protocols.
          For enterprise support, visit fraudshield.ai/support.
        </Text>
      </RoundedBox>
    </group>
  );
}

function CardRig({ children }: { children: React.ReactNode }) {
  const mouseGroup = useRef<THREE.Group>(null);

  const reducedMotion = useReducedMotion();

  useFrame((state, delta) => {

    if (reducedMotion) return;
    // 1. Subtle Mouse Follow 
    if (mouseGroup.current) {
      const maxTilt = 0.05;
      const targetX = (state.pointer.y * maxTilt);
      const targetY = (state.pointer.x * maxTilt);
      
      mouseGroup.current.rotation.x = THREE.MathUtils.damp(mouseGroup.current.rotation.x, targetX, 4, delta);
      mouseGroup.current.rotation.y = THREE.MathUtils.damp(mouseGroup.current.rotation.y, targetY, 4, delta);
    }
  });

  return (
    <group ref={mouseGroup}>
      {/* OrbitControls gives us autoRotate={!reducedMotion}, drag inertia, and touch interactions */}
      <OrbitControls 
        makeDefault
        enableZoom={false}
        enablePan={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.5} // Very slow rotation
        enableDamping={true}
        dampingFactor={0.05} // Smooth inertia
      />
      
      {/* Float provides the continuous idle breathing animation */}
      <Float speed={reducedMotion ? 0 : 1.5} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[-0.05, 0.05]}>
        {children}
      </Float>
    </group>
  );
}

function FadeInOverlay() {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const reducedMotion = useReducedMotion();
  useFrame((_, delta) => {
    if (reducedMotion) {
      if (materialRef.current) materialRef.current.opacity = 0;
      return;
    }
    if (materialRef.current) {
      materialRef.current.opacity = THREE.MathUtils.damp(materialRef.current.opacity, 0, 2, delta);
    }
  });
  return (
    <mesh position={[0, 0, 5]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial ref={materialRef} color="#F8FAF8" transparent opacity={1} depthTest={false} />
    </mesh>
  );
}

// --- Main Scene Component ---
export function Hero3DScene() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="w-full h-full absolute inset-0 z-0 cursor-grab active:cursor-grabbing">
      <VisibleCanvas 
        camera={{ position: [0, 0, 6], fov: 40 }} 
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.6} />
        <React.Suspense fallback={null}>
          <FadeInOverlay />
          {/* HDRI Lighting Setup */}
          <Environment preset="city" />
          
          <spotLight position={[5, 5, 5]} intensity={2.5} angle={0.4} penumbra={1} color="#ffffff" castShadow />
          <directionalLight position={[-5, 2, 5]} intensity={1.5} color="#fff1e6" />
          <directionalLight position={[0, -5, -5]} intensity={2.0} color="#e0f2fe" />

          <CardRig>
            <PremiumCard />
          </CardRig>
          
          <AmbientParticles />
          
          <ContactShadows position={[0, -2.5, 0]} opacity={0.2} scale={20} blur={3} far={5} color="#0F766E" />
        </React.Suspense>
      </VisibleCanvas>
    </div>
  );
}
