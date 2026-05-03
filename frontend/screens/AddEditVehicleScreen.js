import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

const AddEditVehicleScreen = ({ route, navigation }) => {
    const existingVehicle = route.params?.vehicle;
    
    const [brand, setBrand] = useState(existingVehicle ? existingVehicle.brand : '');
    const [model, setModel] = useState(existingVehicle ? existingVehicle.model : '');
    const [description, setDescription] = useState(existingVehicle ? existingVehicle.description : '');
    const [seatingCapacity, setSeatingCapacity] = useState(existingVehicle ? existingVehicle.seatingCapacity.toString() : '');
    const [dailyRate, setDailyRate] = useState(existingVehicle ? existingVehicle.dailyRate.toString() : '');
    
    const types = ['Car', 'Van', 'SUV', 'Bus'];
    const [type, setType] = useState(existingVehicle ? existingVehicle.type : 'Car');
    const [showTypePicker, setShowTypePicker] = useState(false);

    const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
    const [fuel, setFuel] = useState(existingVehicle ? existingVehicle.fuel : 'Petrol');
    const [showFuelPicker, setShowFuelPicker] = useState(false);

    const [images, setImages] = useState(existingVehicle ? existingVehicle.images : []);
    const [newImages, setNewImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
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
        if (!brand || !model || !description || !seatingCapacity || !dailyRate) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('brand', brand);
        formData.append('model', model);
        formData.append('description', description);
        formData.append('type', type);
        formData.append('fuel', fuel);
        formData.append('seatingCapacity', seatingCapacity);
        formData.append('dailyRate', dailyRate);

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
            if (existingVehicle) {
                await api.put(`/vehicles/${existingVehicle._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Alert.alert('Success', 'Vehicle updated successfully.');
            } else {
                await api.post('/vehicles', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Alert.alert('Success', 'Vehicle created successfully. Pending Admin Approval.');
            }
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to save vehicle.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.header}>
                <Text style={styles.headerTitle}>{existingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.row}>
                    <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Brand</Text>
                        <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder="e.g. Toyota" />
                    </View>
                    <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
                        <Text style={styles.label}>Model</Text>
                        <TextInput style={styles.input} value={model} onChangeText={setModel} placeholder="e.g. Prius" />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Vehicle Type</Text>
                        <TouchableOpacity style={styles.input} onPress={() => { setShowTypePicker(!showTypePicker); setShowFuelPicker(false); }}>
                            <Text style={{ marginTop: 15, color: '#2D3142' }}>{type}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
                        <Text style={styles.label}>Fuel Type</Text>
                        <TouchableOpacity style={styles.input} onPress={() => { setShowFuelPicker(!showFuelPicker); setShowTypePicker(false); }}>
                            <Text style={{ marginTop: 15, color: '#2D3142' }}>{fuel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {showTypePicker && (
                    <View style={styles.pickerContainer}>
                        {types.map(t => (
                            <TouchableOpacity key={t} style={styles.pickerItem} onPress={() => { setType(t); setShowTypePicker(false); }}>
                                <Text style={styles.pickerText}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {showFuelPicker && (
                    <View style={styles.pickerContainer}>
                        {fuelTypes.map(f => (
                            <TouchableOpacity key={f} style={styles.pickerItem} onPress={() => { setFuel(f); setShowFuelPicker(false); }}>
                                <Text style={styles.pickerText}>{f}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={styles.row}>
                    <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
                        <Text style={styles.label}>Seating Capacity</Text>
                        <TextInput style={styles.input} value={seatingCapacity} onChangeText={setSeatingCapacity} placeholder="e.g. 4" keyboardType="numeric" />
                    </View>
                    <View style={[styles.inputContainer, { flex: 1, marginLeft: 10 }]}>
                        <Text style={styles.label}>Daily Rate ($)</Text>
                        <TextInput style={styles.input} value={dailyRate} onChangeText={setDailyRate} placeholder="e.g. 50" keyboardType="numeric" />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput 
                        style={[styles.input, styles.textArea]} 
                        value={description} 
                        onChangeText={setDescription} 
                        placeholder="Detailed description of your vehicle..." 
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
                        <Text style={styles.buttonText}>{isSubmitting ? 'Uploading...' : 'Save Vehicle'}</Text>
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
    textArea: { height: 100, paddingTop: 16 },
    pickerContainer: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 20, padding: 10 },
    pickerItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    pickerText: { fontSize: 16, color: '#2D3142' },
    primaryButton: { height: 55, borderRadius: 12, overflow: 'hidden', marginTop: 10, marginBottom: 30, elevation: 5, shadowColor: '#4facfe', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
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

export default AddEditVehicleScreen;
