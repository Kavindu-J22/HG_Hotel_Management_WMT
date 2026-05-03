import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
    const { register } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('tourist'); // Simple toggle or hardcode for now
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Validation Error', 'Please fill all the fields.');
            return;
        }
        setIsSubmitting(true);
        try {
            await register(name, email, password, role);
        } catch (error) {
            Alert.alert('Registration Failed', 'Could not create account. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <LinearGradient colors={['#1c1c2e', '#10101b']} style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join us and discover the best trips.</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="John Doe"
                                placeholderTextColor="#6b6b80"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
                                placeholderTextColor="#6b6b80"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Create a strong password"
                                placeholderTextColor="#6b6b80"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                        
                        {/* Role selection (simplistic) */}
                        <View style={styles.roleContainer}>
                            <Text style={styles.label}>I am a:</Text>
                            <View style={styles.roleButtons}>
                                <TouchableOpacity 
                                    style={[styles.roleButton, role === 'tourist' && styles.roleButtonActive]} 
                                    onPress={() => setRole('tourist')}
                                >
                                    <Text style={[styles.roleButtonText, role === 'tourist' && styles.roleButtonTextActive]}>Tourist</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.roleButton, role === 'provider' && styles.roleButtonActive]} 
                                    onPress={() => setRole('provider')}
                                >
                                    <Text style={[styles.roleButtonText, role === 'provider' && styles.roleButtonTextActive]}>Provider</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]} 
                            onPress={handleRegister}
                            disabled={isSubmitting}
                        >
                            <LinearGradient
                                colors={['#FF6B6B', '#FF8E53']}
                                style={styles.buttonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.buttonText}>{isSubmitting ? 'Creating Account...' : 'Sign Up'}</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.footerLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    headerContainer: {
        marginBottom: 30,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#A0A0B0',
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#E0E0E0',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        height: 55,
        backgroundColor: '#2A2A3D',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#3D3D56',
    },
    roleContainer: {
        marginBottom: 30,
    },
    roleButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    roleButton: {
        flex: 1,
        height: 50,
        backgroundColor: '#2A2A3D',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3D3D56',
        marginHorizontal: 4,
    },
    roleButtonActive: {
        borderColor: '#FF8E53',
        backgroundColor: 'rgba(255, 142, 83, 0.1)',
    },
    roleButtonText: {
        color: '#6b6b80',
        fontWeight: '600',
    },
    roleButtonTextActive: {
        color: '#FF8E53',
        fontWeight: 'bold',
    },
    primaryButton: {
        height: 55,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 30,
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
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
    },
    footerText: {
        color: '#A0A0B0',
        fontSize: 15,
    },
    footerLink: {
        color: '#FF8E53',
        fontSize: 15,
        fontWeight: 'bold',
    }
});

export default RegisterScreen;
