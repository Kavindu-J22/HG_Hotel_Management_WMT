import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import ReviewsSection from '../components/ReviewsSection';
import WishlistButton from '../components/WishlistButton';

const TourGuideDetailsScreen = ({ route, navigation }) => {
    const { guideId } = route.params;
    const [guide, setGuide] = useState(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [guideRes, plansRes] = await Promise.all([
                    api.get(`/guides/${guideId}`),
                    api.get(`/guides/${guideId}/plans`)
                ]);
                setGuide(guideRes.data.data);
                setPlans(plansRes.data.data);
            } catch (error) {
                console.error('Error fetching guide details', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [guideId]);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#43e97b" />
            </View>
        );
    }

    if (!guide) {
        return (
            <View style={styles.loaderContainer}>
                <Text>Guide not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header / Cover */}
            <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.cover}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <WishlistButton itemType="TourGuide" itemId={guide._id} />
            </LinearGradient>

            {/* Content */}
            <View style={styles.contentContainer}>
                {/* Profile Picture overlapping cover */}
                <View style={styles.profileImageWrapper}>
                    <Image 
                        source={{ uri: guide.profileImage ? guide.profileImage : 'https://via.placeholder.com/150' }} 
                        style={styles.profileImage} 
                    />
                    {guide.isVerified ? (
                        <View style={styles.verifiedBadge}>
                            <Text style={styles.verifiedText}>✓</Text>
                        </View>
                    ) : null}
                </View>

                <View style={styles.headerInfo}>
                    <Text style={styles.title}>{guide.user?.name}</Text>
                    <Text style={styles.emailText}>{guide.user?.email}</Text>
                </View>
                
                {/* Specs */}
                <View style={styles.specsContainer}>
                    <View style={styles.specBox}>
                        <Text style={styles.specEmoji}>⭐</Text>
                        <Text style={styles.specValue}>{guide.experienceLevel}</Text>
                        <Text style={styles.specLabel}>Experience</Text>
                    </View>
                    <View style={styles.specBox}>
                        <Text style={styles.specEmoji}>🗣️</Text>
                        <Text style={styles.specValue}>{guide.languages.length}</Text>
                        <Text style={styles.specLabel}>Languages</Text>
                    </View>
                    <View style={styles.specBox}>
                        <Text style={styles.specEmoji}>📞</Text>
                        <Text style={styles.specValue}>{guide.contactNumber || 'N/A'}</Text>
                        <Text style={styles.specLabel}>Contact</Text>
                    </View>
                </View>

                {/* Languages List */}
                <Text style={styles.sectionTitle}>Languages Spoken</Text>
                <View style={styles.languagesContainer}>
                    {guide.languages.map((lang, idx) => (
                        <View key={`${lang}-${idx}`} style={styles.languagePill}>
                            <Text style={styles.languageText}>{lang}</Text>
                        </View>
                    ))}
                </View>

                {/* Description */}
                <Text style={styles.sectionTitle}>About Me</Text>
                <Text style={styles.description}>{guide.bio}</Text>

                {/* Tour Plans Section */}
                <Text style={styles.sectionTitle}>My Tour Plans</Text>
                {plans.length > 0 ? (
                    plans.map(plan => (
                        <TouchableOpacity 
                            key={plan._id} 
                            style={styles.planCard}
                            onPress={() => navigation.navigate('TourPlanDetails', { planId: plan._id })}
                        >
                            {plan.images && plan.images.length > 0 ? (
                                <Image 
                                    source={{ uri: plan.images[0].startsWith('http') ? plan.images[0] : `${api.defaults.baseURL.replace('/api', '')}${plan.images[0]}` }} 
                                    style={styles.planImage} 
                                />
                            ) : null}
                            <View style={styles.planInfo}>
                                <Text style={styles.planTitle}>{plan.title}</Text>
                                <Text style={styles.planSpecs}>{plan.durationDays} Days | Pax: {plan.pax}</Text>
                                <Text style={styles.planPrice}>${plan.price}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={{ color: '#9E9EA7', fontStyle: 'italic', marginBottom: 20 }}>This guide has no active tour plans yet.</Text>
                )}

                {/* Reviews Section */}
                <ReviewsSection itemId={guide._id} itemType="TourGuide" />
            </View>
            
            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F6F8' },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    cover: { height: 180, position: 'relative' },
    backButton: { position: 'absolute', top: 40, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
    backButtonText: { fontSize: 24, color: '#FFF', fontWeight: 'bold', marginTop: -2 },
    contentContainer: { padding: 24, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 10 },
    profileImageWrapper: { alignItems: 'center', marginTop: -70, marginBottom: 16, position: 'relative' },
    profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#FFF' },
    verifiedBadge: { position: 'absolute', bottom: 5, right: '35%', backgroundColor: '#00ACC1', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
    verifiedText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    headerInfo: { alignItems: 'center', marginBottom: 24 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#2D3142', marginBottom: 4 },
    emailText: { fontSize: 14, color: '#9E9EA7' },
    specsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    specBox: { flex: 1, backgroundColor: '#F4F6F8', borderRadius: 16, padding: 16, alignItems: 'center', marginHorizontal: 4 },
    specEmoji: { fontSize: 24, marginBottom: 8 },
    specValue: { fontSize: 16, fontWeight: 'bold', color: '#2D3142' },
    specLabel: { fontSize: 12, color: '#9E9EA7', marginTop: 4 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3142', marginBottom: 12 },
    languagesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
    languagePill: { backgroundColor: '#E8F5E9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, marginBottom: 10 },
    languageText: { color: '#43e97b', fontWeight: 'bold', fontSize: 14 },
    description: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 20 },
    planCard: { flexDirection: 'row', backgroundColor: '#F8F9FA', borderRadius: 12, overflow: 'hidden', marginBottom: 15, borderWidth: 1, borderColor: '#E9ECEF' },
    planImage: { width: 100, height: '100%', resizeMode: 'cover' },
    planInfo: { flex: 1, padding: 15 },
    planTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3142', marginBottom: 4 },
    planSpecs: { fontSize: 13, color: '#6C757D', marginBottom: 8 },
    planPrice: { fontSize: 16, fontWeight: 'bold', color: '#43e97b' }
});

export default TourGuideDetailsScreen;
