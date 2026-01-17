import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token in localStorage on mount
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check expiry
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    // Ideally we also fetch fresh user data from API here
                    setUser({ ...decoded, token }); // Minimal user info from token
                }
            } catch (e) {
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:3000/user/login', { email, password });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            setUser({ ...user, token });
            return { success: true, redirectUrl: res.data.redirectUrl };
        } catch (err) {
            console.error(err);
            return { success: false, error: err.response?.data?.error || 'Login failed' };
        }
    };

    const signup = async (userData) => {
        try {
            const res = await axios.post('http://localhost:3000/user/signup', userData);
            return res.data; // Expect { success: true, message: 'OTP sent' }
        } catch (err) {
            throw err.response?.data?.error || 'Signup failed';
        }
    };

    const verifyOtp = async (email, otp) => {
        try {
            const res = await axios.post('http://localhost:3000/user/verify-otp', { email, otp });
            const { token, user } = res.data;
            localStorage.setItem('token', token);
            setUser({ ...user, token });
            return { success: true, redirectUrl: res.data.redirectUrl };
        } catch (err) {
            throw err.response?.data?.error || 'Verification failed';
        }
    }

    const logout = async () => {
        try {
            await axios.get('http://localhost:3000/user/logout'); // Clear cookie on server if used
        } catch (e) { /* ignore */ }
        localStorage.removeItem('token');
        setUser(null);
    };

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3000',
        withCredentials: true // for cookies
    });

    axiosInstance.interceptors.request.use(config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    const value = {
        user,
        login,
        signup,
        verifyOtp,
        logout,
        loading,
        api: axiosInstance
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
