import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Welcome from '../screens/Welcome';
import Colors from '../constants/Colors';
import Compras from "../screens/Compras";

const Drawer = createDrawerNavigator();

export default function Dashboard() {
    return (
        <Drawer.Navigator 
            initialRouteName='Home'
            screenOptions={{
                sceneContainerStyle: {
                    backgroundColor: Colors.black
                },
                // Agregar estas opciones
                drawerStyle: {
                    backgroundColor: Colors.black,
                },
                drawerLabelStyle: {
                    color: Colors.white // Para que el texto sea visible en fondo negro
                }
            }}
        >
            <Drawer.Screen
                name='Home'
                component={Home}
                options={{ headerShown: false }}
            />
            <Drawer.Screen
                name='Profile'
                component={Profile}
                options={{ headerShown: false }}
            />
            <Drawer.Screen
                name='Compras'
                component={Compras}
                options={{headerShown: false}}
            />
            <Drawer.Screen
                name='Salir'
                component={Welcome}
                options={{ headerShown: false }}
            />
        </Drawer.Navigator>
    );
}
