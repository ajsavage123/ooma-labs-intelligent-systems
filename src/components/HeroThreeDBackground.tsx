import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Line, useCursor, Float } from "@react-three/drei";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

const NeuralGrid = () => {
  const { mouse, viewport } = useThree();
  const meshRef = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  
  const gridSize = 40;
  const spacing = 0.6;
  const count = gridSize * gridSize;

  // Initial grid positions
  const [positions, initialPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const initial = new Float32Array(count * 3);
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const idx = (i * gridSize + j) * 3;
        pos[idx] = (i - gridSize / 2) * spacing;
        pos[idx + 1] = (j - gridSize / 2) * spacing;
        pos[idx + 2] = 0;
        
        initial[idx] = pos[idx];
        initial[idx + 1] = pos[idx + 1];
        initial[idx + 2] = pos[idx + 2];
      }
    }
    return [pos, initial];
  }, []);

  // Line segments for the grid
  const linePositions = useMemo(() => {
    const lines = new Float32Array(count * 2 * 3 * 2); // Horizontal and vertical lines
    return lines;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;
    const mouseVec = new THREE.Vector3(mouseX, mouseY, 0);

    // Update point positions based on mouse proximity (Ripple effect)
    for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const ix = initialPositions[idx];
        const iy = initialPositions[idx + 1];
        
        const dist = Math.sqrt((ix - mouseX) ** 2 + (iy - mouseY) ** 2);
        
        // Dynamic Z displacement (The "Ripple")
        const ripple = Math.sin(dist * 0.8 - t * 3) * 0.5 * Math.max(0, 1 - dist / 8);
        const attraction = Math.max(0, 1 - dist / 5) * 1.5;
        
        positions[idx + 2] = ripple + attraction;
        
        // Hover tilt
        positions[idx] = ix + (mouseX - ix) * 0.02 * attraction;
        positions[idx + 1] = iy + (mouseY - iy) * 0.02 * attraction;
    }

    if (meshRef.current) {
        meshRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Update lines to match points
    if (lineRef.current) {
        let lineIdx = 0;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const currIdx = (i * gridSize + j) * 3;
                
                // Horizontal connection
                if (j < gridSize - 1) {
                    const nextIdx = (i * gridSize + (j + 1)) * 3;
                    linePositions[lineIdx++] = positions[currIdx];
                    linePositions[lineIdx++] = positions[currIdx + 1];
                    linePositions[lineIdx++] = positions[currIdx + 2];
                    linePositions[lineIdx++] = positions[nextIdx];
                    linePositions[lineIdx++] = positions[nextIdx + 1];
                    linePositions[lineIdx++] = positions[nextIdx + 2];
                }
                
                // Vertical connection
                if (i < gridSize - 1) {
                    const nextIdx = ((i + 1) * gridSize + j) * 3;
                    linePositions[lineIdx++] = positions[currIdx];
                    linePositions[lineIdx++] = positions[currIdx + 1];
                    linePositions[lineIdx++] = positions[currIdx + 2];
                    linePositions[lineIdx++] = positions[nextIdx];
                    linePositions[lineIdx++] = positions[nextIdx + 1];
                    linePositions[lineIdx++] = positions[nextIdx + 2];
                }
            }
        }
        lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group rotation={[-Math.PI / 8, 0, 0]}>
      <Points ref={meshRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#4285F4"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
        />
      </Points>
      
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color="#4285F4" 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending} 
          linewidth={1}
        />
      </lineSegments>
      
      {/* Decorative center glow */}
      <mesh position={[0, 0, -2]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial 
            color="#4285F4" 
            transparent 
            opacity={0.03} 
            side={THREE.DoubleSide}
          />
      </mesh>
    </group>
  );
};

// Data pulses that travel along the grid
const DataPulses = ({ count = 12 }) => {
    const { viewport } = useThree();
    const groupRef = useRef<THREE.Group>(null);
    
    const pulses = useMemo(() => {
        return Array.from({ length: count }, () => ({
            speed: 0.02 + Math.random() * 0.05,
            direction: Math.random() > 0.5 ? 'x' : 'y',
            pos: (Math.random() - 0.5) * 15,
            offset: Math.random() * 20,
            color: Math.random() > 0.7 ? '#EA4335' : '#4285F4'
        }));
    }, [count]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                const p = pulses[i];
                const cycle = (t * p.speed * 50 + p.offset) % 20 - 10;
                if (p.direction === 'x') {
                    child.position.set(cycle, p.pos, 0.1);
                } else {
                    child.position.set(p.pos, cycle, 0.1);
                }
                // Fade in/out at edges
                const opacity = Math.sin((cycle + 10) / 20 * Math.PI);
                (child as THREE.Mesh).scale.setScalar(opacity * 0.5);
            });
        }
    });

    return (
        <group ref={groupRef}>
            {pulses.map((p, i) => (
                <mesh key={i}>
                    <sphereGeometry args={[0.1, 8, 8]} />
                    <meshBasicMaterial color={p.color} transparent opacity={0.6} />
                </mesh>
            ))}
        </group>
    );
};

const HeroThreeDBackground = () => {
  const isMobile = useIsMobile();
  
  if (isMobile) return null;
  
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
      {/* Visual layering: Soft background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4285F4]/5 blur-[120px] rounded-full" />
      
      <Canvas 
        dpr={[1, 1.5]}
        camera={{ position: [0, -2, 12], fov: 40 }}
        gl={{ alpha: true, antialias: true, stencil: false, depth: true }}
      >
        <ambientLight intensity={0.5} />
        
        <NeuralGrid />
        <DataPulses count={15} />
        
        {/* Subtle background dust */}
        <Points positions={new Float32Array(Array.from({length: 300}, () => (Math.random() - 0.5) * 40))}>
            <PointMaterial transparent color="#ffffff" size={0.02} sizeAttenuation opacity={0.1} />
        </Points>
      </Canvas>
    </div>
  );
};

export default HeroThreeDBackground;

