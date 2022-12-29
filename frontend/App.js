import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/screens/LoginScreen.js';
import RegisterScreen from './src/screens/RegisterScreen.js';
import HomeScreen from './src/screens/HomeScreen.js';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatroomScreen from './src/screens/ChatroomScreen.js';

export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator  screenOptions={{
    headerShown: false
  }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Chatroom" component={ChatroomScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
