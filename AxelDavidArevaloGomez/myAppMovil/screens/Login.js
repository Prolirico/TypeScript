import { Content, Header, Wrapper, Title } from '../components/layout';
import Button from '../components/controls/Button';
import FormItem from '../components/controls/FormItem';
import Colors from '../constants/Colors';

export default function Login({ navigation }) {
    const goToHome = () => {
        navigation.navigate('Dashboard');
    };

    return (
        <Wrapper backgroundColor={Colors.black}>
            <Header showBack={true} showCart={false} />
            <Content>
                <Title title="Estoy listo para comprar." color={Colors.white}/>
                <FormItem label="Nombre de usuario"></FormItem>
                <FormItem label="Contraseña"></FormItem>
                <Button label="ACCEDER" onPress={goToHome} type="white"/>
            </Content>
        </Wrapper>
    );
};