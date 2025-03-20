import { useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Text,
} from "react-native";
import Colors from "../constants/Colors";
import Base from "../components/modals/Base";
import { Header } from "../components/layout";

export default function Ofertas({ navigation }) {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: true,
  });

  const products = [
    {
      id: 1,
      name: "GoodFortuneEauDeParfum",
      originalPrice: 2500,
      discountPrice: 1875,
      discountPercentage: 25,
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      image: require("../assets/Ofertas/GoodFortuneEauDeParfum1.png"),
    },
    {
      id: 2,
      name: "CocoCrushSingleEarring",
      originalPrice: 2800,
      discountPrice: 1960,
      discountPercentage: 30,
      startDate: "2024-01-01",
      endDate: "2024-02-15",
      image: require("../assets/Ofertas/CocoCrushSingleEarring2.png"),
    },
    {
      id: 3,
      name: "PLATINUMÉGOÏSTE",
      originalPrice: 2300,
      discountPrice: 1840,
      discountPercentage: 20,
      startDate: "2024-01-15",
      endDate: "2024-02-28",
      image: require("../assets/Ofertas/PLATINUMÉGOÏSTE3.png"),
    },
    {
      id: 4,
      name: "ÉCLATPREMIERLAMOUSSE",
      originalPrice: 2700,
      discountPrice: 1890,
      discountPercentage: 30,
      startDate: "2024-01-10",
      endDate: "2024-02-10",
      image: require("../assets/Ofertas/ÉCLATPREMIERLAMOUSSE4.png"),
    },
  ];

  const toggleModal = () => {
    setVisible(!visible);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.originalPrice}>${item.originalPrice.toLocaleString()}</Text>
        <Text style={styles.discountPrice}>${item.discountPrice.toLocaleString()}</Text>
        <Text style={styles.discountPercentage}>{item.discountPercentage}% OFF</Text>
        <Text style={styles.dates}>{item.startDate} - {item.endDate}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Productos" />
      <View style={styles.container}>
        {visible && (
          <Base
            id="modal-state"
            visible={visible}
            title={"Editar estado"}
            onClose={toggleModal}
          >
            <Text>Contenido del modal</Text>
          </Base>
        )}
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productsGrid}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  productCard: {
    width: "45%",
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    margin: "2.5%",
  },
  productImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  originalPrice: {
    color: Colors.white,
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  discountPrice: {
    color: Colors.azulBonito,
    fontSize: 16,
    fontWeight: 'bold',
  },
  discountPercentage: {
    color: Colors.azulBonito,
    fontSize: 14,
    fontWeight: 'bold',
  },
  dates: {
    color: Colors.white,
    fontSize: 12,
    marginTop: 5,
  },
  productsGrid: {
    padding: 15,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.black,
  },
});