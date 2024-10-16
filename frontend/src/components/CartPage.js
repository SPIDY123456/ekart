  import React, { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';

  const CartPage = ({ addToCart, cartItems, totalCost, setCartItems, setTotalCost }) => {

    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch('https://fakestoreapi.com/products');
          const products = await response.json();
          setRecommendedProducts(products);
        } catch (error) {
          console.error('Failed to fetch products:', error);
        }
      };

      fetchProducts();
    }, []);

    // Load cart items from localStorage when the component mounts
    useEffect(() => {
      const savedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      console.log(savedCartItems);
      const savedTotalCost = savedCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

      setCartItems(savedCartItems);
      setTotalCost(savedTotalCost);
    }, [setCartItems, setTotalCost]);

    const handleQuantityChange = (itemId, newQuantity) => {
      const updatedItems = cartItems.map(item => {
        if (item.id === itemId) {
          const priceDifference = (newQuantity - item.quantity) * item.price;
          setTotalCost(prevCost => prevCost + priceDifference);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCartItems(updatedItems);

      // Save updated cart items to localStorage
      localStorage.getItem('cartItems', JSON.stringify(updatedItems));
    };

    const removeFromCart = (productId) => {
      const productToRemove = cartItems.find(item => item.id === productId);
      if (productToRemove) {
        const newTotalCost = totalCost - (productToRemove.price * productToRemove.quantity);
        setCartItems(prevItems => {
          const updatedItems = prevItems.filter(item => item.id !== productId);
          if (updatedItems.length === 0) {
            setTotalCost(0);
            
            // Reset total cost
          }
          // Save updated cart items to localStorage
          localStorage.setItem('cartItems', JSON.stringify(updatedItems));
          return updatedItems;
        });

        if (cartItems.length > 1) {
          setTotalCost(newTotalCost);
        }
      }
    };

    const handleCheckout = () => {
      navigate('/checkout');
    };

    const handleProducts = () => {
      navigate('/products');
    };

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
      <div className="max-w-screen-xl mx-auto bg-white py-12">
        <h5 className="text-3xl font-bold text-center mb-8">Shopping Cart</h5>
        <h1 className="text-md font-semibold text-right mr-8">Price</h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-lg font-semibold text-gray-700">Your cart is empty</p>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b py-4 mb-4 mx-6 bg-gray-50 shadow-lg rounded-lg">
              <div className="flex items-center">
                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-md shadow-md" />
                <div className="ml-6">
                  <h2 className="font-semibold text-xl">{item.title}</h2>
                  <select
                    id={`quantity-${item.id}`}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    className="p-2 border rounded bg-gray-100 mt-2"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '10+'].map((option, idx) => (
                      <option key={idx} value={option === '10+' ? 10 : option}>
                        {`Qty: ${option === '10+' ? '10+' : option}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold mb-4">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
                  onClick={() => removeFromCart(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        <h3 className="font-semibold text-2xl text-right mr-8 mb-6">
          Subtotal ({totalItems} {totalItems > 1 ? 'items' : 'item'}): <span className="text-blue-600">${totalCost.toFixed(2)}</span>
        </h3>

        <div className="flex justify-center mb-12">
          <button
            className="bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition duration-300 py-3 px-8"
            onClick={handleCheckout}
          >
            Proceed to Checkout ({totalItems} {totalItems > 1 ? 'items' : 'item'})
          </button>
        </div>

        <div className="flex justify-end mb-12">
          <button
            className="bg-green-400 text-black font-semibold rounded-lg shadow-md hover:bg-green-500 transition duration-300 py-3 px-8"
            onClick={handleProducts}
          >
            Continue Shopping
          </button>
        </div>

        {recommendedProducts.length > 0 && (
          <div className="mt-12 mx-6">
            <h5 className="text-3xl font-bold mb-6">You might also like</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {recommendedProducts.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded shadow-lg">
                  <img src={product.image} alt={product.title} className="w-full h-48 object-cover rounded-md" />
                  <h2 className="mt-2 font-semibold text-lg">{product.title}</h2>
                  <p className="text-gray-700">${product.price}</p>
                  <button
                    className="mt-4 w-full p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    onClick={() => addToCart(product)} // Add product to the cart
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  export default CartPage;
