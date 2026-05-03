import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

const AddEditTourPlanScreen = ({ route, navigation }) => {
    const { guideId, plan } = route.params;
    const isEdit = !!plan;

    const [formData, setFormData] = useState({
        title: plan?.title || '',
        description: plan?.description || '',
        destinations: plan?.destinations?.join(', ') || '',
        durationDays: plan?.durationDays?.toString() || '',
        price: plan?.price?.toString() || '',
        pax: plan?.pax?.toString() || '',
        transport: plan?.transport || '',
        amenities: plan?.amenities?.join(', ') || ''
    });

    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState(plan?.images || []);
    const [saving, setSaving] = useState(false);

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Sorry', 'Camera roll permissions are required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 5 - existingImages.length - images.length,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImages([...images, ...result.assets]);
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.price || !formData.durationDays || !formData.pax) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        setSaving(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('destinations', formData.destinations);
            data.append('durationDays', formData.durationDays);
            data.append('price', formData.price);
            data.append('pax', formData.pax);
            data.append('transport', formData.transport);
            data.append('amenities', formData.amenities);

            images.forEach((img, index) => {
                data.append('images', {
                    uri: img.uri,
                    type: 'image/jpeg',
                    name: `plan_${index}.jpg`
                });
            });

            if (isEdit) {
                await api.put(`/plans/${plan._id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post(`/guides/${guideId}/plans`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            
            Alert.alert('Success', `Tour Plan ${isEdit ? 'updated' : 'created'} successfully!`);
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEdit ? 'Edit Tour Plan' : 'Create Tour Plan'}</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.label}>Title *</Text>
                <TextInput style={styles.input} value={formData.title} onChangeText={(val) => handleChange('title', val)} placeholder="E.g., Cultural Triangle Explorer" />

                <Text style={styles.label}>Description *</Text>
                <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} value={formData.description} onChangeText={(val) => handleChange('description', val)} multiline placeholder="Describe the tour experience..." />

                <View style={styles.row}>
                    <View style={styles.halfWidth}>
                        <Text style={styles.label}>Duration (Days) *</Text>
                        <TextInput style={styles.input} value={formData.durationDays} onChangeText={(val) => handleChange('durationDays', val)} keyboardType="numeric" placeholder="E.g., 3" />
                    </View>
                    <View style={styles.halfWidth}>
                        <Text style={styles.label}>Price (USD) *</Text>
                        <TextInput style={styles.input} value={formData.price} onChangeText={(val) => handleChange('price', val)} keyboardType="numeric" placeholder="E.g., 150" />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.halfWidth}>
                        <Text style={styles.label}>Max Pax *</Text>
                        <TextInput style={styles.input} value={formData.pax} onChangeText={(val) => handleChange('pax', val)} keyboardType="numeric" placeholder="E.g., 4" />
                    </View>
                    <View style={styles.halfWidth}>
                        <Text style={styles.label}>Transport *</Text>
                        <TextInput style={styles.input} value={formData.transport} onChangeText={(val) => handleChange('transport', val)} placeholder="E.g., A/C Van" />
                    </View>
                </View>

                <Text style={styles.label}>Destinations (comma separated)</Text>
                <TextInput style={styles.input} value={formData.destinations} onChangeText={(val) => handleChange('destinations', val)} placeholder="Colombo, Kandy, Nuwara Eliya" />

                <Text style={styles.label}>Amenities/Includes (comma separated)</Text>
                <TextInput style={styles.input} value={formData.amenities} onChangeText={(val) => handleChange('amenities', val)} placeholder="Breakfast, Entrance Tickets" />

                <Text style={styles.label}>Images</Text>
                <View style={styles.imageGallery}>
                    {existingImages.map((uri, idx) => (
                        <Image key={`exist_${idx}`} source={{ uri }} style={styles.thumbnail} />
                    ))}
                    {images.map((img, idx) => (
                        <Image key={`new_${idx}`} source={{ uri: img.uri }} style={styles.thumbnail} />
                    ))}
                    {existingImages.length + images.length < 5 && (
                        <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
                            <Text style={styles.imagePlaceholderText}>+</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
                    <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Tour Plan'}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: { padding: 20, paddingTop: 50, backgroundColor: '#43e97b', flexDirection: 'row', alignItems: 'center' },
    backButton: { marginRight: 15, paddingHorizontal: 10 },
    backButtonText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
    formContainer: { padding: 20 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#2D3142', marginBottom: 8, marginTop: 12 },
    input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, backgroundColor: '#FAFAFA', fontSize: 16 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    halfWidth: { width: '48%' },
    imageGallery: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
    thumbnail: { width: 70, height: 70, borderRadius: 8 },
    imagePlaceholder: { width: 70, height: 70, borderRadius: 8, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#CCC', borderStyle: 'dashed' },
    imagePlaceholderText: { fontSize: 24, color: '#757575' },
    saveButton: { backgroundColor: '#43e97b', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30, marginBottom: 40 },
    saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 }
});

export default AddEditTourPlanScreen;
