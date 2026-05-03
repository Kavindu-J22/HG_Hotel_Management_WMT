import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const ProviderHotelsScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyHotels = async () => {
        try {
            // Reusing getHotels but we'll filter them by provider locally for now, 
            // or better yet, since the backend getHotels is public and doesn't filter by user
            // we will filter locally.
            const res = await api.get('/hotels');
            const myHotels = res.data.data.filter(h => h.provider && h.provider._id === user._id);
            setHotels(myHotels);
        } catch (error) {
            console.error('Error fetching my hotels', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchMyHotels();
        });
        return unsubscribe;
    }, [navigation]);

    const deleteHotel = async (id) => {
        Alert.alert(
            "Delete Hotel",
            "Are you sure you want to delete this hotel? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/hotels/${id}`);
                            fetchMyHotels();
                        } catch (error) {
                            Alert.alert("Error", error.response?.data?.error || "Failed to delete hotel.");
                        }
                    } 
                }
            ]
        );
    };

    const renderHotel = ({ item }) => (
        <View style={styles.card}>
            <Image 
                source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300x200?text=No+Image' }} 
                style={styles.cardImage} 
            />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    {item.isApproved ? (
                        <View style={[styles.badge, styles.badgeSuccess]}><Text style={styles.badgeText}>Approved</Text></View>
                    ) : (
                        <View style={[styles.badge, styles.badgePending]}><Text style={styles.badgeText}>Pending Review</Text></View>
                    )}
                </View>
                <Text style={styles.cardSubtitle}>{item.location}</Text>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.roomsButton]}
                        onPress={() => navigation.navigate('ProviderRooms', { hotelId: item._id, hotelName: item.name })}
                    >
                        <Text style={styles.actionText}>Manage Rooms</Text>
                    </TouchableOpacity>

                    <View style={styles.rowActions}>
                        <TouchableOpacity 
                            style={[styles.smallButton, styles.editButton]}
                            onPress={() => navigation.navigate('AddEditHotel', { hotel: item })}
                        >
                            <Text style={styles.actionText}>Edit</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.smallButton, styles.deleteButton]}
                            onPress={() => deleteHotel(item._id)}
                        >
                            <Text style={styles.actionText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.header}>
                <Text style={styles.headerTitle}>My Hotels</Text>
                <Text style={styles.headerSubtitle}>Manage your hotel properties</Text>
            </LinearGradient>

            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('AddEditHotel')}
            >
                <Text style={styles.addButtonText}>+ Add New Hotel</Text>
            </TouchableOpacity>

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#FF6B6B" />
                </View>
            ) : hotels.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>You haven't added any hotels yet.</Text>
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
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    addButton: {
        backgroundColor: '#FFF',
        margin: 20,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#FF6B6B',
        borderStyle: 'dashed',
    },
    addButtonText: {
        color: '#FF6B6B',
        fontWeight: 'bold',
        fontSize: 16,
    },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, color: '#9E9EA7' },
    listContent: { paddingHorizontal: 20, paddingBottom: 30 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    cardImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3142',
        flex: 1,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: 10,
    },
    badgeSuccess: { backgroundColor: '#E8F5E9' },
    badgePending: { backgroundColor: '#FFF3E0' },
    badgeText: { fontSize: 10, fontWeight: 'bold', color: '#424242' },
    cardSubtitle: {
        fontSize: 14,
        color: '#9E9EA7',
        marginBottom: 16,
    },
    actionsContainer: {
        borderTopWidth: 1,
        borderColor: '#EEE',
        paddingTop: 16,
    },
    roomsButton: {
        backgroundColor: '#4facfe',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    rowActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smallButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#FFB74D',
        marginRight: 8,
    },
    deleteButton: {
        backgroundColor: '#E57373',
        marginLeft: 8,
    },
    actionText: {
        color: '#FFF',
        fontWeight: 'bold',
    }
});

export default ProviderHotelsScreen;
