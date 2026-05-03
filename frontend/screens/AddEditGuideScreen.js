import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

const AddEditGuideScreen = ({ route, navigation }) => {
    const existingProfile = route.params?.profile;
    
    const [bio, setBio] = useState(existingProfile ? existingProfile.bio : '');
    const [languages, setLanguages] = useState(existingProfile ? existingProfile.languages.join(', ') : '');
    const [contactNumber, setContactNumber] = useState(existingProfile ? existingProfile.contactNumber : '');
    const [dailyRate, setDailyRate] = useState(existingProfile ? (existingProfile.dailyRate ? existingProfile.dailyRate.toString() : '') : '');
    
    const levels = ['Beginner', 'Intermediate', 'Expert'];
    const [experienceLevel, setExperienceLevel] = useState(existingProfile ? existingProfile.experienceLevel : 'Intermediate');
    const [showLevelPicker, setShowLevelPicker] = useState(false);

    const [profileImage, setProfileImage] = useState(existingProfile ? existingProfile.profileImage : null);
    const [newImage, setNewImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setNewImage(result.assets[0]);
        }
    };

    const handleSubmit = async () => {
        if (!bio || !languages || !contactNumber || !dailyRate) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('bio', bio);
        formData.append('contactNumber', contactNumber);
        formData.append('dailyRate', dailyRate);
        
        // Handle array of languages from comma separated string and make unique
        const langArray = [...new Set(languages.split(',').map(l => l.trim()).filter(l => l))];
        langArray.forEach(lang => {
            formData.append('languages[]', lang); // Depending on backend body parser, may need adjustment. Node/Express handles this if parsed correctly or we send a JSON string.
        });
        
        // Better way: send as string and parse in backend, OR multiple append. We will multiple append. Wait, Multer usually allows appending arrays. Actually, the easiest is to append each element.
        // If the backend expects an array of strings:
        langArray.forEach(l => formData.append('languages', l));

        formData.append('experienceLevel', experienceLevel);

        if (newImage) {
            const fileName = newImage.uri.split('/').pop();
            const fileType = fileName.split('.').pop();
            formData.append('profileImage', {
                uri: newImage.uri,
                name: fileName,
                type: `image/${fileType}`
            });
        }

        try {
            if (existingProfile) {
                await api.put(`/guides/${existingProfile._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Alert.alert('Success', 'Profile updated successfully.');
            } else {
                await api.post('/guides', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Alert.alert('Success', 'Profile created successfully. Pending Admin Approval.');
            }
            navigation.goBack();
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to save profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.header}>
                <Text style={styles.headerTitle}>{existingProfile ? 'Edit Profile' : 'Create Profile'}</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                        {newImage ? (
                            <Image source={{ uri: newImage.uri }} style={styles.imagePreview} />
                        ) : profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.imagePreview} />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <Text style={styles.placeholderEmoji}>📸</Text>
                                <Text style={styles.placeholderText}>Tap to add photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Experience Level</Text>
                    <TouchableOpacity style={styles.input} onPress={() => setShowLevelPicker(!showLevelPicker)}>
                        <Text style={{ marginTop: 15, color: '#2D3142' }}>{experienceLevel}</Text>
                    </TouchableOpacity>
                </View>

                {showLevelPicker && (
                    <View style={styles.pickerContainer}>
                        {levels.map(l => (
                            <TouchableOpacity key={l} style={styles.pickerItem} onPress={() => { setExperienceLevel(l); setShowLevelPicker(false); }}>
                                <Text style={styles.pickerText}>{l}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Languages Spoken (comma separated)</Text>
                    <TextInput 
                        style={styles.input} 
                        value={languages} 
                        onChangeText={setLanguages} 
                        placeholder="e.g. English, Spanish, French" 
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Contact Number</Text>
                    <TextInput 
                        style={styles.input} 
                        value={contactNumber} 
                        onChangeText={setContactNumber} 
                        placeholder="e.g. +1 234 567 8900" 
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Daily Rate ($)</Text>
                    <TextInput 
                        style={styles.input} 
                        value={dailyRate} 
                        onChangeText={setDailyRate} 
                        placeholder="e.g. 50" 
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Biography</Text>
                    <TextInput 
                        style={[styles.input, styles.textArea]} 
                        value={bio} 
                        onChangeText={setBio} 
                        placeholder="Tell tourists about your expertise and what makes your tours special..." 
                        multiline
                        numberOfLines={6}
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]} 
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.buttonGradient}>
                        <Text style={styles.buttonText}>{isSubmitting ? 'Saving...' : 'Save Profile'}</Text>
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
    imageContainer: { alignItems: 'center', marginBottom: 30 },
    imagePicker: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, borderWidth: 3, borderColor: '#38f9d7' },
    imagePreview: { width: 134, height: 134, borderRadius: 67 },
    placeholderContainer: { alignItems: 'center' },
    placeholderEmoji: { fontSize: 40, marginBottom: 8 },
    placeholderText: { fontSize: 12, color: '#9E9EA7', fontWeight: 'bold' },
    inputContainer: { marginBottom: 20 },
    label: { fontSize: 14, color: '#2D3142', marginBottom: 8, fontWeight: '600' },
    input: { height: 55, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: '#2D3142', borderWidth: 1, borderColor: '#E0E0E0' },
    textArea: { height: 120, paddingTop: 16 },
    pickerContainer: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 20, padding: 10 },
    pickerItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    pickerText: { fontSize: 16, color: '#2D3142' },
    primaryButton: { height: 55, borderRadius: 12, overflow: 'hidden', marginTop: 10, marginBottom: 40, elevation: 5, shadowColor: '#38f9d7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
    buttonGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    buttonDisabled: { opacity: 0.7 }
});

export default AddEditGuideScreen;
