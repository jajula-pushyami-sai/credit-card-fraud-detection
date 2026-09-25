import { useReducedMotion } from '@/utils/useReducedMotion';
import { VisibleCanvas } from '@/components/3d/VisibleCanvas';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, Environment, Ring, Html } from '@react-three/drei';
import * as THREE from 'three';

const satellites = [
  { label: "Extra Trees", radius: 2, speed: 0.5, color: "#4A6741" },
  { label: "MLP Network", radius: 3, speed: 0.3, color: "#D9A441" }
];

function OrbitSystem() {
  const coreRef = useRef<THREE.Group>(null);
  
  const reducedMotion = useReducedMotion();
  
  useFrame((state) => {
  
    if (reducedMotion) return;
    if (coreRef.current) {
      coreRef.current.rotation.x = Math.PI / 6; // Tilt
    }
  });

  return (
    <group ref={coreRef}>
      {/* Central XGBoost Meta Learner */}
      <Sphere args={[0.5, 32, 32]}>
        <meshPhysicalMaterial 
          color="#162A2B" 
          transmission={0.5} 
          roughness={0.1} 
          ior={1.5} 
          thickness={0.5} 
        />
      </Sphere>
      <Html distanceFactor={10} zIndexRange={[100, 0]}>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-primary bg-white/80 backdrop-blur-md px-3 py-1 rounded-lg border border-border/40 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
          Ensemble Meta-Learner
        </div>
      </Html>

      {/* Orbit Paths & Satellites */}
      {satellites.map((sat, i) => (
        <group key={i}>
          <Ring args={[sat.radius - 0.01, sat.radius + 0.01, 64]}>
            <meshBasicMaterial color={sat.color} transparent opacity={0.2} side={THREE.DoubleSide} />
          </Ring>
          <Satellite data={sat} />
        </group>
      ))}
    </group>
  );
}

function Satellite({ data }: { data: any }) {
  const group = useRef<THREE.Group>(null);
  
  const reducedMotion = useReducedMotion();
  
  useFrame((state) => {
  
    if (reducedMotion) return;
    if (group.current) {
      const angle = state.clock.elapsedTime * data.speed;
      group.current.position.x = Math.cos(angle) * data.radius;
      group.current.position.z = Math.sin(angle) * data.radius;
    }
  });

  return (
    <group ref={group}>
      <Sphere args={[0.2, 16, 16]}>
        <meshStandardMaterial color={data.color} emissive={data.color} emissiveIntensity={0.5} />
      </Sphere>
    </group>
  );
}

export function ModelGalaxy() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="w-full h-[500px] rounded-[32px] overflow-hidden relative">
      <VisibleCanvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#F3EFE6" />
        <Environment preset="city" />
        <Float speed={reducedMotion ? 0 : 1.5} floatIntensity={0.5}>
          <OrbitSystem />
        </Float>
      </VisibleCanvas>
    </div>
  );
}
