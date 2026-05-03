import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const TourGuidesScreen = ({ navigation }) => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const filters = ['All', 'Beginner', 'Intermediate', 'Expert'];

    const fetchGuides = async () => {
        setLoading(true);
        try {
            let query = '/guides';
            const params = [];
            
            if (searchQuery) params.push(`languages=${searchQuery}`);
            
            if (params.length > 0) {
                query += `?${params.join('&')}`;
            }

            const res = await api.get(query);
            let fetchedGuides = res.data.data;

            if (activeFilter !== 'All') {
                fetchedGuides = fetchedGuides.filter(g => g.experienceLevel === activeFilter);
            }

            setGuides(fetchedGuides);
        } catch (error) {
            console.error('Error fetching guides', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchGuides();
        });
        return unsubscribe;
    }, [navigation, searchQuery, activeFilter]);

    const renderGuide = ({ item }) => (
        <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('TourGuideDetails', { guideId: item._id })}
        >
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: item.profileImage ? item.profileImage : 'https://via.placeholder.com/150' }} 
                    style={styles.cardImage} 
                />
            </View>
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.user?.name || 'Unknown Guide'}</Text>
                    {item.isVerified ? (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Verified</Text>
                        </View>
                    ) : null}
                </View>
                <Text style={styles.cardSubtitle}>{item.experienceLevel} Guide</Text>
                <Text style={styles.cardBio} numberOfLines={2}>{item.bio}</Text>
                <Text style={styles.cardLanguages}>🗣️ {item.languages.join(', ')}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.header}>
                <Text style={styles.headerTitle}>Expert Tour Guides</Text>
                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Search by Language (e.g. English)"
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
                    <ActivityIndicator size="large" color="#43e97b" />
                </View>
            ) : guides.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No guides found matching your criteria.</Text>
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
    header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginBottom: 10 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },
    searchContainer: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, alignItems: 'center', paddingHorizontal: 16, height: 55, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
    searchIcon: { fontSize: 20, marginRight: 10 },
    searchInput: { flex: 1, height: '100%', fontSize: 16, color: '#2D3142' },
    filterWrapper: { paddingVertical: 10, marginBottom: 10 },
    filterContainer: { paddingHorizontal: 20 },
    filterBadge: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 10, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    filterBadgeActive: { backgroundColor: '#43e97b' },
    filterText: { fontSize: 14, color: '#9E9EA7', fontWeight: '600' },
    filterTextActive: { color: '#FFF' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, color: '#9E9EA7' },
    listContent: { paddingHorizontal: 20, paddingBottom: 30 },
    card: { backgroundColor: '#FFF', borderRadius: 20, flexDirection: 'row', overflow: 'hidden', marginBottom: 20, padding: 16, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
    imageContainer: { marginRight: 16, justifyContent: 'center' },
    cardImage: { width: 80, height: 80, borderRadius: 40, resizeMode: 'cover' },
    cardContent: { flex: 1, justifyContent: 'center' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3142', marginRight: 8, flex: 1 },
    badge: { backgroundColor: '#E0F7FA', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    badgeText: { color: '#00ACC1', fontSize: 10, fontWeight: 'bold' },
    cardSubtitle: { fontSize: 14, color: '#43e97b', fontWeight: '600', marginBottom: 4 },
    cardBio: { fontSize: 13, color: '#9E9EA7', lineHeight: 18, marginBottom: 4 },
    cardLanguages: { fontSize: 12, color: '#FFB74D', fontWeight: 'bold' }
});

export default TourGuidesScreen;
