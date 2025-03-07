import { useEffect, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { db } from "../../firebase-config";
import Button from "../controls/Button";
import Base from "./Base";
import FormItem from "../controls/FormItem";
import { collection, setDoc } from "firebase/firestore";
import Select from 'react-native-dropdown-select';

const selectStatus = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
]
export default function StateModal({
    selected,
    setSelected,
    visible,
    onClose
}) {
    const statusRef = useRef();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        statusRef?.current?.selectIndex(
            selectStatus.findIndex((item) => item.value === selected.status)
        );
    }, [statusRef, selected]);
    const saveState = async (values) => {
        try {
            setLoading(true);
            if (!selected?.key) {
                // Con la siguiente instrucción creamos un nuevo documento en la colección a la que hagamos referencia
                await setDoc(doc(collection(db, "states")), {
                    name: selected.name,
                    code: selected.code,
                    status: selected.status,
                });
            } else {
                // Creamos primero la referencia al documento que vamos a editar
                const stateRef = doc(db, "states", selected.key);
                // Editamos nuestro documento
                await setDoc(
                    stateRef,
                    {
                        name: selected.name,
                        code: selected.code,
                        status: selected.status,
                    },
                    {
                        merge: true,
                    }
                );
            }
            setLoading(false);
            onClose();
        } catch (error) {
            console.log(error);
            Alert.alert("Error", error.message);
        }
    };
    return(
        <FormItem/>
    )
}
// En el caso de los 2 primeros componentes del formItem van a apuntar para el nombre y estado del item
// Crear 2 componentes formItem(asociar function stateModal), uno para el nombre y otro para el codigo
// Elemento de tipo dropdown para saber si esta activo o inactivo