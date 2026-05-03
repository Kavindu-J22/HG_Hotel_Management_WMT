import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from 'react-native-maps';
import ReviewsSection from '../components/ReviewsSection';
import WishlistButton from '../components/WishlistButton';

const { width } = Dimensions.get('window');

const HotelDetailsScreen = ({ route, navigation }) => {
    const { hotelId } = route.params;
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [hotelRes, roomsRes] = await Promise.all([
                    api.get(`/hotels/${hotelId}`),
                    api.get(`/hotels/${hotelId}/rooms`)
                ]);
                setHotel(hotelRes.data.data);
                setRooms(roomsRes.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [hotelId]);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#FF6B6B" />
            </View>
        );
    }

    if (!hotel) return <Text>Error loading hotel details.</Text>;

    const renderGalleryItem = ({ item }) => (
        <Image source={{ uri: item }} style={styles.galleryImage} />
    );

    const renderRoom = ({ item }) => (
        <View key={item._id} style={styles.roomCard}>
            {item.images && item.images.length > 0 && (
                <Image source={{ uri: item.images[0] }} style={styles.roomImage} />
            )}
            <View style={styles.roomInfo}>
                <View style={styles.roomHeader}>
                    <Text style={styles.roomTitle}>{item.title}</Text>
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeBadgeText}>{item.roomType}</Text>
                    </View>
                </View>
                <Text style={styles.roomDesc} numberOfLines={2}>{item.description}</Text>
                
                <View style={styles.roomFooter}>
                    <View>
                        {item.discount > 0 && (
                            <Text style={styles.originalPrice}>${item.pricePerNight}</Text>
                        )}
                        <Text style={styles.roomPrice}>
                            ${item.discount > 0 ? (item.pricePerNight * (1 - item.discount / 100)).toFixed(2) : item.pricePerNight}
                            <Text style={styles.perNight}> / night</Text>
                        </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <View style={styles.capacityBadge}>
                            <Text style={styles.capacityText}>👤 {item.capacity}</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.bookButton}
                            onPress={() => navigation.navigate('Booking', {
                                itemId: item._id,
                                itemType: 'Room',
                                itemTitle: `${hotel.name} - ${item.title}`,
                                pricePerDay: item.discount > 0 ? (item.pricePerNight * (1 - item.discount / 100)).toFixed(2) : item.pricePerNight
                            })}
                        >
                            <Text style={styles.bookButtonText}>Book Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    // Dummy coordinates based on name/location just for visual map demonstration
    const region = {
        latitude: 6.9271, // Colombo default
        longitude: 79.8612,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    return (
        <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
            {/* Image Gallery */}
            <View style={styles.galleryContainer}>
                {hotel.images && hotel.images.length > 0 ? (
                    <FlatList
                        data={hotel.images}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={renderGalleryItem}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                    />
                ) : (
                    <View style={[styles.galleryImage, { backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ color: '#757575' }}>No Images Available</Text>
                    </View>
                )}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <WishlistButton itemType="Hotel" itemId={hotel._id} />
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.titleRow}>
                    <Text style={styles.hotelName}>{hotel.name}</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>★ {hotel.averageRating ? hotel.averageRating.toFixed(1) : 'New'}</Text>
                    </View>
                </View>
                
                <Text style={styles.locationText}>📍 {hotel.location}</Text>
                
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.descriptionText}>{hotel.description || 'A beautiful property offering great views and amenities.'}</Text>
                
                <Text style={styles.sectionTitle}>Facilities</Text>
                <View style={styles.facilitiesContainer}>
                    {hotel.facilities.map((fac, idx) => (
                        <View key={idx} style={styles.facilityBadge}>
                            <Text style={styles.facilityText}>{fac}</Text>
                        </View>
                    ))}
                </View>

                {/* Map Display */}
                <Text style={styles.sectionTitle}>Location on Map</Text>
                <View style={styles.mapContainer}>
                    <MapView 
                        style={styles.map} 
                        initialRegion={region}
                    >
                        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} title={hotel.name} />
                    </MapView>
                </View>

                {/* Rooms List */}
                <Text style={styles.sectionTitle}>Available Rooms</Text>
                {rooms.length > 0 ? (
                    rooms.map(room => renderRoom({ item: room }))
                ) : (
                    <Text style={styles.noRoomsText}>No rooms available for this property.</Text>
                )}

                {/* Reviews Section */}
                <ReviewsSection itemId={hotel._id} itemType="Hotel" />
                
                <View style={{ height: 40 }} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    container: { flex: 1, backgroundColor: '#FFF' },
    galleryContainer: { height: 300, width: '100%' },
    galleryImage: { width: width, height: 300, resizeMode: 'cover' },
    backButton: {
        position: 'absolute', top: 40, left: 20, width: 40, height: 40,
        backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, justifyContent: 'center', alignItems: 'center'
    },
    backButtonText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: -5 },
    detailsContainer: { padding: 20, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    hotelName: { fontSize: 26, fontWeight: 'bold', color: '#2D3142', flex: 1 },
    ratingContainer: { backgroundColor: '#FFD700', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    ratingText: { fontWeight: 'bold', color: '#2D3142', fontSize: 16 },
    locationText: { fontSize: 16, color: '#757575', marginBottom: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3142', marginBottom: 12, marginTop: 10 },
    descriptionText: { fontSize: 15, color: '#666', lineHeight: 24, marginBottom: 20 },
    facilitiesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
    facilityBadge: { backgroundColor: '#F0F4F8', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, marginBottom: 10 },
    facilityText: { color: '#4facfe', fontWeight: 'bold' },
    mapContainer: { height: 200, width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
    map: { width: '100%', height: '100%' },
    noRoomsText: { color: '#9E9EA7', fontStyle: 'italic' },
    roomCard: {
        borderWidth: 1, borderColor: '#EEE', borderRadius: 16, overflow: 'hidden', marginBottom: 16,
        flexDirection: 'row', backgroundColor: '#FAFAFA'
    },
    roomImage: { width: 120, height: '100%', resizeMode: 'cover' },
    roomInfo: { flex: 1, padding: 16 },
    roomHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    roomTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3142', flex: 1 },
    typeBadge: { backgroundColor: '#4facfe', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 8 },
    typeBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    roomDesc: { fontSize: 13, color: '#757575', marginBottom: 12 },
    roomFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    originalPrice: { fontSize: 12, color: '#999', textDecorationLine: 'line-through' },
    roomPrice: { fontSize: 18, fontWeight: 'bold', color: '#FF6B6B' },
    perNight: { fontSize: 12, color: '#757575', fontWeight: 'normal' },
    capacityText: { fontSize: 12, color: '#424242', fontWeight: 'bold' },
    bookButton: { backgroundColor: '#FF6B6B', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginTop: 8 },
    bookButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' }
});

export default HotelDetailsScreen;
