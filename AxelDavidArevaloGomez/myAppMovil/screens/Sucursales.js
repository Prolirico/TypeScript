//import React from "react";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Button from "../components/controls/Button";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";

export default function Sucursales({ navigation }) {
  const [sucursalesData, setSucursalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Conectando a Firestore...");
    // Conectarse a la colección "sucursales" en Firestore
    const sucursalesQuery = query(collection(db, "sucursales"));

    const unsubscribe = onSnapshot(
      sucursalesQuery,
      (querySnapshot) => {
        console.log("Datos recibidos:", querySnapshot.size);
        const sucursales = [];
        querySnapshot.forEach((doc) => {
          console.log("Documento:", doc.id, doc.data());
          sucursales.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setSucursalesData(sucursales);
        setLoading(false);
      },
      (error) => {
        console.error("Error obteniendo sucursales:", error);
        Alert.alert("Error", "No se pudieron cargar las sucursales");
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  const goToHome = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.buttonContainer}>
        <Button onPress={goToHome} label={"Home"} type="white" />
      </View>

      <ScrollView style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando sucursales...</Text>
          </View>
        ) : sucursalesData.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No hay sucursales disponibles</Text>
          </View>
        ) : (
          sucursalesData.map((sucursal) => {
            console.log("Renderizando sucursal:", sucursal.sucursal);
            return (
              <View key={sucursal.id} style={styles.card}>
                <Text style={styles.title}>{sucursal.sucursal}</Text>

                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Correo:</Text>
                  <Text style={styles.info}>{sucursal.correo}</Text>

                  <Text style={styles.label}>Horario:</Text>
                  <Text style={styles.info}>{sucursal.horario}</Text>

                  <Text style={styles.label}>Teléfono:</Text>
                  <Text style={styles.info}>{sucursal.telefono}</Text>

                  <Text style={styles.label}>Ubicación:</Text>
                  <Text style={styles.info}>{sucursal.ubicacion}</Text>
                </View>

                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: sucursal.coordenadas?.latitude || 20.649999,
                      longitude: sucursal.coordenadas?.longitude || -103.403104,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: sucursal.coordenadas?.latitude || 20.649999,
                        longitude:
                          sucursal.coordenadas?.longitude || -103.403104,
                      }}
                      title={sucursal.sucursal}
                      description={sucursal.ubicacion}
                    />
                  </MapView>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 20,
    position: "absolute",
    top: 80,
    left: 20,
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 60, // Para dar espacio al botón de regreso
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  infoContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginTop: 5,
  },
  info: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  mapContainer: {
    height: 200,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginTop: 10,
  },
  map: {
    width: "100%",
    height: 200,
    borderRadius: 5,
  },
  buttonContainer: {
    paddingTop: 40, // Aumentamos el padding top de 20px a 40px
    paddingHorizontal: 15,
    backgroundColor: Colors.ghostWhite,
    paddingBottom: 10,
  },
});
