import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const res = await api.get('/auth/me');
                setUser(res.data.data);
            }
        } catch (error) {
            console.error('Auth Check Error', error);
            await AsyncStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            await AsyncStorage.setItem('token', res.data.token);
            await checkAuth(); // fetches user details
            return true;
        } catch (error) {
            console.error('Login Error', error.response?.data || error.message);
            throw error;
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const res = await api.post('/auth/register', { name, email, password, role });
            await AsyncStorage.setItem('token', res.data.token);
            await checkAuth();
            return true;
        } catch (error) {
            console.error('Register Error', error.response?.data || error.message);
            throw error;
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
