import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image, FlatList } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

const AddEditHotelScreen = ({ route, navigation }) => {
    const existingHotel = route.params?.hotel;
    
    const [name, setName] = useState(existingHotel ? existingHotel.name : '');
    const [location, setLocation] = useState(existingHotel ? existingHotel.location : '');
    const [description, setDescription] = useState(existingHotel ? existingHotel.description : '');
    const [facilities, setFacilities] = useState(existingHotel ? existingHotel.facilities.join(', ') : '');
    const [images, setImages] = useState(existingHotel ? existingHotel.images : []);
    const [newImages, setNewImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setNewImages([...newImages, result.assets[0]]);
        }
    };

    const removeNewImage = (index) => {
        const updated = [...newImages];
        updated.splice(index, 1);
        setNewImages(updated);
    };

    const handleSubmit = async () => {
        if (!name || !location || !description) {
            Alert.alert('Error', 'Name, location, and description are required.');
            return;
        }

        setIsSubmitting(true);
        
        // Use FormData for multipart/form-data
        const formData = new FormData();
        formData.append('name', name);
        formData.append('location', location);
        formData.append('description', description);
        
        const facilityArray = facilities.split(',').map(f => f.trim()).filter(f => f !== '');
        facilityArray.forEach(f => formData.append('facilities[]', f));

        newImages.forEach((img, index) => {
            const fileName = img.uri.split('/').pop();
            const fileType = fileName.split('.').pop();
            formData.append('images', {
                uri: img.uri,
                name: fileName,
                type: `image/${fileType}`
            });
        });

        try {
            if (existingHotel) {
                await api.put(`/hotels/${existingHotel._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Alert.alert('Success', 'Hotel updated successfully.');
            } else {
                await api.post('/hotels', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Alert.alert('Success', 'Hotel created successfully. Pending Admin Approval.');
            }
            navigation.goBack();
        } catch (error) {
            console.error(error);
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
                    <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Grand Plaza Resort" />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Location</Text>
                    <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="e.g. Colombo, Sri Lanka" />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput 
                        style={[styles.input, styles.textArea]} 
                        value={description} 
                        onChangeText={setDescription} 
                        placeholder="Detailed description of your property..." 
                        multiline
                        numberOfLines={4}
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

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Images</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                        {images.map((imgUrl, idx) => (
                            <Image key={`old-${idx}`} source={{ uri: imgUrl }} style={styles.previewImage} />
                        ))}
                        {newImages.map((img, idx) => (
                            <View key={`new-${idx}`}>
                                <Image source={{ uri: img.uri }} style={styles.previewImage} />
                                <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeNewImage(idx)}>
                                    <Text style={styles.removeImageText}>X</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
                            <Text style={styles.addImageText}>+</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                <TouchableOpacity 
                    style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]} 
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.buttonGradient}>
                        <Text style={styles.buttonText}>{isSubmitting ? 'Uploading...' : 'Save Hotel'}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F6F8' },
    header: {
        paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20,
        borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
    },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
    content: { padding: 24 },
    inputContainer: { marginBottom: 20 },
    label: { fontSize: 14, color: '#2D3142', marginBottom: 8, fontWeight: '600' },
    input: {
        height: 55, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16,
        fontSize: 16, color: '#2D3142', borderWidth: 1, borderColor: '#E0E0E0',
    },
    textArea: { height: 100, paddingTop: 16 },
    primaryButton: {
        height: 55, borderRadius: 12, overflow: 'hidden', marginTop: 10, marginBottom: 30,
        elevation: 5, shadowColor: '#FF6B6B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,
    },
    buttonGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    buttonDisabled: { opacity: 0.7 },
    imageScroll: { flexDirection: 'row', marginTop: 10 },
    previewImage: { width: 100, height: 100, borderRadius: 8, marginRight: 10 },
    removeImageBtn: {
        position: 'absolute', top: 5, right: 15, backgroundColor: 'red',
        width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center'
    },
    removeImageText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
    addImageBtn: {
        width: 100, height: 100, borderRadius: 8, backgroundColor: '#E0E0E0',
        justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#BDBDBD', borderStyle: 'dashed'
    },
    addImageText: { fontSize: 30, color: '#757575' }
});

export default AddEditHotelScreen;
