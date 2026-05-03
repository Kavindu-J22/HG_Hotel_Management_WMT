import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const AdminGuidesScreen = ({ navigation }) => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingGuides = async () => {
        try {
            const res = await api.get('/guides');
            const pendingGuides = res.data.data.filter(g => !g.isApproved);
            setGuides(pendingGuides);
        } catch (error) {
            console.error('Error fetching pending guides', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchPendingGuides();
        });
        return unsubscribe;
    }, [navigation]);

    const approveGuide = async (id) => {
        Alert.alert(
            "Approve Tour Guide",
            "Are you sure you want to approve this Tour Guide profile for tourists to see?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Approve", 
                    style: "default",
                    onPress: async () => {
                        try {
                            await api.put(`/guides/${id}/approve`);
                            Alert.alert("Success", "Tour Guide has been approved!");
                            fetchPendingGuides();
                        } catch (error) {
                            Alert.alert("Error", error.response?.data?.error || "Failed to approve guide.");
                        }
                    } 
                }
            ]
        );
    };

    const renderGuide = ({ item }) => (
        <View style={styles.card}>
            <Image 
                source={{ uri: item.profileImage ? item.profileImage : 'https://via.placeholder.com/150' }} 
                style={styles.profileImage} 
            />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.user?.name || 'Unknown'}</Text>
                    <View style={[styles.badge, styles.badgePending]}>
                        <Text style={styles.badgeText}>Pending</Text>
                    </View>
                </View>
                <Text style={styles.cardSubtitle}>Experience: {item.experienceLevel}</Text>
                <Text style={styles.languagesText}>Languages: {item.languages.join(', ')}</Text>
                
                <TouchableOpacity 
                    style={styles.approveButton}
                    onPress={() => approveGuide(item._id)}
                >
                    <Text style={styles.approveButtonText}>Approve Guide</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#9C27B0', '#E040FB']} style={styles.header}>
                <Text style={styles.headerTitle}>Admin Dashboard</Text>
                <Text style={styles.headerSubtitle}>Pending Tour Guide Approvals</Text>
            </LinearGradient>

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#9C27B0" />
                </View>
            ) : guides.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No pending Tour Guides to approve.</Text>
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
    header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginBottom: 20 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
    headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, color: '#9E9EA7' },
    listContent: { paddingHorizontal: 20, paddingBottom: 30 },
    card: { backgroundColor: '#FFF', borderRadius: 16, flexDirection: 'row', padding: 16, marginBottom: 16, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, alignItems: 'center' },
    profileImage: { width: 80, height: 80, borderRadius: 40, marginRight: 16 },
    cardContent: { flex: 1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3142', flex: 1 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 10 },
    badgePending: { backgroundColor: '#FFF3E0' },
    badgeText: { fontSize: 10, fontWeight: 'bold', color: '#424242' },
    cardSubtitle: { fontSize: 14, color: '#9E9EA7', marginBottom: 4 },
    languagesText: { fontSize: 13, color: '#FF6B6B', marginBottom: 12, fontWeight: 'bold' },
    approveButton: { backgroundColor: '#43e97b', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    approveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 }
});

export default AdminGuidesScreen;
