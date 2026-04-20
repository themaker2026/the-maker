'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'

function BellModel() {
  const { scene } = useGLTF('/models/bell.glb')
  const groupRef  = useRef()
  const { size } = useThree()

  // Responsive scaling and positioning
  const isMobile = size.width < 768
  const baseScale = isMobile ? 1.3 : 1.8
  const baseY = isMobile ? -0.05 : -0.1

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    // Constant rotation animation
    groupRef.current.rotation.y = t * 0.25
    // Gentle bobbing effect around origin
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.04
  })

  return (
    <group ref={groupRef} dispose={null}>
      <primitive
        object={scene}
        scale={baseScale}
        position={[0, baseY, 0]}
        rotation={[-0.1, 0, 0]}
      />
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} color="#CBE0E0" />
      <directionalLight
        position={[-3, 5, 3]}
        intensity={1.2}
        color="#ffffff"
      />
      <directionalLight
        position={[3, 2, -3]}
        intensity={0.3}
        color="#CBE0E0"
      />
      <pointLight
        position={[0, 3, 2]}
        intensity={0.4}
        color="#007677"
        distance={7}
      />
    </>
  )
}

export default function BellCanvasBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 6.5], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <Lights />
      <Suspense fallback={null}>
        <BellModel />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload('/models/bell.glb')