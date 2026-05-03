import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HotelsScreen from '../screens/HotelsScreen';
import VehiclesScreen from '../screens/VehiclesScreen';
import TourGuidesScreen from '../screens/TourGuidesScreen';
import BookingScreen from '../screens/BookingScreen';
import ProviderHotelsScreen from '../screens/ProviderHotelsScreen';
import AddEditHotelScreen from '../screens/AddEditHotelScreen';
import ProviderRoomsScreen from '../screens/ProviderRoomsScreen';
import AddEditRoomScreen from '../screens/AddEditRoomScreen';
import HotelDetailsScreen from '../screens/HotelDetailsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    // App Flow
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Hotels" component={HotelsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="HotelDetails" component={HotelDetailsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Vehicles" component={VehiclesScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="TourGuides" component={TourGuidesScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Booking" component={BookingScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ProviderHotels" component={ProviderHotelsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="AddEditHotel" component={AddEditHotelScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ProviderRooms" component={ProviderRoomsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="AddEditRoom" component={AddEditRoomScreen} options={{ headerShown: false }} />
                    </>
                ) : (
                    // Auth Flow
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
