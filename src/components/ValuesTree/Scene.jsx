import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { Text, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Points, Point } from '@react-three/drei';

const VALUES = [
  {
    id: 1,
    name: 'Truthfulness (Sat)',
    description: 'Honesty and integrity are paramount in Sikh teachings. The Guru Granth Sahib emphasizes the importance of speaking the truth and living a truthful life.',
    examples: ['Honest Speech', 'Integrity', 'Transparency'],
    color: '#FFD700',
    position: [0, 2, 0],
    connections: [2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    id: 2,
    name: 'Compassion (Daya)',
    description: 'Sikhism promotes empathy and kindness towards all beings. Believers are encouraged to act with compassion and understanding, especially towards those in need.',
    examples: ['Helping the Needy', 'Empathy', 'Kindness'],
    color: '#FF6B6B',
    position: [-2, 1, 2],
    connections: [1, 3]
  },
  {
    id: 3,
    name: 'Contentment (Santokh)',
    description: 'Sikhs are taught to be content with what they have and to avoid greed and materialism. Contentment is seen as a way to cultivate spiritual growth and reduce attachment to worldly possessions.',
    examples: ['Gratitude', 'Simplicity', 'Non-attachment'],
    color: '#4ECDC4',
    position: [2, 1, -2],
    connections: [1, 2]
  },
  {
    id: 4,
    name: 'Humility (Nimrata)',
    description: 'Humility and modesty are considered essential qualities in Sikhism. Believers are encouraged to recognize their own limitations and to avoid arrogance and pride.',
    examples: ['Modesty', 'Respect for Others', 'Self-awareness'],
    color: '#45B7D1',
    position: [-2, 0, -2],
    connections: [1, 5]
  },
  {
    id: 5,
    name: 'Love (Pyaar)',
    description: 'Sikh teachings emphasize love for God and for all humanity. Believers are encouraged to cultivate love, respect, and empathy for others, regardless of their background or beliefs.',
    examples: ['Universal Love', 'Respect', 'Empathy'],
    color: '#96CEB4',
    position: [2, -1, 2],
    connections: [1, 4]
  },
  {
    id: 6,
    name: 'Social Equality & Justice',
    description: 'The Guru Granth Sahib promotes the idea of equality for all people, regardless of caste, color, religion, or gender. Sikhs are encouraged to work towards a more just and equitable society, advocating for the rights of marginalized communities and fighting against oppression.',
    examples: ['Equality', 'Justice', 'Advocacy'],
    color: '#FFCA28',
    position: [-2, -2, 2],
    connections: [1, 7]
  },
  {
    id: 7,
    name: 'Selfless Service (Seva)',
    description: 'Serving others without expecting anything in return is a central tenet of Sikhism. Seva is seen as a way to connect with God and to contribute to the well-being of society.',
    examples: ['Langar', 'Community Service', 'Volunteering'],
    color: '#AB47BC',
    position: [2, -2, -2],
    connections: [1, 6]
  },
  {
    id: 8,
    name: 'Earn an Honest Living (Kirat Karni)',
    description: 'Sikhs are encouraged to work hard and earn an honest living, avoiding exploitation and unethical practices.',
    examples: ['Hard Work', 'Ethical Earning', 'Dignity of Labor'],
    color: '#26A69A',
    position: [-2, 2, -2],
    connections: [1, 9]
  },
  {
    id: 9,
    name: 'Sharing with Others (Vand Ke Chakna)',
    description: 'Believers are encouraged to share their earnings with those in need and to contribute to the welfare of the community.',
    examples: ['Charity', 'Community Support', 'Resource Sharing'],
    color: '#FFA726',
    position: [2, 2, 2],
    connections: [1, 8]
  },
  {
    id: 10,
    name: 'Reverence for the Guru Granth Sahib',
    description: 'The Guru Granth Sahib is treated with the utmost respect and reverence, as the living Guru. Its teachings are the foundation of Sikh values and ethics.',
    examples: ['Scripture Reading', 'Respectful Conduct', 'Spiritual Guidance'],
    color: '#8D6E63',
    position: [0, -2, 0],
    connections: [1]
  }
];

const ValueOrb = ({ value, isSelected, onSelect }) => {
  const orbRef = useRef();
  const [hovered, setHovered] = useState(false);
  const particlesRef = useRef();

  const { scale, intensity, pulseScale } = useSpring({
    scale: hovered || isSelected ? 1.25 : 1,
    intensity: isSelected ? 2 : (hovered ? 1.5 : 1),
    pulseScale: isSelected ? 1.4 : 1,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  useFrame(() => {
    if (orbRef.current) orbRef.current.rotation.y += 0.01;
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

const ValueDetails = ({ value, onClose }) => {
  if (!value) return null;

  return (
<Html center position={[0, 1, 0]} transform scale={0.8}>      <div style={{
        background: 'rgba(0, 0, 0, 0.88)',
        padding: '16px',
        borderRadius: '14px',
        color: 'white',
        width: '260px',
        boxShadow: `0 0 18px ${value.color}40`,
        border: `2px solid ${value.color}`,
        textAlign: 'center',
      }}>
        <h2 style={{ color: value.color, marginBottom: '10px', fontSize: '1.1rem' }}>
          {value.name}
        </h2>
        <p style={{ lineHeight: '1.5', marginBottom: '12px', fontSize: '0.98rem' }}>
          {value.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', justifyContent: 'center' }}>
          {value.examples.map((example, i) => (
            <div
              key={i}
              style={{
                background: `${value.color}20`,
                border: `1px solid ${value.color}`,
                padding: '5px 10px',
                borderRadius: '14px',
                fontSize: '0.85em'
              }}
            >
              {example}
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{
            marginTop: '12px',
            background: value.color,
            color: '#222',
            border: 'none',
            borderRadius: '12px',
            padding: '6px 18px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.95rem',
            boxShadow: `0 2px 8px ${value.color}33`,
            transition: 'background 0.2s',
          }}
        >Close</button>
      </div>
    </Html>
  );
};

const Scene = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [activeConnections, setActiveConnections] = useState([]);
  const sceneRef = useRef();
  const particlesRef = useRef();

  const handleValueSelect = (value) => {
    setSelectedValue(value);
    setActiveConnections(value.connections);
  };

  useFrame((state, delta) => {
if (particlesRef.current) {
// spin the whole particle system around Y
particlesRef.current.rotation.y += delta * 0.1
// or pulse them up/down:
// particlesRef.current.position.y = Math.sin(state.clock.elapsedTime) * 2
 }
       })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      
      {/* Ambient particles */}
      <Points ref={particlesRef}>  <pointsMaterial
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
      <group ref={sceneRef} position={[0, 1.5, 0]}>        {/* Connection beams */}
        {VALUES.map(value => 
          value.connections.map(connectionId => {
            const connectedValue = VALUES.find(v => v.id === connectionId);
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
        {VALUES.map(value => (
          <ValueOrb
            key={value.id}
            value={value}
            isSelected={selectedValue?.id === value.id}
            onSelect={handleValueSelect}
          />
        ))}
      </group>

      {/* Details panel */}
      <ValueDetails value={selectedValue} onClose={() => {
        setSelectedValue(null);
        setActiveConnections([]);
      }} />
    </>
  );
};

export default Scene; 