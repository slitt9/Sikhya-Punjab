import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import figuresData from './important_punjabi_figures.json';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  overflow-x: hidden;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  h2 {
    color: #666;
    font-size: 1.5rem;
  }
`;

const CategorySection = styled(motion.div)`
  margin-bottom: 3rem;
`;

const CategoryTitle = styled.h2`
  color: #333;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #646cff;
  display: inline-block;
`;

const FiguresGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const FigureCard = styled(motion.div)`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, #646cff, #ff4444);
  }

  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }

  .content {
    padding: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    line-height: 1.6;
  }
`;

const DetailModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ImportantFigures = () => {
  const [selectedFigure, setSelectedFigure] = useState(null);
  const categories = Object.keys(figuresData);

  return (
    <Container>
      <Header>
        <h1>Important Figures in Punjabi History</h1>
        <h2>Discover the personalities who shaped Punjab's rich heritage</h2>
      </Header>

      {categories.map((category, categoryIndex) => (
        <CategorySection
          key={category}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryIndex * 0.2 }}
        >
          <CategoryTitle>{category}</CategoryTitle>
          <FiguresGrid>
            {figuresData[category].map((figure, index) => (
              <FigureCard
                key={`${category}-${index}`}
                layoutId={`${category}-${index}`}
                onClick={() => setSelectedFigure({ ...figure, category })}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <img src={figure.image} alt={figure.name} />
                <div className="content">
                  <h3>{figure.name}</h3>
                  <p>{figure.description}</p>
                </div>
              </FigureCard>
            ))}
          </FiguresGrid>
        </CategorySection>
      ))}

      <AnimatePresence>
        {selectedFigure && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFigure(null)}
            />
            <DetailModal
              layoutId={`${selectedFigure.category}-${selectedFigure.name}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <motion.img
                src={selectedFigure.image}
                alt={selectedFigure.name}
                style={{ 
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  marginBottom: '1.5rem'
                }}
              />
              <motion.h2 
                style={{ 
                  fontSize: '2rem',
                  color: '#333',
                  marginBottom: '1rem'
                }}
              >
                {selectedFigure.name}
              </motion.h2>
              <motion.p
                style={{
                  color: '#666',
                  lineHeight: '1.8',
                  fontSize: '1.1rem'
                }}
              >
                {selectedFigure.description}
              </motion.p>
              <motion.div
                style={{
                  marginTop: '1.5rem',
                  color: '#666',
                  fontStyle: 'italic'
                }}
              >
                Category: {selectedFigure.category}
              </motion.div>
            </DetailModal>
          </>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default ImportantFigures;