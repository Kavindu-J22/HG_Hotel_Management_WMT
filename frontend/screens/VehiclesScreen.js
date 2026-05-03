import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const VehiclesScreen = ({ navigation }) => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await api.get('/vehicles');
                setVehicles(res.data.data);
            } catch (error) {
                console.error('Error fetching vehicles', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    const renderVehicle = ({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Booking', {
                itemId: item._id,
                itemType: 'Vehicle',
                itemTitle: `${item.brand} ${item.model}`,
                pricePerDay: item.dailyRate
            })}
        >
            <Image 
                source={{ uri: item.images && item.images.length > 0 ? `http://10.0.2.2:5000${item.images[0]}` : 'https://via.placeholder.com/300x200?text=No+Image' }} 
                style={styles.cardImage} 
            />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.brand} {item.model}</Text>
                    <Text style={styles.cardPrice}>${item.dailyRate}/day</Text>
                </View>
                <Text style={styles.cardSubtitle}>{item.type} • {item.fuel} • {item.seatingCapacity} Seats</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.header}>
                <Text style={styles.headerTitle}>Rent a Vehicle</Text>
            </LinearGradient>
            
            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#4facfe" />
                </View>
            ) : (
                <FlatList
                    data={vehicles}
                    keyExtractor={(item) => item._id}
                    renderItem={renderVehicle}
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
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3142',
    },
    cardPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4facfe',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#9E9EA7',
    }
});

export default VehiclesScreen;
