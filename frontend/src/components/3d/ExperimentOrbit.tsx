import { useReducedMotion } from '@/utils/useReducedMotion';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ExperimentOrbit: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  const reducedMotion = useReducedMotion();

  useFrame((state) => {

    if (reducedMotion) return;
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Concentric Search Spaces */}
      {[1, 1.5, 2].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
          <meshBasicMaterial color="#0F766E" transparent opacity={0.3 - (i * 0.1)} side={THREE.DoubleSide} />
        </mesh>
      ))}
      
      {/* Hyperparameter Data Points */}
      {Array.from({ length: 15 }).map((_, i) => {
        const radius = 1 + (Math.random() * 1);
        const theta = Math.random() * Math.PI * 2;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        
        return (
          <mesh key={`p-${i}`} position={[x, y, (Math.random() - 0.5) * 0.5]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={Math.random() > 0.8 ? "#10b981" : "#818cf8"} />
          </mesh>
        );
      })}

      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
    </group>
  );
};
