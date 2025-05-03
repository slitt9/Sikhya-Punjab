import React, { useState, useMemo } from 'react'
import styled, { keyframes } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import punjabMap from '../assets/punjab-map.jpg'

import farmersImg from '../assets/locations/farmers.jpg'
import bluestarImg from '../assets/locations/bluestar.jpg'
import wagahImg    from '../assets/locations/wagah.jpg'
import saragarhiImg from '../assets/locations/saragarhi.jpg'
import ferozeImg   from '../assets/locations/feroze.jpg'
import anandpurImg from '../assets/locations/anandpur.jpg'
import greenrevoImg from '../assets/locations/greenrevo.png'
import jallianwalaImg from '../assets/locations/jallianwala.jpg'

const RAW_EVENTS = [
  {
    id: 1, name: 'Farmers Protest', year: 2020, location: 'Delhi Border',
    x: 85, y: 75,
    image: farmersImg,
    description: `Beginning in late 2020, over a million farmers—mostly from Punjab—camped at Delhi’s borders demanding repeal of three agricultural laws. Their peaceful, year-long sit-in forced India’s first major legislative U-turn, underscoring the power of non-violent protest.`,
    category: 'Social'
  },
  {
    id: 2, name: 'Operation Blue Star', year: 1984, location: 'Golden Temple, Amritsar',
    x: 34, y: 31,
    image: bluestarImg,
    description: `In June 1984, the Indian Army stormed the Golden Temple complex to remove armed militants, resulting in heavy casualties and damage to Sikhism’s holiest shrine. The operation fueled deep communal divides, led to Indira Gandhi’s assassination, and sparked anti-Sikh riots.`,
    category: 'Military'
  },
  {
    id: 3, name: 'Partition of Punjab', year: 1947, location: 'Wagah Border',
    x: 24, y: 27,
    image: wagahImg,
    description: `At independence in August 1947, Punjab was split between India and Pakistan, triggering one of history’s largest migrations. Millions of Hindus, Sikhs, and Muslims crossed amid communal violence, permanently altering the region’s demographics.`,
    category: 'Political'
  },
  {
    id: 4, name: 'Battle of Saragarhi', year: 1897, location: 'Saragarhi (NW Frontier)',
    x: 36, y: 16,
    image: saragarhiImg,
    description: `On September 12, 1897, 21 soldiers of the 36th Sikh Regiment heroically defended the Saragarhi outpost against thousands of Afghan tribesmen. Their final stand lives on in military lore and is celebrated each year.`,
    category: 'Military'
  },
  {
    id: 5, name: 'First Anglo-Sikh War', year: 1845, location: 'Ferozepur',
    x: 25, y: 54,
    image: ferozeImg,
    description: `Between 1845–46, the Sikh Empire clashed with the British East India Company over territory and succession. Despite fierce cavalry charges, the war ended with the Treaty of Lahore and ushered in British rule.`,
    category: 'Military'
  },
  {
    id: 6, name: 'Foundation of Khalsa', year: 1699, location: 'Anandpur Sahib',
    x: 84, y: 50,
    image: anandpurImg,
    description: `On Vaisakhi, April 13 1699, Guru Gobind Singh Ji baptized the first five Khalsa “Panj Pyare,” formalizing a community dedicated to justice and service. The Khalsa’s initiation rites and Five Ks remain central to Sikh identity.`,
    category: 'Religious'
  },
  {
    id: 7, name: 'Green Revolution', year: 1960, location: 'Ludhiana',
    x: 61, y: 55,
    image: greenrevoImg,
    description: `Starting in the 1960s, Punjab adopted high-yield seeds, modern irrigation, and fertilizers. While yields soared—earning Punjab the “Breadbasket of India”—this transformation also brought environmental and socio-economic challenges.`,
    category: 'Economic'
  },
  {
    id: 8, name: 'Jallianwala Bagh Massacre', year: 1919, location: 'Jallianwala Bagh, Amritsar',
    x: 32, y: 29,
    image: jallianwalaImg,
    description: `On April 13 1919, troops under Brigadier Dyer fired on unarmed protesters in Jallianwala Bagh, killing hundreds. The atrocity galvanized Indian public opinion and became a turning point in the independence movement.`,
    category: 'Historical'
  }
]

const EVENTS = [...RAW_EVENTS].sort((a,b) => a.year - b.year)

const pulse = keyframes`
  0%   { transform: scale(0.8); opacity: 0.6; }
  50%  { transform: scale(1.4); opacity: 0; }
  100% { transform: scale(0.8); opacity: 0.6; }
`
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`
const float = keyframes`
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`

const Page = styled.div`
  background: #121214;
  color: #ececec;
  min-height: 100vh;
  padding: 2rem 1rem;
  font-family: 'Poppins', sans-serif;
`
const Title = styled(motion.h1)`
text-align: center;
font-size: 3rem;
margin-bottom: 0.5rem;
  background: linear-gradient(
    90deg,
rgb(236, 153, 28) 0%,
rgb(255, 162, 0) 50%,
rgb(251, 117, 7) 100%
  );
background-size: 200% 200%;
background-clip: text;
color: transparent;
animation: ${gradientShift} 5s ease infinite, ${float} 4s ease-in-out infinite;
`

const Subtitle = styled(motion.p)`
  text-align: center;
  margin-bottom: 2rem;
  color: #a5a5a5;
  max-width: 600px;
  margin: 0 auto 2rem;
`
const MapCard = styled(motion.div)`
  position: relative;
  max-width: 900px;
  margin: 0 auto 2.5rem;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 16px 48px rgba(0,0,0,0.5);
`
const MapImg = styled.img`
  width: 100%;
  display: block;
`
const PulseCircle = styled.div`
  position: absolute;
  width: 40px; height: 40px;
  background: rgba(233,30,99,0.3);
  border-radius: 50%;
  animation: ${pulse} 2s infinite;
  pointer-events: none;
`
const PinWrapper = styled(motion.div)`
  position: absolute; transform: translate(-50%, -110%);
  cursor: pointer; z-index: 2;

  .pin-icon { transition: transform 0.2s; }
  &:hover .pin-icon { transform: scale(1.4) rotate(15deg); }
`
const PinIcon = styled.div`
  width: 24px; height: 24px;
  background: #e91e63;
  clip-path: polygon(50% 0%,100% 38%,82% 100%,18% 100%,0 38%);
`
const Tooltip = styled.div`
  position: absolute; bottom:130%; left:50%;
  transform: translateX(-50%);
  background: rgba(30,30,30,0.9);
  color:#fff; padding:6px 10px; border-radius:6px;
  font-size:0.85rem; white-space:nowrap;
  opacity:0; pointer-events:none;
  transition:opacity 0.2s;
  ${PinWrapper}:hover & { opacity:1; }
`
const Overlay = styled.div`
  position:fixed; inset:0;
  background:rgba(0,0,0,0.85);
  display:flex; justify-content:center; align-items:center;
  z-index:20;
`
const Modal = styled(motion.div)`
  background: #fafafa; color:#222;
  border-radius:12px; padding:2rem;
  width:90%; max-width:400px;
  box-shadow:0 24px 64px rgba(0,0,0,0.3);
  animation:${fadeIn} 0.3s ease-out forwards;
  position:relative;
`
const ModalImage = styled.img`
  width:100%; height:auto;
  border-radius:8px;
  margin-bottom:1rem;
  box-shadow:0 8px 24px rgba(0,0,0,0.2);
`
const Close = styled.button`
  position:absolute; top:1rem; right:1rem;
  background:none; border:none; font-size:1.5rem;
  color:#555; cursor:pointer;
  &:hover { color:#333; }
`
const ModalTitle = styled.h2` margin:0 0 .5rem; `
const ModalMeta  = styled.p` margin:0; color:#555; font-weight:500; `
const ModalDesc  = styled.p` margin:1rem 0; line-height:1.6; color:#333; `
const Badge      = styled.span`
  display:inline-block; padding:.3rem .8rem;
  background:#e91e63; color:#fff; border-radius:8px;
  font-size:.85rem; font-weight:600;
`

// Timeline
const TimelineContainer = styled.div`
  max-width:900px; margin:0 auto 2rem; text-align:center;
`
const TLList = styled.ul`
  list-style:none; padding:0;
  display:inline-flex; gap:1rem;
`
const TLItem = styled.li` position:relative; `
const TLButton = styled(motion.button)`
  background:${p=>p.active?'#e91e63':'#444'};
  color:#fff; border:none; border-radius:6px;
  padding:.5rem 1rem; font-weight:600; cursor:pointer;
`
const MiniTip = styled.div`
  position:absolute; bottom:120%; left:50%;
  transform:translateX(-50%);
  background:rgba(30,30,30,0.9);
  color:#fff; padding:4px 8px; border-radius:4px;
  font-size:.75rem; white-space:nowrap;
  opacity:0; transition:opacity .2s;
  ${TLItem}:hover & { opacity:1; }
`

export default function ImportantEventsMap() {
  const [selected, setSelected] = useState(null)

  return (
    <Page>
      <Title
        initial={{ opacity:0, scale:0.8 }}
        animate={{ opacity:1, scale:1 }}
        transition={{ type:'spring', stiffness:200, damping:20 }}
      >
        Punjab’s Most Important Events
      </Title>
      <Subtitle
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
      >
        Hover markers for a preview, click to dive into history—or jump around via the timeline!
      </Subtitle>

      <AnimatePresence>
        <MapCard
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          exit={{ opacity:0 }}
          transition={{ duration:0.6 }}
        >
          <MapImg src={punjabMap} alt="Punjab map"/>
          {EVENTS.map(ev => (
            <React.Fragment key={ev.id}>
              <PulseCircle
                style={{
                  left:`${ev.x-1}%`,
                  top:`${ev.y-1}%`,
                  transform:'translate(-50%,-50%)'
                }}
              />
              <PinWrapper
                style={{ left:`${ev.x}%`, top:`${ev.y}%` }}
                onClick={()=>setSelected(ev)}
                initial={{ scale:0.8, opacity:0 }}
                animate={{ scale:1, opacity:1 }}
                transition={{ delay:0.3 + ev.id*0.1 }}
              >
                <PinIcon className="pin-icon"/>
                <Tooltip>{ev.name}</Tooltip>
              </PinWrapper>
            </React.Fragment>
          ))}
        </MapCard>
      </AnimatePresence>

      <TimelineContainer>
        <TLList>
          {EVENTS.map(ev => (
            <TLItem key={ev.id}>
              <MiniTip>{ev.name}</MiniTip>
              <TLButton
                active={selected?.id===ev.id}
                onClick={()=>setSelected(ev)}
                whileHover={{ scale:1.1 }}
                whileTap={{ scale:0.95 }}
              >
                {ev.year}
              </TLButton>
            </TLItem>
          ))}
        </TLList>
      </TimelineContainer>

      <AnimatePresence>
        {selected && (
          <Overlay onClick={()=>setSelected(null)}>
            <Modal
              initial={{ y:20, opacity:0 }}
              animate={{ y:0, opacity:1 }}
              exit={{ y:20, opacity:0 }}
              transition={{ duration:0.3 }}
              onClick={e=>e.stopPropagation()}
            >
              <Close onClick={()=>setSelected(null)}>&times;</Close>
              {/* Here’s the new image! */}
              <ModalImage src={selected.image} alt={selected.name} />
              <ModalTitle>{selected.name}</ModalTitle>
              <ModalMeta>
                {selected.location} · {selected.year}
              </ModalMeta>
              <ModalDesc>{selected.description}</ModalDesc>
              <Badge>{selected.category}</Badge>
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>
    </Page>
  )
}
