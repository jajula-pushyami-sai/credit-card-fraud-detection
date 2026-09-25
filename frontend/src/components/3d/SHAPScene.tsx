import { useReducedMotion } from '@/utils/useReducedMotion';
import { VisibleCanvas } from '@/components/3d/VisibleCanvas';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, Environment, Line } from '@react-three/drei';
import * as THREE from 'three';

const features = [
  { pos: [-2, 2, 0], strength: 0.8 },
  { pos: [-2, 0, 1], strength: 0.3 },
  { pos: [-2, -2, 0], strength: 0.9 },
  { pos: [-1.5, 1, -1.5], strength: 0.5 },
];

function SHAPCore() {
  const group = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.Group>(null);
  
  const reducedMotion = useReducedMotion();
  
  useFrame((state) => {
  
    if (reducedMotion) return;
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, (state.pointer.x * Math.PI) / 8, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -(state.pointer.y * Math.PI) / 8, 0.05);
    }
    
    if (linesRef.current) {
      const pulse = (Math.sin(state.clock.elapsedTime * 2) + 1) / 2; // 0 to 1
      linesRef.current.children.forEach((child: any, i) => {
        if (child.material) {
          child.material.opacity = 0.2 + (features[i].strength * pulse * 0.8);
        }
      });
    }
  });

  const center = new THREE.Vector3(2, 0, 0);

  return (
    <group ref={group}>
      {/* Central Decision Node */}
      <Sphere args={[0.5, 32, 32]} position={center}>
        <meshStandardMaterial color="#162A2B" emissive="#162A2B" emissiveIntensity={0.5} />
      </Sphere>

      {/* Feature Nodes */}
      {features.map((feat, i) => (
        <Sphere key={i} args={[0.2 + (feat.strength * 0.1), 32, 32]} position={new THREE.Vector3(...feat.pos)}>
          <meshStandardMaterial color={feat.strength > 0.6 ? "#C26E60" : "#4A6741"} />
        </Sphere>
      ))}

      {/* Connecting Flow Lines */}
      <group ref={linesRef}>
        {features.map((feat, i) => (
          <Line
            key={`line-${i}`}
            points={[new THREE.Vector3(...feat.pos), center]}
            color={feat.strength > 0.6 ? "#C26E60" : "#4A6741"}
            lineWidth={2 + (feat.strength * 3)}
            transparent
            opacity={0.5}
          />
        ))}
      </group>
    </group>
  );
}

export function SHAPScene() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="w-full h-[500px] rounded-[32px] overflow-hidden relative">
      <VisibleCanvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#F3EFE6" />
        <Environment preset="city" />
        <Float speed={reducedMotion ? 0 : 1.5} rotationIntensity={0.2}>
          <SHAPCore />
        </Float>
      </VisibleCanvas>
    </div>
  );
}
