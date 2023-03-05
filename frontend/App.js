import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/screens/LoginScreen.js';
import RegisterScreen from './src/screens/RegisterScreen.js';
import HomeScreen from './src/screens/HomeScreen.js';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatroomScreen from './src/screens/ChatroomScreen.js';
import SettingsScreen from './src/screens/SettingsScreen.js';
import RegisterDetailsScreen from './src/screens/RegisterDetailsScreen.js';
import SearchScreen from './src/screens/SearchScreen.js'; 
import PinScreen from './src/screens/PinScreen.js';
import PinSetup from './src/screens/PinSetup.js';

export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator  screenOptions={{
    headerShown: false
  }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RegisterDetails" component={RegisterDetailsScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Chatroom" component={ChatroomScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="PinScreen" component={PinScreen} />
        <Stack.Screen name="PinSetup" component={PinSetup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
