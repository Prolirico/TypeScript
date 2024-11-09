import { useState } from 'react';
import { FlatList, ScrollView } from 'react-native';

import { Content, Header, Wrapper } from '../components/layout';
import State from '../components/controls/State';
import Base from '../components/modals/Base';
import FormItem from '../components/controls/FormItem';
import Button from '../components/controls/Button';

export default function Home({ navigation }) {
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState();
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        status: true
    });

    const data = [
        { id: 1, name: 'Querétaro', code: 'QRO', status: true },
        { id: 2, name: 'Guerrero', code: 'GUE', status: true },
        { id: 3, name: 'Guanajuato', code: 'GUA', status: false },
    ];

    const statusOptions = [
        { label: 'Activo', value: true },
        { label: 'Inactivo', value: false }
    ];

    const toggleModal = () => {
        setVisible(!visible);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <Wrapper>
            <Header title="Dashboard" />
            <Content>
                {visible && (
                    <Base
                        id="modal-state"
                        visible={visible}
                        title={"Editar estado"}
                        onClose={toggleModal}
                    >
                        <FormItem 
                            label="Nombre"
                            value={formData.name}
                            onValueChange={(value) => handleChange('name', value)}
                        />
                        <FormItem 
                            label="Código"
                            value={formData.code}
                            onValueChange={(value) => handleChange('code', value)}
                        />
                        <FormItem 
                            label="Estatus"
                            type="select"
                            value={formData.status}
                            options={statusOptions}
                            onValueChange={(value) => handleChange('status', value)}
                        />
                    </Base>
                )}
                <Button label="Abrir modal" onPress={toggleModal} />
                <ScrollView horizontal={true}>
                    <FlatList
                        data={data}
                        renderItem={State}
                        keyExtractor={item => item.id}
                    />
                </ScrollView>
            </Content>
        </Wrapper>
    );
};