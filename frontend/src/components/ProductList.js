import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // for navigation
import axios from "axios";
import { FaShoppingCart } from "react-icons/fa"; // Import Cart Icon

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // To manage search input
    const [cartItems, setCartItems] = useState([]); // Manage cart items
    const [selectedCategory, setSelectedCategory] = useState(""); // Manage selected category
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null); // Store user info
    const [showSignIn, setShowSignIn] = useState(false); // Toggle sign-in form
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate(); // React Router for navigation

    // Fetch products from Fake Store API
    useEffect(() => {
        axios
            .get("https://fakestoreapi.com/products")
            .then((response) => {
                setProducts(response.data);
                setFilteredProducts(response.data); // Initialize filteredProducts
            })
            .catch((error) => {
                console.error("Error fetching the products", error);
            });
    }, []);

    // Function to handle new product addition to cart
    const addToCart = (product) => {
        const itemExists = cartItems.find((item) => item.id === product.id);
        let updatedCartItems;

        if (!itemExists) {
            updatedCartItems = [...cartItems, { ...product, quantity: 1 }];
        } else {
            updatedCartItems = cartItems.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        }

        // Update the state
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    }

    // Navigate to cart page with cart items
    const handleNavigateToCart = () => {
        if (!user) {
            alert("Please sign in to proceed to checkout.");
        } else {
            navigate("/carts");
        }
    };

    // Function to handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.trim() === "") {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter((product) =>
                product.title.toLowerCase().includes(e.target.value.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    };

    // Function to filter products by category
    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
        const filtered = products.filter((product) =>
            category === "All" ? true : product.category === category
        );
        setFilteredProducts(filtered);
    };

    // Sign-in form submission
    const handleSignIn = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        // Save user data
        const userData = { email, password };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setShowSignIn(false);
    };

    // Sign out functionality
    const handleSignOut = () => {
        localStorage.removeItem('user');
        setUser(null);
        alert("Signed out successfully");
    };
    
    const handleDropdownClick = () => {
        setShowDropdown((prev) => !prev); // Toggle dropdown visibility
    };

    const handleAccount = () => {
        navigate('/login')
    }

    return (
        <div>
            {/* Navigation Bar */}
            <nav className="bg-black shadow-md py-4 px-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">My Store</h1>

                <div className="flex space-x-32 items-center">
                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search products"
                        value={searchTerm}
                        onChange={handleSearch} // Search as you type
                        className="p-2 border mr-24 w-96 border-gray-300 rounded-lg focus:outline-none"
                    />
                    
                    <div className="relative">
                        <button
                            className="relative text-white  flex flex-col items-start"
                            onMouseEnter={() => setShowDropdown(true)} // Show dropdown on hover
                            onMouseLeave={() => setShowDropdown(false)} // Hide dropdown on hover out
                        >
                            Hello, {user ? user.email: "Sign In"}
                            <p>Account and Lists</p>
                        </button>

                        {showDropdown && (
                            <div
                                className="absolute w-26 bg-white -300 border mt-2 rounded-lg p-2"
                                onMouseEnter={() => setShowDropdown(true)}
                                onMouseDown={()=> setShowDropdown(true)}
                            >
                                {!user ? (
                                    <div>
                                        <button
                                            className="absolute bg-yellow-300 w-28 text-center px-6 py-2 hover:bg-yellow-400"
                                            onClick={() => setShowSignIn(true)}
                                        >
                                            Sign In
                                        </button>
                                     
                                    </div>
                                ) : (
                                    <div>
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-gray-200"
                                            onClick={() => alert("Account Details")}
                                        >
                                            Your Account
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                            onClick={() => alert("Your Orders")}
                                        >
                                            Your Orders
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                            onClick={() => alert("Your Lists")}
                                        >
                                            Your Lists
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                            onClick={handleSignOut}
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
{/* 
                    {/* User Account Section */}
                    {/* {user ? (
                        <div className="text-white">
                            <h2>Hello,{user.email}</h2>
                            <p>Account & lists: </p>
                            <button
                                className="text-yellow-400 hover:underline"
                                onClick={handleSignOut}
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div>
                            <button
                                className="text-white hover:underline"
                                onClick={() => setShowSignIn(true)}
                            >
                               Hello, Sign In
                             </button>
                        </div>
                    )}  */}

                    <div className="relative">
                        {/* Cart Icon */}
                        <FaShoppingCart
                            className="text-2xl text-white cursor-pointer"
                            onClick={handleNavigateToCart}
                        />

                        {/* Cart Item Count */}
                        {cartItems.length > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">
                                {cartItems.length}
                            </span>
                        )}
                    </div>
                </div>
            </nav>

            {/* Sign In Form */}
            {showSignIn && (
                <form onSubmit={handleSignIn} className="bg-white shadow-lg p-6 rounded-lg">
                    <h2 className="text-lg font-bold mb-4">Sign In</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            name="email"
                            type="email"
                            className="p-2 border w-full rounded-lg"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="p-2 border w-full rounded-lg"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 mb-12"
                    >
                        Sign In
                    </button>
                   
                </form>
            )}

            {/* Product Section */}
            <div className="p-6 bg-gray-50">
                {/* Categories */}
                <div className="flex ml-12 justify-center space-x-4 mb-28">
                    <button
                        className="p-2 w-16 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                        onClick={() => handleCategoryFilter("All")} // Filter all products
                    >
                        All
                    </button>
                    <button
                        className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                        onClick={() => handleCategoryFilter("electronics")} // Filter electronics
                    >
                        Electronics
                    </button>
                    <button
                        className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                        onClick={() => handleCategoryFilter("jewelery")} // Filter jewelry
                    >
                        Jewelery
                    </button>
                    <button
                        className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                        onClick={() => handleCategoryFilter("men's clothing")} // Filter men's clothing
                    >
                        Men's Clothing
                    </button>
                    <button
                        className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                        onClick={() => handleCategoryFilter("women's clothing")} // Filter women's clothing
                    >
                        Women's Clothing
                    </button>
                </div>

                {/* Product Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="w-full bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="mt-2">
                                <h2 className="text-xl font-bold">{product.title}</h2>
                                <p className="text-gray-700">{product.description}</p>
                                <p className="text-lg font-semibold text-green-600">${product.price}</p>
                                <button
                                    className="mt-4 w-full p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                    onClick={() => addToCart(product)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
