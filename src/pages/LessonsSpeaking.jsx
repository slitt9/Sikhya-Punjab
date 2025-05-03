import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
`

const GameArea = styled.div`
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
`

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
`

const Card = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`

const WordDisplay = styled(motion.div)`
  font-size: 3rem;
  font-family: 'Mukta Mahee', sans-serif;
  margin: 2rem 0;
  color: #333;
`

const Button = styled(motion.button)`
  background: ${props => (props.recording ? '#ff4444' : '#4CAF50')};
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
`

const WaveformContainer = styled.div`
  height: 100px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin: 1rem 0;
  position: relative;
  overflow: hidden;
`

const ResultWrapper = styled(motion.div)`
  text-align: center;
  margin-top: 1rem;
`

const ResultTitle = styled.h3`
  font-family: 'Mukta Mahee', sans-serif;
  color: #FFCA28;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`

const ResultText = styled.p`
  font-family: 'Mukta Mahee', sans-serif;
  color: #222;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`

const speakingData = [
  { punjabi: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', english: 'Sat Sri Akal', audio: '/audio/sat-sri-akal.mp3' },
  { punjabi: 'ਧੰਨਵਾਦ', english: 'Dhanyavaad', audio: '/audio/dhanyavaad.mp3' },
  { punjabi: 'ਕਿਵੇਂ ਹੋ', english: 'Kiven Ho', audio: '/audio/kiven-ho.mp3' },
  { punjabi: 'ਠੀਕ ਹਾਂ', english: 'Theek Haan', audio: '/audio/theek-haan.mp3' },
  { punjabi: 'ਮੈਂ ਪੰਜਾਬੀ ਸਿੱਖ ਰਿਹਾ ਹਾਂ', english: 'Main Punjabi Sikh Riha Haan', audio: '/audio/learning.mp3' },
]

const LessonsSpeaking = () => {
  const [currentWord, setCurrentWord] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState('')
  const mediaRecorder = useRef(null)
  const audioContext = useRef(null)
  const analyser = useRef(null)
  const animationFrame = useRef(null)

  useEffect(() => {
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)()
    analyser.current = audioContext.current.createAnalyser()
    analyser.current.fftSize = 2048

    // Preload audio
    speakingData.forEach(item => {
      const a = new Audio(item.audio)
      a.preload = 'auto'
    })

    return () => cancelAnimationFrame(animationFrame.current)
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      mediaRecorder.current.ondataavailable = e => {
        const blob = new Blob([e.data], { type: 'audio/wav' })
        setAudioURL(URL.createObjectURL(blob))
      }
      mediaRecorder.current.start()
      setIsRecording(true)
      visualizeAudio(stream)
    } catch (err) {
      console.error(err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop()
      setIsRecording(false)
      cancelAnimationFrame(animationFrame.current)
    }
  }

  const visualizeAudio = stream => {
    const source = audioContext.current.createMediaStreamSource(stream)
    source.connect(analyser.current)
    const canvas = document.getElementById('waveform')
    const ctx = canvas.getContext('2d')
    const bufferLength = analyser.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const draw = () => {
      animationFrame.current = requestAnimationFrame(draw)
      analyser.current.getByteTimeDomainData(dataArray)
      ctx.fillStyle = 'rgb(255, 255, 255)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.lineWidth = 2
      ctx.strokeStyle = '#4CAF50'
      ctx.beginPath()
      let x = 0
      const slice = canvas.width / bufferLength
      dataArray.forEach((v, i) => {
        const y = (v / 128.0) * (canvas.height / 2)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        x += slice
      })
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
    }
    draw()
  }

  const playReference = () => {
    new Audio(speakingData[currentWord].audio).play().catch(console.error)
  }

  const handleNext = () => {
    setAudioURL('')
    setCurrentWord(prev => prev + 1)
  }

  const resetGame = () => {
    setAudioURL('')
    setCurrentWord(0)
  }

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

              <Button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={playReference}>
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <audio controls src={audioURL} />
                  {currentWord < speakingData.length - 1 ? (
                    <Button onClick={handleNext}>Next Word</Button>
                  ) : (
                    <ResultWrapper initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                      <ResultTitle>🎉 Great Job!</ResultTitle>
                      <ResultText>Want to try again?</ResultText>
                      <Button onClick={resetGame}>Restart</Button>
                    </ResultWrapper>
                  )}
                </motion.div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </GameArea>
    </Container>
  )
}

export default LessonsSpeaking
