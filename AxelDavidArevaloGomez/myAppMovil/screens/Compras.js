import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { Header } from '../components/layout'; // Removemos Content y Wrapper
import Colors from '../constants/Colors';

export default function Compras({ route }) {
    const [orderStatus, setOrderStatus] = useState('En espera');
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'CHANEL N°5', price: '2,500', image: require('../assets/bolsa1Verde.jpg') },
        // ... más items si los necesitas
    ]);

    const statusOptions = [
        'En espera',
        'En paqueteria',
        'En camino',
        'Entregada'
    ];

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image source={item.image} style={styles.cartItemImage} />
            <View style={styles.cartItemInfo}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemPrice}>${item.price}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header title="Mi Carrito" />
            <View style={styles.container}>
                <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>Estado del pedido: {orderStatus}</Text>
                </View>
                <FlatList
                    data={cartItems}
                    renderItem={renderCartItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    statusContainer: {
        padding: 10,
        backgroundColor: Colors.black,
    },
    statusText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white,
    },
    listContainer: {
        padding: 10,
    },
    cartItem: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        marginBottom: 10,
    },
    cartItemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    cartItemInfo: {
        marginLeft: 10,
        justifyContent: 'center',
    },
    cartItemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.white,
    },
    cartItemPrice: {
        fontSize: 14,
        color: Colors.azulBonito,
        marginTop: 5,
    },
});