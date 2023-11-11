'use client'

import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import {
  Text,
  Paper,
  NumberInput,
  Space,
  Group, 
  Image,
  Button
} from '@mantine/core';
import { GoogleButton } from './GoogleButton';
import classes from './AuthenticationPage.module.css'


export function QuantityModal({ setModalOpen, data }) {
  const [cartItems, setCartItems] = useState([]);
  const form = useForm({
    initialValues: {
      quantity: 1,
    },

    validate:{
      quantity: (val)=>(val<=0 ? "Quantity must be bigger than 0":null)
    }
  });
  
  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === data.id);
  
    if (existingItem) {
      const updatedCartItems = cartItems.map((cartItem) => {
        if (cartItem.id === data.id) {
          console.log("quan", cartItem.quantity, item.quantity, cartItem.quantity + item.quantity)
          return { 
            id:cartItem.id,
            quantity: cartItem.quantity + item.quantity
          };
        }
        return cartItem;
      });
      console.log("cart", updatedCartItems, cartItems)
      setCartItems(updatedCartItems);
      localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    } else {
      console.log("First CArt")
      const cartObj = {
        id: data.id,
        quantity: item.quantity,
      };
      const updatedCartItems = [...cartItems, cartObj];
      setCartItems(updatedCartItems);
      localStorage.setItem('cart', JSON.stringify(updatedCartItems));
    }

    setModalOpen(false);
  }
  

  function getCartFromLocalStorage() {
    const cartData = localStorage.getItem('cart');
  
    if (cartData) {
        let parseData = JSON.parse(cartData);
        if (!Array.isArray(parseData)) {
          parseData = [parseData];
        }
        console.log("CART DATA", cartData, parseData)
        setCartItems(parseData);
    }
  }

  useEffect(()=>{
    getCartFromLocalStorage();
  },[])

  return (
    <Paper radius="md" p="xl" withBorder size='md' className={classes.paper}>
      <Text size="lg" fw={500}>
        {data.title}
      </Text>
      <Space h={20}/>
      <Group justify='space-between'>
        <Image src={data.image} h={150} w={200} fit='contain'></Image>
        <Text fw={500}>{data.price}</Text>
      </Group>
      <Space h={30}/>
      <form >
      <NumberInput
        min={1}
        max={99}
        label="Quantity"
        value={form.values.quantity}
        onChange={(value) => form.setFieldValue('quantity', value)}
        error={form.errors.quantity}
        opacity={1}
        // {...form.getInputProps('quantity')}
      />
      <Space h={30}/>
      <Button variant='outline' color='black' type="submit" radius="xl"  onClick={(event)=>{
        event.preventDefault()
        console.log("form", form.values);
        const validateErrors = form.validate();
        if(!validateErrors.hasErrors) addToCart(form.values)
      }}>
        Add to Cart
      </Button>
      </form>
    </Paper>
  );
}