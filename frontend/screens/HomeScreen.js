import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ImageBackground, Image } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);

    const renderTouristHome = () => {
        const categories = [
            { id: 1, title: 'Hotels & Rooms', subtitle: 'Find the perfect stay', colors: ['#FF6B6B', '#FF8E53'], route: 'Hotels', icon: '🏨' },
            { id: 2, title: 'Vehicles', subtitle: 'Rent cars, vans & more', colors: ['#4facfe', '#00f2fe'], route: 'Vehicles', icon: '🚗' },
            { id: 3, title: 'Tour Guides', subtitle: 'Local experts & plans', colors: ['#43e97b', '#38f9d7'], route: 'TourGuides', icon: '🧭' },
        ];

        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>Explore The World</Text>
                    <Text style={styles.heroSubtitle}>Find the best hotels, transport, and guides for your next adventure.</Text>
                </View>

                <Text style={styles.sectionHeader}>Top Categories</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                    {categories.map((cat) => (
                        <TouchableOpacity 
                            key={cat.id} 
                            style={styles.categoryCardHorizontal}
                            activeOpacity={0.9}
                            onPress={() => navigation.navigate(cat.route)}
                        >
                            <LinearGradient colors={cat.colors} style={styles.catGradientHorizontal} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                                <Text style={styles.catIconHorizontal}>{cat.icon}</Text>
                                <Text style={styles.catTitleHorizontal}>{cat.title}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={styles.sectionHeader}>Your Travel Hub</Text>
                <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Dashboard')}>
                        <View style={[styles.iconCircle, { backgroundColor: '#E8EAF6' }]}>
                            <Text style={styles.actionIcon}>📅</Text>
                        </View>
                        <Text style={styles.actionTitle}>My Bookings</Text>
                        <Text style={styles.actionSubtitle}>View your history</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Wishlist')}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FFEBEE' }]}>
                            <Text style={styles.actionIcon}>❤️</Text>
                        </View>
                        <Text style={styles.actionTitle}>Wishlist</Text>
                        <Text style={styles.actionSubtitle}>Saved favorites</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    };

    const renderProviderHome = () => {
        const mgmtOptions = [
            { id: 1, title: 'Manage Hotels', icon: '🏨', route: 'ProviderHotels', colors: ['#FF6B6B', '#FF8E53'] },
            { id: 2, title: 'Manage Vehicles', icon: '🚗', route: 'ProviderVehicles', colors: ['#4facfe', '#00f2fe'] },
            { id: 3, title: 'Tour Guide Profile', icon: '🧭', route: 'ProviderGuide', colors: ['#43e97b', '#38f9d7'] },
        ];

        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.providerStatsContainer}>
                    <LinearGradient colors={['#2c3e50', '#3498db']} style={styles.statBox}>
                        <Text style={styles.statTitle}>Manage Services</Text>
                        <Text style={styles.statDesc}>Grow your business</Text>
                    </LinearGradient>
                </View>

                <Text style={styles.sectionHeader}>Your Services</Text>
                {mgmtOptions.map((opt) => (
                    <TouchableOpacity 
                        key={opt.id} 
                        style={styles.mgmtCard}
                        onPress={() => navigation.navigate(opt.route)}
                    >
                        <LinearGradient colors={opt.colors} style={styles.mgmtIconWrapper}>
                            <Text style={styles.mgmtIcon}>{opt.icon}</Text>
                        </LinearGradient>
                        <View style={styles.mgmtInfo}>
                            <Text style={styles.mgmtTitle}>{opt.title}</Text>
                            <Text style={styles.mgmtSubtitle}>Add, edit, or remove entries</Text>
                        </View>
                        <Text style={styles.arrowIcon}>→</Text>
                    </TouchableOpacity>
                ))}

                <Text style={styles.sectionHeader}>Customer Interactions</Text>
                <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Dashboard')}>
                        <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                            <Text style={styles.actionIcon}>🛎️</Text>
                        </View>
                        <Text style={styles.actionTitle}>Bookings</Text>
                        <Text style={styles.actionSubtitle}>Approve requests</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('ProviderReviews')}>
                        <View style={[styles.iconCircle, { backgroundColor: '#F3E5F5' }]}>
                            <Text style={styles.actionIcon}>⭐</Text>
                        </View>
                        <Text style={styles.actionTitle}>Reviews</Text>
                        <Text style={styles.actionSubtitle}>Reply to feedback</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    };

    const renderAdminHome = () => {
        const adminModules = [
            { id: 1, title: 'Approve Hotels', subtitle: 'Manage properties', icon: '🏨', route: 'AdminHotels', colors: ['#9C27B0', '#E040FB'] },
            { id: 2, title: 'Approve Vehicles', subtitle: 'Manage fleet', icon: '🚗', route: 'AdminVehicles', colors: ['#4facfe', '#00f2fe'] },
            { id: 3, title: 'Approve Guides', subtitle: 'Manage experts', icon: '🧭', route: 'AdminGuides', colors: ['#43e97b', '#38f9d7'] },
            { id: 4, title: 'All Bookings', subtitle: 'System-wide logs', icon: '📅', route: 'AdminBookings', colors: ['#FF9800', '#FFC107'] },
            { id: 5, title: 'All Reviews', subtitle: 'Content moderation', icon: '⭐', route: 'AdminReviews', colors: ['#FF6B6B', '#FF8E53'] },
        ];

        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.adminBanner}>
                    <Text style={styles.adminBannerText}>System Control Panel</Text>
                </View>

                <View style={styles.adminGrid}>
                    {adminModules.map(mod => (
                        <TouchableOpacity 
                            key={mod.id} 
                            style={styles.adminCard}
                            onPress={() => navigation.navigate(mod.route)}
                        >
                            <LinearGradient colors={mod.colors} style={styles.adminIconWrapper}>
                                <Text style={styles.adminIcon}>{mod.icon}</Text>
                            </LinearGradient>
                            <Text style={styles.adminTitle}>{mod.title}</Text>
                            <Text style={styles.adminSubtitle}>{mod.subtitle}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {user?.name}</Text>
                    <Text style={styles.subtitle}>
                        {user?.role === 'admin' ? 'Super Administrator' : user?.role === 'provider' ? 'Service Provider' : 'Ready for your next trip?'}
                    </Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {user?.role === 'admin' && renderAdminHome()}
            {user?.role === 'provider' && renderProviderHome()}
            {user?.role === 'tourist' && renderTouristHome()}

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
        zIndex: 10,
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
        paddingBottom: 40,
    },
    
    // Tourist Styles
    heroSection: {
        padding: 24,
        marginTop: 10,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#2D3142',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#6C757D',
        lineHeight: 24,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3142',
        marginHorizontal: 24,
        marginBottom: 16,
        marginTop: 10,
    },
    horizontalList: {
        paddingLeft: 24,
        paddingRight: 8,
        paddingBottom: 20,
    },
    categoryCardHorizontal: {
        width: 160,
        height: 200,
        borderRadius: 24,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
    },
    catGradientHorizontal: {
        flex: 1,
        borderRadius: 24,
        padding: 20,
        justifyContent: 'flex-end',
    },
    catIconHorizontal: {
        fontSize: 40,
        marginBottom: 'auto',
    },
    catTitleHorizontal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    actionGrid: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        justifyContent: 'space-between',
    },
    actionCard: {
        width: '48%',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionIcon: {
        fontSize: 28,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2D3142',
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 12,
        color: '#9E9EA7',
        textAlign: 'center',
    },

    // Provider Styles
    providerStatsContainer: {
        padding: 24,
        paddingTop: 30,
    },
    statBox: {
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#2c3e50',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    statTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
    },
    statDesc: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    },
    mgmtCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        marginHorizontal: 24,
        marginBottom: 16,
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    mgmtIconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    mgmtIcon: {
        fontSize: 24,
    },
    mgmtInfo: {
        flex: 1,
    },
    mgmtTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3142',
        marginBottom: 4,
    },
    mgmtSubtitle: {
        fontSize: 13,
        color: '#9E9EA7',
    },
    arrowIcon: {
        fontSize: 20,
        color: '#D1D5DB',
        fontWeight: 'bold',
    },

    // Admin Styles
    adminBanner: {
        backgroundColor: '#9C27B0',
        margin: 24,
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#9C27B0',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    adminBannerText: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    adminGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    adminCard: {
        width: '48%',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    adminIconWrapper: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    adminIcon: {
        fontSize: 28,
    },
    adminTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#2D3142',
        textAlign: 'center',
        marginBottom: 4,
    },
    adminSubtitle: {
        fontSize: 12,
        color: '#9E9EA7',
        textAlign: 'center',
    }
});

export default HomeScreen;
