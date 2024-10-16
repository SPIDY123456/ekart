import axios from "axios";

const API_URL = "https://ekart-3528.onrender.com";

export const registerUser = async (user) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, user);
        return response.data;
    }
    catch(error){
         throw new Error(error.response.data.message);
    }
};

export const loginUser = async (user) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, user);
        return response.data;
    }
    catch(error){
        throw new Error(error.response?.data?.message  || "ERROR MAMA");
}
};

export const getProducts = async () => {
    try {
        const response = await axios.get(`https://fakestoreapi.com/products`);
        return response.data;
    }
    catch(error){
         throw new Error(error.response.data.message);
    }
        
};

export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data;
    }
    catch(error){
         throw new Error(error.response.data.message);
    }
};



export const addToCart = async (product, userId) => {
    try {
        const { id, title, price, imageUrl } = product;

        const response = await axios.post(`https://fakestoreapi.com/carts`, {
            userId,
            products: [{
                id, 
                quantity: 1, 
                title,          
                price,         
                imageUrl
}] // Structure this as needed by your API
        });
        return response.data;

    }
    catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to add product to cart');
    }
};


export const createOrder = async (orderData,token) => {
    try {
        const response = await axios.post(`https://fakestoreapi.com/`, orderData, {
            headers : {
                Authorization : token
            },
        });
        return response.data;
    }
        catch(error){
             throw new Error(error.response.data.message);
        }
            
        
};

    

// Fetch user orders
export const getUserOrder = async () => {
    try {
        
        const token = localStorage.getItem('token') || 'S0m3R@nd0mJWT!Key12345*&^%'; 
        const response = await axios.get('https://fakestoreapi.com/carts', {
            headers: {
                Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRpd2FrYXJsZXdpc0BnbWFpbC5jb20iLCJpYXQiOjE3MjgzMTA0MDksImV4cCI6MTcyODMxNDAwOX0.2eOl5hhFzQpGnvdNTxAvA6kQQyaIkUamzqsTSs2KKpk'}` // Use the fetched or default token
            },
        });
        return response.data; 
    } catch (error) {
     
        const errorMessage = error.response?.data?.message || 'Error fetching orders';
        throw new Error(errorMessage); 
    }
}

        
        












        
