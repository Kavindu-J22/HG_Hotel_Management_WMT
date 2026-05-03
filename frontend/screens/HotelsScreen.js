import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const HotelsScreen = ({ navigation }) => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await api.get('/hotels');
                setHotels(res.data.data);
            } catch (error) {
                console.error('Error fetching hotels', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    const renderHotel = ({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Booking', {
                itemId: item._id,
                itemType: 'Room',
                itemTitle: `${item.name} Room`,
                pricePerDay: 100 // Ideally we'd show rooms for the hotel, using 100 as placeholder
            })}
        >
            <Image 
                source={{ uri: item.images && item.images.length > 0 ? `http://10.0.2.2:5000${item.images[0]}` : 'https://via.placeholder.com/300x200?text=No+Image' }} 
                style={styles.cardImage} 
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSubtitle}>{item.location}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.header}>
                <Text style={styles.headerTitle}>Find Accommodations</Text>
            </LinearGradient>
            
            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#FF6B6B" />
                </View>
            ) : (
                <FlatList
                    data={hotels}
                    keyExtractor={(item) => item._id}
                    renderItem={renderHotel}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F6F8' },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
    },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { paddingHorizontal: 20, paddingBottom: 30 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3142',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#9E9EA7',
    }
});

export default HotelsScreen;
