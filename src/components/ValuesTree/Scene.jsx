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

// Continue with Scene implementation... 