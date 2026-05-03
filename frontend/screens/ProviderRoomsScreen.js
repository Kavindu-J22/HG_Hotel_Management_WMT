import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const ProviderRoomsScreen = ({ route, navigation }) => {
    const { hotelId, hotelName } = route.params;
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRooms = async () => {
        try {
            const res = await api.get(`/hotels/${hotelId}/rooms`);
            setRooms(res.data.data);
        } catch (error) {
            console.error('Error fetching rooms', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchRooms();
        });
        return unsubscribe;
    }, [navigation]);

    const deleteRoom = async (roomId) => {
        Alert.alert(
            "Delete Room",
            "Are you sure you want to delete this room?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/rooms/${roomId}`);
                            fetchRooms();
                        } catch (error) {
                            Alert.alert("Error", error.response?.data?.error || "Failed to delete room.");
                        }
                    } 
                }
            ]
        );
    };

    const renderRoom = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardPrice}>${item.pricePerNight}/night</Text>
                </View>
                <Text style={styles.cardSubtitle}>Capacity: {item.capacity} Persons</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>

                <View style={styles.actionsContainer}>
                    <View style={styles.rowActions}>
                        <TouchableOpacity 
                            style={[styles.smallButton, styles.editButton]}
                            onPress={() => navigation.navigate('AddEditRoom', { hotelId, room: item })}
                        >
                            <Text style={styles.actionText}>Edit</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.smallButton, styles.deleteButton]}
                            onPress={() => deleteRoom(item._id)}
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
                <Text style={styles.headerTitle}>Manage Rooms</Text>
                <Text style={styles.headerSubtitle}>{hotelName}</Text>
            </LinearGradient>

            <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('AddEditRoom', { hotelId })}
            >
                <Text style={styles.addButtonText}>+ Add New Room</Text>
            </TouchableOpacity>

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#4facfe" />
                </View>
            ) : rooms.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No rooms added yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={rooms}
                    keyExtractor={(item) => item._id}
                    renderItem={renderRoom}
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
        borderColor: '#4facfe',
        borderStyle: 'dashed',
    },
    addButtonText: {
        color: '#4facfe',
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
    cardContent: {
        padding: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3142',
        flex: 1,
    },
    cardPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4facfe',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#9E9EA7',
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    actionsContainer: {
        borderTopWidth: 1,
        borderColor: '#EEE',
        paddingTop: 16,
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

export default ProviderRoomsScreen;
