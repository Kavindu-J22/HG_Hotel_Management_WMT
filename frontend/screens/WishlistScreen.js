import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useIsFocused } from '@react-navigation/native';

const WishlistScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState({ Hotel: [], Vehicle: [], TourGuide: [] });
    const [activeTab, setActiveTab] = useState('Hotel');
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await api.get('/wishlists');
                const items = res.data.data;
                
                // Group by itemType
                const grouped = { Hotel: [], Vehicle: [], TourGuide: [] };
                items.forEach(item => {
                    if (item.itemId && grouped[item.itemType]) {
                        grouped[item.itemType].push(item);
                    }
                });
                
                setWishlist(grouped);
            } catch (error) {
                console.error('Error fetching wishlist', error);
            } finally {
                setLoading(false);
            }
        };

        if (isFocused && user) {
            fetchWishlist();
        }
    }, [isFocused, user]);

    const removeFromWishlist = async (itemType, itemId) => {
        try {
            await api.post('/wishlists/toggle', { itemType, itemId });
            setWishlist(prev => ({
                ...prev,
                [itemType]: prev[itemType].filter(w => w.itemId._id !== itemId)
            }));
        } catch (error) {
            console.error('Error removing from wishlist', error);
        }
    };

    const renderItem = ({ item }) => {
        const targetItem = item.itemId;
        if (!targetItem) return null;

        const title = targetItem.name || targetItem.title || `${targetItem.brand} ${targetItem.model}` || (targetItem.user?.name ? `${targetItem.user.name}'s Profile` : 'Unknown');
        const subtitle = targetItem.location || targetItem.locationArea || targetItem.bio?.substring(0, 50) || '';
        const image = targetItem.images?.[0] || targetItem.profileImage || 'https://via.placeholder.com/150';

        const handlePress = () => {
            if (activeTab === 'Hotel') navigation.navigate('HotelDetails', { hotelId: targetItem._id });
            if (activeTab === 'Vehicle') navigation.navigate('VehicleDetails', { vehicleId: targetItem._id });
            if (activeTab === 'TourGuide') navigation.navigate('TourGuideDetails', { guideId: targetItem._id });
        };

        return (
            <TouchableOpacity style={styles.card} onPress={handlePress}>
                <Image source={{ uri: image }} style={styles.image} />
                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
                    <Text style={styles.ratingText}>⭐ {targetItem.averageRating || 0}/5</Text>
                </View>
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromWishlist(activeTab, targetItem._id)}>
                    <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    const tabs = [
        { key: 'Hotel', label: 'Hotels', color: '#FF6B6B' },
        { key: 'Vehicle', label: 'Vehicles', color: '#4facfe' },
        { key: 'TourGuide', label: 'Guides', color: '#43e97b' }
    ];

    if (loading) return <View style={styles.loader}><ActivityIndicator size="large" color="#FF6B6B" /></View>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Wishlist</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {tabs.map(tab => (
                    <TouchableOpacity 
                        key={tab.key}
                        style={[styles.tab, activeTab === tab.key && { borderBottomColor: tab.color }]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Text style={[styles.tabText, activeTab === tab.key && { color: tab.color, fontWeight: 'bold' }]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* List */}
            {wishlist[activeTab].length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyEmoji}>❤️</Text>
                    <Text style={styles.emptyTitle}>Nothing here yet</Text>
                    <Text style={styles.emptyText}>Tap the heart icon on any {activeTab.toLowerCase()} to save it for later.</Text>
                </View>
            ) : (
                <FlatList
                    data={wishlist[activeTab]}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F6F8' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 20, paddingTop: 50, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', elevation: 2, zIndex: 10 },
    backButton: { marginRight: 15 },
    backButtonText: { fontSize: 24, fontWeight: 'bold', color: '#2D3142' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3142' },
    tabContainer: { flexDirection: 'row', backgroundColor: '#FFF', elevation: 2 },
    tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
    tabText: { fontSize: 16, color: '#9E9EA7' },
    listContent: { padding: 20 },
    card: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, marginBottom: 15, padding: 10, elevation: 3 },
    image: { width: 80, height: 80, borderRadius: 12 },
    info: { flex: 1, marginLeft: 15, justifyContent: 'center' },
    title: { fontSize: 16, fontWeight: 'bold', color: '#2D3142', marginBottom: 4 },
    subtitle: { fontSize: 13, color: '#666', marginBottom: 6 },
    ratingText: { fontSize: 12, color: '#E65100', fontWeight: 'bold', backgroundColor: '#FFF3E0', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    removeBtn: { padding: 10, justifyContent: 'center' },
    removeBtnText: { color: '#FF6B6B', fontSize: 18, fontWeight: 'bold' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyEmoji: { fontSize: 40, marginBottom: 15, opacity: 0.5 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3142', marginBottom: 10 },
    emptyText: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22 }
});

export default WishlistScreen;
