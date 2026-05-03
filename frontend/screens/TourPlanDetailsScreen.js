import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const TourPlanDetailsScreen = ({ route, navigation }) => {
    const { planId } = route.params;
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlanDetails = async () => {
            try {
                const res = await api.get(`/plans/${planId}`);
                setPlan(res.data.data);
            } catch (error) {
                console.error('Error fetching plan details', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlanDetails();
    }, [planId]);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#43e97b" />
            </View>
        );
    }

    if (!plan) {
        return (
            <View style={styles.loaderContainer}>
                <Text>Tour Plan not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Image Gallery */}
            <View style={styles.imageGalleryContainer}>
                {plan.images && plan.images.length > 0 ? (
                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                        {plan.images.map((img, index) => (
                            <Image 
                                key={index} 
                                source={{ uri: img.startsWith('http') ? img : `${api.defaults.baseURL.replace('/api', '')}${img}` }} 
                                style={styles.galleryImage} 
                            />
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
                    <Text style={styles.title}>{plan.title}</Text>
                    <Text style={styles.price}>${plan.price}</Text>
                </View>
                
                <Text style={styles.providerText}>Guided by: {plan.guide?.user?.name}</Text>

                {/* Specs */}
                <View style={styles.specsContainer}>
                    <View style={styles.specBox}>
                        <Text style={styles.specEmoji}>🗓️</Text>
                        <Text style={styles.specValue}>{plan.durationDays} Days</Text>
                        <Text style={styles.specLabel}>Duration</Text>
                    </View>
                    <View style={styles.specBox}>
                        <Text style={styles.specEmoji}>👥</Text>
                        <Text style={styles.specValue}>{plan.pax}</Text>
                        <Text style={styles.specLabel}>Max Pax</Text>
                    </View>
                    <View style={styles.specBox}>
                        <Text style={styles.specEmoji}>🚐</Text>
                        <Text style={styles.specValue}>{plan.transport}</Text>
                        <Text style={styles.specLabel}>Transport</Text>
                    </View>
                </View>

                {/* Destinations */}
                <Text style={styles.sectionTitle}>Destinations</Text>
                <View style={styles.tagsContainer}>
                    {plan.destinations.map((dest, idx) => (
                        <View key={idx} style={styles.tagPill}>
                            <Text style={styles.tagText}>{dest}</Text>
                        </View>
                    ))}
                </View>

                {/* Amenities */}
                <Text style={styles.sectionTitle}>Includes</Text>
                <View style={styles.tagsContainer}>
                    {plan.amenities.map((item, idx) => (
                        <View key={idx} style={[styles.tagPill, { backgroundColor: '#FFF3E0' }]}>
                            <Text style={[styles.tagText, { color: '#E65100' }]}>✓ {item}</Text>
                        </View>
                    ))}
                </View>

                {/* Description */}
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{plan.description}</Text>

            </View>

            <View style={{ height: 80 }} /> {/* Bottom padding */}

            {/* Bottom Book Button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity 
                    style={styles.bookButton}
                    onPress={() => navigation.navigate('Booking', {
                        itemId: plan._id,
                        itemType: 'TourPlan',
                        itemTitle: plan.title,
                        pricePerDay: plan.price // Treat total plan price as pricePerDay since it's a fixed plan
                    })}
                >
                    <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.bookButtonGradient} start={{x:0, y:0}} end={{x:1, y:0}}>
                        <Text style={styles.bookButtonText}>Book This Plan</Text>
                        <Text style={styles.bookButtonPrice}>${plan.price}</Text>
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
    backButton: { position: 'absolute', top: 40, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
    backButtonText: { fontSize: 24, color: '#FFF', fontWeight: 'bold', marginTop: -2 },
    contentContainer: { padding: 24, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 10 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#2D3142', flex: 1 },
    price: { fontSize: 24, fontWeight: 'bold', color: '#43e97b' },
    providerText: { fontSize: 14, color: '#9E9EA7', fontWeight: '600', marginBottom: 24 },
    specsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    specBox: { flex: 1, backgroundColor: '#F4F6F8', borderRadius: 16, padding: 16, alignItems: 'center', marginHorizontal: 4 },
    specEmoji: { fontSize: 24, marginBottom: 8 },
    specValue: { fontSize: 14, fontWeight: 'bold', color: '#2D3142' },
    specLabel: { fontSize: 12, color: '#9E9EA7', marginTop: 4 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3142', marginBottom: 12 },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
    tagPill: { backgroundColor: '#E8F5E9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, marginBottom: 10 },
    tagText: { color: '#43e97b', fontWeight: 'bold', fontSize: 14 },
    description: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 20 },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#EEE' },
    bookButton: { borderRadius: 16, overflow: 'hidden', elevation: 5, shadowColor: '#38f9d7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
    bookButtonGradient: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
    bookButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    bookButtonPrice: { color: '#FFF', fontSize: 16, fontWeight: '600' }
});

export default TourPlanDetailsScreen;
