import { Content, Header, Wrapper, Title } from '../components/layout';
import Button from '../components/controls/Button';
import FormItem from '../components/controls/FormItem';
import Colors from '../constants/Colors';

export default function SignUp({ navigation }) {
    const goToHome = () => {
        navigation.navigate('Home');
    };

    return (
        <Wrapper backgroundColor={Colors.black}>
            <Header showBack={true} showCart={false} />
            <Content>
                <Title title="Crear nueva cuenta" color={Colors.white}/>
                <FormItem label="Nombre y apellidos" />
                <FormItem label="Nombre de usuario" />
                <FormItem label="Contraseña" />
                <FormItem label="Repetir contraseña" />
                <FormItem label="Ingrese su correo electrónico/numero telefono" />
                <Button label="REGISTRARSE" onPress={goToHome} type="white"/>
            </Content>
        </Wrapper>
    );
};