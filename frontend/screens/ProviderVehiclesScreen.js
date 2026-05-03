import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const ProviderVehiclesScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyVehicles = async () => {
        try {
            const res = await api.get('/vehicles');
            const myVehicles = res.data.data.filter(v => v.provider && v.provider._id === user._id);
            setVehicles(myVehicles);
        } catch (error) {
            console.error('Error fetching my vehicles', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchMyVehicles();
        });
        return unsubscribe;
    }, [navigation]);

    const deleteVehicle = async (id) => {
        Alert.alert(
            "Delete Vehicle",
            "Are you sure you want to delete this vehicle? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/vehicles/${id}`);
                            fetchMyVehicles();
                        } catch (error) {
                            Alert.alert("Error", error.response?.data?.error || "Failed to delete vehicle.");
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
                    {item.isApproved ? (
                        <View style={[styles.badge, styles.badgeSuccess]}><Text style={styles.badgeText}>Approved</Text></View>
                    ) : (
                        <View style={[styles.badge, styles.badgePending]}><Text style={styles.badgeText}>Pending Review</Text></View>
                    )}
                </View>
                <Text style={styles.cardSubtitle}>{item.type} • {item.fuel}</Text>
                
                <View style={styles.priceRow}>
                    <Text style={styles.priceText}>${item.dailyRate}/day</Text>
                    <Text style={styles.capacityText}>👤 {item.seatingCapacity} Seats</Text>
                </View>

                <View style={styles.actionsContainer}>
                    <View style={styles.rowActions}>
                        <TouchableOpacity 
                            style={[styles.smallButton, styles.editButton]}
                            onPress={() => navigation.navigate('AddEditVehicle', { vehicle: item })}
                        >
                            <Text style={styles.actionText}>Edit</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.smallButton, styles.deleteButton]}
                            onPress={() => deleteVehicle(item._id)}
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
            <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.header}>
                <Text style={styles.headerTitle}>My Vehicles</Text>
                <Text style={styles.headerSubtitle}>Manage your rental fleet</Text>
            </LinearGradient>

            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('AddEditVehicle')}
            >
                <Text style={styles.addButtonText}>+ Add New Vehicle</Text>
            </TouchableOpacity>

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#4facfe" />
                </View>
            ) : vehicles.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>You haven't added any vehicles yet.</Text>
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
    header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
    headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
    addButton: { backgroundColor: '#FFF', margin: 20, padding: 16, borderRadius: 12, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, borderWidth: 1, borderColor: '#4facfe', borderStyle: 'dashed' },
    addButtonText: { color: '#4facfe', fontWeight: 'bold', fontSize: 16 },
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
    badgeSuccess: { backgroundColor: '#E8F5E9' },
    badgePending: { backgroundColor: '#FFF3E0' },
    badgeText: { fontSize: 10, fontWeight: 'bold', color: '#424242' },
    cardSubtitle: { fontSize: 14, color: '#9E9EA7', marginBottom: 8 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    priceText: { fontSize: 16, fontWeight: 'bold', color: '#4facfe' },
    capacityText: { fontSize: 14, color: '#757575', fontWeight: 'bold' },
    actionsContainer: { borderTopWidth: 1, borderColor: '#EEE', paddingTop: 16 },
    rowActions: { flexDirection: 'row', justifyContent: 'space-between' },
    smallButton: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    editButton: { backgroundColor: '#FFB74D', marginRight: 8 },
    deleteButton: { backgroundColor: '#E57373', marginLeft: 8 },
    actionText: { color: '#FFF', fontWeight: 'bold' }
});

export default ProviderVehiclesScreen;
