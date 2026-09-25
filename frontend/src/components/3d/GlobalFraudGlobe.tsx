import { useReducedMotion } from '@/utils/useReducedMotion';
import { VisibleCanvas } from '@/components/3d/VisibleCanvas';
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, Environment, QuadraticBezierLine, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const arcs = [
  { start: new THREE.Vector3(1, 1, 1.5), end: new THREE.Vector3(-1, 1.5, 1) },
  { start: new THREE.Vector3(-1.2, 0.5, 1.5), end: new THREE.Vector3(1.5, 0, 1.2) },
  { start: new THREE.Vector3(0.5, -1.5, 1.2), end: new THREE.Vector3(-0.5, -1, 1.5) },
];

function EarthCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const reducedMotion = useReducedMotion();
  
  useFrame(({ clock }) => {
  
    if (reducedMotion) return;
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Glass Sphere */}
      <Sphere args={[2, 64, 64]}>
        <meshPhysicalMaterial 
          color="#F3EFE6"
          transmission={0.9}
          opacity={1}
          metalness={0.1}
          roughness={0.1}
          ior={1.5}
          thickness={1}
        />
      </Sphere>

      {/* Internal Glow */}
      <Sphere args={[1.9, 32, 32]}>
        <meshBasicMaterial color="#D9A441" transparent opacity={0.05} />
      </Sphere>

      {/* Transaction Arcs */}
      {arcs.map((arc, i) => (
        <QuadraticBezierLine 
          key={i}
          start={arc.start}
          end={arc.end}
          mid={new THREE.Vector3().addVectors(arc.start, arc.end).multiplyScalar(0.5).add(new THREE.Vector3(0, 0, 0.5))}
          color={i === 1 ? "#C26E60" : "#D9A441"}
          lineWidth={1.5}
          dashed={true}
          dashScale={2}
          dashSize={0.5}
        />
      ))}
    </group>
  );
}

function GlobalParticles() {
  const count = 1000;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 15;
      p[i * 3 + 1] = (Math.random() - 0.5) * 15;
      p[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  const reducedMotion = useReducedMotion();
  useFrame((state) => {
    if (reducedMotion) return;
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#D9A441" size={0.03} sizeAttenuation={true} depthWrite={false} opacity={0.3} />
    </Points>
  );
}

export function GlobalFraudGlobe() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="w-full h-full min-h-[500px] rounded-[32px] overflow-hidden relative">
      <VisibleCanvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#F3EFE6" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#D9A441" />
        <Environment preset="city" />
        
        <Float speed={reducedMotion ? 0 : 1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <EarthCore />
        </Float>
        <GlobalParticles />
      </VisibleCanvas>
    </div>
  );
}
