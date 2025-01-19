import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
`;

const GameArea = styled.div`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const ScoreBoard = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
`;

const Card = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  cursor: pointer;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
`;

const punjabiFontClass = {
    fontFamily: "'Mukta Mahee', sans-serif",
    fontSize: '2rem',
};

const lessonData = [
    { punjabi: 'ੳ', english: 'ura', audio: 'audio/ura.mp3' },
    { punjabi: 'ਅ', english: 'aira', audio: 'audio/aira.mp3' },
    { punjabi: 'ੲ', english: 'iri', audio: 'audio/iri.mp3' },
    { punjabi: 'ਸ', english: 'sassa', audio: 'audio/sassa.mp3' },
    { punjabi: 'ਹ', english: 'haha', audio: 'audio/haha.mp3' },
    { punjabi: 'ਕ', english: 'kakka', audio: 'audio/kakka.mp3' },
    { punjabi: 'ਖ', english: 'khakha', audio: 'audio/khakha.mp3' },
    { punjabi: 'ਗ', english: 'gagga', audio: 'audio/gagga.mp3' },
];

const LessonReading = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [options, setOptions] = useState([]);
    const [isCorrect, setIsCorrect] = useState(null);

    useEffect(() => {
        generateOptions();
    }, [currentQuestion]);

    const generateOptions = () => {
        const correct = lessonData[currentQuestion];
        let optionsArray = [correct];

        while (optionsArray.length < 4) {
            const randomOption = lessonData[Math.floor(Math.random() * lessonData.length)];
            if (!optionsArray.includes(randomOption)) {
                optionsArray.push(randomOption);
            }
        }

        // Shuffle options
        optionsArray = optionsArray.sort(() => Math.random() - 0.5);
        setOptions(optionsArray);
    };

    const handleAnswer = (selected) => {
        const correct = lessonData[currentQuestion];
        const isAnswerCorrect = selected.punjabi === correct.punjabi;

        setIsCorrect(isAnswerCorrect);

        if (isAnswerCorrect) {
            setScore(prev => prev + 1);
        }

        // Play audio feedback
        const audio = new Audio(isAnswerCorrect ? 'audio/correct.mp3' : 'audio/incorrect.mp3');
        audio.play();

        setTimeout(() => {
            if (currentQuestion < lessonData.length - 1) {
                setCurrentQuestion(prev => prev + 1);
                setIsCorrect(null);
            } else {
                setShowResult(true);
            }
        }, 1000);
    };

    const restartGame = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowResult(false);
        setIsCorrect(null);
        generateOptions();
    };

    return (
        <Container>
            <GameArea>
                <ScoreBoard
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2>Score: {score}</h2>
                    <h3>Question: {currentQuestion + 1}/{lessonData.length}</h3>
                </ScoreBoard>

                <AnimatePresence mode="wait">
                    {!showResult ? (
                        <motion.div
                            key="question"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card
                                style={punjabiFontClass}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <h1>{lessonData[currentQuestion].punjabi}</h1>
                                <p>Select the correct pronunciation</p>
                            </Card>

                            <OptionsGrid>
                                {options.map((option, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card
                                            onClick={() => handleAnswer(option)}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            style={{
                                                background: isCorrect !== null
                                                    ? option.punjabi === lessonData[currentQuestion].punjabi
                                                        ? isCorrect ? '#4CAF50' : '#F44336'
                                                        : 'white'
                                                    : 'white'
                                            }}
                                        >
                                            <h2>{option.english}</h2>
                                        </Card>
                                    </motion.div>
                                ))}
                            </OptionsGrid>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card>
                                <h1>Game Complete!</h1>
                                <h2>Your Score: {score}/{lessonData.length}</h2>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={restartGame}
                                    style={{
                                        padding: '1rem 2rem',
                                        fontSize: '1.2rem',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: '#4CAF50',
                                        color: 'white',
                                        cursor: 'pointer',
                                        marginTop: '1rem'
                                    }}
                                >
                                    Play Again
                                </motion.button>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </GameArea>
        </Container>
    );
};

export default LessonReading; 