"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, Center } from "@react-three/drei";
import { useScroll, useTransform, useSpring, motion, useInView } from "framer-motion";

function BellModel({ scrollRotation, scrollY }) {
  const { scene } = useGLTF("/models/bell.glb");
  const groupRef = useRef();
  const constantRotRef = useRef(0);
  
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 900 : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Increased mobile scale significantly as requested, while keeping desktop the same
  const scale = isMobile ? 2.4 : 1.75; 
  const baseY = isMobile ? -0.2 : 0.0;

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Clamp delta to max 0.1s to avoid huge rotation jumps when resuming from a paused state
    const dt = Math.min(delta, 0.1);
    constantRotRef.current += dt * 0.4; // Constant slow rotation multiplier
    
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y =
      constantRotRef.current + Math.sin(t * 0.3) * 0.12 + (scrollRotation.get() || 0);
    groupRef.current.position.y =
      baseY + Math.sin(t * 0.5) * 0.03 + (scrollY.get() || 0);
  });

  // Enhance material properties without touching the original .glb file
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.envMapIntensity = 1.6; // Boosts reflection brightness (default is 1)
        child.material.roughness = 0.15; // Makes the brass slightly smoother/shinier
        child.material.metalness = 0.9; // Forces the material to act like pure metal
        child.material.color.set("#d4af37"); // Injects a rich, premium "Golden" hue (Metallic Gold hex)
        child.material.needsUpdate = true;
      }
    });
  }, [scene]);

  // Tilt the bell backward slightly on mobile to reveal more of the underlying bottom
  const initRotation = isMobile ? [-0.20, 0, 0] : [0.02, 0, 0];

  return (
    <group ref={groupRef} dispose={null}>
      <Center>
        <primitive
          object={scene}
          scale={scale}
          position={[0, 0, 0]}
          rotation={initRotation}
        />
      </Center>
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} color="#f0f4f4" />
      <directionalLight position={[-4, 6, 4]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[4, 2, -4]} intensity={0.4} color="#CBE0E0" />
      <pointLight
        position={[0, 4, 2]}
        intensity={0.5}
        color="#007677"
        distance={8}
      />
    </>
  );
}

export default function BellCanvas() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef);

  const { scrollYProgress } = useScroll();

  const rotateY = useTransform(scrollYProgress, [0, 0.5], [0, Math.PI * 0.18]);
  const posY = useTransform(scrollYProgress, [0, 0.5], [0, -0.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0.35]);

  const springRotateY = useSpring(rotateY, { stiffness: 60, damping: 20 });
  const springPosY = useSpring(posY, { stiffness: 60, damping: 20 });

  return (
    <motion.div ref={containerRef} style={{ width: "100%", height: "100%", opacity }}>
      <Canvas
        frameloop={isInView ? "always" : "demand"}
        camera={{ position: [0, 0.5, 8.5], fov: 38 }}
        dpr={[1, 1.5]} // Cap DPR to prevent memory exhaustion on high-res mobile devices
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: "high-performance"
          // Removed manual mediump precision: allowing highp restores smooth metallic reflections automatically!
        }}
        style={{ background: "transparent" }}
      >
        <Lights />
        <Suspense fallback={null}>
          <BellModel scrollRotation={springRotateY} scrollY={springPosY} />
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.3}
            scale={7}
            blur={1.5}
            far={2}
            resolution={256} // Lower resolution texturing to save VRAM
            color="#0f2b2b"
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}

useGLTF.preload("/models/bell.glb");
