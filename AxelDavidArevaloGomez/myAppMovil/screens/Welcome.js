import { Content, Wrapper, Title, Logo } from '../components/layout';
import Button from '../components/controls/Button';
import Colors from '../constants/Colors';
import { logoutAuth } from '../services/firebase';
import { ImageBackground, StyleSheet } from 'react-native';

export default function Welcome({ navigation }) {
    const goToLogin = () => {
        navigation.navigate('Login');
    }
    const goToSignUp = () => {
        navigation.navigate('SignUp');
    };


    return (
        <Wrapper backgroundColor={Colors.black}>
            <Content>
                <ImageBackground
                    style={styles.background}
                    source={require('../assets/welcomeBack.png')}
                >
                <Logo type="white" />
                </ImageBackground>
                <Title color={Colors.white} title="Bienvenid@ a Chanel" />
                <Button onPress={goToLogin} label={"YA TENGO CUENTA"} type="white" />
                <Button onPress={goToSignUp} label={"NO TENGO CUENTA"}type="white" style={{ marginTop: 20 }}/>
            </Content>
        </Wrapper>
    );
};

const styles = StyleSheet.create({
    background: {
        marginBottom: 20,
        marginTop: 50,
        width: '100%',
    }
})