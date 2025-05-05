
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { createGlobalStyle } from 'styled-components';
import figuresData from './important_punjabi_figures.json';

const GlobalStyle = createGlobalStyle`
  /* Global nav or body styles can go here */
`;

const Container = styled.div`
  max-width: 100vw;
  min-height: 100vh;
  background: #f0e6d6;
  padding: 4rem;
  overflow-x: hidden;
`;

const BooksContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 4rem;
  padding: 3rem;
  perspective: 2000px;
`;

const BookCover = styled(motion.div)`
  width: 300px;
  height: 450px;
  margin: 0 auto;
  background: ${props => props.color || '#8B4513'};
  border-radius: 5px 15px 15px 5px;
  box-shadow: -10px 10px 30px rgba(0,0,0,0.4), inset 0 0 30px rgba(0,0,0,0.4);
  position: relative;
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;

  .book-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    color: #f0e6d6;
    text-align: center;
    padding: 2rem;
    position: relative;
    text-shadow: 0 0 10px rgba(255,215,0,0.5);
    transition: all 0.3s ease;
    z-index: 2;

    &::before, &::after {
      content: '✧';
      position: absolute;
      font-size: 1.5rem;
      color: gold;
    }
    &::before { top: -20px; left: 50%; transform: translateX(-50%); }
    &::after  { bottom: -20px; left: 50%; transform: translateX(-50%); }
  }

  .spine {
    position: absolute;
    left: -30px;
    top: 0;
    width: 30px;
    height: 100%;
    background: ${props => props.color || '#8B4513'};
    transform: rotateY(-90deg);
    transform-origin: right;
    box-shadow: inset -2px 0 5px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    color: #f0e6d6;
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    padding: 1rem 0;
  }

  .pages {
    position: absolute;
    right: 0;
    top: 0;
    width: 30px;
    height: 100%;
    background: #fff;
    transform: translateX(100%);
    border-left: 2px solid rgba(0,0,0,0.1);

    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        to right,
        #f0f0f0,
        #f0f0f0 2px,
        transparent 2px,
        transparent 5px
      );
    }
  }
`;

const OpenBook = styled(motion.div)`
  width: 90vw;
  height: 80vh;
  background: #f0e6d6;
  margin: 2rem auto;
  display: flex;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  position: relative;
  perspective: 2000px;
  overflow: hidden;
`;

const Page = styled(motion.div)`
  flex: 1;
  background: linear-gradient(to right, #f9f4e8, #fff);
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  box-shadow: inset 0 0 30px rgba(0,0,0,0.1);

  &.left-page {
    border-right: 2px solid #8B4513;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  &.right-page {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

const FigureContent = styled.div`
  text-align: center;

  img {
    max-width: 90%;
    height: auto;
    max-height: 300px;
    object-fit: contain;
    border-radius: 5px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    margin-bottom: 1rem;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    color: #4a4a4a;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #666;
    text-align: justify;
  }
`;

const NavigationButtons = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 10;
`;

const NavButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  border: none;
  background: #8B4513;
  color: #f0e6d6;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Playfair Display', serif;
`;

const categoryColors = {
  'Religious Leaders': '#8B4513',
  'Freedom Fighters': '#800000',
  'Rulers and Warriors': '#654321',
  'Poets and Writers': '#4A3C2A',
};

const ImportantFigures = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const categories = Object.keys(figuresData);

  const getFigures = (cat) => figuresData[cat] || [];

  const openCategory = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(0);
  };

  const nextPage = () => {
    const maxPages = Math.ceil(getFigures(selectedCategory).length / 2) - 1;
    setCurrentPage((p) => Math.min(p + 1, maxPages));
  };

  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 0));
  const closeBook = () => setSelectedCategory(null);

  return (
    <Container>
      <GlobalStyle />
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <BooksContainer>
            {categories.map((cat, i) => (
              <BookCover
                key={cat}
                color={categoryColors[cat]}
                onClick={() => openCategory(cat)}
                whileHover={{ rotateY: -20, scale: 1.05 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.2 } }}
              >
                <div className="spine">{cat}</div>
                <div className="pages"></div>
                <div className="book-title">{cat}</div>
              </BookCover>
            ))}
          </BooksContainer>
        ) : (
          <>
            <OpenBook>
              {[0,1].map((side) => {
                const index = currentPage * 2 + side;
                const item = getFigures(selectedCategory)[index];
                return (
                  <Page
                    key={side}
                    className={side === 0 ? 'left-page' : 'right-page'}
                    initial={{ rotateY: side===0?90:-90 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {item && (
                      <FigureContent>
                        <motion.img
                          src={item.image}
                          alt={item.name}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          onError={(e) => e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'}
                        />
                        <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                          {item.name}
                        </motion.h3>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                          {item.description}
                        </motion.p>
                      </FigureContent>
                    )}
                  </Page>
                );
              })}
            </OpenBook>
            <NavigationButtons>
              <NavButton onClick={prevPage} disabled={currentPage===0} whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>← Prev</NavButton>
              <NavButton onClick={closeBook} whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>Close</NavButton>
              <NavButton onClick={nextPage} disabled={currentPage >= Math.ceil(getFigures(selectedCategory).length/2)-1} whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>Next →</NavButton>
            </NavigationButtons>
          </>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default ImportantFigures;
