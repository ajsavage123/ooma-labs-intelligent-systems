import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, OrbitControls, Stars, Points, PointMaterial, MeshWobbleMaterial } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

const InnovationHub = ({ isMobile }: { isMobile: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scale = isMobile ? 0.5 : 0.8;
  const yOffset = isMobile ? 2.5 : 0.8;
  
  // Mouse tracking state
  const mouse = new THREE.Vector2();
  
  useFrame((state) => {
    // Smooth mouse tilt
    const x = (state.mouse.x * 0.5);
    const y = (state.mouse.y * 0.5);
    
    if (groupRef.current) {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x, 0.05);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y, 0.05);
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.005;
    }
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]} position={[0, yOffset, 0]}>
      {/* Central Core with "Liquid" motion */}
      <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#4285F4"
            wireframe
            emissive="#4285F4"
            emissiveIntensity={2}
            transparent
            opacity={0.15}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.7, 15]} />
          <MeshDistortMaterial
            color="#4285F4"
            speed={5}
            distort={0.4}
            radius={1}
            emissive="#1a3b7a"
            emissiveIntensity={1}
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>
      
      {/* "Data Stream" Rings representing Efficiency Bridges */}
      {[1.5, 2.2, 3.0].map((radius, i) => (
        <Float key={i} speed={2 + i} rotationIntensity={5} floatIntensity={0.5}>
          <group rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <mesh>
                <torusGeometry args={[radius, 0.005, 16, 100]} />
                <meshStandardMaterial 
                    color={i === 0 ? "#4285F4" : i === 1 ? "#EA4335" : "#FBBC05"} 
                    emissive={i === 0 ? "#4285F4" : i === 1 ? "#EA4335" : "#FBBC05"}
                    emissiveIntensity={3}
                />
            </mesh>
            {/* Pulsing particles on the rings */}
            {[0, 1, 2, 3].map((p) => (
                <mesh key={p} position={[radius * Math.cos(p * Math.PI/2), radius * Math.sin(p * Math.PI/2), 0]}>
                    <sphereGeometry args={[0.03, 8, 8]} />
                    <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={5} />
                </mesh>
            ))}
          </group>
        </Float>
      ))}
      
      {/* Soft Glow Ambient Field */}
      <mesh scale={[10, 10, 10]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#4285F4" transparent opacity={0.02} side={THREE.BackSide} />
      </mesh>
    </group>
  );
};

const TechnologyParticleGlow = ({ count }: { count: number }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        p[i * 3] = (Math.random() - 0.5) * 25;
        p[i * 3 + 1] = (Math.random() - 0.5) * 25;
        p[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);
  useFrame((state) => {
      if (pointsRef.current) {
          pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
          pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.01;
      }
  });

  return (
    <Points ref={pointsRef} positions={points}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.5}
      />
    </Points>
  );
};

const HeroThreeDBackground = () => {
  const isMobile = useIsMobile();
  
  // DRATICALLY reduce counts for mobile performance
  const starCount = isMobile ? 800 : 5000;
  const particleCount = isMobile ? 500 : 3000;
  const dprValue = isMobile ? 1 : [1, 2] as any;
  
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-50 overflow-hidden">
      <Canvas 
        shadows={!isMobile} 
        dpr={dprValue} 
        camera={{ position: [0, 0, isMobile ? 12 : 8], fov: 50 }}
        gl={{ 
            alpha: true, 
            antialias: !isMobile,
            powerPreference: 'high-performance'
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#4285F4" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#EA4335" />
        <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1} intensity={1} color="#FBBC05" />
        
        <Stars radius={100} depth={50} count={starCount} factor={4} saturation={isMobile ? 0 : 1} fade speed={1} />
        <TechnologyParticleGlow count={particleCount} />
        
        <Suspense fallback={null}>
          <InnovationHub isMobile={isMobile} />
        </Suspense>
        
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
};

export default HeroThreeDBackground;
