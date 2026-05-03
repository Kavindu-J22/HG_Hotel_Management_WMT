import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useIsFocused } from '@react-navigation/native';

const ProviderTourPlansScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [plans, setPlans] = useState([]);
    const [guideId, setGuideId] = useState(null);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        const fetchGuideAndPlans = async () => {
            try {
                // First get the guide profile for this provider
                const guideRes = await api.get('/guides/me');
                if (guideRes.data.data) {
                    const currentGuideId = guideRes.data.data._id;
                    setGuideId(currentGuideId);
                    
                    // Fetch plans for this guide
                    const plansRes = await api.get(`/guides/${currentGuideId}/plans`);
                    setPlans(plansRes.data.data);
                } else {
                    Alert.alert('Notice', 'Please create a Guide Profile first.');
                    navigation.navigate('ProviderGuide');
                }
            } catch (error) {
                console.error(error);
                if (error.response?.status === 404) {
                    // Guide not found
                    Alert.alert('Notice', 'Please create a Guide Profile first.');
                    navigation.navigate('ProviderGuide');
                }
            } finally {
                setLoading(false);
            }
        };

        if (isFocused) {
            fetchGuideAndPlans();
        }
    }, [isFocused]);

    const handleDelete = async (id) => {
        Alert.alert('Delete Plan', 'Are you sure you want to delete this tour plan?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.delete(`/plans/${id}`);
                        setPlans(plans.filter(p => p._id !== id));
                    } catch (error) {
                        Alert.alert('Error', error.response?.data?.error || 'Failed to delete');
                    }
                }
            }
        ]);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>${item.price}</Text>
            </View>
            <Text style={styles.infoText}>Duration: {item.durationDays} Days | Pax: {item.pax}</Text>
            <Text style={styles.infoText}>Transport: {item.transport}</Text>
            <Text style={styles.infoText} numberOfLines={1}>Destinations: {item.destinations.join(', ')}</Text>
            
            <View style={styles.actions}>
                <TouchableOpacity 
                    style={styles.editBtn} 
                    onPress={() => navigation.navigate('AddEditTourPlan', { guideId, plan: item })}
                >
                    <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.deleteBtn} 
                    onPress={() => handleDelete(item._id)}
                >
                    <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return <ActivityIndicator style={styles.loader} size="large" color="#43e97b" />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Tour Plans</Text>
            </View>

            <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => navigation.navigate('AddEditTourPlan', { guideId })}
            >
                <Text style={styles.addButtonText}>+ Create New Tour Plan</Text>
            </TouchableOpacity>

            {plans.length === 0 ? (
                <Text style={styles.noData}>No Tour Plans created yet.</Text>
            ) : (
                <FlatList 
                    data={plans}
                    keyExtractor={item => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F6F8' },
    loader: { flex: 1, justifyContent: 'center' },
    header: { padding: 20, paddingTop: 50, backgroundColor: '#43e97b', flexDirection: 'row', alignItems: 'center' },
    backButton: { marginRight: 15 },
    backButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    addButton: { backgroundColor: '#38f9d7', margin: 20, padding: 15, borderRadius: 10, alignItems: 'center' },
    addButtonText: { color: '#2D3142', fontWeight: 'bold', fontSize: 16 },
    noData: { textAlign: 'center', marginTop: 50, color: '#9E9EA7', fontSize: 16 },
    card: { backgroundColor: '#FFF', marginHorizontal: 20, marginBottom: 15, padding: 15, borderRadius: 12, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#2D3142', flex: 1 },
    price: { fontSize: 18, fontWeight: 'bold', color: '#43e97b' },
    infoText: { fontSize: 14, color: '#666', marginBottom: 4 },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
    editBtn: { backgroundColor: '#4facfe', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 6, marginRight: 10 },
    deleteBtn: { backgroundColor: '#FF6B6B', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 6 },
    btnText: { color: '#FFF', fontWeight: 'bold' }
});

export default ProviderTourPlansScreen;
