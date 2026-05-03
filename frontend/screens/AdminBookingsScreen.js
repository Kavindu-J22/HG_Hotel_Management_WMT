import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const AdminBookingsScreen = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings');
            setBookings(res.data.data);
        } catch (error) {
            console.error('Error fetching all bookings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const deleteBooking = async (id) => {
        Alert.alert(
            "Delete Booking",
            "Are you sure you want to delete this booking? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/bookings/${id}`);
                            Alert.alert("Success", "Booking deleted.");
                            fetchBookings();
                        } catch (error) {
                            Alert.alert("Error", error.response?.data?.error || "Could not delete booking.");
                        }
                    } 
                }
            ]
        );
    };

    const renderBooking = ({ item }) => {
        const brandModel = (item.itemId?.brand || item.itemId?.model) ? `${item.itemId?.brand || ''} ${item.itemId?.model || ''}`.trim() : '';
        const itemTitle = item.itemId?.title || item.itemId?.name || brandModel || 'Tour/Service';

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{item.itemType} - {itemTitle}</Text>
                        <Text style={styles.bookingIdText}>Ref: {item.bookingId || item._id.substring(item._id.length - 6).toUpperCase()}</Text>
                    </View>
                    <View style={[styles.badge, item.status === 'Confirmed' ? styles.badgeSuccess : styles.badgePending]}>
                        <Text style={styles.badgeText}>{item.status}</Text>
                    </View>
                </View>
                
                <Text style={styles.userInfo}>Tourist: {item.user?.name} ({item.user?.email})</Text>
                <Text style={styles.cardText}>Dates: {new Date(item.startDate).toLocaleDateString()} to {new Date(item.endDate).toLocaleDateString()}</Text>
                <Text style={styles.cardPrice}>Total: ${item.totalPrice}</Text>
                
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteBooking(item._id)}>
                    <Text style={styles.deleteButtonText}>Delete Booking</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#9C27B0', '#E040FB']} style={styles.header}>
                <Text style={styles.headerTitle}>Bookings Database</Text>
                <Text style={styles.headerSubtitle}>Manage all platform bookings</Text>
            </LinearGradient>

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#9C27B0" />
                </View>
            ) : bookings.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No bookings found on the platform.</Text>
                </View>
            ) : (
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item._id}
                    renderItem={renderBooking}
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
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
    headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 18, color: '#9E9EA7' },
    listContent: { paddingHorizontal: 20, paddingBottom: 30 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3142', marginRight: 10 },
    bookingIdText: { fontSize: 12, color: '#9E9EA7', fontWeight: 'bold', marginTop: 2 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgePending: { backgroundColor: '#FFF3E0' },
    badgeSuccess: { backgroundColor: '#E8F5E9' },
    badgeText: { fontSize: 12, fontWeight: 'bold', color: '#424242' },
    userInfo: { fontSize: 13, color: '#FF6B6B', marginBottom: 4, fontWeight: 'bold' },
    cardText: { fontSize: 14, color: '#666', marginBottom: 6 },
    cardPrice: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 16 },
    deleteButton: {
        backgroundColor: '#f44336',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButtonText: { color: '#FFF', fontWeight: 'bold' }
});

export default AdminBookingsScreen;
