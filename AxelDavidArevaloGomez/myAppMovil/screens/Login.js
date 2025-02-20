import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Colors from '../constants/Colors';
import { Alert } from 'react-native';

import { Content, Header, Wrapper, Title } from "../components/layout";
import Button from "../components/controls/Button";
import FormItem from "../components/controls/FormItem";

import { auth } from "../firebase-config";
import { loginWithEmailPass } from "../services/firebase";

export default function Login({ navigation }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Navigation object:', navigation);
    console.log('Available routes:', navigation.getState());

    // Nos suscribimos y detecta cuando el usuario ya inicio sesión
    const subscriber = onAuthStateChanged(auth, (response) => {
      console.log('Estado de autenticación cambiado:', response);
      if (response) {
        console.log('Rutas actuales:', navigation.getState().routes);
        try {
          // Try different navigation targets
          console.log('Intento de navegar al Panel de control');
          navigation.navigate("Dashboard");
        } catch (dashboardError) {
          console.error('Dashboard navigation error:', dashboardError);
          try {
            console.log('Intento denavegar al home');
            navigation.navigate("Home");
          } catch (homeError) {
            console.error('Error de navegación de la página principal:', homeError);
            try {
              console.log('Intentando navegar a Externo');
              navigation.navigate("External");
            } catch (externalError) {
              console.error('Error de navegación hacia el external:', externalError);
            }
          }
        }
      }
    });
    return subscriber;
  }, [auth, navigation]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const login = async () => {
    if (!user || !pass) {
      Alert.alert('Error', 'Por favor ingrese correo y contraseña');
      return;
    }

    if (!validateEmail(user)) {
      Alert.alert('Error', 'Por favor ingrese un correo electrónico válido');
      return;
    }

    setLoading(true);
    try {
      const loggedInUser = await loginWithEmailPass(user, pass);
      console.log('Logged in user:', loggedInUser);
      setUser("");
      setPass("");
      
      // Try different navigation targets
      try {
        console.log('Attempting to navigate to Dashboard');
        navigation.navigate("Dashboard");
      } catch (dashboardError) {
        console.error('Dashboard navigation error:', dashboardError);
        try {
          console.log('Attempting to navigate to Home');
          navigation.navigate("Home");
        } catch (homeError) {
          console.error('Home navigation error:', homeError);
          try {
            console.log('Attempting to navigate to External');
            navigation.navigate("External");
          } catch (externalError) {
            console.error('External navigation error:', externalError);
            Alert.alert('Error de navegación', 'No se pudo navegar después del inicio de sesión');
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error de inicio de sesión', error.message);
    } finally {
      setLoading(false);
    }
  };

  const onChangeUser = (value) => {
    setUser(value);
  };

  const onChangePass = (value) => {
    setPass(value);
  };

  return (
    <Wrapper>
      <Header showBack={true} showCart={false} />
      <Content>
        <Title title="Iniciar Sesión" />
        <FormItem
          value={user}
          label="Correo de usuario"
          keyboardType="email-address"
          onChange={onChangeUser}
        ></FormItem>
        <FormItem
          value={pass}
          secure={true}
          label="Contraseña"
          onChange={onChangePass}
        ></FormItem>
        <Button label="ACCEDER" onPress={login} isLoading={loading} />
      </Content>
    </Wrapper>
  );
}