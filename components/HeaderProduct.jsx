'use client'

import { useState } from 'react';
import { Container, Group, ActionIcon, em } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconShoppingCart, IconArrowLeft } from '@tabler/icons-react';
import classes from './HeaderProduct.module.css';
import { useRouter } from 'next/navigation';

const links = [
  { link: '/about', label: 'ALL' },
  { link: '/pricing', label: 'FURNITURE' },
  { link: '/learn', label: 'ART' },
  { link: '/community', label: 'DIGITAL ART' },
];

export function HeaderProduct({onCategoryChange}) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const router = useRouter();
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      style={{color:"black"}}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        close();

        onCategoryChange(link.label)
      }}
    >
      {link.label}
    </a>
  ));

  const handleBackButton = () => {
    router.push('/');
  }
  
  const handleCartButton = () => {
    router.push('/cart');
  }

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Group justify='space-between'>
          <ActionIcon variant="filled" size={isMobile?20:30} color='black' onClick={handleBackButton}>
            <IconArrowLeft stroke={1} size={isMobile?15:25} />
          </ActionIcon>
          <Group gap={isMobile?10:30}>
            {items}
          </Group>
          <ActionIcon variant="filled" size={isMobile?20:30} color='black' onClick={handleCartButton}>
            <IconShoppingCart stroke={1.5} size={isMobile?10:20} />
          </ActionIcon>
        </Group>
      </Container>
    </header>
  );
}