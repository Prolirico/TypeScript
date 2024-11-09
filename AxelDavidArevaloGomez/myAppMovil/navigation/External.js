import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Welcome from '../screens/Welcome';

const Stack = createNativeStackNavigator();

export default function Dashboard() {
    return (
        <Stack.Navigator initialRouteName='Welcome'>
            <Stack.Screen
                name='Login'
                component={Login}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name='Welcome'
                component={Welcome}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}