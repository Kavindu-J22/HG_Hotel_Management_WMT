import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

const AddEditRoomScreen = ({ route, navigation }) => {
    const { hotelId, room: existingRoom } = route.params;
    
    const [title, setTitle] = useState(existingRoom ? existingRoom.title : '');
    const [description, setDescription] = useState(existingRoom ? existingRoom.description : '');
    const [pricePerNight, setPricePerNight] = useState(existingRoom ? existingRoom.pricePerNight.toString() : '');
    const [capacity, setCapacity] = useState(existingRoom ? existingRoom.capacity.toString() : '');
    const [discount, setDiscount] = useState(existingRoom ? existingRoom.discount.toString() : '0');
    
    // For simplicity without installing a dropdown package, we use a custom basic picker
    const roomTypes = ['Single', 'Double', 'Luxury', 'Sea view', 'A/C', 'Non-A/C'];
    const [roomType, setRoomType] = useState(existingRoom ? existingRoom.roomType : 'Single');
    const [showTypePicker, setShowTypePicker] = useState(false);

    const [images, setImages] = useState(existingRoom ? existingRoom.images : []);
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
        if (!title || !description || !pricePerNight || !capacity || !roomType) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('pricePerNight', pricePerNight);
        formData.append('capacity', capacity);
        formData.append('discount', discount);
        formData.append('roomType', roomType);

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
            if (existingRoom) {
                await api.put(`/rooms/${existingRoom._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Alert.alert('Success', 'Room updated successfully.');
            } else {
                await api.post(`/hotels/${hotelId}/rooms`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
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
                    <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Deluxe Ocean View" />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Price/Night ($)</Text>
                        <TextInput style={styles.input} value={pricePerNight} onChangeText={setPricePerNight} placeholder="150" keyboardType="numeric" />
                    </View>

                    <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
                        <Text style={styles.label}>Discount (%)</Text>
                        <TextInput style={styles.input} value={discount} onChangeText={setDiscount} placeholder="10" keyboardType="numeric" />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Capacity</Text>
                        <TextInput style={styles.input} value={capacity} onChangeText={setCapacity} placeholder="2" keyboardType="numeric" />
                    </View>

                    <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
                        <Text style={styles.label}>Room Type</Text>
                        <TouchableOpacity style={styles.input} onPress={() => setShowTypePicker(!showTypePicker)}>
                            <Text style={{ marginTop: 15, color: '#2D3142' }}>{roomType}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {showTypePicker && (
                    <View style={styles.pickerContainer}>
                        {roomTypes.map(type => (
                            <TouchableOpacity key={type} style={styles.pickerItem} onPress={() => { setRoomType(type); setShowTypePicker(false); }}>
                                <Text style={styles.pickerText}>{type}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

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
                    <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.buttonGradient}>
                        <Text style={styles.buttonText}>{isSubmitting ? 'Saving...' : 'Save Room'}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F6F8' },
    header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
    content: { padding: 24 },
    inputContainer: { marginBottom: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    label: { fontSize: 14, color: '#2D3142', marginBottom: 8, fontWeight: '600' },
    input: { height: 55, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: '#2D3142', borderWidth: 1, borderColor: '#E0E0E0' },
    textArea: { height: 120, paddingTop: 16 },
    pickerContainer: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 20, padding: 10 },
    pickerItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    pickerText: { fontSize: 16, color: '#2D3142' },
    primaryButton: { height: 55, borderRadius: 12, overflow: 'hidden', marginTop: 10, marginBottom: 40, elevation: 5, shadowColor: '#4facfe', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
    buttonGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    buttonDisabled: { opacity: 0.7 },
    imageScroll: { flexDirection: 'row', marginTop: 10 },
    previewImage: { width: 100, height: 100, borderRadius: 8, marginRight: 10 },
    removeImageBtn: { position: 'absolute', top: 5, right: 15, backgroundColor: 'red', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    removeImageText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
    addImageBtn: { width: 100, height: 100, borderRadius: 8, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#BDBDBD', borderStyle: 'dashed' },
    addImageText: { fontSize: 30, color: '#757575' }
});

export default AddEditRoomScreen;
