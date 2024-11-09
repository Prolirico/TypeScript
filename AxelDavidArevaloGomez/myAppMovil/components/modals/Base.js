import {
    Modal,
    TouchableOpacity,
    Text,
    View,
    StyleSheet,
    Dimensions,
} from "react-native";
import { AntDesign } from '@expo/vector-icons'; // Agregamos esta importación
import Colors from "../../constants/Colors";

const { height, width } = Dimensions.get("window");

export default function Base({ id, title, visible, children, onClose }) {
    return (
        <Modal
            key={id}
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.overlay} onPress={onClose} />
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.modalHeader}>
                        {title && (
                            <Text style={styles.titleText}>{title}</Text>
                        )}
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <AntDesign name="closecircle" size={24} color={Colors.black} />
                        </TouchableOpacity>
                    </View>
                    <View>{children}</View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        paddingVertical: 20,
    },
    modalView: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        margin: 20,
        paddingBottom: 15,
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    overlay: {
        backgroundColor: "rgba(0,0,0,0.6)", // Corregido el valor de opacidad
        height,
        left: 0,
        position: "absolute",
        top: 0,
        width,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
});