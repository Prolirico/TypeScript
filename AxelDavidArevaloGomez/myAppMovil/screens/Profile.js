import FormItem from '../components/controls/FormItem';
import {Content, Header, Wrapper} from '../components/layout';

export default function Profile(){
    return(
        <Wrapper>
            <Header title="Perfil" showBack={true}/>
            <Content>
                <FormItem label={"Correo Electronico"}/>
                <FormItem label={"Nombre Completo"}/>
                <FormItem label={"Telefono"}/>
            </Content>
        </Wrapper>
    )
}