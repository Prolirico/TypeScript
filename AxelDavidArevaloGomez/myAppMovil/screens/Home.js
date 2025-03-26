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

// Importa las imágenes que usarás para los productos
const productImages = {
  CHANEL_N5: require("../assets/bolsa1Verde.jpg"),
  Coco_Mademoiselle: require("../assets/bolsaBasura2.jpg"),
  Chance: require("../assets/bolsa3.jpg"),
  Bleu_de_Chanel: require("../assets/perfume4.jpg"),
  Gabrielle: require("../assets/maquillaje5.jpg"),
  Allure: require("../assets/bolsa6.jpg"),
  default: require("../assets/bolsa1Verde.jpg"), // Imagen predeterminada
};

export default function Home({ navigation }) {
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    releaseDate: "",
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
    console.log("Conectando a Firestore...");
    setIsLoading(true);

    // Conectarse a la colección "productos" en Firestore
    const q = query(collection(db, "productos"));

    console.log("Consulta creada, escuchando cambios...");

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        console.log("Datos recibidos:", querySnapshot.size);
        const productsData = [];

        querySnapshot.forEach((doc) => {
          console.log("Documento:", doc.id, doc.data());
          // Determinar qué imagen usar
          const imageName = doc.data().imageName || "default";

          productsData.push({
            id: doc.id,
            ...doc.data(),
            image: productImages[imageName] || productImages.default,
          });
        });

        setProducts(productsData);
        setIsLoading(false);
        console.log("Datos cargados correctamente");
      },
      (error) => {
        console.error("Error cargando productos:", error);
        Alert.alert("Error", "No se pudieron cargar los productos");
        setIsLoading(false);
      },
    );

    return () => {
      console.log("Limpiando subscripción");
      unsubscribe();
    };
  }, []);

  const toggleModal = () => {
    setVisible(!visible);
  };

  const createNew = () => {
    setIsEditing(false);
    setFormData({
      id: "",
      name: "",
      price: "",
      releaseDate: "",
      imageName: "default",
    });
    toggleModal();
  };

  const editProduct = (item) => {
    console.log("Editando producto:", item);
    setIsEditing(true);
    setFormData({
      id: item.id,
      name: item.name || "",
      price: item.price ? item.price.toString() : "",
      releaseDate: item.releaseDate || "",
      imageName: item.imageName || "default",
    });
    toggleModal();
  };

  const deleteProduct = async (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este producto?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí",
          onPress: async () => {
            try {
              console.log("Eliminando producto con ID:", id);
              await deleteDoc(doc(db, "productos", id));
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

  const validateForm = () => {
    if (!formData.name || !formData.price || !formData.releaseDate) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return false;
    }

    const price = parseFloat(formData.price);

    if (isNaN(price) || price <= 0) {
      Alert.alert("Error", "El precio debe ser un número positivo válido");
      return false;
    }

    // Validar formato de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.releaseDate)) {
      Alert.alert("Error", "La fecha debe tener el formato YYYY-MM-DD");
      return false;
    }

    return true;
  };

  const saveProduct = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      console.log("Guardando producto...");
      const price = parseFloat(formData.price);

      const productData = {
        name: formData.name,
        price: price,
        releaseDate: formData.releaseDate,
        imageName: formData.imageName,
        updatedAt: new Date(),
      };

      console.log("Datos a guardar:", productData);

      if (isEditing) {
        // Actualizar producto existente
        console.log("Actualizando producto con ID:", formData.id);
        await updateDoc(doc(db, "productos", formData.id), productData);
        Alert.alert("Éxito", "Producto actualizado correctamente");
      } else {
        // Crear producto nuevo
        console.log("Creando nuevo producto");
        productData.createdAt = new Date();
        const docRef = await addDoc(collection(db, "productos"), productData);
        console.log("Producto creado con ID:", docRef.id);
        Alert.alert("Éxito", "Producto agregado correctamente");
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
        <Text style={styles.productPrice}>
          $
          {typeof item.price === "number"
            ? item.price.toLocaleString()
            : item.price}
        </Text>
        {item.releaseDate && (
          <Text style={styles.releaseDate}>
            Lanzamiento: {item.releaseDate}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Productos" />
      <View style={styles.container}>
        {visible && (
          <Base
            id="modal-state"
            visible={visible}
            title={isEditing ? "Editar Producto" : "Agregar Producto"}
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
                <Text style={styles.label}>Precio</Text>
                <TextInput
                  style={styles.input}
                  value={formData.price}
                  onChangeText={(text) => handleInputChange("price", text)}
                  keyboardType="numeric"
                  placeholder="Ingrese precio"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.label}>
                  Fecha de Lanzamiento (YYYY-MM-DD)
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.releaseDate}
                  onChangeText={(text) =>
                    handleInputChange("releaseDate", text)
                  }
                  placeholder="2024-01-01"
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
              No hay productos disponibles. Agrega uno pulsando el botón +
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
  productPrice: {
    color: Colors.azulBonito,
    fontSize: 14,
    fontWeight: "bold",
  },
  releaseDate: {
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
