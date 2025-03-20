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
      price: "$2,500",
      image: require("../assets/Ofertas/GoodFortuneEauDeParfum1.png"),
    },
    {
      id: 2,
      name: "CocoCrushSingleEarring",
      price: "$2,800",
      image: require("../assets/Ofertas/CocoCrushSingleEarring2.png"),
    },
    {
      id: 3,
      name: "PLATINUMÉGOÏSTE",
      price: "$2,300",
      image: require("../assets/Ofertas/PLATINUMÉGOÏSTE3.png"),
    },
    {
      id: 4,
      name: "ÉCLATPREMIERLAMOUSSE",
      price: "$2,700",
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
        <Text style={styles.productPrice}>{item.price}</Text>
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
  productPrice: {
    color: Colors.azulBonito,
    fontSize: 14,
  },
  productsGrid: {
    padding: 15,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.black,
  },
});
