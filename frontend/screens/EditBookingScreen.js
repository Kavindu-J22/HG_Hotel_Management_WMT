import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const EditBookingScreen = ({ route, navigation }) => {
    // Expect booking object passed from previous screen
    const { booking } = route.params;

    const [startDate, setStartDate] = useState(booking.startDate ? new Date(booking.startDate).toISOString().split('T')[0] : '');
    const [endDate, setEndDate] = useState(booking.endDate ? new Date(booking.endDate).toISOString().split('T')[0] : '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEditBooking = async () => {
        if (!startDate || !endDate) {
            Alert.alert('Error', 'Please enter start and end dates (YYYY-MM-DD)');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.put(`/bookings/${booking._id}/dates`, {
                startDate,
                endDate
            });
            Alert.alert('Success', 'Booking dates updated successfully!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Update Failed', error.response?.data?.error || 'Could not update booking dates.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const itemTitle = booking.itemId?.title || booking.itemId?.name || `${booking.itemId?.brand || ''} ${booking.itemId?.model || ''}`.trim() || 'Tour/Service';

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#FF9800', '#FFC107']} style={styles.header}>
                <Text style={styles.headerTitle}>Edit Dates</Text>
            </LinearGradient>

            <View style={styles.content}>
                <Text style={styles.itemTitle}>{booking.itemType} - {itemTitle}</Text>
                <Text style={styles.priceText}>Ref: {booking.bookingId}</Text>

                <View style={styles.form}>
                    <Text style={styles.label}>New Start Date (YYYY-MM-DD)</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="2026-06-01" 
                        value={startDate} 
                        onChangeText={setStartDate} 
                    />

                    <Text style={styles.label}>New End Date (YYYY-MM-DD)</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="2026-06-05" 
                        value={endDate} 
                        onChangeText={setEndDate} 
                    />

                    <TouchableOpacity 
                        style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]} 
                        onPress={handleEditBooking}
                        disabled={isSubmitting}
                    >
                        <LinearGradient
                            colors={['#FF9800', '#FFC107']}
                            style={styles.buttonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.buttonText}>{isSubmitting ? 'Processing...' : 'Update Dates'}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
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
    content: {
        padding: 24,
    },
    itemTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3142',
        marginBottom: 8,
    },
    priceText: {
        fontSize: 14,
        color: '#764ba2',
        fontWeight: 'bold',
        marginBottom: 30,
    },
    form: {
        marginTop: 10,
    },
    label: {
        fontSize: 14,
        color: '#2D3142',
        marginBottom: 8,
        fontWeight: '600',
    },
    input: {
        height: 55,
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#2D3142',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 20,
    },
    primaryButton: {
        height: 55,
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 10,
        elevation: 5,
        shadowColor: '#FF9800',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonDisabled: {
        opacity: 0.7,
    }
});

export default EditBookingScreen;
