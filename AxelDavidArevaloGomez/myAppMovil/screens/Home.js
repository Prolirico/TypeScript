import{Content, Header, Wrapper} from '../components/layout';
import FormItem from '../components/controls/FormItem';

export default function Home(){
    return(
        <Wrapper>
            <Header title="Dashboard"/>
            <Content>
                <FormItem label="Nombre"/>
                <FormItem label="Código"/>
                <FormItem label="Estatus"/>
            </Content>
        </Wrapper>
    );
}