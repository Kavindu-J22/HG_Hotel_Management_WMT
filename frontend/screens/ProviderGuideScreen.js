import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const ProviderGuideScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [guideProfile, setGuideProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMyProfile = async () => {
        try {
            const res = await api.get('/guides');
            const myProfile = res.data.data.find(g => g.user && g.user._id === user._id);
            setGuideProfile(myProfile || null);
        } catch (error) {
            console.error('Error fetching my guide profile', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchMyProfile();
        });
        return unsubscribe;
    }, [navigation]);

    const deleteProfile = async () => {
        Alert.alert(
            "Delete Profile",
            "Are you sure you want to delete your Tour Guide profile? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/guides/${guideProfile._id}`);
                            setGuideProfile(null);
                        } catch (error) {
                            Alert.alert("Error", error.response?.data?.error || "Failed to delete profile.");
                        }
                    } 
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#4facfe" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.header}>
                <Text style={styles.headerTitle}>My Guide Profile</Text>
                <Text style={styles.headerSubtitle}>Manage your public persona</Text>
            </LinearGradient>

            {!guideProfile ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>You haven't set up a Tour Guide profile yet.</Text>
                    <TouchableOpacity 
                        style={styles.createButton}
                        onPress={() => navigation.navigate('AddEditGuide')}
                    >
                        <Text style={styles.createButtonText}>Create Profile</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.card}>
                        <Image 
                            source={{ uri: guideProfile.profileImage ? guideProfile.profileImage : 'https://via.placeholder.com/150' }} 
                            style={styles.profileImage} 
                        />
                        
                        <View style={styles.cardHeader}>
                            <Text style={styles.name}>{user.name}</Text>
                            {guideProfile.isApproved ? (
                                <View style={[styles.badge, styles.badgeSuccess]}><Text style={styles.badgeText}>Approved</Text></View>
                            ) : (
                                <View style={[styles.badge, styles.badgePending]}><Text style={styles.badgeText}>Pending Review</Text></View>
                            )}
                        </View>

                        <Text style={styles.infoText}>⭐ Experience: <Text style={styles.boldText}>{guideProfile.experienceLevel}</Text></Text>
                        <Text style={styles.infoText}>🗣️ Languages: <Text style={styles.boldText}>{guideProfile.languages.join(', ')}</Text></Text>
                        <Text style={styles.infoText}>📞 Contact: <Text style={styles.boldText}>{guideProfile.contactNumber || 'N/A'}</Text></Text>
                        <Text style={styles.infoText}>💰 Daily Rate: <Text style={styles.boldText}>${guideProfile.dailyRate || '0'}</Text></Text>
                        
                        <Text style={styles.sectionTitle}>Biography</Text>
                        <Text style={styles.bioText}>{guideProfile.bio}</Text>

                        <View style={styles.actionsContainer}>
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.editButton]}
                                onPress={() => navigation.navigate('AddEditGuide', { profile: guideProfile })}
                            >
                                <Text style={styles.actionText}>Edit Profile</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.deleteButton]}
                                onPress={deleteProfile}
                            >
                                <Text style={styles.actionText}>Delete Profile</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={[styles.actionButton, styles.editButton, { marginTop: 15, width: '100%' }]} onPress={() => navigation.navigate('ProviderTourPlans')}>
                            <Text style={styles.actionText}>Manage Tour Plans</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F6F8' },
    header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
    headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    emptyText: { fontSize: 16, color: '#9E9EA7', textAlign: 'center', marginBottom: 20 },
    createButton: { backgroundColor: '#43e97b', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, elevation: 3 },
    createButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    content: { padding: 20 },
    card: { backgroundColor: '#FFF', borderRadius: 20, padding: 24, alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
    profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 16, borderWidth: 4, borderColor: '#38f9d7' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    name: { fontSize: 24, fontWeight: 'bold', color: '#2D3142', marginRight: 10 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgeSuccess: { backgroundColor: '#E8F5E9' },
    badgePending: { backgroundColor: '#FFF3E0' },
    badgeText: { fontSize: 12, fontWeight: 'bold', color: '#424242' },
    infoText: { fontSize: 16, color: '#666', marginBottom: 8, width: '100%' },
    boldText: { fontWeight: 'bold', color: '#2D3142' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3142', width: '100%', marginTop: 16, marginBottom: 8 },
    bioText: { fontSize: 15, color: '#666', lineHeight: 22, width: '100%', marginBottom: 24 },
    actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
    actionButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    editButton: { backgroundColor: '#FFB74D', marginRight: 8 },
    deleteButton: { backgroundColor: '#E57373', marginLeft: 8 },
    actionText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default ProviderGuideScreen;
