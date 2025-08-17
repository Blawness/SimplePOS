import type { Category, Product } from './types';

export const categories: Category[] = [
  { id: 'cat1', name: 'Drinks' },
  { id: 'cat2', name: 'Snacks' },
  { id: 'cat3', name: 'Main Course' },
  { id: 'cat4', name: 'Desserts' },
];

export const products: Product[] = [
  { id: 'prod1', name: 'Espresso', price: 25000, stock: 100, category: categories[0], image: 'https://placehold.co/300x300.png', },
  { id: 'prod2', name: 'Caramel Macchiato', price: 45000, stock: 50, category: categories[0], image: 'https://placehold.co/300x300.png', },
  { id: 'prod3', name: 'Iced Tea', price: 20000, stock: 120, category: categories[0], image: 'https://placehold.co/300x300.png', },
  { id: 'prod4', name: 'French Fries', price: 30000, stock: 80, category: categories[1], image: 'https://placehold.co/300x300.png', },
  { id: 'prod5', name: 'Onion Rings', price: 35000, stock: 70, category: categories[1], image: 'https://placehold.co/300x300.png', },
  { id: 'prod6', name: 'Nasi Goreng', price: 55000, stock: 40, category: categories[2], image: 'https://placehold.co/300x300.png', },
  { id: 'prod7', name: 'Spaghetti Carbonara', price: 75000, stock: 30, category: categories[2], image: 'https://placehold.co/300x300.png', },
  { id: 'prod8', name: 'Chicken Steak', price: 95000, stock: 25, category: categories[2], image: 'https://placehold.co/300x300.png', },
  { id: 'prod9', name: 'Cheesecake', price: 50000, stock: 35, category: categories[3], image: 'https://placehold.co/300x300.png', },
  { id: 'prod10', name: 'Chocolate Lava', price: 48000, stock: 45, category: categories[3], image: 'https://placehold.co/300x300.png', },
  { id: 'prod11', name: 'Mineral Water', price: 10000, stock: 200, category: categories[0], image: 'https://placehold.co/300x300.png', },
  { id: 'prod12', name: 'Chicken Wings', price: 60000, stock: 60, category: categories[1], image: 'https://placehold.co/300x300.png', },
];
