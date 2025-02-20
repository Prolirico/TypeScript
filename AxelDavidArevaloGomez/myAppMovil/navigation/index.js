import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './Dashboard';
import External from './External';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';

const Stack = createNativeStackNavigator();
function RootNavigation() {
    return (
        <Stack.Navigator initialRouteName='External'>
            <Stack.Screen
                name='Dashboard'
                component={Dashboard}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='External'
                component={External}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='SignUp'
                component={SignUp}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='Home'
                component={Home}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
export default function Navigation() {
    return (
        <NavigationContainer>
            <RootNavigation />
        </NavigationContainer>
    )
}