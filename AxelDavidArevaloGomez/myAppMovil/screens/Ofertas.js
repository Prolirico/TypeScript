import { useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/Colors";
import Base from "../components/modals/Base";
import { Header } from "../components/layout";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import Button from "../components/controls/Button";

const productImages = {
  GoodFortuneEauDeParfum: require("../assets/Ofertas/GoodFortuneEauDeParfum1.png"),
  CocoCrushSingleEarring: require("../assets/Ofertas/CocoCrushSingleEarring2.png"),
  PLATINUMÉGOÏSTE: require("../assets/Ofertas/PLATINUMÉGOÏSTE3.png"),
  ÉCLATPREMIERLAMOUSSE: require("../assets/Ofertas/ÉCLATPREMIERLAMOUSSE4.png"),
  default: require("../assets/Ofertas/GoodFortuneEauDeParfum1.png"), // Imagen predeterminada
};

export default function Ofertas({ navigation }) {
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    originalPrice: "",
    discountPrice: "",
    startDate: "",
    endDate: "",
    imageName: "default",
  });

  // Verificar autenticación
  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (response) => {
      if (!response) {
        navigation.navigate("Login");
      }
    });
    return subscriber;
  }, [auth, navigation]);

  // Cargar productos de Firebase
  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "ofertas"), orderBy("name"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const ofertasData = [];
        querySnapshot.forEach((doc) => {
          // Determinar qué imagen usar
          const imageName = doc.data().imageName || "default";

          ofertasData.push({
            id: doc.id,
            ...doc.data(),
            image: productImages[imageName] || productImages.default,
          });
        });

        setProducts(ofertasData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error cargando ofertas:", error);
        Alert.alert("Error", "No se pudieron cargar los productos en oferta");
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const toggleModal = () => {
    setVisible(!visible);
  };

  const createNew = () => {
    setIsEditing(false);
    setFormData({
      id: "",
      name: "",
      originalPrice: "",
      discountPrice: "",
      startDate: "",
      endDate: "",
      imageName: "default",
    });
    toggleModal();
  };

  const editProduct = (item) => {
    setIsEditing(true);
    setFormData({
      id: item.id,
      name: item.name,
      originalPrice: item.originalPrice.toString(),
      discountPrice: item.discountPrice.toString(),
      startDate: item.startDate,
      endDate: item.endDate,
      imageName: item.imageName || "default",
    });
    toggleModal();
  };

  const deleteProduct = async (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este producto en oferta?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "ofertas", id));
              Alert.alert("Éxito", "Producto eliminado correctamente");
            } catch (error) {
              console.error("Error eliminando producto:", error);
              Alert.alert(
                "Error",
                "No se pudo eliminar el producto: " + error.message,
              );
            }
          },
        },
      ],
    );
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleImageSelect = () => {
    Alert.alert(
      "Seleccionar Imagen",
      "Elige una imagen para el producto",
      Object.keys(productImages).map((key) => ({
        text: key,
        onPress: () => handleInputChange("imageName", key),
      })),
    );
  };

  const calculateDiscountPercentage = (original, discount) => {
    const originalNum = parseFloat(original);
    const discountNum = parseFloat(discount);

    if (isNaN(originalNum) || isNaN(discountNum) || originalNum <= 0) {
      return 0;
    }

    return Math.round(((originalNum - discountNum) / originalNum) * 100);
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.originalPrice ||
      !formData.discountPrice ||
      !formData.startDate ||
      !formData.endDate
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return false;
    }

    const originalPrice = parseFloat(formData.originalPrice);
    const discountPrice = parseFloat(formData.discountPrice);

    if (isNaN(originalPrice) || isNaN(discountPrice)) {
      Alert.alert("Error", "Los precios deben ser números válidos");
      return false;
    }

    if (discountPrice >= originalPrice) {
      Alert.alert(
        "Error",
        "El precio con descuento debe ser menor al precio original",
      );
      return false;
    }

    // Validar formato de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (
      !dateRegex.test(formData.startDate) ||
      !dateRegex.test(formData.endDate)
    ) {
      Alert.alert("Error", "Las fechas deben tener el formato YYYY-MM-DD");
      return false;
    }

    return true;
  };

  const saveProduct = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const originalPrice = parseFloat(formData.originalPrice);
      const discountPrice = parseFloat(formData.discountPrice);
      const discountPercentage = calculateDiscountPercentage(
        originalPrice,
        discountPrice,
      );

      const productData = {
        name: formData.name,
        originalPrice: originalPrice,
        discountPrice: discountPrice,
        discountPercentage: discountPercentage,
        startDate: formData.startDate,
        endDate: formData.endDate,
        imageName: formData.imageName,
        updatedAt: new Date(),
      };

      if (isEditing) {
        // Actualizar producto existente
        await updateDoc(doc(db, "ofertas", formData.id), productData);
        Alert.alert("Éxito", "Producto actualizado correctamente");
      } else {
        // Crear producto nuevo
        productData.createdAt = new Date();
        await addDoc(collection(db, "ofertas"), productData);
        Alert.alert("Éxito", "Producto en oferta agregado correctamente");
      }

      toggleModal();
    } catch (error) {
      console.error("Error guardando producto:", error);
      Alert.alert("Error", "No se pudo guardar el producto: " + error.message);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => editProduct(item)}
      onLongPress={() => deleteProduct(item.id)}
    >
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.originalPrice}>
          ${item.originalPrice.toLocaleString()}
        </Text>
        <Text style={styles.discountPrice}>
          ${item.discountPrice.toLocaleString()}
        </Text>
        <Text style={styles.discountPercentage}>
          {item.discountPercentage}% OFF
        </Text>
        <Text style={styles.dates}>
          {item.startDate} - {item.endDate}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Productos en Oferta" />
      <View style={styles.container}>
        {visible && (
          <Base
            id="modal-state"
            visible={visible}
            title={
              isEditing
                ? "Editar Producto en Oferta"
                : "Agregar Producto en Oferta"
            }
            onClose={toggleModal}
          >
            <View style={styles.formContainer}>
              <View style={styles.formItem}>
                <Text style={styles.label}>Nombre del Producto</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                  placeholder="Ingrese nombre del producto"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.label}>Precio Original</Text>
                <TextInput
                  style={styles.input}
                  value={formData.originalPrice}
                  onChangeText={(text) =>
                    handleInputChange("originalPrice", text)
                  }
                  keyboardType="numeric"
                  placeholder="Ingrese precio original"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.label}>Precio con Descuento</Text>
                <TextInput
                  style={styles.input}
                  value={formData.discountPrice}
                  onChangeText={(text) =>
                    handleInputChange("discountPrice", text)
                  }
                  keyboardType="numeric"
                  placeholder="Ingrese precio con descuento"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.label}>Fecha de Inicio (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.startDate}
                  onChangeText={(text) => handleInputChange("startDate", text)}
                  placeholder="2024-01-01"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.label}>Fecha de Fin (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.endDate}
                  onChangeText={(text) => handleInputChange("endDate", text)}
                  placeholder="2024-02-01"
                  placeholderTextColor="#999"
                />
              </View>

              <TouchableOpacity
                style={styles.imageSelectButton}
                onPress={handleImageSelect}
              >
                <Text style={styles.imageSelectText}>
                  {formData.imageName !== "default"
                    ? `Imagen seleccionada: ${formData.imageName}`
                    : "Seleccionar Imagen"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addButton} onPress={saveProduct}>
                <Text style={styles.addButtonText}>
                  {isEditing ? "Actualizar" : "Guardar"}
                </Text>
              </TouchableOpacity>
            </View>
          </Base>
        )}

        <TouchableOpacity style={styles.floatingButton} onPress={createNew}>
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando productos...</Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay productos en oferta. Agrega uno pulsando el botón +
            </Text>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.productsGrid}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: Colors.white,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: Colors.white,
    fontSize: 16,
    textAlign: "center",
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
    textDecorationLine: "line-through",
  },
  discountPrice: {
    color: Colors.azulBonito,
    fontSize: 16,
    fontWeight: "bold",
  },
  discountPercentage: {
    color: Colors.azulBonito,
    fontSize: 14,
    fontWeight: "bold",
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
  floatingButton: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: Colors.azulBonito,
    borderRadius: 30,
    elevation: 8,
    zIndex: 999,
  },
  floatingButtonText: {
    fontSize: 30,
    color: Colors.white,
  },
  formContainer: {
    padding: 15,
  },
  formItem: {
    marginBottom: 15,
  },
  label: {
    color: Colors.white,
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 5,
    padding: 10,
    color: Colors.black,
    fontSize: 16,
  },
  imageSelectButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginVertical: 10,
  },
  imageSelectText: {
    color: Colors.white,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: Colors.azulBonito,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
