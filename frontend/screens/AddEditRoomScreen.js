import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';

const AddEditRoomScreen = ({ route, navigation }) => {
    // If route.params.room exists, we are editing. hotelId is always passed.
    const { hotelId, room: existingRoom } = route.params;
    
    const [title, setTitle] = useState(existingRoom ? existingRoom.title : '');
    const [description, setDescription] = useState(existingRoom ? existingRoom.description : '');
    const [pricePerNight, setPricePerNight] = useState(existingRoom ? existingRoom.pricePerNight.toString() : '');
    const [capacity, setCapacity] = useState(existingRoom ? existingRoom.capacity.toString() : '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title || !description || !pricePerNight || !capacity) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        setIsSubmitting(true);
        const data = {
            title,
            description,
            pricePerNight: Number(pricePerNight),
            capacity: Number(capacity)
        };

        try {
            if (existingRoom) {
                await api.put(`/rooms/${existingRoom._id}`, data);
                Alert.alert('Success', 'Room updated successfully.');
            } else {
                await api.post(`/hotels/${hotelId}/rooms`, data);
                Alert.alert('Success', 'Room created successfully.');
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to save room.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.header}>
                <Text style={styles.headerTitle}>{existingRoom ? 'Edit Room' : 'Add New Room'}</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Room Title</Text>
                    <TextInput 
                        style={styles.input} 
                        value={title} 
                        onChangeText={setTitle} 
                        placeholder="e.g. Deluxe Ocean View" 
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Price Per Night ($)</Text>
                    <TextInput 
                        style={styles.input} 
                        value={pricePerNight} 
                        onChangeText={setPricePerNight} 
                        placeholder="e.g. 150" 
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Capacity (Persons)</Text>
                    <TextInput 
                        style={styles.input} 
                        value={capacity} 
                        onChangeText={setCapacity} 
                        placeholder="e.g. 2" 
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput 
                        style={[styles.input, styles.textArea]} 
                        value={description} 
                        onChangeText={setDescription} 
                        placeholder="Describe the room features..." 
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]} 
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    <LinearGradient
                        colors={['#4facfe', '#00f2fe']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.buttonText}>{isSubmitting ? 'Saving...' : 'Save Room'}</Text>
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
        height: 120,
        paddingTop: 16,
    },
    primaryButton: {
        height: 55,
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 10,
        elevation: 5,
        shadowColor: '#4facfe',
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

export default AddEditRoomScreen;
