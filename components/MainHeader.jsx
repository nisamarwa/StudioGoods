'use client'

import { useEffect, useState } from 'react';
import { Container, Group, Burger, Paper, Transition, Text, Button, Divider, Portal, Menu, ActionIcon, Avatar, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AuthenticationForm } from './AuthenticationPage';
import classes from './MainHeader.module.css';
import { IconShoppingCart } from '@tabler/icons-react';
import useFirebaseAuth from '@/lib/Authentication';
import { useRouter } from 'next/navigation';

const links = [
  { link: '/', label: 'HOME' },
  { link: '/products', label: 'PRODUCT' },
  { link: '/#contact-section', label: 'CONTACT' },
];

export function MainHeader() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const [isModalOpen, setModalOpen] = useState(false)
  const { user, signOut, isAuthenticated } = useFirebaseAuth();
  const router = useRouter();

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      style={{color:"black"}}
      onClick={(event) => {
        event.preventDefault();
        router.push(link.link)
        setActive(link.link);
        close();
      }}
    >
      {link.label}
    </a>
  ));


  const openLoginModal = () => {
    setModalOpen(true);
  } 

  const handleCartButton = () => {
    if(user) router.push('/cart');
    else openLoginModal();
  }

  useEffect(() => {
    console.log("USER", user, isAuthenticated)
    if(user){
      if(isModalOpen) setModalOpen(false)
      console.log("USER", user)
      router.push('/');
    }
  }, [])

  return (
    <header className={classes.header}>
        <Container size="md" className={classes.inner}>
            <Group justify="space-between">
                <Text fw={700} className={classes.name}>StudioGoods</Text>

                <Group gap={7} visibleFrom="xs">
                {items}
                </Group>

                <Group visibleFrom="sm">
                    <ActionIcon variant="filled" size={30} color='black' onClick={handleCartButton}>
                      <IconShoppingCart stroke={1} size={25} />
                    </ActionIcon>
                    {isAuthenticated ? (
                      <Menu shadow='md'>
                        <Menu.Target>
                          <Avatar variant='transparent' color='black' size={30} src={user.urlPhoto}/>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Item>
                            Profile
                          </Menu.Item>
                          <Menu.Item onClick={signOut}>
                            Sign Out
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    ) : (
                    <Button 
                        variant="filled"
                        size='xs'
                        color='black'
                        onClick={openLoginModal}
                    >Log in</Button>
                    )} 
                </Group>

                <Modal opened={isModalOpen} onClose={()=>setModalOpen(false)}>
                      <AuthenticationForm setModalOpen={setModalOpen}/>
                </Modal>

                <Burger opened={opened} onClick={toggle}  hiddenFrom='xs' size="sm" />

                <Transition transition="pop-top-right" duration={200} mounted={opened}>
                {(styles) => (
                    <Paper className={classes.dropdown} withBorder style={styles}>
                        {items}
                        <Divider my="sm" />

                        <Group justify="space-between" grow pb="sm" px="md">
                        <ActionIcon variant="filled" color="black" size={30} style={{ maxWidth: '30px' }}>
                          <IconShoppingCart stroke={1.5} size={20}/>
                        </ActionIcon>
                        {isAuthenticated ? (
                         <Menu shadow='md'>
                         <Menu.Target>
                           <Avatar variant='transparent' color='black' size={30} src={user.urlPhoto} style={{ maxWidth: '30px' }}/>
                         </Menu.Target>
 
                         <Menu.Dropdown>
                           <Menu.Item>
                             Profile
                           </Menu.Item>
                           <Menu.Item onClick={signOut}>
                             Sign Out
                           </Menu.Item>
                         </Menu.Dropdown>
                       </Menu>
                        ) : (
                        <Button 
                            variant="filled"
                            size='xs'
                            color='black'
                            onClick={openLoginModal}
                        >Log in</Button>
                        )} 
                        </Group>
                    </Paper>
                )}
                
                </Transition>
            </Group>
        </Container>
{/* 
        {showOverlay && (
          <Portal zIndex={1000}>
            <div className={classes.overlay}>
                <AuthenticationForm closeOverlay={closeOverlay}/>
            </div>
          </Portal>
        )} */}
    </header>
  );
}