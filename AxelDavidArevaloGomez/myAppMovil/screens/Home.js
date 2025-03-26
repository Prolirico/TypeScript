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
  ScrollView,
  Modal,
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
  where,
  getDocs,
  serverTimestamp,
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

// Opciones de filtrado
const filterOptions = [
  { id: "az", label: "Nombre (A-Z)" },
  { id: "za", label: "Nombre (Z-A)" },
  { id: "oldest", label: "Antigüedad (Más antiguos primero)" },
  { id: "newest", label: "Antigüedad (Más recientes primero)" },
  { id: "price_asc", label: "Precio (Menor a Mayor)" },
  { id: "price_desc", label: "Precio (Mayor a Menor)" },
];

export default function Home({ navigation }) {
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Estado para el modal de comentarios
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [commentData, setCommentData] = useState({
    rating: "5",
    comment: "",
  });
  const [productComments, setProductComments] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  // Estado para el filtrado
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState("az"); // Filtro por defecto

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: "",
    releaseDate: "",
    imageName: "default",
  });

  // Verificar autenticación y guardar usuario actual
  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (response) => {
      if (!response) {
        navigation.navigate("Login");
      } else {
        setCurrentUser(response);
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
        // Aplicar el filtro activo a los productos cargados
        applyFilter(productsData, activeFilter);

        setIsLoading(false);
        console.log("Datos cargados correctamente");

        // Cargar comentarios para cada producto
        productsData.forEach((product) => {
          loadCommentsForProduct(product.id);
        });
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

  // Aplicar filtro cuando cambie
  useEffect(() => {
    applyFilter(products, activeFilter);
  }, [activeFilter]);

  // Función para aplicar el filtro seleccionado
  const applyFilter = (productsToFilter, filterId) => {
    if (!productsToFilter || productsToFilter.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let sorted = [...productsToFilter];

    switch (filterId) {
      case "az":
        sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "za":
        sorted.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "oldest":
        sorted.sort((a, b) => {
          const dateA = a.releaseDate ? new Date(a.releaseDate) : new Date(0);
          const dateB = b.releaseDate ? new Date(b.releaseDate) : new Date(0);
          return dateA - dateB;
        });
        break;
      case "newest":
        sorted.sort((a, b) => {
          const dateA = a.releaseDate ? new Date(a.releaseDate) : new Date(0);
          const dateB = b.releaseDate ? new Date(b.releaseDate) : new Date(0);
          return dateB - dateA;
        });
        break;
      case "price_asc":
        sorted.sort((a, b) => {
          const priceA = typeof a.price === "number" ? a.price : 0;
          const priceB = typeof b.price === "number" ? b.price : 0;
          return priceA - priceB;
        });
        break;
      case "price_desc":
        sorted.sort((a, b) => {
          const priceA = typeof a.price === "number" ? a.price : 0;
          const priceB = typeof b.price === "number" ? b.price : 0;
          return priceB - priceA;
        });
        break;
      default:
        // No hacer nada
        break;
    }

    setFilteredProducts(sorted);
  };

  // Función para cambiar el filtro
  const changeFilter = (filterId) => {
    setActiveFilter(filterId);
    setFilterModalVisible(false);
  };

  // Función para cargar comentarios de un producto específico
  const loadCommentsForProduct = async (productId) => {
    try {
      console.log(`Cargando comentarios para producto ${productId}`);

      // Consulta sin orderBy para evitar necesidad de índice compuesto
      const commentsQuery = query(
        collection(db, "comentarios"),
        where("productId", "==", productId),
      );

      const querySnapshot = await getDocs(commentsQuery);
      console.log(`Se encontraron ${querySnapshot.size} comentarios`);

      const comments = [];

      querySnapshot.forEach((doc) => {
        comments.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date(),
        });
      });

      // Ordenar comentarios por fecha (más recientes primero)
      comments.sort((a, b) => {
        const dateA =
          a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
        const dateB =
          b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
        return dateB - dateA;
      });

      // Actualizar estado de comentarios
      setProductComments((prev) => ({
        ...prev,
        [productId]: comments,
      }));

      console.log(`Comentarios cargados y ordenados correctamente`);
    } catch (error) {
      console.error("Error cargando comentarios:", error);
    }
  };

  const toggleModal = () => {
    setVisible(!visible);
  };

  const toggleCommentModal = () => {
    setCommentModalVisible(!commentModalVisible);
  };

  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const toggleComments = (productId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
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

  const openCommentModal = (product) => {
    setSelectedProduct(product);
    setCommentData({
      rating: "5",
      comment: "",
    });
    toggleCommentModal();
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

  const handleCommentInputChange = (field, value) => {
    setCommentData({
      ...commentData,
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

  const validateCommentForm = () => {
    if (!commentData.comment) {
      Alert.alert("Error", "Por favor ingresa un comentario");
      return false;
    }

    const rating = parseInt(commentData.rating);
    if (isNaN(rating) || rating < 1 || rating > 10) {
      Alert.alert("Error", "La calificación debe ser un número entre 1 y 10");
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

  const submitComment = async () => {
    if (!validateCommentForm()) {
      return;
    }

    if (!currentUser) {
      Alert.alert("Error", "Debes iniciar sesión para comentar");
      return;
    }

    try {
      const commentToSave = {
        productId: selectedProduct.id,
        userEmail: currentUser.email,
        rating: parseInt(commentData.rating),
        comment: commentData.comment,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "comentarios"), commentToSave);
      Alert.alert("Éxito", "Comentario agregado correctamente");

      // Recargar comentarios para este producto
      loadCommentsForProduct(selectedProduct.id);

      toggleCommentModal();
    } catch (error) {
      console.error("Error guardando comentario:", error);
      Alert.alert(
        "Error",
        "No se pudo guardar el comentario: " + error.message,
      );
    }
  };

  const renderComment = (comment) => {
    // Formatear fecha
    const date =
      comment.timestamp instanceof Date
        ? comment.timestamp
        : new Date(comment.timestamp);

    const formattedDate = isNaN(date.getTime())
      ? "Fecha no disponible"
      : `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    return (
      <View style={styles.commentItem} key={comment.id}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentEmail}>{comment.userEmail}</Text>
          <Text style={styles.commentRating}>{comment.rating}/10</Text>
        </View>
        <Text style={styles.commentText}>{comment.comment}</Text>
        <Text style={styles.commentDate}>{formattedDate}</Text>
      </View>
    );
  };

  const renderProduct = ({ item }) => {
    const hasComments =
      productComments[item.id] && productComments[item.id].length > 0;
    const isExpanded = expandedComments[item.id] || false;

    return (
      <View style={styles.productCard}>
        <TouchableOpacity
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

        <View style={styles.commentsSection}>
          <TouchableOpacity
            style={styles.commentButton}
            onPress={() => openCommentModal(item)}
          >
            <Text style={styles.commentButtonText}>Agregar Comentario</Text>
          </TouchableOpacity>

          {hasComments && (
            <TouchableOpacity
              style={styles.toggleCommentsButton}
              onPress={() => toggleComments(item.id)}
            >
              <Text style={styles.toggleCommentsText}>
                {isExpanded
                  ? "Ocultar comentarios"
                  : `Ver comentarios (${productComments[item.id].length})`}
              </Text>
            </TouchableOpacity>
          )}

          {isExpanded && hasComments && (
            <View style={styles.commentsList}>
              {productComments[item.id].map((comment) =>
                renderComment(comment),
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  // Obtener la etiqueta del filtro activo
  const getActiveFilterLabel = () => {
    const activeOption = filterOptions.find(
      (option) => option.id === activeFilter,
    );
    return activeOption ? activeOption.label : "Ordenar por";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Productos" />
      <View style={styles.container}>
        {/* Botón de filtro */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={toggleFilterModal}
        >
          <Text style={styles.filterButtonText}>
            {getActiveFilterLabel()} ▼
          </Text>
        </TouchableOpacity>

        {/* Modal para seleccionar filtro */}
        <Modal
          transparent={true}
          visible={filterModalVisible}
          animationType="fade"
          onRequestClose={toggleFilterModal}
        >
          <TouchableOpacity
            style={styles.filterModalOverlay}
            activeOpacity={1}
            onPress={toggleFilterModal}
          >
            <View style={styles.filterModalContent}>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.filterOption,
                    activeFilter === option.id && styles.filterOptionActive,
                  ]}
                  onPress={() => changeFilter(option.id)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      activeFilter === option.id &&
                        styles.filterOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Modal para crear/editar producto */}
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

        {/* Modal para agregar comentario */}
        {commentModalVisible && (
          <Base
            id="modal-comment"
            visible={commentModalVisible}
            title={"Agregar Comentario"}
            onClose={toggleCommentModal}
          >
            <View style={styles.formContainer}>
              <Text style={styles.commentProductName}>
                Producto: {selectedProduct?.name}
              </Text>

              <View style={styles.formItem}>
                <Text style={styles.label}>Calificación (1-10)</Text>
                <TextInput
                  style={styles.input}
                  value={commentData.rating}
                  onChangeText={(text) =>
                    handleCommentInputChange("rating", text)
                  }
                  keyboardType="numeric"
                  placeholder="Califica del 1 al 10"
                  placeholderTextColor="#999"
                  maxLength={2}
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.label}>Comentario</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={commentData.comment}
                  onChangeText={(text) =>
                    handleCommentInputChange("comment", text)
                  }
                  placeholder="Escribe tu comentario"
                  placeholderTextColor="#999"
                  multiline={true}
                  numberOfLines={4}
                />
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={submitComment}
              >
                <Text style={styles.addButtonText}>Enviar Comentario</Text>
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
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay productos disponibles. Agrega uno pulsando el botón +
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={1} // Cambio a 1 columna para mostrar mejor los comentarios
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
    width: "95%",
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
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    color: Colors.azulBonito,
    fontSize: 16,
    fontWeight: "bold",
  },
  releaseDate: {
    color: Colors.white,
    fontSize: 14,
    marginTop: 5,
  },
  productsGrid: {
    padding: 10,
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
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
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
  commentsSection: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  commentButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  commentButtonText: {
    color: Colors.white,
    fontSize: 14,
  },
  toggleCommentsButton: {
    padding: 5,
    alignItems: "center",
  },
  toggleCommentsText: {
    color: Colors.azulBonito,
    fontSize: 14,
  },
  commentsList: {
    marginTop: 10,
  },
  commentItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  commentEmail: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  commentRating: {
    color: Colors.azulBonito,
    fontSize: 12,
    fontWeight: "bold",
  },
  commentText: {
    color: Colors.white,
    fontSize: 14,
    marginBottom: 5,
  },
  commentDate: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    textAlign: "right",
  },
  commentProductName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  // Estilos para el filtro
  filterButton: {
    backgroundColor: Colors.azulBonito,
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  filterButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  filterModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterModalContent: {
    width: "80%",
    backgroundColor: Colors.black,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.azulBonito,
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  filterOptionActive: {
    backgroundColor: "rgba(0, 123, 255, 0.1)",
  },
  filterOptionText: {
    color: Colors.white,
    fontSize: 16,
  },
  filterOptionTextActive: {
    color: Colors.azulBonito,
    fontWeight: "bold",
  },
});
