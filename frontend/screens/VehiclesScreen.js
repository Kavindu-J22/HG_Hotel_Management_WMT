import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const VehiclesScreen = ({ navigation }) => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const filters = ['All', 'Car', 'Van', 'SUV', 'Bus'];

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            let query = '/vehicles';
            const params = [];
            
            if (searchQuery) params.push(`brand=${searchQuery}`);
            if (activeFilter !== 'All') params.push(`type=${activeFilter}`);

            if (params.length > 0) {
                query += `?${params.join('&')}`;
            }

            const res = await api.get(query);
            setVehicles(res.data.data);
        } catch (error) {
            console.error('Error fetching vehicles', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchVehicles();
        });
        return unsubscribe;
    }, [navigation, searchQuery, activeFilter]);

    const renderVehicle = ({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('VehicleDetails', { vehicleId: item._id })}
        >
            <Image 
                source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300x200?text=No+Image' }} 
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
                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Search by Brand (e.g. Toyota)"
                        placeholderTextColor="#9E9EA7"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </LinearGradient>

            <View style={styles.filterWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
                    {filters.map(filter => (
                        <TouchableOpacity 
                            key={filter} 
                            style={[styles.filterBadge, activeFilter === filter && styles.filterBadgeActive]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            
            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#4facfe" />
                </View>
            ) : vehicles.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No vehicles found matching your criteria.</Text>
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
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 20
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 55,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    searchIcon: { fontSize: 20, marginRight: 10 },
    searchInput: { flex: 1, height: '100%', fontSize: 16, color: '#2D3142' },
    filterWrapper: { paddingVertical: 10, marginBottom: 10 },
    filterContainer: { paddingHorizontal: 20 },
    filterBadge: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    filterBadgeActive: { backgroundColor: '#4facfe' },
    filterText: { fontSize: 14, color: '#9E9EA7', fontWeight: '600' },
    filterTextActive: { color: '#FFF' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, color: '#9E9EA7' },
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
    cardImage: { width: '100%', height: 200, resizeMode: 'cover' },
    cardContent: { padding: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3142' },
    cardPrice: { fontSize: 18, fontWeight: 'bold', color: '#4facfe' },
    cardSubtitle: { fontSize: 14, color: '#9E9EA7' }
});

export default VehiclesScreen;
