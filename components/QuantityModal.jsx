'use client'

import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import {
  Text,
  Paper,
  NumberInput,
  Space,
  Container,
  Group, 
  Notification,
  Image,
  Button,
} from '@mantine/core';
import classes from './AuthenticationPage.module.css'
import useFirebaseAuth from '@/lib/Authentication';

export function QuantityModal({ setModalOpen, data }) {
  const [cartItems, setCartItems] = useState([]);
  const [cart, setCart] = useState(false);
  const [message, setMessage] = useState('');
  const {user, updateDocCart} = useFirebaseAuth();

  const form = useForm({
    initialValues: {
      quantity: 1,
    },

    validate:{
      quantity: (val)=>(val<=0 ? "Quantity must be bigger than 0":null)
    }
  });
  
  const addToCart = async(item) => {
    try{
      console.log('cartItems',cartItems);
      const existingItem = cartItems.find((cartItem) => cartItem.id === data.id);
      let updatedCartItems;

      if (existingItem) {
        updatedCartItems = cartItems.map((cartItem) => {
          if (cartItem.id === data.id) {
            return { 
              id:cartItem.id,
              quantity: cartItem.quantity + item.quantity
            };
          }
          return cartItem;
        });
        console.log('update exist', updatedCartItems)
      }
      else {
        const cartObj = {
          id: data.id,
          quantity: item.quantity,
        };
        updatedCartItems = [...cartItems, cartObj];
        console.log('update first', updatedCartItems)
      }

      const dataToStore = {
        uid:user.uid,
        cart:updatedCartItems
      }

      setCartItems(updatedCartItems);
      localStorage.setItem('cart', JSON.stringify(dataToStore))
      // console.log('update 2', updatedCartItems)
      await updateDocCart({cart:updatedCartItems}); 

      setCart(true)
      console.log('data store', dataToStore)
      setMessage('Item added to cart successfully!')
    }
    catch(error){
      setCart(true);
      setMessage('Failed to add item to cart', error)
    }
    finally{
      setTimeout(() =>{
        setModalOpen(false);
      }, 5000)
    }
    
  }
  

  function getCartFromLocalStorage() {
    const cartData = localStorage.getItem('cart');
    console.log("getlocal")
    let parseData = JSON.parse(cartData);

    if (cartData) {
      // Pastikan parseData adalah array
      if (Array.isArray(parseData)) {
        console.log('cartnya array');// Ambil bagian cart dari setiap objek jika properti cart ada
        const cart = parseData.map(item => item.cart || []);
        
        console.log("CART DATA", parseData);
        setCartItems(cart);
      }
      else {
        setCartItems(parseData.cart);
      }
    }
  }

  useEffect(()=>{
    getCartFromLocalStorage();
  },[])

  return (
    <>
     {cart &&(
      <>
        <Notification title="We notify you that">
          {message}
        </Notification>
        <Space h={20}/>
      </>
      )}
    <Container>
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
    </Container>
    </>
  );
}