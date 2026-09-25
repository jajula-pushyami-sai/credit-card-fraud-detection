import { useReducedMotion } from '@/utils/useReducedMotion';
import { VisibleCanvas } from '@/components/3d/VisibleCanvas';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial, Float } from '@react-three/drei';

const ShieldCore = () => {
  const meshRef = useRef<any>(null);

  const reducedMotion = useReducedMotion();

  useFrame(({ clock }) => {

    if (reducedMotion) return;
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={reducedMotion ? 0 : 1.5} rotationIntensity={1} floatIntensity={1}>
      <Icosahedron ref={meshRef} args={[2, 1]} scale={1.2}>
        <MeshDistortMaterial 
          color="#10b981" 
          attach="material" 
          distort={0.2} 
          speed={reducedMotion ? 0 : 1.5} 
          roughness={0.2}
          metalness={0.8}
          wireframe={true}
          opacity={0.5}
          transparent={true}
        />
      </Icosahedron>
      <Icosahedron args={[1.5, 0]}>
        <meshStandardMaterial color="#059669" emissive="#059669" emissiveIntensity={1} />
      </Icosahedron>
    </Float>
  );
};

export const SecurityShield = () => {
  return (
    <div className="w-full h-[300px] rounded-xl overflow-hidden bg-background/20 relative">
      <VisibleCanvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#10b981" />
        <ShieldCore />
      </VisibleCanvas>
    </div>
  );
};
