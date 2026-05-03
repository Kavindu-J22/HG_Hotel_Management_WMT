import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const DashboardScreen = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings');
            setBookings(res.data.data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const cancelBooking = async (id) => {
        try {
            await api.delete(`/bookings/${id}`);
            Alert.alert('Success', 'Booking cancelled.');
            fetchBookings();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Could not cancel booking.');
        }
    };

    const confirmBooking = async (id) => {
        try {
            await api.put(`/bookings/${id}`, { status: 'Confirmed' });
            Alert.alert('Success', 'Booking confirmed. Email sent!');
            fetchBookings();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Could not confirm booking.');
        }
    };

    const renderBooking = ({ item }) => {
        const brandModel = (item.itemId?.brand || item.itemId?.model) ? `${item.itemId?.brand || ''} ${item.itemId?.model || ''}`.trim() : '';
        const itemTitle = item.itemId?.title || item.itemId?.name || brandModel || 'Tour/Service';
        const isTourist = user.role === 'tourist';

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
                <Text style={styles.cardText}>Dates: {new Date(item.startDate).toLocaleDateString()} to {new Date(item.endDate).toLocaleDateString()}</Text>
                <Text style={styles.cardPrice}>Total: ${item.totalPrice}</Text>
                
                {/* Tourist Actions */}
                {isTourist && item.status === 'Pending' && (
                    <View style={styles.providerActions}>
                        <TouchableOpacity 
                            style={[styles.actionButton, { flex: 1, backgroundColor: '#FF9800', marginRight: 8 }]} 
                            onPress={() => navigation.navigate('EditBooking', { booking: item })}
                        >
                            <Text style={styles.actionButtonText}>Edit Dates</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.actionButton, { flex: 1, backgroundColor: '#FF6B6B', marginLeft: 8 }]} 
                            onPress={() => cancelBooking(item._id)}
                        >
                            <Text style={styles.actionButtonText}>Cancel Booking</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Provider Actions */}
                {!isTourist && item.status === 'Pending' && (
                    <View style={styles.providerActions}>
                        <TouchableOpacity style={[styles.actionButton, styles.confirmButton]} onPress={() => confirmBooking(item._id)}>
                            <Text style={styles.actionButtonText}>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={() => cancelBooking(item._id)}>
                            <Text style={styles.actionButtonText}>Reject</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#2c3e50', '#3498db']} style={styles.header}>
                <Text style={styles.headerTitle}>My Dashboard</Text>
                <Text style={styles.headerSubtitle}>{user?.role === 'provider' ? 'Manage your services' : 'Your bookings'}</Text>
            </LinearGradient>

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#3498db" />
                </View>
            ) : bookings.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No bookings found.</Text>
                </View>
            ) : (
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item._id}
                    renderItem={renderBooking}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={() => (
                        user?.role === 'provider' ? (
                            <View style={styles.providerManagementSection}>
                                <Text style={styles.sectionTitle}>Manage Your Services</Text>
                                <View style={styles.managementButtons}>
                                    <TouchableOpacity 
                                        style={styles.manageButton}
                                        onPress={() => navigation.navigate('ProviderHotels')}
                                    >
                                        <Text style={styles.manageButtonText}>Manage Hotels</Text>
                                    </TouchableOpacity>
                                    {/* Add buttons for Vehicles and Tour Plans later */}
                                </View>
                                <Text style={styles.sectionTitle}>Recent Bookings</Text>
                            </View>
                        ) : (
                            <Text style={styles.sectionTitle}>Your Bookings</Text>
                        )
                    )}
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
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
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
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3142',
        marginRight: 10,
    },
    bookingIdText: {
        fontSize: 12,
        color: '#9E9EA7',
        fontWeight: 'bold',
        marginTop: 2,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgePending: { backgroundColor: '#FFF3E0' },
    badgeSuccess: { backgroundColor: '#E8F5E9' },
    badgeText: { fontSize: 12, fontWeight: 'bold', color: '#424242' },
    cardText: { fontSize: 14, color: '#666', marginBottom: 6 },
    cardPrice: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 16 },
    actionButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonText: { color: '#FFF', fontWeight: 'bold' },
    providerActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    confirmButton: { flex: 1, backgroundColor: '#4caf50', marginRight: 8 },
    cancelButton: { flex: 1, backgroundColor: '#f44336', marginLeft: 8 },
    providerManagementSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3142',
        marginBottom: 12,
    },
    managementButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    manageButton: {
        backgroundColor: '#FFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginRight: 10,
        marginBottom: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#4facfe',
    },
    manageButtonText: {
        color: '#4facfe',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default DashboardScreen;
