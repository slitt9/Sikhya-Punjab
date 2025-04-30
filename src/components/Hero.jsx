
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import styled, { keyframes, createGlobalStyle } from 'styled-components'
import useTypewriter from '../hooks/useTypewriter'

const blink = keyframes`
  50% { opacity: 0; }
`
const popIn = keyframes`
  to {
    opacity: 1;
    transform: scale(1);
  }
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
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  z-index: 9999;
  padding: 2rem;
  cursor: pointer;
`

const HeroContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-family: 'Playfair Display', serif;
  color: #2c3e50;
  text-align: center;
  min-height: 6rem;
  overflow: hidden;
  white-space: nowrap;

  &.final-popup {
    opacity: 0;
    transform: scale(0.8);
    animation: ${popIn} 1s ease-in-out forwards;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`

const Cursor = styled.span`
  display: inline-block;
  margin-left: 2px;
  animation: ${blink} 0.7s step-start infinite;
`

const Tagline = styled.nav`
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  font-size: 1.2rem;
`

const TaglineLink = styled(Link)`
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #3498db;
  }

  &:not(:last-child)::after {
    content: '•';
    margin-left: 0.75rem;
    color: #2c3e50;
  }
`

const Hero = () => {
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
            transition={{ duration: 0.6, ease: 'easeInOut' }}
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
          <Title className="final-popup">Sikhya Punjab</Title>
          <Tagline>
            <TaglineLink to="/lessons-reading">Learn to Read</TaglineLink>
            <TaglineLink to="/lessons-speaking">Speak</TaglineLink>
            <TaglineLink to="/important-events">Discover History</TaglineLink>
          </Tagline>
        </HeroContainer>
      )}
    </>
  )
}

export default Hero