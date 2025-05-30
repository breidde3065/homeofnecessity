
import { Product, RoutePath } from './types';

export const APP_NAME = "Home of Necessity";

export const NAV_LINKS = [
  { name: 'Home', path: RoutePath.Home },
  { name: 'All Products', path: RoutePath.Products },
  { name: 'Cart', path: RoutePath.Cart },
];

export const PRODUCTS_DATA: Product[] = [
  {
    id: '1',
    name: 'Artisan Ceramic Vase',
    description: 'Handcrafted ceramic vase with a unique glaze finish. Perfect for modern interiors.',
    price: 120.00,
    imageUrl: '/images/vase.jpg',
    category: 'Accessories',
    details: 'This stunning vase is individually thrown and glazed by skilled artisans. Its minimalist design and subtle texture make it a versatile piece for any room. Dimensions: 12" H x 6" W.'
  },
  {
    id: '2',
    name: 'Minimalist Oak Coffee Table',
    description: 'Solid oak coffee table with clean lines and a natural matte finish.',
    price: 350.00,
    imageUrl: '/images/oak table.jpg',
    category: 'Furniture',
    details: 'Crafted from sustainably sourced solid oak, this coffee table embodies minimalist elegance. Its robust construction and timeless design ensure it will be a centerpiece for years to come. Dimensions: 48" L x 24" W x 16" H.'
  },
  {
    id: '3',
    name: 'Luxe Velvet Throw Pillow',
    description: 'Plush velvet throw pillow in a rich emerald green. Adds a touch of luxury.',
    price: 70.00,
    imageUrl: '/images/pillow.jpeg',
    category: 'Accessories',
    details: 'Indulge in the sumptuous feel of this velvet throw pillow. The deep emerald hue and soft texture provide an instant upgrade to your sofa or bed. Includes a premium feather-down insert. Dimensions: 20" x 20".'
  },
  {
    id: '4',
    name: 'Scandinavian Design Armchair',
    description: 'Elegant armchair featuring natural wood and light grey upholstery.',
    price: 230.00,
    imageUrl: '/images/armchair.jpeg',
    category: 'Furniture',
    details: 'Inspired by classic Scandinavian design, this armchair combines comfort and style. The solid wood frame provides durability, while the high-density foam cushioning ensures a comfortable seat. Upholstered in a durable, easy-to-clean fabric. Dimensions: 30" W x 32" D x 30" H.'
  },
  {
    id: '5',
    name: 'Abstract Marble Bookends',
    description: 'Set of two polished marble bookends with unique veining.',
    price: 100.00,
    imageUrl: '/images/bookend.jpg',
    category: 'Accessories',
    details: 'Elevate your bookshelf with these sophisticated marble bookends. Each piece is cut from natural marble, showcasing unique patterns and colors. Heavy enough to support your favorite reads. Dimensions (each): 6" H x 4" W x 2" D.'
  },
  {
    id: '6',
    name: 'Industrial Chic Floor Lamp',
    description: 'Matte black floor lamp with an adjustable arm and vintage-style bulb.',
    price: 180.00,
    imageUrl: '/images/lamp.jpeg',
    category: 'Accessories',
    details: 'Add an industrial edge to your space with this sleek floor lamp. The adjustable arm allows you to direct light where you need it most. Features a matte black finish and includes an Edison-style LED bulb for warm ambiance. Height: 60" adjustable.'
  },
];
