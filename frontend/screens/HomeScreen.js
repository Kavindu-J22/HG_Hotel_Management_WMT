import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);

    const categories = [
        { id: 1, title: 'Hotels & Rooms', subtitle: 'Find the perfect stay', colors: ['#FF6B6B', '#FF8E53'], route: 'Hotels' },
        { id: 2, title: 'Vehicles', subtitle: 'Rent cars, vans & more', colors: ['#4facfe', '#00f2fe'], route: 'Vehicles' },
        { id: 3, title: 'Tour Guides', subtitle: 'Local experts & plans', colors: ['#43e97b', '#38f9d7'], route: 'TourGuides' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {user?.name}</Text>
                    <Text style={styles.subtitle}>Where are we going next?</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Explore Categories</Text>
                
                {categories.map((cat) => (
                    <TouchableOpacity 
                        key={cat.id} 
                        style={styles.cardContainer}
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate(cat.route)}
                    >
                        <LinearGradient
                            colors={cat.colors}
                            style={styles.cardGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.cardTitle}>{cat.title}</Text>
                            <Text style={styles.cardSubtitle}>{cat.subtitle}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}

                <View style={styles.dashboardSection}>
                    <Text style={styles.sectionTitle}>Your Account</Text>
                    <TouchableOpacity 
                        style={styles.dashboardButton}
                        onPress={() => navigation.navigate('Dashboard')}
                    >
                        <Text style={styles.dashboardButtonText}>Go to Dashboard</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F6F8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#FFF',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3142',
    },
    subtitle: {
        fontSize: 14,
        color: '#9E9EA7',
        marginTop: 4,
    },
    logoutButton: {
        backgroundColor: '#FFEBEE',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    logoutText: {
        color: '#D32F2F',
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3142',
        marginBottom: 16,
        marginTop: 10,
    },
    cardContainer: {
        width: '100%',
        height: 140,
        borderRadius: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    cardGradient: {
        flex: 1,
        borderRadius: 24,
        padding: 24,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
    },
    cardSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    dashboardSection: {
        marginTop: 20,
    },
    dashboardButton: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    dashboardButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2D3142',
    }
});

export default HomeScreen;
