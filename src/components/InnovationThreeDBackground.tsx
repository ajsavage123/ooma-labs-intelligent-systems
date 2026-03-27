import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

const KineticGaps = ({ isMobile }: { isMobile: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  const count = isMobile ? 8 : 15;
  
  const boxes = useMemo(() => {
    const b = [];
    for (let i = 0; i < count; i++) {
        b.push({
            position: [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 5
            ] as [number, number, number],
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
            scale: 0.1 + Math.random() * 0.4
        });
    }
    return b;
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
        groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {boxes.map((box, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={1}>
          <mesh position={box.position} rotation={box.rotation} scale={[box.scale, box.scale, box.scale]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
                color={i % 2 === 0 ? "#4285F4" : "#EA4335"} 
                metalness={0.8} 
                roughness={0.2} 
                emissive={i % 2 === 0 ? "#4285F4" : "#EA4335"}
                emissiveIntensity={0.5}
            />
          </mesh>
        </Float>
      ))}
      
      {/* Dynamic connections */}
      {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 12, 32]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.1} />
          </mesh>
      ))}
    </group>
  );
};

const InnovationThreeDBackground = () => {
    const isMobile = useIsMobile();
    
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
            <Canvas 
                camera={{ position: [0, 0, 10], fov: 50 }}
                gl={{ alpha: true, antialias: true }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#4285F4" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#EA4335" />
                
                <Suspense fallback={null}>
                    <KineticGaps isMobile={isMobile} />
                </Suspense>
                
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};

export default InnovationThreeDBackground;
