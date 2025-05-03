import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import styled, { keyframes, createGlobalStyle } from 'styled-components'
import useTypewriter from '../hooks/useTypewriter'
import ParallaxTilt from 'react-parallax-tilt'
import fiveRiversImg from '../assets/5rivers.jpg'

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`
const blink = keyframes`
  50% { opacity: 0; }
`

const GlobalStyle = createGlobalStyle`
  #site-nav {
    opacity: ${props => (props.showNav ? 1 : 0)};
    pointer-events: ${props => (props.showNav ? 'auto' : 'none')};
    transition: opacity 0.5s ease;
  }
`

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle, #ffffff, #c3cfe2);
  z-index: 9999;
  cursor: pointer;
`

const HeroContainer = styled.div`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #eef2f3 0%, #8e9eab 100%);
  padding: 3rem 2rem;
  position: relative;
  overflow: visible;
`

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-family: 'Playfair Display', serif;
  color: #2c3e50;
  text-align: center;
  margin: 0;
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`

const Cursor = styled.span`
  margin-left: 4px;
  animation: ${blink} 0.7s step-start infinite;
`

const StyledTilt = styled.div`
  margin-top: 2rem;
  max-width: 400px;
  width: 100%;
`

const RiversImage = styled(motion.img)`
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
`

const Caption = styled(motion.h2)`
  font-size: 2rem;
  margin-top: 1rem;
  background: linear-gradient(45deg, #FFD700, #B8860B);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 4s linear infinite;
  font-family: 'Playfair Display', serif;
  text-align: center;
`

const Tagline = styled.div`
  margin-top: 2.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`

const TaglineLink = styled(motion(Link))`
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 600;
  padding: 0.6rem 1.5rem;
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  color: #2c3e50;
  text-decoration: none;
  cursor: pointer;
`

const links = [
  { to: '/lessons-reading', label: 'Learn to Read' },
  { to: '/lessons-speaking', label: 'Speak' },
  { to: '/important-events', label: 'Discover History' }
]

export default function Hero() {
  const texts = ['Sikhya Punjab', 'ਸਿੱਖਿਆ ਪੰਜਾਬ', 'Sikhya Punjab']
  const [skip, setSkip] = useState(false)
  const [rawText, hookComplete] = useTypewriter(texts, 100, 2000)
  const text = skip ? texts[2] : rawText
  const isComplete = skip || hookComplete

  return (
    <>
      <GlobalStyle showNav={isComplete} />
      <AnimatePresence>
        {!isComplete && (
          <Overlay
            onClick={() => setSkip(true)}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Title
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {text}
              <Cursor>|</Cursor>
            </Title>
          </Overlay>
        )}
      </AnimatePresence>
      {isComplete && (
        <HeroContainer>
          <Title
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            Sikhya Punjab
          </Title>
          <StyledTilt>
            <ParallaxTilt glareEnable glareMaxOpacity={0.3} scale={1.05} transitionSpeed={400}>
              <RiversImage
                src={fiveRiversImg}
                alt="Land of the Five Rivers"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </ParallaxTilt>
          </StyledTilt>
          <Caption
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Land of the Five Rivers
          </Caption>
          <Tagline>
            {links.map((link, idx) => (
              <TaglineLink
                key={link.label}
                to={link.to}

                whileHover={{
                  scale: 1.1,
                  color: '#5A5AFF',
                  backgroundColor: 'rgba(255,255,255,0.35)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                {link.label}
              </TaglineLink>
            ))}
          </Tagline>
        </HeroContainer>
      )}
    </>
  )
}