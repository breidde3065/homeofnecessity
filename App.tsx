//amy react app components 
import React, { useState, createContext, useContext, useEffect, /*..useCallback..*/ } from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import { Product, CartItem, CartContextType } from './types';
import { APP_NAME, NAV_LINKS, PRODUCTS_DATA } from './constants';
//import {useCart} from '../context/CartContext';
//import {useNavigate, useLocation, link} from 'react-router-dom';
//import { RoutePath } from '../constants/routes';
//import {Button} from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 


// Add this near the top of App.tsx
const RoutePath = {
  HOME:'/',
  PRODUCTS:'/products',
  PRODUCTDETAILS:'/productdetails',
  SUCCESS: '/success',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERCONFIRMATION: '/orderconfirmation',
};


// ---------- ICON COMPONENTS ---------- //
const CartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.243.492 3.004 1.308m11.056-1.308c-.658-.818-1.729-1.308-2.826-1.308m0 0A48.149 48.149 0 0012 4.5c-2.036 0-4.023.404-5.876 1.142m11.752 0c.004.002.008.004.012.006l.012-.006z" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const MinusIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);

// ---------- CART CONTEXT ---------- //
const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const localData = localStorage.getItem('hon-cart');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('hon-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0) // Remove if quantity is 0
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

// ---------- UI COMPONENTS ---------- //
const Header: React.FC = () => {
  const { getItemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-brand-bg shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to={RoutePath.HOME} className="text-3xl font-serif font-bold text-brand-primary hover:text-brand-accent transition-colors">
            {APP_NAME}
          </Link>
          <nav className="hidden md:flex space-x-8">
            {NAV_LINKS.map(link => (
              <Link key={link.name} to={link.path} className="text-brand-secondary hover:text-brand-accent transition-colors font-medium">
                {link.name === 'Cart' ? (
                  <div className="relative flex items-center">
                    <CartIcon />
                    {getItemCount() > 0 && (
                      <span className="absolute -top-2 -right-3 bg-brand-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getItemCount()}
                      </span>
                    )}
                     <span className="ml-2 md:hidden lg:inline">Cart</span>
                  </div>
                ) : link.name}
              </Link>
            ))}
          </nav>
          <div className="md:hidden flex items-center">
            <Link to={RoutePath.CART} className="text-brand-secondary hover:text-brand-accent mr-4">
                <div className="relative">
                    <CartIcon />
                    {getItemCount() > 0 && (
                      <span className="absolute -top-2 -right-3 bg-brand-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getItemCount()}
                      </span>
                    )}
                </div>
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-brand-secondary hover:text-brand-accent">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-brand-bg shadow-lg">
          <nav className="flex flex-col space-y-1 px-4 pt-2 pb-4">
            {NAV_LINKS.filter(link => link.name !== 'Cart').map(link => ( // Cart is already visible via icon
              <Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)} className="block py-2 px-3 text-brand-secondary hover:text-brand-accent hover:bg-brand-light rounded-md transition-colors font-medium">
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-primary text-brand-light mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        <p className="text-sm mt-1">Crafted with passion for exceptional living.</p>
      </div>
    </footer>
  );
};

interface ProductCardProps {
  product: Product;
}
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  //const navigate = useNavigate();

  return (
    <div className="bg-brand-bg rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col">
      <Link to={`${RoutePath.PRODUCTS}/${product.id}`} className="block">
        <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover" />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-serif font-semibold text-brand-primary mb-2">
          <Link to={`${RoutePath.PRODUCTS}/${product.id}`} className="hover:text-brand-accent">{product.name}</Link>
        </h3>
        <p className="text-brand-secondary text-sm mb-3 flex-grow">{product.description}</p>
        <p className="text-2xl font-semibold text-brand-accent mb-4">${product.price.toFixed(2)}</p>
        <button
          onClick={() => addToCart(product)}
          className="w-full bg-brand-primary text-white py-2 px-4 rounded-md hover:bg-brand-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-opacity-50"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {variant?: 'primary' | 'secondary' | 'outline'}> = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyle = "py-2 px-6 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50";
  let variantStyle = "";
  switch(variant) {
    case 'primary':
      variantStyle = "bg-brand-primary text-white hover:bg-brand-secondary focus:ring-brand-accent";
      break;
    case 'secondary':
      variantStyle = "bg-brand-accent text-white hover:opacity-90 focus:ring-brand-primary";
      break;
    case 'outline':
      variantStyle = "border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white focus:ring-brand-primary";
      break;
  }
  return (
    <button className={`${baseStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  );
};


// ---------- PAGE COMPONENTS ---------- //
const HomePage: React.FC = () => {
  const featuredProducts = PRODUCTS_DATA.slice(0, 3);
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-serif font-bold text-brand-primary mb-4">Welcome to {APP_NAME}</h1>
        <p className="text-xl text-brand-secondary max-w-2xl mx-auto">Discover curated accessories and furniture for a truly distinguished home.</p>
      </section>
      <section>
        <h2 className="text-3xl font-serif font-semibold text-brand-primary mb-8 text-center">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to={RoutePath.PRODUCTS}>
            <Button variant="primary">Explore All Products</Button>
          </Link>
        </div>
      </section>
       <section className="mt-16 bg-brand-bg p-8 md:p-12 rounded-lg shadow-lg">
        <h2 className="text-3xl font-serif font-semibold text-brand-primary mb-6 text-center">Our Philosophy</h2>
        <p className="text-lg text-brand-secondary max-w-3xl mx-auto text-center leading-relaxed">
          At Home of Necessity, we believe that true luxury lies in the perfect blend of form, function, and feeling. 
          Each piece in our collection is carefully selected for its exceptional quality, timeless design, and the unique story it tells. 
          We aim to provide not just objects, but essentials that elevate your everyday living and transform your house into a cherished home.
        </p>
      </section>
    </div>
  );
};

const ProductListPage: React.FC = () => {
  // Basic filtering could be added here
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(PRODUCTS_DATA.map(p => p.category))];

  const filteredProducts = PRODUCTS_DATA.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-brand-primary mb-10 text-center">Our Collection</h1>
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
        <input 
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent sm:w-1/2 lg:w-1/3"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-3 border border-gray-300 rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-brand-secondary text-xl mt-10">No products found matching your criteria.</p>
      )}
    </div>
  );
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const product = PRODUCTS_DATA.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="container mx-auto p-8 text-center text-xl text-red-600">Product not found.</div>;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Optionally, show a notification
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          <img src={product.imageUrl} alt={product.name} className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-xl"/>
        </div>
        <div className="pt-4">
          <h1 className="text-4xl font-serif font-bold text-brand-primary mb-4">{product.name}</h1>
          <p className="text-brand-secondary text-lg mb-6">{product.description}</p>
          {product.details && <p className="text-brand-secondary mb-6 whitespace-pre-line">{product.details}</p>}
          <p className="text-4xl font-semibold text-brand-accent mb-8">${product.price.toFixed(2)}</p>
          
          <div className="flex items-center mb-8">
            <label htmlFor="quantity" className="mr-4 text-brand-secondary font-medium">Quantity:</label>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-brand-primary hover:bg-gray-100"><MinusIcon /></button>
              <input 
                type="number" 
                id="quantity" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-16 text-center border-l border-r border-gray-300 focus:outline-none"
              />
              <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-brand-primary hover:bg-gray-100"><PlusIcon /></button>
            </div>
          </div>

          <Button onClick={handleAddToCart} variant="primary" className="w-full sm:w-auto">
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Suggested Products Section (Optional) */}
      <div className="mt-20">
        <h2 className="text-2xl font-serif font-semibold text-brand-primary mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS_DATA.filter(p => p.id !== product.id && p.category === product.category).slice(0,3).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
          {PRODUCTS_DATA.filter(p => p.id !== product.id && p.category !== product.category).slice(0, 3 - PRODUCTS_DATA.filter(p => p.id !== product.id && p.category === product.category).length).map(p => (
             <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};


const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-serif font-bold text-brand-primary mb-6">Your Cart is Empty</h1>
        <p className="text-brand-secondary mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to={RoutePath.PRODUCTS}>
          <Button variant="primary">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-brand-primary mb-10 text-center">Shopping Cart</h1>
      <div className="bg-brand-bg shadow-xl rounded-lg p-6 md:p-8">
        <div className="hidden md:grid grid-cols-6 gap-4 mb-4 pb-2 border-b border-gray-200 font-semibold text-brand-secondary">
          <div className="col-span-2">Product</div>
          <div>Price</div>
          <div>Quantity</div>
          <div>Total</div>
          <div>Remove</div>
        </div>
        {cart.map(item => (
          <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
            <div className="col-span-1 md:col-span-2 flex items-center">
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4"/>
              <div>
                <Link to={`${RoutePath.PRODUCTS}/${item.id}`} className="font-semibold text-brand-primary hover:text-brand-accent">{item.name}</Link>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
            </div>
            <div className="text-brand-secondary md:text-center"><span className="md:hidden font-semibold">Price: </span>${item.price.toFixed(2)}</div>
            <div className="flex items-center md:justify-center">
              <span className="md:hidden font-semibold mr-2">Quantity: </span>
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-brand-primary hover:bg-gray-100 rounded-full"><MinusIcon className="w-4 h-4"/></button>
              <span className="mx-3">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-brand-primary hover:bg-gray-100 rounded-full"><PlusIcon className="w-4 h-4"/></button>
            </div>
            <div className="font-semibold text-brand-primary md:text-center"><span className="md:hidden font-semibold">Total: </span>${(item.price * item.quantity).toFixed(2)}</div>
            <div className="md:text-center">
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
          <Button onClick={clearCart} variant="outline" className="mb-4 md:mb-0">Clear Cart</Button>
          <div className="text-right">
            <p className="text-2xl font-semibold text-brand-primary mb-4">
              Grand Total: <span className="text-brand-accent">${getCartTotal().toFixed(2)}</span>
            </p>
            <Button onClick={() => navigate(RoutePath.CHECKOUT)} variant="primary" className="w-full md:w-auto">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

declare global{
  interface Window{
    paypal:any;
  }
}

const CheckoutPage: React.FC = () => {



  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', address: '' });
  const [formErrors, setFormErrors] = useState({ name: '', email: '', address: '' });

  useEffect(() => {
    if (cart.length === 0 && !isProcessing) {
      navigate(RoutePath.CART);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, navigate, isProcessing]);

useEffect(()=>{
  if (!window.paypal){
    const script=document.createElement('script');
    script.src='https://www.paypal.com/sdk/js?client-id=AfoIUhq3sOvyPPZnxhmEXp6drbQJZeDlzL2Sk6DiLIojdAR-c3MfFQftaspE5KvWAfe95KF10IJZy9jg&currency=USD';
    script.async=true;
    document.body.appendChild(script);
  }
},[]);



  
  useEffect(() => {
    if (window.paypal && cart.length > 0 && !isProcessing) {
      const container= document.getElementById('paypal-button-container');
      if (container) container.innerHTML='';
      renderPayPalButton();  // <- this is your defined function
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, formData, isProcessing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const errors = { name: '', email: '', address: '' };
    if (!formData.name.trim()) {
      errors.name = 'Name is required.';
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid.';
      isValid = false;
    }
    if (!formData.address.trim()) {
      errors.address = 'Address is required.';
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

 const renderPayPalButton = () => {
    if (!window.paypal || !validateForm()) return;

    window.paypal.Buttons({
      createOrder: (_data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: getCartTotal().toFixed(2),
            },
          }],
        });
      },
      onApprove: async (data: any, actions: any) => {
        setIsProcessing(true);
        const details = await actions.order.capture();
          console.log("Transaction details:", details);
          console.log("PayPal order ID:",data.orderID);
        const orderId = `HON-${Date.now()}`;

    try{
      await fetch('/api/serve',{
        method:'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
        orderId,
          name:formData.name,
          email:formData.email,
          address:formData.address,
          total: getCartTotal(),
          items:cart
        })
      });
    }catch (err){
      console.error("Failed to save order:"err);
      
    }
        
        clearCart();
        setIsProcessing(false);

        navigate(RoutePath.ORDERCONFIRMATION, {
          state: {
            orderId,
            total: getCartTotal(),
            items: cart,
            customer: formData,
          }
        });
      },
      onError: (err: any) => {
        alert('Payment failed. Please try again.');
        console.error('PayPal error:', err);
      }
    }).render('#paypal-button-container');
  };

  if (isProcessing) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-serif font-bold text-brand-primary mb-4">Processing Payment...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
        <p className="text-brand-secondary mt-4">Please wait, we're securely processing your order.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-brand-primary mb-10 text-center">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-brand-bg shadow-xl rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-serif font-semibold text-brand-primary mb-6">Shipping Details</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-secondary mb-1">Full Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className={`w-full p-3 border rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`} />
              {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-secondary mb-1">Email Address</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className={`w-full p-3 border rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`} />
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-brand-secondary mb-1">Shipping Address</label>
              <textarea name="address" id="address" rows={3} value={formData.address} onChange={handleInputChange} className={`w-full p-3 border rounded-md shadow-sm focus:ring-brand-accent focus:border-brand-accent ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}></textarea>
              {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
            </div>
          </form>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-brand-bg shadow-xl rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-serif font-semibold text-brand-primary mb-6">Order Summary</h2>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <span className="text-brand-secondary">{item.name} (x{item.quantity})</span>
                <span className="font-medium text-brand-primary">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
             <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-brand-primary">
              <span className="text-xl font-bold text-brand-primary">Total</span>
              <span className="text-xl font-bold text-brand-accent">${getCartTotal().toFixed(2)}</span>
            </div>
            <div id="paypal-button-container" className="mt-8"></div>

    <p className="text-xs text-gray-500 mt-2 text-center">You will be redirected to a confirmation page.</p>
</div>

            
          </div>
        </div>
      </div>
    
  );  
};



const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Type assertion for location.state
  const orderDetails = location.state as { orderId: string; total: number; items: CartItem[]; customer: { name: string } } | null;


  useEffect(() => {
    if (!orderDetails) {
      // If no order details are passed, redirect to home.
      // This prevents direct access to this page without "placing an order".
      navigate(RoutePath.HOME);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDetails, navigate]);

  if (!orderDetails) {
    // This will usually not be seen due to the redirect, but good for robustness.
    return <div className="container mx-auto p-8 text-center">Loading confirmation...</div>;
  }
  
  const { orderId, total, items, customer } = orderDetails;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <div className="bg-brand-bg shadow-xl rounded-lg p-8 md:p-12 max-w-2xl mx-auto">
        <svg className="w-16 h-16 text-green-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 className="text-3xl font-serif font-bold text-brand-primary mb-4">Thank You, {customer?.name || 'Valued Customer'}!</h1>
        <p className="text-lg text-brand-secondary mb-2">Your order has been successfully placed.</p>
        <p className="text-brand-secondary mb-6">Your Order ID is: <span className="font-semibold text-brand-accent">{orderId}</span></p>
        
        <div className="text-left my-8 p-4 border border-gray-200 rounded-md">
            <h3 className="text-xl font-serif font-semibold text-brand-primary mb-3">Order Summary:</h3>
            {items.map(item => (
                 <div key={item.id} className="flex justify-between text-sm text-brand-secondary py-1">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                 </div>
            ))}
            <div className="flex justify-between font-bold text-brand-primary mt-3 pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
            </div>
        </div>

        <p className="text-brand-secondary mb-8">We've sent a confirmation email with your order details (simulated). You can expect your items to be delivered with care.</p>
        <Link to={RoutePath.HOME}>
          <Button variant="primary">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
};

// ---------- MAIN APP COMPONENT ---------- //
const App: React.FC = () => {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen font-sans bg-brand-light">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path={RoutePath.HOME} element={<HomePage />} />
            <Route path={RoutePath.PRODUCTS} element={<ProductListPage />} />
            <Route path={RoutePath.PRODUCTDETAILS} element={<ProductDetailPage />} />
            <Route path={RoutePath.CART} element={<CartPage />} />
            <Route path={RoutePath.CHECKOUT} element={<CheckoutPage />} />
            <Route path={RoutePath.ORDERCONFIRMATION} element={<OrderConfirmationPage />} />
            <Route path="*" element={<HomePage />} /> {/* Fallback to home for unknown routes */}
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
};



export default App;
