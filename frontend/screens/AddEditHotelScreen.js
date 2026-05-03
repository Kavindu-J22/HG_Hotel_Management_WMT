import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const AddEditHotelScreen = ({ route, navigation }) => {
    // If route.params.hotel exists, we are editing, otherwise creating
    const existingHotel = route.params?.hotel;
    
    const [name, setName] = useState(existingHotel ? existingHotel.name : '');
    const [location, setLocation] = useState(existingHotel ? existingHotel.location : '');
    const [facilities, setFacilities] = useState(existingHotel ? existingHotel.facilities.join(', ') : '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!name || !location) {
            Alert.alert('Error', 'Name and location are required.');
            return;
        }

        setIsSubmitting(true);
        const data = {
            name,
            location,
            facilities: facilities.split(',').map(f => f.trim()).filter(f => f !== '')
        };

        try {
            if (existingHotel) {
                await api.put(`/hotels/${existingHotel._id}`, data);
                Alert.alert('Success', 'Hotel updated successfully.');
            } else {
                await api.post('/hotels', data);
                Alert.alert('Success', 'Hotel created successfully.');
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to save hotel.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.header}>
                <Text style={styles.headerTitle}>{existingHotel ? 'Edit Hotel' : 'Add New Hotel'}</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Hotel Name</Text>
                    <TextInput 
                        style={styles.input} 
                        value={name} 
                        onChangeText={setName} 
                        placeholder="e.g. Grand Plaza Resort" 
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Location</Text>
                    <TextInput 
                        style={styles.input} 
                        value={location} 
                        onChangeText={setLocation} 
                        placeholder="e.g. Colombo, Sri Lanka" 
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Facilities (comma separated)</Text>
                    <TextInput 
                        style={[styles.input, styles.textArea]} 
                        value={facilities} 
                        onChangeText={setFacilities} 
                        placeholder="e.g. Free WiFi, Pool, Spa" 
                        multiline
                        numberOfLines={3}
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]} 
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    <LinearGradient
                        colors={['#FF6B6B', '#FF8E53']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.buttonText}>{isSubmitting ? 'Saving...' : 'Save Hotel'}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
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
    content: {
        padding: 24,
    },
    inputContainer: {
        marginBottom: 20,
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
    },
    textArea: {
        height: 100,
        paddingTop: 16,
    },
    primaryButton: {
        height: 55,
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 10,
        elevation: 5,
        shadowColor: '#FF6B6B',
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

export default AddEditHotelScreen;
