import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Button from "../components/controls/Button";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

export default function Sucursales({ navigation }) {
  const goToHome = () => {
    navigation.navigate("Home");
  };

  const sucursalesData = [
    {
      id: 1,
      sucursal: "Chanel Guadalajara Plaza",
      correo: "chanel.gdl.plaza@chanel.com",
      horario: "Lunes a Sábado 11:00 - 21:00, Domingo 11:00 - 20:00",
      telefono: "(33) 3647-8900",
      ubicacion: "Av. Pablo Neruda 2340, Providencia, 44630 Guadalajara, Jal.",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2541.04115705916!2d-103.40310476597352!3d20.649999463987456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428adcd327f9097%3A0xebb0e572fabb4285!2sChanel!5e0!3m2!1ses!2smx!4v1742345760762!5m2!1ses!2smx",
    },
    {
      id: 2,
      sucursal: "Chanel Guadalajara Andares",
      correo: "chanel.gdl.andares@chanel.com",
      horario: "Lunes a Domingo 11:00 - 21:00",
      telefono: "(33) 3648-7100",
      ubicacion:
        "Blvd. Puerta de Hierro 4965, Puerta de Hierro, 45116 Zapopan, Jal.",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3731.945375081817!2d-103.37751956147758!3d20.712442673914587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428b1db66e29317%3A0xa525d353fead7897!2sChanel!5e0!3m2!1ses!2smx!4v1742345935153!5m2!1ses!2smx",
    },
    {
      id: 3,
      sucursal: "Chanel Ciudad de México",
      correo: "chanel.cdmx@chanel.com",
      horario: "Lunes a Domingo 11:00 - 20:00",
      telefono: "(55) 5280-9000",
      ubicacion:
        "Av. Presidente Masaryk 433, Polanco, Miguel Hidalgo, 11550 Ciudad de México, CDMX",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115136.86125499915!2d-99.31679615662694!3d19.43875679130388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d2021ca199c5db%3A0x543dbd7292e1480f!2sChanel!5e0!3m2!1ses!2smx!4v1742346001242!5m2!1ses!2smx",
    },
  ];

  return (
    <View style={styles.mainContainer}>
      {/* Contenedor del botón con padding */}
      <View style={styles.buttonContainer}>
        <Button onPress={goToHome} label={"Home"} type="white" />
      </View>

      <ScrollView style={styles.container}>
        {sucursalesData.map((sucursal) => (
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
                  latitude: 20.649999,
                  longitude: -103.403104,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: 20.649999,
                    longitude: -103.403104,
                  }}
                  title={sucursal.sucursal}
                  description={sucursal.ubicacion}
                />
              </MapView>
            </View>
          </View>
        ))}
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
