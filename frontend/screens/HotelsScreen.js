import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, TextInput } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const HotelsScreen = ({ navigation }) => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLocation, setSearchLocation] = useState('');

    const fetchHotels = async (locationQuery = '') => {
        setLoading(true);
        try {
            const url = locationQuery ? `/hotels?location=${locationQuery}` : '/hotels';
            const res = await api.get(url);
            // Only show approved hotels to users
            const approvedHotels = res.data.data.filter(h => h.isApproved);
            setHotels(approvedHotels);
        } catch (error) {
            console.error('Error fetching hotels', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    const handleSearch = () => {
        fetchHotels(searchLocation);
    };

    const renderHotel = ({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('HotelDetails', { hotelId: item._id })}
        >
            <Image 
                source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300x200?text=No+Image' }} 
                style={styles.cardImage} 
            />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>★ {item.averageRating ? item.averageRating.toFixed(1) : 'New'}</Text>
                    </View>
                </View>
                <Text style={styles.cardSubtitle}>📍 {item.location}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                
                <View style={styles.facilitiesContainer}>
                    {item.facilities.slice(0, 3).map((fac, idx) => (
                        <Text key={idx} style={styles.facilityText}>• {fac}</Text>
                    ))}
                    {item.facilities.length > 3 && <Text style={styles.facilityText}>+{item.facilities.length - 3} more</Text>}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.header}>
                <Text style={styles.headerTitle}>Find Accommodations</Text>
                
                <View style={styles.searchContainer}>
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Search by city or location..."
                        placeholderTextColor="#999"
                        value={searchLocation}
                        onChangeText={setSearchLocation}
                        onSubmitEditing={handleSearch}
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
            
            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#FF6B6B" />
                </View>
            ) : hotels.length === 0 ? (
                <View style={styles.loader}>
                    <Text style={styles.noResultsText}>No hotels found for this location.</Text>
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
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
    },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 16 },
    searchContainer: { flexDirection: 'row', alignItems: 'center' },
    searchInput: {
        flex: 1, height: 50, backgroundColor: '#FFF', borderRadius: 12,
        paddingHorizontal: 16, fontSize: 16, color: '#2D3142', marginRight: 10
    },
    searchButton: {
        backgroundColor: '#2D3142', height: 50, paddingHorizontal: 20,
        borderRadius: 12, justifyContent: 'center', alignItems: 'center'
    },
    searchButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    noResultsText: { fontSize: 16, color: '#9E9EA7' },
    listContent: { paddingHorizontal: 20, paddingBottom: 30 },
    card: {
        backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', marginBottom: 20,
        elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8,
    },
    cardImage: { width: '100%', height: 200, resizeMode: 'cover' },
    cardContent: { padding: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3142', flex: 1 },
    ratingBadge: { backgroundColor: '#FFD700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 10 },
    ratingText: { fontWeight: 'bold', color: '#2D3142', fontSize: 12 },
    cardSubtitle: { fontSize: 14, color: '#FF6B6B', marginBottom: 8, fontWeight: 'bold' },
    cardDesc: { fontSize: 13, color: '#757575', marginBottom: 12 },
    facilitiesContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    facilityText: { fontSize: 12, color: '#9E9EA7', marginRight: 10, marginBottom: 4 }
});

export default HotelsScreen;
