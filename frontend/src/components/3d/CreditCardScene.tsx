import { useReducedMotion } from '@/utils/useReducedMotion';
import { VisibleCanvas } from '@/components/3d/VisibleCanvas';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float, Environment, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';

function Card() {
  const group = useRef<THREE.Group>(null);

  const reducedMotion = useReducedMotion();

  useFrame((state) => {

    if (reducedMotion) return;
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, (state.pointer.x * Math.PI) / 8, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -(state.pointer.y * Math.PI) / 8, 0.05);
    }
  });

  return (
    <Float speed={reducedMotion ? 0 : 1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={group}>
        {/* Glass Body */}
        <RoundedBox args={[3.37, 2.12, 0.05]} radius={0.1} smoothness={4} castShadow>
          <meshPhysicalMaterial 
            color="#ffffff"
            transmission={0.95} 
            opacity={1}
            metalness={0.2}
            roughness={0.05}
            ior={1.5}
            thickness={0.5}
            clearcoat={1}
          />
        </RoundedBox>

        {/* Microchip */}
        <RoundedBox args={[0.4, 0.3, 0.06]} radius={0.05} position={[-1.1, 0.4, 0.01]}>
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
        </RoundedBox>

        {/* Branding */}
        <Text
          position={[0, -0.4, 0.03]}
          fontSize={0.2}
          color="#162A2B"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
        >
          FRAUDSHIELD AI
        </Text>
      </group>
    </Float>
  );
}

export function CreditCardScene() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="w-full h-[500px] rounded-[32px] overflow-hidden relative">
      <VisibleCanvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#F3EFE6" />
        <Environment preset="city" />
        <Card />
        <ContactShadows position={[0, -2, 0]} opacity={0.3} scale={10} blur={2.5} far={4} color="#162A2B" />
      </VisibleCanvas>
    </div>
  );
}
