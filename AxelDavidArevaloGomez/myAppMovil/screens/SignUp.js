import { useState } from 'react';
import { Content, Header, Wrapper, Title } from '../components/layout';
import Button from '../components/controls/Button';
import FormItem from '../components/controls/FormItem';
import Colors from '../constants/Colors';
import { registerEmailPass } from '../services/firebase';

export default function SignUp({ navigation }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!fullName || !email || !password || !confirmPassword) {
            alert('Por favor, complete todos los campos');
            return;
        }

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        const user = {
            full_name: fullName,
            email: email,
            password: password
        };

        const success = await registerEmailPass(user);
        setLoading(false);

        if (success) {
            navigation.replace('Dashboard');
        }
    };

    return (
        <Wrapper backgroundColor={Colors.black}>
            <Header showBack={true} showCart={false} />
            <Content>
                <Title title="Crear nueva cuenta" color={Colors.white}/>
                <FormItem 
                    label="Nombre y apellidos" 
                    value={fullName}
                    onChange={(value) => setFullName(value)}
                />
                <FormItem 
                    label="Correo electrónico" 
                    value={email}
                    keyboardType="email-address"
                    onChange={(value) => setEmail(value)}
                />
                <FormItem 
                    label="Contraseña" 
                    value={password}
                    secure={true}
                    onChange={(value) => setPassword(value)}
                />
                <FormItem 
                    label="Repetir contraseña" 
                    value={confirmPassword}
                    secure={true}
                    onChange={(value) => setConfirmPassword(value)}
                />
                <Button 
                    label="REGISTRARSE" 
                    onPress={handleSignUp} 
                    type="white"
                    isLoading={loading}
                />
            </Content>
        </Wrapper>
    );
};