import { VisibleCanvas } from '@/components/3d/VisibleCanvas';
import React from "react";
export * from './CreditCardScene';
import { OrbitControls, Environment, Sphere, Box } from "@react-three/drei";

import { useReducedMotion } from '@/utils/useReducedMotion';

// Basic reusable canvas wrapper
export const SceneWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const reducedMotion = useReducedMotion();
  return (
    <div className={`w-full h-full min-h-[300px] rounded-xl overflow-hidden glass ${className || ""}`}>
      <VisibleCanvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="city" />
        {children}
        <OrbitControls enableZoom={false} autoRotate={!reducedMotion} autoRotateSpeed={0.5} />
      </VisibleCanvas>
    </div>
  );
};

// 3D Stubs requested by design specs
export const GlassShield = () => (
  <SceneWrapper>
    <Box args={[2, 2.5, 0.2]} castShadow receiveShadow>
      <meshPhysicalMaterial 
        color="#8FAF9B" 
        transmission={0.9} 
        opacity={1} 
        metalness={0.1} 
        roughness={0.1} 
        ior={1.5} 
        thickness={0.5}
      />
    </Box>
  </SceneWrapper>
);

export const AICore = () => (
  <SceneWrapper>
    <Sphere args={[1, 64, 64]}>
      <meshStandardMaterial color="#C7A66A" wireframe />
    </Sphere>
    <Sphere args={[0.5, 32, 32]}>
      <meshStandardMaterial color="#1E1E1E" />
    </Sphere>
  </SceneWrapper>
);

export const TransactionNetwork = () => <SceneWrapper><Sphere args={[1, 32, 32]}><meshStandardMaterial color="#6F7287" wireframe /></Sphere></SceneWrapper>;
export const DataFlow = () => <SceneWrapper><Box args={[1.5, 1.5, 1.5]}><meshStandardMaterial color="#D9A441" wireframe /></Box></SceneWrapper>;
export const SecurityRing = () => <SceneWrapper><Sphere args={[1.2, 32, 32]}><meshStandardMaterial color="#8FAF9B" wireframe /></Sphere></SceneWrapper>;
export const FraudPulse = () => <SceneWrapper><Sphere args={[1.5, 32, 32]}><meshStandardMaterial color="#D96B6B" wireframe /></Sphere></SceneWrapper>;
export const RiskRadar = () => <SceneWrapper><Sphere args={[1, 32, 32]}><meshStandardMaterial color="#F8F5F2" wireframe /></Sphere></SceneWrapper>;
export const FloatingAnalyticsPanels = () => <SceneWrapper><Box args={[2, 1, 0.1]}><meshStandardMaterial color="#1E1E1E" /></Box></SceneWrapper>;
export const ExplainabilityNodes = () => <SceneWrapper><Sphere args={[0.8, 16, 16]}><meshStandardMaterial color="#C7A66A" /></Sphere></SceneWrapper>;
export const PredictionOrb = () => <SceneWrapper><Sphere args={[1, 64, 64]}><meshStandardMaterial color="#8FAF9B" /></Sphere></SceneWrapper>;
