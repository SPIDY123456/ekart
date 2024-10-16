// import React, { useState } from "react";
// import { registerUser, loginUser } from "../api";
// import { useNavigate } from "react-router-dom";

// const AuthForm = ({ isLogin }) => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const userData = { username, password };
//         console.log('userdata', userData);

//         try {
//             if (isLogin) {
//                 const data = await loginUser(userData);
//                 alert('Login successful');
//                 localStorage.setItem('token', data.token);
//                 navigate('/products');
//             } else {
//                 await registerUser(userData);
//                 alert('Registration successful');
//                 navigate('/admin-dashboard');
//             }
//         } catch (error) {
//             console.log('Error occurred');
//             if (error.response) {
//                 console.log('Server Error:', error.response.data);
//             } else if (error.request) {
//                 console.log('No response from server:', error.request);
//             } else {
//                 console.log('Error setting up the request:', error.message);
//             }
//             alert('An error occurred. Please try again.');
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="flex flex-col items-center bg-white rounded-md shadow-md p-6 space-y-6">
//             <h2 className="text-2xl font-bold text-gray-800">{isLogin ? "Login" : "Register"}</h2>
//             <label className="text-gray-700">UserName</label>
//             <input
//                 type="text"
//                 name="username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="border border-gray-300 rounded-md p-2  w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                 required
//                 minLength="5"
//             />
//             <label className="text-gray-700">Password</label>
//             <input
//                 type="password"
//                 name="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="border border-gray-300 rounded-md p-2 w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                 required
//             />
//             <button
//                 type="submit"
//                 className="bg-blue-600 text-white py-2 rounded-lg w-96  hover:bg-blue-700 transition duration-300"
//             >
//                 {isLogin ? "Login" : "Register"}
//                 <p className="text-gray-600 text-sm text-center">
//                     {isLogin ? "Don't have an account? " : "Already have an account? "}
//                     <span
//                         className="text-blue-500 font-semibold cursor-pointer hover:underline"
//                         onClick={() => navigate(isLogin ? '/register' : '/login')}
//                     >
//                         {isLogin ? 'Register' : 'Login'}
//                     </span>
//                 </p>
//             </button>
//         </form>
//     );
// }

// export default AuthForm;

import React, { useState } from "react";
import { registerUser, loginUser } from "../api";
import { useNavigate } from "react-router-dom";

const AuthForm = ({ isLogin }) => {
    const [username, setUsername] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState(''); // Field for email
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare user data based on login or registration
        const userData = isLogin
            ? { email, password } // Only email and password for login
            : { username, mobileNumber, password }; // All fields for registration

        console.log('UserData:', userData);

        try {
            if (isLogin) {
                const data = await loginUser(userData); // Send email and password for login
                alert('Login successful');
                navigate('/carts')
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({ username: data.username, mobileNumber: data.mobileNumber })); // Save user details in local storage
                navigate('/products'); // Redirect to product list after login
            } else {
                const registrationResponse = await registerUser(userData);
                alert('Registration successful');
                localStorage.setItem('token', registrationResponse.token);
                localStorage.setItem('user', JSON.stringify({ username, mobileNumber })); // Save user details in local storage
                navigate('/login'); // Redirect to login page after registration
            }
        } catch (error) {
            console.log('Error occurred');
            if (error.response) {
                console.log('Server Error:', error.response.data);
            } else if (error.request) {
                console.log('No response from server:', error.request);
            } else {
                console.log('Error setting up the request:', error.message);
            }
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center bg-white rounded-md shadow-md p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">{isLogin ? "Sign In" : "Create Your Account"}</h2>
            {!isLogin && (
                <>
                    <label className="text-gray-700">UserName</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        required
                        minLength="5"
                    />
                    <label className="text-gray-700">Mobile Number</label>
                    <input
                        type="text"
                        name="mobileNumber"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        required
                    />
                </>
            )}
            <label className="text-gray-700 mt-8">Email</label>
            <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
            />
            <label className="text-gray-700 mt-8">Password</label>
            <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                required
            />
            <button
                type="submit"
                className="bg-yellow-500 text-white py-2 rounded-lg w-96 hover:bg-yellow-600 transition duration-300"
            >
                {isLogin ? "Continue" : "Create Your Account"}
            </button>
            <p className="text-gray-600 text-sm text-center">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span
                    className="text-blue-500 font-semibold cursor-pointer hover:underline"
                    onClick={() => navigate(isLogin ? '/register' : '/login')}
                >
                    {isLogin ? 'Create Your Account' : 'Sign In'}
                </span>
            </p>
        </form>
    );
};

export default AuthForm;
