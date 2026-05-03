import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const ProviderReviewsScreen = () => {
    const { user } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Reply Modal State
    const [replyModalVisible, setReplyModalVisible] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);

    const fetchProviderReviews = async () => {
        try {
            const res = await api.get('/reviews/provider');
            setReviews(res.data.data);
        } catch (error) {
            console.error('Error fetching provider reviews:', error);
            Alert.alert('Error', 'Failed to load your reviews.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviderReviews();
    }, []);

    const openReplyModal = (reviewId) => {
        setSelectedReviewId(reviewId);
        setReplyText('');
        setReplyModalVisible(true);
    };

    const submitReply = async () => {
        if (!replyText.trim()) {
            Alert.alert('Error', 'Please enter a reply.');
            return;
        }

        setSubmittingReply(true);
        try {
            await api.put(`/reviews/${selectedReviewId}/reply`, {
                providerReply: replyText
            });
            Alert.alert('Success', 'Reply submitted successfully!');
            setReplyModalVisible(false);
            fetchProviderReviews(); // Refresh the list
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Could not submit reply.');
        } finally {
            setSubmittingReply(false);
        }
    };

    const renderReviewCard = ({ item }) => {
        const itemTitle = item.itemId?.title || item.itemId?.name || `${item.itemId?.brand} ${item.itemId?.model}` || 'Unknown Item';

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.itemTitle}>{item.itemType} - {itemTitle}</Text>
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>⭐ {item.rating}/5</Text>
                    </View>
                </View>

                <View style={styles.reviewContent}>
                    <Text style={styles.reviewerName}>Reviewed by: {item.user?.name || 'Anonymous'}</Text>
                    <Text style={styles.reviewTitle}>{item.title}</Text>
                    <Text style={styles.reviewText}>{item.text}</Text>
                </View>

                {item.providerReply ? (
                    <View style={styles.replyBox}>
                        <Text style={styles.replyHeader}>Your Reply:</Text>
                        <Text style={styles.replyText}>{item.providerReply}</Text>
                    </View>
                ) : (
                    <TouchableOpacity 
                        style={styles.replyButton}
                        onPress={() => openReplyModal(item._id)}
                    >
                        <Text style={styles.replyButtonText}>Write a Reply</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#9C27B0', '#E040FB']} style={styles.header}>
                <Text style={styles.headerTitle}>Guest Reviews</Text>
                <Text style={styles.headerSubtitle}>Manage feedback for your properties & services</Text>
            </LinearGradient>

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#9C27B0" />
                </View>
            ) : reviews.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No reviews found yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={reviews}
                    keyExtractor={item => item._id}
                    renderItem={renderReviewCard}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Reply Modal */}
            <Modal
                visible={replyModalVisible}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Reply to Review</Text>
                        <Text style={styles.modalSubtitle}>Your reply will be public and visible to all tourists.</Text>
                        
                        <TextInput
                            style={styles.replyInput}
                            placeholder="Type your professional reply here..."
                            multiline
                            numberOfLines={5}
                            value={replyText}
                            onChangeText={setReplyText}
                            textAlignVertical="top"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity 
                                style={styles.cancelButton} 
                                onPress={() => setReplyModalVisible(false)}
                                disabled={submittingReply}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.submitReplyButton, submittingReply && { opacity: 0.7 }]} 
                                onPress={submitReply}
                                disabled={submittingReply}
                            >
                                <Text style={styles.submitReplyButtonText}>{submittingReply ? 'Sending...' : 'Submit Reply'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F6F8' },
    header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginBottom: 20 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
    headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, color: '#9E9EA7', fontStyle: 'italic' },
    listContent: { paddingHorizontal: 20, paddingBottom: 40 },
    card: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 10 },
    itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3142', flex: 1, marginRight: 10 },
    ratingBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    ratingText: { color: '#E65100', fontWeight: 'bold', fontSize: 12 },
    reviewContent: { marginBottom: 12 },
    reviewerName: { fontSize: 13, color: '#9E9EA7', marginBottom: 4 },
    reviewTitle: { fontSize: 16, fontWeight: 'bold', color: '#2D3142', marginBottom: 4 },
    reviewText: { fontSize: 14, color: '#666', lineHeight: 20 },
    replyBox: { backgroundColor: '#F0F4F8', padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#4facfe' },
    replyHeader: { fontSize: 13, fontWeight: 'bold', color: '#4facfe', marginBottom: 4 },
    replyText: { fontSize: 14, color: '#2D3142' },
    replyButton: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#9C27B0', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    replyButtonText: { color: '#9C27B0', fontWeight: 'bold' },
    
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { width: '100%', backgroundColor: '#FFF', borderRadius: 20, padding: 24, elevation: 10 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3142', marginBottom: 8 },
    modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
    replyInput: { borderWidth: 1, borderColor: '#DDD', borderRadius: 12, padding: 16, fontSize: 15, backgroundColor: '#FAFAFA', marginBottom: 20 },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
    cancelButton: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, marginRight: 10 },
    cancelButtonText: { color: '#666', fontWeight: 'bold', fontSize: 16 },
    submitReplyButton: { backgroundColor: '#9C27B0', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
    submitReplyButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default ProviderReviewsScreen;
