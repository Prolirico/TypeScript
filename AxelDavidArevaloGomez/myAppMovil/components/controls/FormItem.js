import { View, Text, TextInput, StyleSheet } from 'react-native';
import Fonts from '../../constants/Fonts';
import Colors from '../../constants/Colors';

export default function FormItem({ label }) {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput style={styles.input} />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        width: '100%'
    },
    label: {
        color: Colors.letraPassword,
        fontSize: Fonts.size.small,
        fontFamily: Fonts.family.regularm,
        textAlign: 'left'
    },
    input: {
        borderBottomColor: Colors.white, //colorDeLaBarraDelLogin (formulario)
        borderBottomWidth: 3,
        color: Colors.white, //colorDelRecuadro
        fontSize: Fonts.size.normal,
        paddingBottom: 5,
        paddingTop: 5,
    },
});