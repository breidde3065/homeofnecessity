
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  details?: string; // Optional longer details for product page
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  customerDetails: {
    name: string;
    email: string;
    address: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderDate: Date;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

export enum RoutePath {
  Home = '/',
  Products = '/products',
  ProductDetail = '/products/:id',
  Cart = '/cart',
  Checkout = '/checkout',
  OrderConfirmation = '/order-confirmation',
}
