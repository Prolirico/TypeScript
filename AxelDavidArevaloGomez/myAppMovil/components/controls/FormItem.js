import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Fonts from '../../constants/Fonts';
import Colors from '../../constants/Colors';

export default function FormItem({ label, type = 'text', value, options = [], onValueChange }) {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            {type === 'select' ? (
                <Picker
                    selectedValue={value}
                    onValueChange={onValueChange}
                    style={[styles.input, styles.picker]}
                >
                    {options.map((option) => (
                        <Picker.Item 
                            key={option.value} 
                            label={option.label} 
                            value={option.value}
                            color={Colors.white}
                        />
                    ))}
                </Picker>
            ) : (
                <TextInput 
                    style={styles.input}
                    value={value}
                    onChangeText={onValueChange}
                />
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        width: '100%',
        backgroundColor: Colors.black,
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
    picker: {
        color: Colors.white,
        height: 40,
        backgroundColor: Colors.black,
    },
});