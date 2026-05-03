import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const ReviewsSection = ({ itemId, itemType }) => {
    const { user } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchReviews = async () => {
        try {
            const res = await api.get(`/items/${itemId}/reviews`);
            setReviews(res.data.data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (itemId) fetchReviews();
    }, [itemId]);

    const submitReview = async () => {
        if (!title || !text || !rating) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const ratingNum = parseInt(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            Alert.alert('Error', 'Rating must be between 1 and 5');
            return;
        }

        setSubmitting(true);
        try {
            const res = await api.post('/reviews', {
                itemType,
                itemId,
                title,
                text,
                rating: ratingNum
            });

            // Add new review to list
            setReviews([{ ...res.data.data, user: { name: user.name } }, ...reviews]);
            setTitle('');
            setText('');
            setRating(5);
            Alert.alert('Success', 'Review submitted!');
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Could not submit review. You may have already reviewed this item.');
        } finally {
            setSubmitting(false);
        }
    };

    const renderReview = ({ item }) => (
        <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>{item.user?.name || 'Anonymous'}</Text>
                <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐ {item.rating}/5</Text>
                </View>
            </View>
            <Text style={styles.reviewTitle}>{item.title}</Text>
            <Text style={styles.reviewText}>{item.text}</Text>
            
            {item.providerReply && (
                <View style={styles.replyBox}>
                    <Text style={styles.replyHeader}>↳ Provider Reply</Text>
                    <Text style={styles.replyText}>{item.providerReply}</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Reviews & Feedback</Text>

            {loading ? (
                <ActivityIndicator size="small" color="#43e97b" />
            ) : reviews.length === 0 ? (
                <Text style={styles.noReviews}>No reviews yet. Be the first!</Text>
            ) : (
                <FlatList
                    data={reviews}
                    keyExtractor={item => item._id}
                    renderItem={renderReview}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                />
            )}

            {user?.role === 'tourist' && (
                <View style={styles.addReviewContainer}>
                    <Text style={styles.addReviewTitle}>Write a Review</Text>
                    
                    <View style={styles.ratingInputContainer}>
                        <Text style={styles.label}>Rating:</Text>
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                    <Text style={[styles.starIcon, rating >= star ? styles.starSelected : styles.starUnselected]}>
                                        ★
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TextInput 
                        style={styles.input}
                        placeholder="Review Title"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <TextInput 
                        style={[styles.input, styles.textArea]}
                        placeholder="Tell us about your experience..."
                        value={text}
                        onChangeText={setText}
                        multiline
                        numberOfLines={4}
                    />

                    <TouchableOpacity 
                        style={[styles.submitButton, submitting && styles.submitButtonDisabled]} 
                        onPress={submitReview}
                        disabled={submitting}
                    >
                        <Text style={styles.submitButtonText}>{submitting ? 'Submitting...' : 'Submit Review'}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 24, paddingBottom: 40 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#2D3142', marginBottom: 16 },
    noReviews: { color: '#9E9EA7', fontStyle: 'italic', marginBottom: 20 },
    reviewCard: { backgroundColor: '#F8F9FA', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E9ECEF' },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    reviewerName: { fontSize: 16, fontWeight: 'bold', color: '#495057' },
    ratingBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    ratingText: { color: '#E65100', fontWeight: 'bold', fontSize: 12 },
    reviewTitle: { fontSize: 15, fontWeight: 'bold', color: '#2D3142', marginBottom: 4 },
    reviewText: { fontSize: 14, color: '#6C757D', lineHeight: 20 },
    replyBox: { marginTop: 12, backgroundColor: '#E8F5E9', padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#4CAF50' },
    replyHeader: { fontSize: 13, fontWeight: 'bold', color: '#2E7D32', marginBottom: 4 },
    replyText: { fontSize: 14, color: '#1B5E20' },
    
    addReviewContainer: { marginTop: 24, backgroundColor: '#FFF', padding: 16, borderRadius: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
    addReviewTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D3142', marginBottom: 16 },
    ratingInputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    label: { fontSize: 15, color: '#666', marginRight: 12, fontWeight: '600' },
    starsContainer: { flexDirection: 'row' },
    starIcon: { fontSize: 32, marginRight: 6 },
    starSelected: { color: '#FFD700' },
    starUnselected: { color: '#E0E0E0' },
    input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 14, backgroundColor: '#FAFAFA' },
    textArea: { height: 100, textAlignVertical: 'top' },
    submitButton: { backgroundColor: '#4facfe', padding: 14, borderRadius: 8, alignItems: 'center' },
    submitButtonDisabled: { backgroundColor: '#A0C4FF' },
    submitButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default ReviewsSection;
