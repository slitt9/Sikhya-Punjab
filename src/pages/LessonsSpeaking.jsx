import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
`;

const GameArea = styled.div`
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`;

const ProgressBar = styled(motion.div)`
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  margin: 1rem 0;
  overflow: hidden;

  div {
    height: 100%;
    background: #4CAF50;
    border-radius: 5px;
  }
`;

const Card = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const WordDisplay = styled(motion.div)`
  font-size: 3rem;
  font-family: 'Mukta Mahee', sans-serif;
  margin: 2rem 0;
  color: #333;
`;

const Button = styled(motion.button)`
  background: ${props => props.recording ? '#ff4444' : '#4CAF50'};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.2rem;
  cursor: pointer;
  margin: 1rem;
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const WaveformContainer = styled.div`
  height: 100px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin: 1rem 0;
  position: relative;
  overflow: hidden;
`;

const speakingData = [
  { punjabi: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', english: 'Sat Sri Akal', audio: 'audio/sat-sri-akal.mp3' },
  { punjabi: 'ਧੰਨਵਾਦ', english: 'Dhanyavaad', audio: 'audio/dhanyavaad.mp3' },
  { punjabi: 'ਕਿਵੇਂ ਹੋ', english: 'Kiven Ho', audio: 'audio/kiven-ho.mp3' },
  { punjabi: 'ਠੀਕ ਹਾਂ', english: 'Theek Haan', audio: 'audio/theek-haan.mp3' },
  { punjabi: 'ਮੈਂ ਪੰਜਾਬੀ ਸਿੱਖ ਰਿਹਾ ਹਾਂ', english: 'Main Punjabi Sikh Riha Haan', audio: 'audio/learning.mp3' },
];

const LessonsSpeaking = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const mediaRecorder = useRef(null);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const animationFrame = useRef(null);

  useEffect(() => {
    setupAudioContext();
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  const setupAudioContext = async () => {
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    analyser.current = audioContext.current.createAnalyser();
    analyser.current.fftSize = 2048;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = (event) => {
        const audioBlob = new Blob([event.data], { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      visualizeAudio(stream);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      cancelAnimationFrame(animationFrame.current);
    }
  };

  const visualizeAudio = (stream) => {
    const source = audioContext.current.createMediaStreamSource(stream);
    source.connect(analyser.current);
    
    const canvas = document.getElementById('waveform');
    const canvasCtx = canvas.getContext('2d');
    const bufferLength = analyser.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrame.current = requestAnimationFrame(draw);
      analyser.current.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(255, 255, 255)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = '#4CAF50';
      canvasCtx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  };

  const playReference = () => {
    const audio = new Audio(speakingData[currentWord].audio);
    audio.play();
  };

  const handleNext = () => {
    if (currentWord < speakingData.length - 1) {
      setCurrentWord(prev => prev + 1);
      setAudioURL('');
      setShowFeedback(false);
    } else {
      // Game complete logic
    }
  };

  return (
    <Container>
      <GameArea>
        <ProgressBar>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentWord + 1) / speakingData.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </ProgressBar>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <WordDisplay>{speakingData[currentWord].punjabi}</WordDisplay>
              <p>{speakingData[currentWord].english}</p>
              
              <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playReference}
              >
                🔊 Listen
              </Button>

              <WaveformContainer>
                <canvas id="waveform" width="1000" height="100" />
              </WaveformContainer>

              <Button
                recording={isRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
              </Button>

              {audioURL && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <audio controls src={audioURL} />
                  <Button onClick={handleNext}>Next Word</Button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </GameArea>
    </Container>
  );
};

export default LessonsSpeaking;