import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const TourGuidesScreen = ({ navigation }) => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const res = await api.get('/guides');
                setGuides(res.data.data);
            } catch (error) {
                console.error('Error fetching guides', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGuides();
    }, []);

    const renderGuide = ({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Booking', {
                itemId: item._id, // This should technically be TourPlan, but for demo we pass Guide ID
                itemType: 'TourPlan',
                itemTitle: `${item.user?.name}'s Tour Plan`,
                pricePerDay: 50 // Placeholder price
            })}
        >
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: item.profileImage !== 'no-photo.jpg' ? `http://10.0.2.2:5000${item.profileImage}` : 'https://via.placeholder.com/150' }} 
                    style={styles.cardImage} 
                />
            </View>
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.user?.name || 'Unknown Guide'}</Text>
                    {item.isVerified && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Verified</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.cardSubtitle}>{item.experienceLevel} Guide</Text>
                <Text style={styles.cardBio} numberOfLines={2}>{item.bio}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.header}>
                <Text style={styles.headerTitle}>Expert Tour Guides</Text>
            </LinearGradient>
            
            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#43e97b" />
                </View>
            ) : (
                <FlatList
                    data={guides}
                    keyExtractor={(item) => item._id}
                    renderItem={renderGuide}
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
        flexDirection: 'row',
        overflow: 'hidden',
        marginBottom: 20,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    imageContainer: {
        marginRight: 16,
        justifyContent: 'center',
    },
    cardImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        resizeMode: 'cover',
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3142',
        marginRight: 8,
    },
    badge: {
        backgroundColor: '#E0F7FA',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    badgeText: {
        color: '#00ACC1',
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#43e97b',
        fontWeight: '600',
        marginBottom: 4,
    },
    cardBio: {
        fontSize: 13,
        color: '#9E9EA7',
        lineHeight: 18,
    }
});

export default TourGuidesScreen;
