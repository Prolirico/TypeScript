import React from 'react';
import { View, Text, StyleSheet } from 'react-native'; // Importamos Text de react-native
import { Content, Header, Wrapper } from '../components/layout';
import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';
import { Alert } from "react-native";
import { getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { setDoc, doc, onSnapshot } from "firebase/firestore";
import FormItem from "../components/controls/FormItem";
import Button from "../components/controls/Button";
import { db, app } from "../firebase-config";

export default function Profile() {
        const [loading, setloading] = useState(false);
        const [data, setData] = useState({
            full_name: "",
            phone: "",
            age: "",
        });
        const auth = getAuth(auth);

        useEffect(() => {
            //crear la función para traer la información extra del usuario.
            const subscriber = onSnapshot(
                doc(db, "users", auth.currentUser?.uid || ""),
                (docSnap) => {
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setData((prev) => ({
                            ...prev,
                            full_name: userData.full_name,
                            age: userData.age,
                            phone: userData.phone,
                        }));
                    }
                });
            return subscriber;
        }, [auth]);

        const updateUser = async () => {
            setloading(true);
            if (auth.currentUser) {
                try {
                    await setDoc(doc(db, "users", auth.currentUser.uid), data, {
                        merge: true,
                    });
                } catch (error) {
                    console.error(error);
                    Alert.alert("Error", JSON.stringify(error));
                }
            }
            setloading(false);
        };

        return (
            <Wrapper backgroundColor={Colors.black}>
                <Header title="Perfil" showBack={true} />
                <Content>
                    <FormItem
                        value={data.full_name}
                        label="Nombre completo"
                        onChange={(value) =>
                            setData((prev) => ({ ...prev, full_name: value }))
                        } />
                    <FormItem
                        value={data.phone}
                        label="Numero telefonico"
                        onChange={(value) =>
                            setData((prev) => ({ ...prev, phone: value }))
                        }
                    />
                    <FormItem
                        value={data.age}
                        label="Edad"
                        onChange={(value) =>
                            setData((prev) => ({ ...prev, age: value }))
                        }
                    />
                </Content>
                <Button onPress={updateUser} label={"Actualizar"} isloading={loading} />
            </Wrapper>);
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