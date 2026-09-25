import { useReducedMotion } from '@/utils/useReducedMotion';
import { VisibleCanvas } from '@/components/3d/VisibleCanvas';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const gridData = Array.from({ length: 16 }, (_, i) => ({
  pos: [(i % 4) - 1.5, Math.floor(i / 4) - 1.5, 0],
  active: Math.random() > 0.5
}));

function GridCore() {
  const group = useRef<THREE.Group>(null);
  
  const reducedMotion = useReducedMotion();
  
  useFrame((state) => {
  
    if (reducedMotion) return;
    if (group.current) {
      group.current.rotation.x = Math.PI / 4;
      group.current.rotation.z = Math.PI / 4;
      // Parallax
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={group}>
      {gridData.map((tile, i) => (
        <Box key={i} args={[0.8, 0.8, 0.1]} position={new THREE.Vector3(...tile.pos)}>
          <meshPhysicalMaterial 
            color={tile.active ? "#4A6741" : "#F3EFE6"} 
            transmission={0.8} 
            opacity={1} 
            roughness={0.1}
            ior={1.5}
          />
        </Box>
      ))}
    </group>
  );
}

export function ComplianceGrid3D() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="w-full h-[500px] rounded-[32px] overflow-hidden relative">
      <VisibleCanvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#F3EFE6" />
        <Environment preset="city" />
        <Float speed={reducedMotion ? 0 : 1.5} floatIntensity={0.5}>
          <GridCore />
        </Float>
      </VisibleCanvas>
    </div>
  );
}
