
import React from 'react'
import styled from 'styled-components'

import architectureImg from '../assets/architecture.jpeg'
import musicImg       from '../assets/punjabiart.jpg'
import festivalsImg   from '../assets/festivals.jpg'

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 4rem 2rem;
  background: #fafafa;
`

const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
`

const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`

const CardBody = styled.div`
  padding: 1.5rem;
`

const CardTitle = styled.h3`
  font-family: 'Playfair Display', serif;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
`

const CardDescription = styled.p`
  font-family: 'Poppins', sans-serif;
  color: #555;
  line-height: 1.5;
`

const cards = [
  {
    title: 'Art & Architecture',
    img: architectureImg,
    desc: 'Explore the intricate carvings and vibrant murals of historic Gurdwaras and havelis across Punjab.'
  },
  {
    title: 'Folk Music',
    img: musicImg,
    desc: 'Dive into Bhangra beats, soulful folk tunes, and traditional instruments that define Punjabi culture.'
  },
  {
    title: 'Festivals',
    img: festivalsImg,
    desc: 'Celebrate Vaisakhi, Lohri, and more with dazzling processions, bonfires, and community feasts.'
  }
]

export default function CardGrid() {
  return (
    <GridContainer>
      {cards.map(({ title, img, desc }) => (
        <Card key={title}>
          <CardImage src={img} alt={title} />
          <CardBody>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{desc}</CardDescription>
          </CardBody>
        </Card>
      ))}
    </GridContainer>
  )
}