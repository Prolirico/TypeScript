import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { Wrapper, Header, Content } from '../components/layout';

export default function Compras({ route }) {
    const [orderStatus, setOrderStatus] = useState('En espera');
    
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
        <Wrapper>
            <Header title="Mi Carrito" />
            <Content>
                <Text style={styles.statusText}>Estado del pedido: {orderStatus}</Text>
                <FlatList
                    data={cartItems}
                    renderItem={renderCartItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Content>
        </Wrapper>
    );
}

const styles = StyleSheet.create({
    cartItem: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
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
    },
    cartItemPrice: {
        fontSize: 14,
        color: '#666',
    },
    statusText: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        backgroundColor: '#f0f0f0',
    },
});