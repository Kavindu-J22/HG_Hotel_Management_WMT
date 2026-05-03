import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const TouristProfileScreen = () => {
    const { user, logout } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);

    const updateProfile = async () => {
        if (!name || !email) {
            Alert.alert("Error", "Name and Email cannot be empty.");
            return;
        }

        setLoading(true);
        try {
            await api.put('/auth/updatedetails', { name, email });
            Alert.alert("Success", "Profile updated successfully! Please note your changes will be fully visible next time you log in.");
        } catch (error) {
            Alert.alert("Error", error.response?.data?.error || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const deleteAccount = async () => {
        Alert.alert(
            "Delete Account",
            "Are you absolutely sure you want to delete your account? This will permanently erase your profile and cancel all your bookings and reviews.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete My Account",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await api.delete('/auth/deleteme');
                            Alert.alert("Account Deleted", "Your account has been deleted.");
                            logout();
                        } catch (error) {
                            Alert.alert("Error", error.response?.data?.error || "Failed to delete account.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.header}>
                <Text style={styles.headerTitle}>My Profile</Text>
                <Text style={styles.headerSubtitle}>Manage your account details</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput 
                        style={styles.input} 
                        value={name} 
                        onChangeText={setName} 
                        placeholder="Enter your name" 
                        placeholderTextColor="#9E9EA7"
                    />

                    <Text style={styles.label}>Email Address</Text>
                    <TextInput 
                        style={styles.input} 
                        value={email} 
                        onChangeText={setEmail} 
                        placeholder="Enter your email" 
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#9E9EA7"
                    />

                    <TouchableOpacity 
                        style={styles.updateButton} 
                        onPress={updateProfile}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.updateButtonText}>Update Profile</Text>}
                    </TouchableOpacity>
                </View>

                <View style={styles.dangerZone}>
                    <Text style={styles.dangerTitle}>Danger Zone</Text>
                    <Text style={styles.dangerText}>Once you delete your account, there is no going back. Please be certain.</Text>
                    <TouchableOpacity style={styles.deleteButton} onPress={deleteAccount}>
                        <Text style={styles.deleteButtonText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
    headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    label: { fontSize: 14, fontWeight: 'bold', color: '#2D3142', marginBottom: 8 },
    input: {
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E9ECEF',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: '#2D3142',
        marginBottom: 16,
    },
    updateButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    updateButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    dangerZone: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#FFEBEE',
        elevation: 3,
        shadowColor: '#f44336',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    dangerTitle: { fontSize: 18, fontWeight: 'bold', color: '#d32f2f', marginBottom: 8 },
    dangerText: { fontSize: 14, color: '#6C757D', marginBottom: 16 },
    deleteButton: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#d32f2f',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    deleteButtonText: { color: '#d32f2f', fontSize: 16, fontWeight: 'bold' }
});

export default TouristProfileScreen;
