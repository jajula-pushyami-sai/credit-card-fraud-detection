import { useReducedMotion } from '@/utils/useReducedMotion';
import { VisibleCanvas } from '@/components/3d/VisibleCanvas';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

function ShieldCore() {
  const group = useRef<THREE.Group>(null);
  
  const reducedMotion = useReducedMotion();
  
  useFrame((state) => {
  
    if (reducedMotion) return;
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={group} rotation={[Math.PI / 4, 0, 0]}>
      {/* Outer Hexagon Shield Layer */}
      <Cylinder args={[1.5, 1.5, 0.2, 6]} castShadow>
        <meshPhysicalMaterial 
          color="#F3EFE6"
          transmission={0.9} 
          opacity={1} 
          metalness={0.2}
          roughness={0.1}
          ior={1.5}
          clearcoat={1}
        />
      </Cylinder>

      {/* Inner Core */}
      <Cylinder args={[1, 1, 0.4, 6]}>
        <meshStandardMaterial color="#4A6741" metalness={0.8} roughness={0.2} />
      </Cylinder>
    </group>
  );
}

export function SecurityShield3D() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="w-full h-[500px] rounded-[32px] overflow-hidden relative">
      <VisibleCanvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#D9A441" />
        <Environment preset="city" />
        <Float speed={reducedMotion ? 0 : 1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <ShieldCore />
        </Float>
      </VisibleCanvas>
    </div>
  );
}
