import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Home from '../screens/Home';
import Welcome from '../screens/Welcome';
import Register from '../screens/Register';
import { useState } from 'react';

const Stack = createNativeStackNavigator();

export default function External() {
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
            <Stack.Screen
                name='Register'
                component={Register}
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