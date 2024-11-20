import React from 'react';
import { View, Text, StyleSheet } from 'react-native'; // Importamos Text de react-native
import { Content, Header, Wrapper } from '../components/layout';
import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';

export default function Profile() {
    return (
        <Wrapper backgroundColor={Colors.black}>
            <Header title="Perfil" showBack={true} />
            <Content>
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Username:</Text>
                    <Text style={styles.value}>AxelArevalo1</Text>

                    <Text style={styles.label}>Information About:</Text>
                    <Text style={styles.value}>Se unio el 19/11/2024</Text>

                    <Text style={styles.label}>Name and LastName:</Text>
                    <Text style={styles.value}>Axel David Arevalo Gomez</Text>

                    <Text style={styles.label}>Correo/Numero de telefono:</Text>
                    <Text style={styles.value}>022000708upsrj@gmail.com</Text>
                </View>
            </Content>
        </Wrapper>
    );
}

const styles = StyleSheet.create({
    infoContainer: {
        padding: 20,
    },
    label: {
        color: Colors.azulBonito,
        fontSize: Fonts.size.large,
        fontFamily: Fonts.family.bold,
        marginBottom: 5,
        marginTop: 15,
    },
    value: {
        color: Colors.white,
        fontSize: Fonts.size.normal,
        fontFamily: Fonts.family.regular,
        marginBottom: 10,
    },
});