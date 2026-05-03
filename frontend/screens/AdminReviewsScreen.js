import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const AdminReviewsScreen = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const res = await api.get('/reviews');
            setReviews(res.data.data);
        } catch (error) {
            console.error('Error fetching all reviews', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const deleteReview = async (id) => {
        Alert.alert(
            "Delete Review",
            "Are you sure you want to delete this review? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete(`/reviews/${id}`);
                            Alert.alert("Success", "Review deleted.");
                            fetchReviews();
                        } catch (error) {
                            Alert.alert("Error", error.response?.data?.error || "Could not delete review.");
                        }
                    } 
                }
            ]
        );
    };

    const renderReview = ({ item }) => {
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.userInfo}>By: {item.user?.name || 'Anonymous'}</Text>
                    </View>
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>⭐ {item.rating}/5</Text>
                    </View>
                </View>
                
                <Text style={styles.reviewText}>{item.text}</Text>
                
                {item.providerReply ? (
                    <View style={styles.replyBox}>
                        <Text style={styles.replyHeader}>↳ Provider Reply</Text>
                        <Text style={styles.replyText}>{item.providerReply}</Text>
                    </View>
                ) : null}
                
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteReview(item._id)}>
                    <Text style={styles.deleteButtonText}>Delete Review</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#9C27B0', '#E040FB']} style={styles.header}>
                <Text style={styles.headerTitle}>Reviews Database</Text>
                <Text style={styles.headerSubtitle}>Manage all platform reviews</Text>
            </LinearGradient>

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#9C27B0" />
                </View>
            ) : reviews.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No reviews found on the platform.</Text>
                </View>
            ) : (
                <FlatList
                    data={reviews}
                    keyExtractor={(item) => item._id}
                    renderItem={renderReview}
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
    userInfo: { fontSize: 13, color: '#9E9EA7', marginTop: 4 },
    ratingBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    ratingText: { fontSize: 12, fontWeight: 'bold', color: '#E65100' },
    reviewText: { fontSize: 14, color: '#666', marginBottom: 12, lineHeight: 20 },
    replyBox: {
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#4facfe',
        marginBottom: 12
    },
    replyHeader: { fontSize: 12, fontWeight: 'bold', color: '#4facfe', marginBottom: 4 },
    replyText: { fontSize: 13, color: '#6C757D', fontStyle: 'italic' },
    deleteButton: {
        backgroundColor: '#f44336',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10
    },
    deleteButtonText: { color: '#FFF', fontWeight: 'bold' }
});

export default AdminReviewsScreen;
