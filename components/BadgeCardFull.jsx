'use client'

import React, { useEffect, useState, } from 'react'; // Import useState
import { IconHeart, IconShoppingCart, IconShare, IconX, IconCheck } from '@tabler/icons-react'; // Import icons
import { rem, Card, Image, Modal, Text, Group, Notification, Badge, Button, ActionIcon } from '@mantine/core';
import classes from './BadgeCardFull.module.css';
import useFirebaseAuth from '@/lib/Authentication';
import { QuantityModal } from './QuantityModal';
import { AuthenticationForm } from './AuthenticationPage';

export default function BadgeCardFull({selectedCategory}) {
  const [isHovered, setIsHovered] = useState(false); // State untuk mengontrol overlay
  const {user, products} = useFirebaseAuth();
  const [initialProducts, setInitialProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('ALL');
  const [isModalAuthOpen, setIsModalAuthOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null);

  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  function formatUSD(price) {
    // Menggunakan metode toLocaleString() untuk mengubah ke format Rupiah
    return parseInt(price).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  }

  const loadProductsByCategory = async (category) => {
    console.log("Products", products)
    setInitialProducts(products);
    setCurrentCategory(category); // Set kategori yang dipilih
  };

  const filterProductsByCategory = (category) => {
    console.log("cate", category)
    if (category === 'ALL') {
      return initialProducts; // Return all products
    } else {
      console.log("initial",initialProducts)
      return initialProducts.filter((product) => product.categories.toUpperCase() === category);
    }
  };

  const mockdata = filterProductsByCategory(selectedCategory).map((product) => ({
    image: product.imageUrl,
    title: product.name,
    categories: product.categories,
    price: formatUSD(product.price),
    id: product.id
  }));

  const handleCartButton = (data) => {
    if(!user) setIsModalAuthOpen(true);
    else{
      setSelectedProduct(data);
      setModalOpen(true); 
    }
  }

  useEffect(()=>{
    loadProductsByCategory(currentCategory);
  }, [products, currentCategory])

  
  return (
    <>

    <div className={classes.cardContainer}>
      {mockdata.map((data, index) => {

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

            <Modal opened={isModalOpen} onClose={()=>setModalOpen(false)}>
                <QuantityModal setModalOpen={setModalOpen} data={selectedProduct}/>
            </Modal>

            <Modal opened={isModalAuthOpen} onClose={()=>setModalOpen(false)}>
                <AuthenticationForm setModalOpen={setIsModalAuthOpen}/>
          </Modal>
          </Card>
        );
      })}
    </div>
    </>
  );
}
