import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const AdminVehiclesScreen = ({ navigation }) => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingVehicles = async () => {
        try {
            const res = await api.get('/vehicles');
            const pendingVehicles = res.data.data.filter(v => !v.isApproved);
            setVehicles(pendingVehicles);
        } catch (error) {
            console.error('Error fetching pending vehicles', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchPendingVehicles();
        });
        return unsubscribe;
    }, [navigation]);

    const approveVehicle = async (id) => {
        Alert.alert(
            "Approve Vehicle",
            "Are you sure you want to approve this vehicle for tourists to see?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Approve", 
                    style: "default",
                    onPress: async () => {
                        try {
                            await api.put(`/vehicles/${id}/approve`);
                            Alert.alert("Success", "Vehicle has been approved!");
                            fetchPendingVehicles();
                        } catch (error) {
                            Alert.alert("Error", error.response?.data?.error || "Failed to approve vehicle.");
                        }
                    } 
                }
            ]
        );
    };

    const renderVehicle = ({ item }) => (
        <View style={styles.card}>
            <Image 
                source={{ uri: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300x200?text=No+Image' }} 
                style={styles.cardImage} 
            />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.brand} {item.model}</Text>
                    <View style={[styles.badge, styles.badgePending]}>
                        <Text style={styles.badgeText}>Pending</Text>
                    </View>
                </View>
                <Text style={styles.cardSubtitle}>{item.type} • {item.fuel} • {item.seatingCapacity} Seats</Text>
                <Text style={styles.providerInfo}>Provider: {item.provider?.name || 'Unknown'}</Text>
                
                <TouchableOpacity 
                    style={styles.approveButton}
                    onPress={() => approveVehicle(item._id)}
                >
                    <Text style={styles.approveButtonText}>Approve Vehicle</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#9C27B0', '#E040FB']} style={styles.header}>
                <Text style={styles.headerTitle}>Admin Dashboard</Text>
                <Text style={styles.headerSubtitle}>Pending Vehicle Approvals</Text>
            </LinearGradient>

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#9C27B0" />
                </View>
            ) : vehicles.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No pending vehicles to approve.</Text>
                </View>
            ) : (
                <FlatList
                    data={vehicles}
                    keyExtractor={(item) => item._id}
                    renderItem={renderVehicle}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F6F8' },
    header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginBottom: 20 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
    headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, color: '#9E9EA7' },
    listContent: { paddingHorizontal: 20, paddingBottom: 30 },
    card: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
    cardImage: { width: '100%', height: 150, resizeMode: 'cover' },
    cardContent: { padding: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3142', flex: 1 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 10 },
    badgePending: { backgroundColor: '#FFF3E0' },
    badgeText: { fontSize: 10, fontWeight: 'bold', color: '#424242' },
    cardSubtitle: { fontSize: 14, color: '#9E9EA7', marginBottom: 4 },
    providerInfo: { fontSize: 13, color: '#4facfe', marginBottom: 16, fontWeight: 'bold' },
    approveButton: { backgroundColor: '#43e97b', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    approveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default AdminVehiclesScreen;
