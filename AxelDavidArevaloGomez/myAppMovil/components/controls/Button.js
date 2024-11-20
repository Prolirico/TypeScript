import { TouchableOpacity, Text, StyleSheet } from "react-native";

import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";

export default function Button({ label, type = 'black', onPress, style }) {
    return (
        <TouchableOpacity onPress={onPress} style={[
            styles.container,
            type === 'white' && styles.containerWhite,
            style
        ]}>
            <Text style={styles.text}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: Colors.azulBonito,
        borderRadius: 25,
        paddingVertical: 10,
        width: '100%',
    },
    text: {
        color: Colors.white,
        fontFamily: Fonts.family.regular,
        fontSize: Fonts.size.normal,
    },
    containerWhite: {
        borderColor: Colors.white,
        borderRadius: 10,
        borderWidth: 2,
    },
});