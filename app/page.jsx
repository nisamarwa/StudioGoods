'use client'

import { useState } from 'react';
import { Overlay, Container, Title, Button, Text, Space } from '@mantine/core';
import classes from './HeroContentLeft.module.css';
import BadgeCard from '../components/BadgeCard';
import { MainHeader } from '@/components/MainHeader';
import GetInTouch from '@/pages/contact';

export default function HeroContentLeft() {
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
    {/* <HeaderProduct onCategoryChange={handleCategoryChange}/> */}
    <Text size='xl' ta='center' fw={400} style={{marginTop:'50px'}}>P R O D U C T S</Text>
    <BadgeCard/>
    <Space h={50}/>
    <Text ta='center' fw={700} style={{marginTop:'50px', fontSize:50}}>LET'S GET IN TOUCH</Text>
    <div id="contact-section">
      <GetInTouch/>
    </div>
    </>
  );
}