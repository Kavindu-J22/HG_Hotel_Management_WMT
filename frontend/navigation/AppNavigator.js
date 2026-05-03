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
import AdminHotelsScreen from '../screens/AdminHotelsScreen';
import ProviderVehiclesScreen from '../screens/ProviderVehiclesScreen';
import AddEditVehicleScreen from '../screens/AddEditVehicleScreen';
import AdminVehiclesScreen from '../screens/AdminVehiclesScreen';
import VehicleDetailsScreen from '../screens/VehicleDetailsScreen';
import ProviderGuideScreen from '../screens/ProviderGuideScreen';
import AddEditGuideScreen from '../screens/AddEditGuideScreen';
import AdminGuidesScreen from '../screens/AdminGuidesScreen';
import AdminBookingsScreen from '../screens/AdminBookingsScreen';
import AdminReviewsScreen from '../screens/AdminReviewsScreen';
import TourGuideDetailsScreen from '../screens/TourGuideDetailsScreen';
import ProviderReviewsScreen from '../screens/ProviderReviewsScreen';
import ProviderTourPlansScreen from '../screens/ProviderTourPlansScreen';
import AddEditTourPlanScreen from '../screens/AddEditTourPlanScreen';
import TourPlanDetailsScreen from '../screens/TourPlanDetailsScreen';
import WishlistScreen from '../screens/WishlistScreen';

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
                        <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="TourGuides" component={TourGuidesScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="TourGuideDetails" component={TourGuideDetailsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="TourPlanDetails" component={TourPlanDetailsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Booking" component={BookingScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Wishlist" component={WishlistScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ProviderHotels" component={ProviderHotelsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="AddEditHotel" component={AddEditHotelScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ProviderRooms" component={ProviderRoomsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="AddEditRoom" component={AddEditRoomScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="AdminHotels" component={AdminHotelsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ProviderVehicles" component={ProviderVehiclesScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="AddEditVehicle" component={AddEditVehicleScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="AdminVehicles" component={AdminVehiclesScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ProviderGuide" component={ProviderGuideScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="AddEditGuide" component={AddEditGuideScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="AdminGuides" component={AdminGuidesScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="AdminBookings" component={AdminBookingsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="AdminReviews" component={AdminReviewsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ProviderReviews" component={ProviderReviewsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ProviderTourPlans" component={ProviderTourPlansScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="AddEditTourPlan" component={AddEditTourPlanScreen} options={{ headerShown: false }} />
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
