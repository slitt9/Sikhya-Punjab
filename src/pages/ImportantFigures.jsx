import { useState } from 'react';
import { useGesture } from '@use-gesture/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import figuresData from './important_punjabi_figures.json';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import khandaImage from '../assets/khanda.png';
import punjabImage from '../assets/punjab.png';

const Container = styled.div`
  max-width: 100vw;
  min-height: 100vh;
  background: #f0e6d6; // Antique paper color
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
  box-shadow: 
    -10px 10px 30px rgba(0,0,0,0.4),
    inset 0 0 30px rgba(0,0,0,0.4);
  position: relative;
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      rgba(255,255,255,0.1) 0%,
      rgba(255,255,255,0) 100%
    );
    border-radius: inherit;
  }

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

    &::before {
      content: '✧';
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.5rem;
      color: gold;
    }

    &::after {
      content: '✧';
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.5rem;
      color: gold;
    }
  }

  &:hover .book-title {
    transform: scale(1.1);
    text-shadow: 
      0 0 20px rgba(255,215,0,0.8),
      0 0 30px rgba(255,215,0,0.6),
      0 0 40px rgba(255,215,0,0.4);
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
`;

const Page = styled(motion.div)`
  flex: 1;
  background: #fff;
  padding: 2rem;
  position: relative;
  background: linear-gradient(to right, #f9f4e8, #fff);
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
    width: 80%;
    height: 300px;
    object-fit: cover;
    border-radius: 5px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    margin-bottom: 1rem;
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
  'Warriors': '#654321',
  'Poets and Writers': '#4A3C2A',
  'Prominent Women': '#5C4033'
};

const ImportantFigures = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const categories = Object.keys(figuresData);

  const getFiguresForCategory = (category) => {
    return figuresData[category] || [];
  };

  const handleBookClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(0);
  };

  const handleNextPage = () => {
    const maxPages = Math.floor(getFiguresForCategory(selectedCategory).length / 2);
    if (currentPage < maxPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleCloseBook = () => {
    setSelectedCategory(null);
    setCurrentPage(0);
  };

  return (
    <Container>
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BooksContainer>
              {categories.map((category, index) => (
                <BookCover
                  key={category}
                  color={categoryColors[category]}
                  onClick={() => handleBookClick(category)}
                  whileHover={{ 
                    rotateY: -20,
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.2 }
                  }}
                >
                  <div className="spine">{category}</div>
                  <div className="pages"></div>
                  <div className="book-title">{category}</div>
                </BookCover>
              ))}
            </BooksContainer>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <OpenBook>
              <Page 
                className="left-page"
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FigureContent>
                  {getFiguresForCategory(selectedCategory)[currentPage * 2] && (
                    <>
                      <motion.img
                        src={getFiguresForCategory(selectedCategory)[currentPage * 2].image}
                        alt={getFiguresForCategory(selectedCategory)[currentPage * 2].name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                        }}
                      />
                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        {getFiguresForCategory(selectedCategory)[currentPage * 2].name}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {getFiguresForCategory(selectedCategory)[currentPage * 2].description}
                      </motion.p>
                    </>
                  )}
                </FigureContent>
              </Page>
              <Page 
                className="right-page"
                initial={{ rotateY: -90 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FigureContent>
                  {getFiguresForCategory(selectedCategory)[currentPage * 2 + 1] && (
                    <>
                      <motion.img
                        src={getFiguresForCategory(selectedCategory)[currentPage * 2 + 1].image}
                        alt={getFiguresForCategory(selectedCategory)[currentPage * 2 + 1].name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                        }}
                      />
                      <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        {getFiguresForCategory(selectedCategory)[currentPage * 2 + 1].name}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {getFiguresForCategory(selectedCategory)[currentPage * 2 + 1].description}
                      </motion.p>
                    </>
                  )}
                </FigureContent>
              </Page>
            </OpenBook>
            <NavigationButtons>
              <NavButton
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Previous Page
              </NavButton>
              <NavButton
                onClick={handleCloseBook}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close Book
              </NavButton>
              <NavButton
                onClick={handleNextPage}
                disabled={currentPage >= Math.floor(getFiguresForCategory(selectedCategory).length / 2) - 1}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next Page →
              </NavButton>
            </NavigationButtons>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default ImportantFigures;