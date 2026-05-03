import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const WishlistButton = ({ itemType, itemId }) => {
    const { user } = useContext(AuthContext);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'tourist') {
            setLoading(false);
            return;
        }

        const checkStatus = async () => {
            try {
                const res = await api.get(`/wishlists/check/${itemType}/${itemId}`);
                setIsWishlisted(res.data.isWishlisted);
            } catch (error) {
                console.error('Error checking wishlist status', error);
            } finally {
                setLoading(false);
            }
        };

        checkStatus();
    }, [itemId, itemType, user]);

    const toggleWishlist = async () => {
        if (!user) {
            Alert.alert('Notice', 'Please login to save to your wishlist');
            return;
        }

        // Optimistic UI update
        const previousState = isWishlisted;
        setIsWishlisted(!isWishlisted);

        try {
            await api.post('/wishlists/toggle', { itemType, itemId });
        } catch (error) {
            // Revert on error
            setIsWishlisted(previousState);
            Alert.alert('Error', 'Failed to update wishlist');
        }
    };

    if (!user || user.role !== 'tourist') return null;

    if (loading) {
        return (
            <TouchableOpacity style={styles.button}>
                <ActivityIndicator size="small" color="#FF6B6B" />
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={styles.button} onPress={toggleWishlist}>
            <Text style={[styles.icon, isWishlisted ? styles.iconActive : styles.iconInactive]}>
                {isWishlisted ? '❤️' : '🤍'}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: 40,
        right: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
    },
    icon: {
        fontSize: 24,
        marginTop: 2
    },
    iconActive: {
        color: '#FF6B6B'
    },
    iconInactive: {
        color: '#666'
    }
});

export default WishlistButton;
