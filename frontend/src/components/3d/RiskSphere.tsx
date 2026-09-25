import { useReducedMotion } from '@/utils/useReducedMotion';
import { VisibleCanvas } from '@/components/3d/VisibleCanvas';
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, Environment, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function RiskParticles() {
  const count = 300;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Points inside sphere
      const r = 1.5 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  
  const reducedMotion = useReducedMotion();
  
  useFrame((state) => {
  
    if (reducedMotion) return;
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
      
      // Dynamic color shift based on scroll (simulated via time for now)
      const colorIntensity = (Math.sin(state.clock.elapsedTime * 0.5) + 1) / 2; // 0 to 1
      const material = ref.current.material as THREE.PointsMaterial;
      
      // Transition from Green (#4A6741) to Red (#C26E60)
      const color1 = new THREE.Color("#4A6741");
      const color2 = new THREE.Color("#C26E60");
      material.color.copy(color1).lerp(color2, colorIntensity);
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
    </Points>
  );
}

export function RiskSphere() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="w-full h-[500px] rounded-[32px] overflow-hidden relative">
      <VisibleCanvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#F3EFE6" />
        <Environment preset="city" />
        
        <Float speed={reducedMotion ? 0 : 1.5} rotationIntensity={0.5} floatIntensity={1}>
          <Sphere args={[2, 64, 64]}>
            <meshPhysicalMaterial 
              color="#F3EFE6"
              transmission={0.9} 
              opacity={1} 
              roughness={0} 
              ior={1.5} 
              thickness={2} 
            />
          </Sphere>
          <RiskParticles />
        </Float>
      </VisibleCanvas>
    </div>
  );
}
