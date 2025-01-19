import React, { useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { Html, useTexture } from '@react-three/drei';
import punjabMapTexture from '../../assets/punjab-map.jpg';
const HISTORICAL_EVENTS = [
    { 
      id: 1, 
      name: 'Farmers Protest 2020-2021', 
      location: 'Delhi Border',
      position: [2, 0, 1], 
      year: 2020,
      description: 'The largest peaceful protest in history, where millions of farmers united against controversial agricultural laws, leading to their eventual repeal.',
      category: 'Modern'
    },
    { 
      id: 2, 
      name: 'Operation Blue Star', 
      location: 'Amritsar',
      position: [-1, 0, -2], 
      year: 1984,
      description: 'Military operation that deeply impacted the Sikh community and led to significant historical changes in Punjab.',
      category: 'Political'
    },
    { 
      id: 3, 
      name: 'Partition of Punjab', 
      location: 'Wagah Border',
      position: [1.5, 0, -1], 
      year: 1947,
      description: 'The division of Punjab during Indian independence, leading to one of the largest migrations in human history.',
      category: 'Historical'
    },
    { 
      id: 4, 
      name: 'Battle of Saragarhi', 
      location: 'Saragarhi',
      position: [-0.5, 0, 1.5], 
      year: 1897,
      description: '21 Sikh soldiers fought against 10,000 Afghan tribesmen, showing unprecedented bravery and dedication.',
      category: 'Military'
    },
    { 
      id: 5, 
      name: 'First Anglo-Sikh War', 
      location: 'Ferozepur',
      position: [1, 0, 0], 
      year: 1845,
      description: 'Major conflict between the Sikh Empire and the British East India Company.',
      category: 'Military'
    },
    { 
      id: 6, 
      name: 'Foundation of Khalsa', 
      location: 'Anandpur Sahib',
      position: [-1.5, 0, 0], 
      year: 1699,
      description: 'Guru Gobind Singh Ji established the Khalsa, marking a pivotal moment in Sikh history.',
      category: 'Religious'
    },
    { 
      id: 7, 
      name: 'Green Revolution', 
      location: 'Punjab Plains',
      position: [0, 0, -1], 
      year: 1960,
      description: 'Agricultural transformation that made Punjab the "Breadbasket of India".',
      category: 'Economic'
    },
    { 
      id: 8, 
      name: 'Jallianwala Bagh Massacre', 
      location: 'Amritsar',
      position: [-0.8, 0, -1.5], 
      year: 1919,
      description: 'Tragic event where peaceful protesters were fired upon, becoming a turning point in India\'s freedom struggle.',
      category: 'Historical'
    }
  ];
  
  const categoryColors = {
    Modern: '#FF6B6B',
    Political: '#4ECDC4',
    Historical: '#45B7D1',
    Military: '#96CEB4',
    Religious: '#FFEEAD',
    Economic: '#D4A5A5'
  };

const categoryColors = {
  Modern: '#FF6B6B',
  Political: '#4ECDC4',
  Historical: '#45B7D1',
  Military: '#96CEB4',
  Religious: '#FFEEAD',
  Economic: '#D4A5A5'
};

const Pin = ({ position, onClick, isActive }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  const { scale, color } = useSpring({
    scale: hovered ? 1.5 : 1,
    color: isActive ? '#ffd700' : (hovered ? '#ff4444' : '#ff0000'),
    config: { mass: 1, tension: 170, friction: 26 }
  });

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <cylinderGeometry args={[0.1, 0, 0.3, 32]} />
      <animated.meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </animated.mesh>
  );
};

const Timeline = ({ selectedYear, allYears }) => {
  const containerRef = useRef();

  return (
    <Html center position={[0, -2.5, 0]} transform portal={containerRef}>
      <div className="timeline-container" style={{
        width: '800px',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '20px',
        borderRadius: '15px',
        color: 'white'
      }}>
        <div className="timeline-line" style={{
          height: '3px',
          background: 'linear-gradient(90deg, #FFD700, #FFA500)',
          position: 'relative'
        }}>
          {HISTORICAL_EVENTS.map((event) => (
            <div
              key={event.id}
              className="timeline-marker"
              style={{
                position: 'absolute',
                left: `${((event.year - 1699) / (2020 - 1699)) * 100}%`,
                transform: 'translateX(-50%)',
                width: selectedYear === event.year ? '20px' : '12px',
                height: selectedYear === event.year ? '20px' : '12px',
                borderRadius: '50%',
                background: categoryColors[event.category],
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              <div className="year-label" style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: selectedYear === event.year ? '16px' : '12px',
                fontWeight: selectedYear === event.year ? 'bold' : 'normal'
              }}>
                {event.year}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Html>
  );
};

const EventDetails = ({ event }) => {
  if (!event) return null;

  return (
    <Html center position={[0, 1, 0]} transform>
      <div style={{
        background: 'rgba(0, 0, 0, 0.85)',
        padding: '25px',
        borderRadius: '15px',
        color: 'white',
        width: '400px',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
        border: `2px solid ${categoryColors[event.category]}`
      }}>
        <h2 style={{ color: categoryColors[event.category], marginBottom: '10px' }}>
          {event.name}
        </h2>
        <h3 style={{ color: '#FFD700', marginBottom: '15px' }}>
          {event.location} • {event.year}
        </h3>
        <p style={{ lineHeight: '1.6' }}>{event.description}</p>
        <div style={{
          marginTop: '15px',
          padding: '5px 10px',
          background: categoryColors[event.category],
          display: 'inline-block',
          borderRadius: '15px',
          color: 'black'
        }}>
          {event.category}
        </div>
      </div>
    </Html>
  );
};

const Scene = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const mapRef = useRef();
  const cameraRef = useRef();

  // Load textures
  const mapTexture = useTexture(punjabMapTexture);
  const normalMap = useTexture('/textures/punjab-normal.jpg');
  const heightMap = useTexture('/textures/punjab-height.jpg');

  // Spring animations for camera movement
  const { cameraPosition } = useSpring({
    cameraPosition: selectedEvent 
      ? [selectedEvent.position[0] * 1.5, 2, selectedEvent.position[2] * 1.5]
      : [0, 5, 5],
    config: { mass: 1, tension: 280, friction: 120 }
  });

  useFrame((state) => {
    // Smooth camera animation
    if (selectedEvent) {
      state.camera.position.lerp(new THREE.Vector3(...cameraPosition.get()), 0.05);
      state.camera.lookAt(selectedEvent.position[0], 0, selectedEvent.position[2]);
    } else {
      state.camera.position.lerp(new THREE.Vector3(0, 5, 5), 0.05);
      state.camera.lookAt(0, 0, 0);
    }
  });

  // Event marker component with animations
  const EventMarker = ({ event }) => {
    const isSelected = selectedEvent?.id === event.id;
    const isHovered = hoveredEvent?.id === event.id;
    
    const { scale, color, height } = useSpring({
      scale: isSelected ? 1.5 : (isHovered ? 1.2 : 1),
      color: isSelected ? '#FFD700' : (isHovered ? '#FFA500' : categoryColors[event.category]),
      height: isSelected ? 2 : (isHovered ? 1.5 : 1),
      config: { mass: 1, tension: 280, friction: 60 }
    });

    return (
      <group position={event.position}>
        <animated.mesh
          position-y={height}
          scale={scale}
          onClick={() => setSelectedEvent(event)}
          onPointerOver={() => setHoveredEvent(event)}
          onPointerOut={() => setHoveredEvent(null)}
        >
          <cylinderGeometry args={[0.1, 0, 0.3, 32]} />
          <animated.meshStandardMaterial 
            color={color} 
            metalness={0.8}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </animated.mesh>
        
        {/* Light beam effect */}
        {(isSelected || isHovered) && (
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.05, 0.05, height.get(), 16]} />
            <meshBasicMaterial 
              color={color.get()} 
              transparent
              opacity={0.3}
            />
          </mesh>
        )}

        {/* Ripple effect */}
        <animated.mesh
          position-y={0.01}
          rotation-x={-Math.PI / 2}
        >
          <ringGeometry args={[0, 0.3, 32]} />
          <animated.meshBasicMaterial
            color={color}
            transparent
            opacity={isSelected || isHovered ? 0.5 : 0}
          />
        </animated.mesh>
      </group>
    );
  };

  return (
    <>
      {/* Ambient and directional lights */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1}
        castShadow
      />

      {/* Spotlight following selected event */}
      {selectedEvent && (
        <spotLight
          position={[
            selectedEvent.position[0],
            5,
            selectedEvent.position[2]
          ]}
          angle={0.3}
          penumbra={0.8}
          intensity={1.5}
          color="#FFD700"
          castShadow
        />
      )}

      {/* Punjab map plane */}
      <mesh 
        ref={mapRef}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 10, 128, 128]} />
        <meshStandardMaterial
          map={mapTexture}
          normalMap={normalMap}
          normalScale={[0.1, 0.1]}
          displacementMap={heightMap}
          displacementScale={0.2}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Event markers */}
      {HISTORICAL_EVENTS.map((event) => (
        <EventMarker key={event.id} event={event} />
      ))}

      {/* Event details overlay */}
      <EventDetails event={selectedEvent} />

      {/* Interactive timeline */}
      <Timeline 
        selectedYear={selectedEvent?.year}
        allYears={HISTORICAL_EVENTS.map(e => e.year)}
      />

      {/* Close button */}
      {selectedEvent && (
        <Html center position={[3, 2, 0]}>
          <button
            onClick={() => setSelectedEvent(null)}
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Close Event
          </button>
        </Html>
      )}
    </>
  );
};

export default Scene; 