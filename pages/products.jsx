'use client'

import { useState } from 'react';
import { HeaderProduct } from '@/components/HeaderProduct';
import BadgeCardFull from '@/components/BadgeCardFull';

export default function ProductsPage(){
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [cartItems, setCartItems] = useState([]);

    const handleCategoryChange=(category) =>{
        setSelectedCategory(category)
    }
    return(
        <>
            <HeaderProduct onCategoryChange={handleCategoryChange}/>
            <BadgeCardFull selectedCategory={selectedCategory}/>
        </>
    );
}