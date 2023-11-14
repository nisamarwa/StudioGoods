'use client'

import { useState } from 'react';
import { Overlay, Container, Title, Modal, Text, Space } from '@mantine/core';
import classes from './HeroContentLeft.module.css';
import BadgeCard from '../components/BadgeCard';
import { MainHeader } from '@/components/MainHeader';
import GetInTouch from '@/pages/contact';

export default function HeroContentLeft() {
  const[showModal, setShowModal] = useState(true);

   return (
    <>
    <div className={classes.hero}>
      <div className={classes.headerContainer}>
        <MainHeader/>
      </div>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, .4) 40%)"
        opacity={1}
        zIndex={0}
        style={{position:'absolute'}}
      />
      <Container className={classes.container} size="md">
        <Title className={classes.title}>Explore Unique Art at StudioGoods</Title>
        <Text className={classes.description} size="xl" mt="xl">
        Immerse yourself in a world of creativity and craftsmanship at StudioGoods. Our curated collection features a diverse range of art, digital masterpieces, and bespoke furniture. Elevate your space with handcrafted treasures that tell a story and bring art to life.
        </Text>
      </Container>
    </div>

    <Text size='xl' ta='center' fw={400} style={{marginTop:'50px'}}>P R O D U C T S</Text>
    <BadgeCard/>
    <Space h={50}/>
    <Text ta='center' fw={700} style={{marginTop:'50px', fontSize:50}}>LET'S GET IN TOUCH</Text>
    <div id="contact-section">
      <GetInTouch/>
    </div>

    {/* {showModal &&( */}
      <Modal opened={showModal} size='lg' onClose={()=>setShowModal(false)}>
        <Space h={50}/>
        <Title>WELCOME TO STUDIOGOODS !!</Title>
        <Space h={20}/>
        <Text>
        Thank you for exploring our test portfolio. This showcase demonstrates our ongoing work, and we appreciate your interest. While some features are still under construction, including details, like, and share functionality, we are pleased to inform you that the core functions of our e-commerce platform are up and running smoothly. Feel free to navigate through the available features and products. Your feedback is valuable as we continue to enhance and refine the user experience.
        </Text>
        <Space h={100}/>
      </Modal>
    {/* )} */}
    </>
  );
}