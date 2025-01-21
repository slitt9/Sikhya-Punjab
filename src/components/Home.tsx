import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParallaxTilt from 'react-parallax-tilt';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const HomeContainer = styled.div`
  min-height: 400vh;
  background: linear-gradient(
    to bottom,
    #f7e9d7,
    #e6c9a8,
    #d4b08c,
    #c2977f
  );
  overflow: hidden;
  position: relative;
`;

const HeroSection = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const TitleContainer = styled(motion.div)`
  position: relative;
  z-index: 2;
  text-align: center;
`;

const MainTitle = styled(motion.h1)`
  font-size: 8rem;
  font-weight: bold;
  background: linear-gradient(45deg, #FFD700, #B8860B);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 3s linear infinite;
  font-family: 'Playfair Display', serif;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.8rem;
  color: #4a4a4a;
  max-width: 800px;
  line-height: 1.6;
  margin: 0 auto;
  text-align: center;
  font-family: 'Poppins', sans-serif;
`;

const WheatField = styled(motion.div)`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40vh;
  z-index: 1;
`;

const ParallaxSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 4rem 2rem;
`;

const ContentCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  max-width: 1200px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled(motion.div)`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
`;

const FloatingSymbol = styled(motion.div)`
  position: absolute;
  font-size: 3rem;
  color: goldenrod;
  animation: ${float} 3s ease-in-out infinite;
  opacity: 0.6;
`;

// 3D Wheat component for Three.js
const Wheat = () => {
  const mesh = useRef();
  const texture = useLoader(TextureLoader, '/wheat.png');

  useFrame((state) => {
    mesh.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial map={texture} transparent />
    </mesh>
  );
};

// Particle background component
const ParticleBackground = () => {
  useEffect(() => {
    // Initialize particles.js
    particlesJS('particles-js', {
      particles: {
        number: { value: 80 },
        color: { value: '#FFD700' },
        shape: { type: 'circle' },
        opacity: { value: 0.5 },
        size: { value: 3 },
        move: { speed: 2 }
      }
    });
  }, []);

  return <div id="particles-js" style={{ position: 'absolute', width: '100%', height: '100%' }} />;
};

export default function Home() {
  const [isEnglish, setIsEnglish] = useState(true);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const wheatScale = useTransform(scrollYProgress, [0, 0.5], [0.1, 1]);
  const wheatY = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  const titleSpring = useSpring({
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1 },
    config: { tension: 300, friction: 10 }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setIsEnglish(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // GSAP animations
    gsap.to('.feature-card', {
      scrollTrigger: {
        trigger: '.feature-card',
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      },
      y: 0,
      opacity: 1,
      stagger: 0.2
    });
  }, []);

  return (
    <HomeContainer ref={containerRef}>
      <HeroSection>
        <ParticleBackground />
        
        <TitleContainer>
          <MainTitle
            animate={{
              scale: [1, 1.02, 1],
              transition: { duration: 2, repeat: Infinity }
            }}
          >
            {isEnglish ? "Sikhya Punjab" : "ਸਿੱਖਿਆ ਪੰਜਾਬ"}
          </MainTitle>

          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Embark on a journey through the heart of Punjab's rich cultural heritage,
            where ancient wisdom meets modern learning.
          </Subtitle>
        </TitleContainer>

        <WheatField style={{ scale: wheatScale, y: wheatY, opacity }}>
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <EffectComposer>
              <Bloom luminanceThreshold={0.3} intensity={2} />
            </EffectComposer>
            <Wheat />
          </Canvas>
        </WheatField>
      </HeroSection>

      <ParallaxSection>
        <ContentCard
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2>Discover Punjab's Legacy</h2>
          <GridContainer>
            {features.map((feature, index) => (
              <ParallaxTilt key={index}>
                <FeatureCard
                  className="feature-card"
                  initial={{ opacity: 0, y: 50 }}
                >
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </FeatureCard>
              </ParallaxTilt>
            ))}
          </GridContainer>
        </ContentCard>
      </ParallaxSection>

      {/* Add decorative floating symbols */}
      {symbols.map((symbol, index) => (
        <FloatingSymbol
          key={index}
          style={{
            top: `${symbol.top}%`,
            left: `${symbol.left}%`,
            animationDelay: `${index * 0.5}s`
          }}
        >
          {symbol.char}
        </FloatingSymbol>
      ))}
    </HomeContainer>
  );
}

const features = [
  {
    title: "Language & Literature",
    description: "Immerse yourself in the poetic beauty of Punjabi language and its rich literary traditions."
  },
  {
    title: "Cultural Heritage",
    description: "Experience the vibrant customs, festivals, and traditions that make Punjab unique."
  },
  {
    title: "Historical Legacy",
    description: "Journey through time to discover Punjab's profound impact on civilization."
  },
  {
    title: "Modern Punjab",
    description: "Connect with contemporary Punjab and its dynamic evolution in the modern world."
  }
];

const symbols = [
  { char: "☬", top: 20, left: 80 },
  { char: "॥", top: 40, left: 15 },
  { char: "ੴ", top: 60, left: 85 },
  { char: "☬", top: 80, left: 25 }
]; 