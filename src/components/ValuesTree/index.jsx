import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Scene from './Scene';
import LoadingScreen from '../LoadingScreen';

const ValuesTree = () => {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 5, 10]} />
          <Scene />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.5}
          />
        </Suspense>
      </Canvas>
      <LoadingScreen />
    </div>
  );
};

export default ValuesTree;