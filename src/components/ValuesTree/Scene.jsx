import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Text, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const VALUES_DATA = [
  {
    id: 1,
    name: 'Seva (Selfless Service)',
    description: 'The practice of selfless service without expectation of reward.',
    examples: ['Langar', 'Community Service', 'Helping Others'],
    color: '#FFD700',
    position: [0, 2, 0],
    connections: [2, 5]
  },
  {
    id: 2,
    name: 'Kirat Karni',
    description: 'Earning an honest living through ethical means.',
    examples: ['Hard Work', 'Honest Living', 'Dignity of Labor'],
    color: '#FF6B6B',
    position: [-2, 1, 2],
    connections: [1, 3]
  },
  {
    id: 3,
    name: 'Vand Chakna',
    description: 'Sharing with others and caring for community.',
    examples: ['Sharing Resources', 'Community Support', 'Collective Progress'],
    color: '#4ECDC4',
    position: [2, 1, -2],
    connections: [1, 2]
  },
  {
    id: 4,
    name: 'Sarbat Da Bhala',
    description: 'Welfare and wellbeing of all humanity.',
    examples: ['Universal Welfare', 'Equality', 'Inclusivity'],
    color: '#45B7D1',
    position: [-2, 0, -2],
    connections: [1, 3, 5]
  },
  {
    id: 5,
    name: 'Chardi Kala',
    description: 'Eternal optimism and high spirits.',
    examples: ['Resilience', 'Positivity', 'Courage'],
    color: '#96CEB4',
    position: [2, -1, 2],
    connections: [4, 6]
  }
];

const ValueOrb = ({ value, isSelected, onSelect }) => {
  const orbRef = useRef();
  const [hovered, setHovered] = useState(false);
  const particlesRef = useRef();

  const { scale, intensity, pulseScale } = useSpring({
    scale: hovered ? 1.2 : 1,
    intensity: isSelected ? 2 : (hovered ? 1.5 : 1),
    pulseScale: isSelected ? 1.4 : 1,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  useFrame((state) => {
    // Orbital rotation
    if (orbRef.current) {
      orbRef.current.rotation.y += 0.01;
    }
    
    // Particle system animation
    if (particlesRef.current) {
      particlesRef.current.rotation.y -= 0.005;
      particlesRef.current.children.forEach((particle, i) => {
        particle.position.y = Math.sin(state.clock.elapsedTime + i) * 0.1;
      });
    }
  });

  return (
    <group position={value.position}>
      {/* Main orb */}
      <animated.mesh
        ref={orbRef}
        scale={scale}
        onClick={() => onSelect(value)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <animated.meshPhysicalMaterial
          color={value.color}
          metalness={0.2}
          roughness={0.1}
          transmission={0.6}
          thickness={0.5}
          emissive={value.color}
          emissiveIntensity={intensity}
        />
      </animated.mesh>

      {/* Energy particles */}
      <group ref={particlesRef}>
        {Array.from({ length: 20 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.sin(i) * 0.8,
              Math.cos(i) * 0.8,
              Math.sin(i + Math.PI) * 0.8
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial
              color={value.color}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Value name with glow */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.2}
        color={value.color}
        anchorX="center"
        anchorY="middle"
      >
        {value.name}
      </Text>
    </group>
  );
};

const ConnectionBeam = ({ start, end, color, active }) => {
  const beamRef = useRef();

  const { opacity, width } = useSpring({
    opacity: active ? 0.6 : 0.2,
    width: active ? 0.1 : 0.05,
    config: { duration: 1000 }
  });

  useFrame((state) => {
    if (beamRef.current) {
      beamRef.current.material.dashOffset -= 0.01;
    }
  });

  const points = [
    new THREE.Vector3(...start),
    new THREE.Vector3(
      (start[0] + end[0]) / 2,
      ((start[1] + end[1]) / 2) + 1,
      (start[2] + end[2]) / 2
    ),
    new THREE.Vector3(...end)
  ];

  const curve = new THREE.QuadraticBezierCurve3(...points);
  const geometry = new THREE.TubeGeometry(curve, 20, width.get(), 8, false);

  return (
    <animated.mesh ref={beamRef}>
      <primitive object={geometry} />
      <animated.meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        dashSize={0.5}
        gapSize={0.2}
      />
    </animated.mesh>
  );
};

const ValueDetails = ({ value }) => {
  if (!value) return null;

  return (
    <Html center position={[0, 1, 0]} transform>
      <div style={{
        background: 'rgba(0, 0, 0, 0.85)',
        padding: '25px',
        borderRadius: '15px',
        color: 'white',
        width: '400px',
        boxShadow: `0 0 30px ${value.color}40`,
        border: `2px solid ${value.color}`
      }}>
        <h2 style={{ color: value.color, marginBottom: '15px' }}>
          {value.name}
        </h2>
        <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
          {value.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {value.examples.map((example, index) => (
            <div
              key={index}
              style={{
                background: `${value.color}20`,
                border: `1px solid ${value.color}`,
                padding: '8px 15px',
                borderRadius: '20px',
                fontSize: '0.9em'
              }}
            >
              {example}
            </div>
          ))}
        </div>
      </div>
    </Html>
  );
};

const Scene = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [activeConnections, setActiveConnections] = useState([]);
  const sceneRef = useRef();

  const handleValueSelect = (value) => {
    setSelectedValue(value);
    setActiveConnections(value.connections);
  };

  useFrame((state) => {
    // Ambient scene rotation
    if (sceneRef.current && !selectedValue) {
      sceneRef.current.rotation.y += 0.001;
    }
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      
      {/* Ambient particles */}
      <Points>
        <pointsMaterial
          size={0.05}
          color="#ffffff"
          transparent
          opacity={0.4}
          sizeAttenuation
        />
        {Array.from({ length: 1000 }).map((_, i) => (
          <Point
            key={i}
            position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20
            ]}
          />
        ))}
      </Points>

      {/* Main content group */}
      <group ref={sceneRef}>
        {/* Connection beams */}
        {VALUES_DATA.map(value => 
          value.connections.map(connectionId => {
            const connectedValue = VALUES_DATA.find(v => v.id === connectionId);
            return (
              <ConnectionBeam
                key={`${value.id}-${connectionId}`}
                start={value.position}
                end={connectedValue.position}
                color={value.color}
                active={activeConnections.includes(connectionId)}
              />
            );
          })
        )}

        {/* Value orbs */}
        {VALUES_DATA.map(value => (
          <ValueOrb
            key={value.id}
            value={value}
            isSelected={selectedValue?.id === value.id}
            onSelect={handleValueSelect}
          />
        ))}
      </group>

      {/* Details panel */}
      <ValueDetails value={selectedValue} />

      {/* Close button */}
      {selectedValue && (
        <Html center position={[3, 2, 0]}>
          <button
            onClick={() => {
              setSelectedValue(null);
              setActiveConnections([]);
            }}
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.3s ease'
            }}
          >
            Close
          </button>
        </Html>
      )}
    </>
  );
};

export default Scene; 