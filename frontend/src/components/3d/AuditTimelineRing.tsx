import { useReducedMotion } from '@/utils/useReducedMotion';
import { VisibleCanvas } from '@/components/3d/VisibleCanvas';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Environment, Torus, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const timelineEvents = [
  { color: "#162A2B", offset: 0 },
  { color: "#4A6741", offset: Math.PI / 2 },
  { color: "#D9A441", offset: Math.PI },
  { color: "#C26E60", offset: (3 * Math.PI) / 2 },
];

function TimelineCore() {
  const group = useRef<THREE.Group>(null);
  
  const reducedMotion = useReducedMotion();
  
  useFrame((state) => {
  
    if (reducedMotion) return;
    if (group.current) {
      group.current.rotation.x = Math.PI / 3;
      group.current.rotation.z = state.clock.elapsedTime * -0.1;
    }
  });

  return (
    <group ref={group}>
      {/* Track */}
      <Torus args={[2, 0.05, 16, 64]}>
        <meshPhysicalMaterial color="#ffffff" transmission={0.8} opacity={1} roughness={0.1} ior={1.5} />
      </Torus>

      {/* Events */}
      {timelineEvents.map((evt, i) => (
        <group key={i} rotation={[0, 0, evt.offset]}>
          <Sphere args={[0.2, 32, 32]} position={[2, 0, 0]}>
            <meshStandardMaterial color={evt.color} emissive={evt.color} emissiveIntensity={0.2} />
          </Sphere>
        </group>
      ))}
    </group>
  );
}

export function AuditTimelineRing() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="w-full h-[500px] rounded-[32px] overflow-hidden relative">
      <VisibleCanvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#F3EFE6" />
        <Environment preset="city" />
        <Float speed={reducedMotion ? 0 : 1.5} floatIntensity={0.5}>
          <TimelineCore />
        </Float>
      </VisibleCanvas>
    </div>
  );
}
