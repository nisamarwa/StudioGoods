import React, { useState, useEffect } from 'react';
import { Container, Paper, Text, Space, Group, Button, em, Image, Select, TextInput, Table, ActionIcon, Checkbox, NumberInput } from '@mantine/core';
import { IconX, IconArrowLeft  } from '@tabler/icons-react';
import useFirebaseAuth from '@/lib/Authentication';
import { useMediaQuery } from '@mantine/hooks';
import { MainHeader } from '@/components/MainHeader';
import { useRouter } from 'next/navigation';
import classes from './Cart.module.css'

export default function CartPage({ removeFromCart }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {products} = useFirebaseAuth();
  const [checkedItems, setCheckedItems] = useState({});
  const [showPaper, setShowPaper] = useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  async function getCartFromLocalStorage() {
    const cartData = localStorage.getItem('cart');
  
    if (cartData) {
        console.log("CART DATA", cartData, products)
        let parseData = JSON.parse(cartData);
        if (!Array.isArray(parseData)) {
          parseData = [parseData];
        }

        await new Promise((resolve) => {
          const checkSavedProduct = () => {
            if (products.length > 0) {
              resolve();
            } else {
              // Cek kembali dalam beberapa milidetik
              setTimeout(checkSavedProduct, 100);
            }
          };
    
          checkSavedProduct();
        });

        const cartItemsWithDetails = parseData.map((cartItemId) =>{
         const productCart =  products.find((product) => product.id === cartItemId.id);
         return{
          ...productCart,
          quantity:cartItemId.quantity,
         }
        });
        console.log("COCOK", cartItemsWithDetails, cartItems.length)
        

        setCartItems(cartItemsWithDetails);
        setIsLoading(false);
    }
  }

  function formatUSD(price) {
    // Menggunakan metode toLocaleString() untuk mengubah ke format Rupiah
    return parseInt(price).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  }

  const handleToggleCheck = (itemId) => {
    setCheckedItems((prevCheckedItems) => {
      return {
        ...prevCheckedItems,
        [itemId]: !prevCheckedItems[itemId], // Membalik status centang
      };
    });
  };
  
  const handleCheckout = () => {
    const selectedItems = cartItems.filter((item) => checkedItems[item.id]);
    // Tampilkan atau lakukan apa yang Anda inginkan dengan item yang dicentang ini.
    console.log('Items to Checkout:', JSON.stringify({
      items: selectedItems,
    }));
    const config={
      method:'POST',
      headers:{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":"*"
      },
      body: JSON.stringify({ items: selectedItems }),
      mode:'cors'
    }
    console.log('config', config.body);
    fetch('http://localhost:3000/create-checkout-session', config).then(res => {
      if(res.status === 204) return null 
      if(res.ok) return res.json()
      else console.log('res', res)
    })
    .then(({url})=>{
      router.push(url)
    })
  };

  const handleRemoveFromCart = (item) => {
    // Salin state keranjang ke dalam variabel baru
    const updatedCartItems = [...cartItems];
  
    // Cari index item yang akan dihapus
    const indexToRemove = updatedCartItems.findIndex((cartItem) => cartItem.id === item.id);
  
    if (indexToRemove !== -1) {
      // Hapus item dari array
      updatedCartItems.splice(indexToRemove, 1);
  
      // Perbarui state dengan keranjang yang telah diubah
      setCartItems(updatedCartItems);
  
      // Simpan ulang keranjang ke local storage
      localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  
      // Lakukan apa yang Anda inginkan dengan informasi item yang dihapus
      console.log('Item removed:', item);
    }
  };

  
  
  const rows = cartItems.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>
        <div className={classes.tableData}>
        <Group>
          <Checkbox 
            checked={checkedItems[element.id]}
            onChange={() => handleToggleCheck(element.id)}
            style={{marginLeft:isMobile?0:'10px'}}
          />
          <Image
            src={element.imageUrl}
            alt={element.name}
            width={isMobile?50:100}
            height={isMobile?50:100}
            className={classes.imageData }
          />
        </Group>
        <div className={classes.detail}>
          <Text size={isMobile?"sm":"lg"} weight={700}>
            {element.name}
          </Text>
          <Space h={10} />
          <Text size={isMobile?'xs':"sm"} color="gray">
            {element.categories}
          </Text>
        </div>
        </div>
      </Table.Td>
      <Table.Td>{formatUSD(element.price)}</Table.Td>
      <Table.Td>{element.quantity}</Table.Td>
      <Table.Td>{formatUSD(Number(element.price * element.quantity))}</Table.Td>
      <Table.Td>
        <ActionIcon variant="transparent" size={25} color='black' onClick={() => handleRemoveFromCart(element)}>
          <IconX stroke={1} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  const calculateTotalSelectedItemsPrice = () => {
    const selectedItems = cartItems.filter((item) => checkedItems[item.id]);
    const total = selectedItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
    return total;
  };

  const handleBackButton = () => {
    router.push('/products');
  }

  useEffect(() => {
    getCartFromLocalStorage();
    if (Object.values(checkedItems).some((item) => item === true)) {
      setShowPaper(true);
    } else {
      setShowPaper(false);
    }
  }, [products, checkedItems]);
  

  return (
    <>
    <Container size="xl">
      <Space h={20} />
      <div className={classes.titleDiv}>
        <div className={classes.backIcon}>
          <ActionIcon variant="filled" size={isMobile?20:30} color='black' onClick={handleBackButton}>
            <IconArrowLeft stroke={1} size={isMobile?15:25} />
          </ActionIcon>
        </div>
        <Space h={20} w={10}/>
        <Text size={isMobile?'lg':'xl'} fw={700} className={classes.title}>
          SHOPPING CART
        </Text>
      </div>
      <Space h={50} />
      <div className={classes.cartDiv}>
        <div className={classes.titleTable}>
          {cartItems.length <= 0 && cartItems[0] === undefined ? (
            <Text size="lg" color="gray" align="center">
            Your cart is empty.
          </Text>
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>PRODUCT</Table.Th>
                  <Table.Th>PRICE</Table.Th>
                  <Table.Th>QUANTITY</Table.Th>
                  <Table.Th>TOTAL</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows}
              </Table.Tbody>
            </Table>
          )}
        </div>
        <div className={classes.paperDiv}>
          {showPaper && (
            <Paper className={classes.paper}>
              <Text size="lg" color='black' weight={700}>
                ORDER SUMMARY
              </Text>
              <Space h={20}/>
              <Table>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td className={classes.fontColor}>
                      Product Total
                    </Table.Td>
                    <Table.Td className={classes.fontColor}>
                      {formatUSD(calculateTotalSelectedItemsPrice())}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td className={classes.fontColor}>
                      Shipping
                    </Table.Td>
                    <Table.Td className={classes.fontColor}>
                      -
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td className={classes.fontColor}>
                      TAX
                    </Table.Td>
                    <Table.Td className={classes.fontColor}>
                      -
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
              <Space h={20}/>
              <Button variant='outline' color='black' radius='md' size="sm" 
                onClick={handleCheckout}>
                  Checkout
                </Button>
            </Paper>
          )}
        </div>
    </div>
    </Container>
  </>          
  );
}
