import { useReducedMotion } from '@/utils/useReducedMotion';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ComplianceGrid: React.FC = () => {
  const gridRef = useRef<THREE.GridHelper>(null);

  // Subtle panning motion to represent scanning/auditing
  const reducedMotion = useReducedMotion();
  useFrame((state) => {
    if (reducedMotion) return;
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.getElapsedTime() * 0.5) % 1;
    }
  });

  return (
    <group rotation={[Math.PI / 6, Math.PI / 4, 0]}>
      {/* Main floor grid */}
      <gridHelper 
        ref={gridRef}
        args={[20, 20, '#10b981', '#064e3b']} 
        position={[0, -1, 0]} 
      />
      
      {/* Vertical pillars representing compliance pillars (OWASP, GDPR, etc) */}
      {[
        [-2, -2], [2, 2], [-2, 2], [2, -2]
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0, z]}>
          <cylinderGeometry args={[0.1, 0.1, 2, 16]} />
          <meshStandardMaterial color="#34d399" transparent opacity={0.8} />
        </mesh>
      ))}

      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 0]} intensity={1} color="#a7f3d0" />
    </group>
  );
};
