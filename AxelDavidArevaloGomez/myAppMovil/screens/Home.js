import { useState } from "react";
import {
    FlatList,
    ScrollView,
    SafeAreaView,
    StyleSheet,
    View,
    Image,
    Text,
} from "react-native";
import Colors from "../constants/Colors";
import { Header, Wrapper, Content } from "../components/layout";
import Base from "../components/modals/Base";
import State from "../components/controls/State";
import FormItem from "../components/controls/FormItem";
import { Button } from "../components/controls/Button";

export default function Home({ navigation }) {
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
            name: "CHANEL N°5",
            price: "$2,500",
            image: require("../assets/bolsa1Verde.jpg"),
        },
        {
            id: 2,
            name: "Coco Mademoiselle",
            price: "$2,800",
            image: require("../assets/bolsaBasura2.jpg"),
        },
        {
            id: 3,
            name: "Chance",
            price: "$2,300",
            image: require("../assets/bolsa3.jpg"),
        },
        {
            id: 4,
            name: "Bleu de Chanel",
            price: "$2,700",
            image: require("../assets/perfume4.jpg"),
        },
        {
            id: 5,
            name: "Gabrielle",
            price: "$2,600",
            image: require("../assets/maquillaje5.jpg"),
        },
        {
            id: 6,
            name: "Allure",
            price: "$2,400",
            image: require("../assets/bolsa6.jpg"),
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