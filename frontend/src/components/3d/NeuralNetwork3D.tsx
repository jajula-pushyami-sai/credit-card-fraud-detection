import { useReducedMotion } from '@/utils/useReducedMotion';
import { VisibleCanvas } from '@/components/3d/VisibleCanvas';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Float, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';

const nodes = [
  { pos: [-2, 1, 0], label: "Feature Extraction" },
  { pos: [-1, -1.5, 1], label: "Time Delta" },
  { pos: [0, 2, -1], label: "Amount Scaler" },
  { pos: [1, 0, 1], label: "SHAP Kernel" },
  { pos: [2, -1, 0], label: "Decision Core" },
];

const edges = [
  [0, 1], [0, 2], [1, 3], [2, 3], [3, 4]
];

function Network() {
  const groupRef = useRef<THREE.Group>(null);

  const reducedMotion = useReducedMotion();

  useFrame((state) => {

    if (reducedMotion) return;
    if (groupRef.current) {
      // Parallax rotation
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, (state.pointer.x * Math.PI) / 10, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, (state.pointer.y * Math.PI) / 10, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Draw Nodes */}
      {nodes.map((node, i) => (
        <Float key={i} speed={reducedMotion ? 0 : 1.5} rotationIntensity={0.5} floatIntensity={1}>
          <group position={new THREE.Vector3(...node.pos)}>
            <Sphere args={[0.2, 32, 32]}>
              <meshPhysicalMaterial 
                color={i === 4 ? "#C26E60" : "#4A6741"}
                transmission={0.8} 
                opacity={1} 
                roughness={0.1}
                ior={1.5}
                thickness={0.5}
              />
            </Sphere>
            <Html distanceFactor={10} zIndexRange={[100, 0]} className="pointer-events-none">
              <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border/40 text-xs font-semibold text-primary shadow-sm whitespace-nowrap -translate-x-1/2 mt-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                {node.label}
              </div>
            </Html>
          </group>
        </Float>
      ))}

      {/* Draw Edges */}
      {edges.map((edge, i) => {
        const start = nodes[edge[0]].pos;
        const end = nodes[edge[1]].pos;
        return (
          <Line
            key={`edge-${i}`}
            points={[new THREE.Vector3(...start), new THREE.Vector3(...end)]}
            color="#D9A441"
            lineWidth={1.5}
            transparent
            opacity={0.3}
          />
        );
      })}
    </group>
  );
}

export function NeuralNetwork3D() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="w-full h-[500px] rounded-[32px] overflow-hidden relative">
      <VisibleCanvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#F3EFE6" />
        <Environment preset="city" />
        <Network />
      </VisibleCanvas>
    </div>
  );
}
