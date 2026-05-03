import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import ReviewsSection from '../components/ReviewsSection';

const { width } = Dimensions.get('window');

const VehicleDetailsScreen = ({ route, navigation }) => {
    const { vehicleId } = route.params;
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicleDetails = async () => {
            try {
                const res = await api.get(`/vehicles/${vehicleId}`);
                setVehicle(res.data.data);
            } catch (error) {
                console.error('Error fetching vehicle details', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicleDetails();
    }, [vehicleId]);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#4facfe" />
            </View>
        );
    }

    if (!vehicle) {
        return (
            <View style={styles.loaderContainer}>
                <Text>Vehicle not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Image Gallery */}
            <View style={styles.imageGalleryContainer}>
                {vehicle.images && vehicle.images.length > 0 ? (
                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                        {vehicle.images.map((img, index) => (
                            <Image key={index} source={{ uri: img }} style={styles.galleryImage} />
                        ))}
                    </ScrollView>
                ) : (
                    <Image source={{ uri: 'https://via.placeholder.com/600x400?text=No+Image' }} style={styles.galleryImage} />
                )}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{vehicle.brand} {vehicle.model}</Text>
                    <Text style={styles.price}>${vehicle.dailyRate}<Text style={styles.priceDay}>/day</Text></Text>
                </View>
                
                <Text style={styles.providerText}>Provided by: {vehicle.provider?.name}</Text>

                {/* Specs */}
                <View style={styles.specsContainer}>
                    <View style={styles.specBox}>
                        <Text style={styles.specEmoji}>🚗</Text>
                        <Text style={styles.specValue}>{vehicle.type}</Text>
                        <Text style={styles.specLabel}>Type</Text>
                    </View>
                    <View style={styles.specBox}>
                        <Text style={styles.specEmoji}>⛽</Text>
                        <Text style={styles.specValue}>{vehicle.fuel}</Text>
                        <Text style={styles.specLabel}>Fuel</Text>
                    </View>
                    <View style={styles.specBox}>
                        <Text style={styles.specEmoji}>👥</Text>
                        <Text style={styles.specValue}>{vehicle.seatingCapacity}</Text>
                        <Text style={styles.specLabel}>Seats</Text>
                    </View>
                </View>

                {/* Description */}
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{vehicle.description}</Text>

                {/* Reviews Section */}
                <ReviewsSection itemId={vehicle._id} itemType="Vehicle" />
            </View>

            <View style={{ height: 80 }} /> {/* Bottom padding */}

            {/* Bottom Book Button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity 
                    style={styles.bookButton}
                    onPress={() => navigation.navigate('Booking', {
                        itemId: vehicle._id,
                        itemType: 'Vehicle',
                        itemTitle: `${vehicle.brand} ${vehicle.model}`,
                        pricePerDay: vehicle.dailyRate
                    })}
                >
                    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.bookButtonGradient} start={{x:0, y:0}} end={{x:1, y:0}}>
                        <Text style={styles.bookButtonText}>Book Vehicle</Text>
                        <Text style={styles.bookButtonPrice}>${vehicle.dailyRate} / day</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F6F8' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    imageGalleryContainer: { height: 300, position: 'relative' },
    galleryImage: { width: width, height: 300, resizeMode: 'cover' },
    backButton: { position: 'absolute', top: 40, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
    backButtonText: { fontSize: 24, color: '#2D3142', fontWeight: 'bold', marginTop: -2 },
    contentContainer: { padding: 24, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 10 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#2D3142', flex: 1 },
    price: { fontSize: 24, fontWeight: 'bold', color: '#4facfe' },
    priceDay: { fontSize: 14, color: '#9E9EA7', fontWeight: 'normal' },
    providerText: { fontSize: 14, color: '#FF6B6B', fontWeight: '600', marginBottom: 24 },
    specsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    specBox: { flex: 1, backgroundColor: '#F4F6F8', borderRadius: 16, padding: 16, alignItems: 'center', marginHorizontal: 4 },
    specEmoji: { fontSize: 24, marginBottom: 8 },
    specValue: { fontSize: 16, fontWeight: 'bold', color: '#2D3142' },
    specLabel: { fontSize: 12, color: '#9E9EA7', marginTop: 4 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3142', marginBottom: 12 },
    description: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 20 },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#EEE' },
    bookButton: { borderRadius: 16, overflow: 'hidden', elevation: 5, shadowColor: '#4facfe', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
    bookButtonGradient: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
    bookButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    bookButtonPrice: { color: '#FFF', fontSize: 16, fontWeight: '600' }
});

export default VehicleDetailsScreen;
