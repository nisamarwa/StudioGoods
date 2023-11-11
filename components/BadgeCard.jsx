'use client'

import React, { useEffect, useState } from 'react'; // Import useState
import { IconHeart, IconShoppingCart, IconShare } from '@tabler/icons-react'; // Import icons
import { Card, Image, Modal, Loader, Space, Text, Group, Badge, Button, ActionIcon } from '@mantine/core';
import classes from './BadgeCard.module.css';
import useFirebaseAuth from '@/lib/Authentication';
import { useRouter } from 'next/navigation';
import { AuthenticationForm } from './AuthenticationPage';
import { QuantityModal } from './QuantityModal';

export default function BadgeCard() {
  const [isHovered, setIsHovered] = useState(false); // State untuk mengontrol overlay
  const {user, products} = useFirebaseAuth();
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalAuthOpen, setIsModalAuthOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  function formatUSD(price) {
    // Menggunakan metode toLocaleString() untuk mengubah ke format Rupiah
    return parseInt(price).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  }

  const mockdata = products.map((product) => ({
    image: product.imageUrl,
    title: product.name,
    categories: product.categories,
    price: formatUSD(product.price),
    badges: [
          { emoji: '☀️', label: 'Sunny weather' },
          { emoji: '🦓', label: 'Onsite zoo' },
          { emoji: '🌊', label: 'Sea' },
          { emoji: '🌲', label: 'Nature' },
          { emoji: '🤽', label: 'Water sports' },
        ],
  }));

  const isServer = typeof window === 'undefined';
  const limitedMockdata = mockdata.slice(0, 3);

  function handleLoadMoreClick() {
    router.push('/products');
  }

  const handleCartButton = (data) => {
    if(!user) setIsModalAuthOpen(true);
    else{
      setSelectedProduct(data);
      setModalOpen(true); 
    }
  }

  useEffect(()=>{
    if(!products) setIsLoading(true);
    else setIsLoading(false);
  }, [products])

  
  return (
    <>
    {!isServer && (isLoading || !products) ? (
      <Loader color='gray' type='bars' />
    ):(
    <div className={classes.cardContainer}>
      {limitedMockdata.map((data, index) => {
        const features = data.badges.map((badge) => (
          <Badge variant="light" key={badge.label} leftSection={badge.emoji}>
            {badge.label}
          </Badge>
        ));

        return (
          <Card
            withBorder
            radius="md"
            p="md"
            className={classes.card}
            key={index}
            onMouseEnter={() => setIsHovered(true)} // Menyetel state saat hover masuk
            onMouseLeave={() => setIsHovered(false)} // Menyetel state saat hover keluar
          >
            <Card.Section>
              <div className={classes.imageContainer}>
                <Image src={data.image} alt={data.title} className={classes.image}/>
                {isHovered && ( // Tampilkan overlay hanya saat isHovered true
                  <div className={classes.overlay}>
                    <Button
                      variant="transparent"
                      size="sm"
                      className={classes.overlayButton}
                    >
                      <IconShare size={18} />
                    </Button>
                    <Button
                      variant="transparent"
                      size="sm"
                      className={classes.overlayButton}
                    >
                      <IconHeart size={18} />
                    </Button>
                  </div>
                )}
              </div>
            </Card.Section>

            <Card.Section className={classes.section} mt="md">
              <Group justify="apart">
                <Text fz="lg" fw={500}>
                  {data.title}
                </Text>
                <Badge size="sm" variant="light" color='black'>
                  {data.categories}
                </Badge>
              </Group>
              <Text fz="sm" mt="xs">
                {data.price}
              </Text>
            </Card.Section>

            <Group mt="xs" justify='space-between'>
              <ActionIcon variant="default" radius="md" size={36} onClick={()=>handleCartButton(data)}>
                <IconShoppingCart className={classes.like} stroke={1.5} />
              </ActionIcon>
              <Button variant='outline' color='black' radius="md" >
                Show details
              </Button>
            </Group>

            <Modal opened={isModalOpen} style={{opacity:0.75}} onClose={()=>setModalOpen(false)}>
                <QuantityModal setModalOpen={setModalOpen} data={selectedProduct}/>
            </Modal>

            <Modal opened={isModalAuthOpen} onClose={()=>setModalOpen(false)}>
                <AuthenticationForm setModalOpen={setIsModalAuthOpen}/>
          </Modal>
          </Card>
        );
      })}
    </div>
    )}

    <Space h={90}/>
    <div className={classes.styleButton}>
      <Button variant='outline' size='md' color='black' onClick={handleLoadMoreClick}>LOAD MORE</Button>
      </div>
    </>
  );
}
