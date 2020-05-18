import React from 'react';
import { Link } from 'react-router-dom';

import Header from '../../components/header';

export default function ErrorStatus(){
    return(
            <div>
                <Header/>
                <div className="div-global-page with-scroll">
                    <div className="div-introduction-title">
                        <h1>Dúvidas sobre o Classwork?</h1>
                        <h2>Esperamos que isso te ajude bastante! </h2>
                    </div>
                    <div className="div-alt">
                        <div className="alt-login-container enter no-icon shadow-theme">
                            <Link to="/">
                                <h3>Ok, quero voltar</h3>
                            </Link>
                        </div>
                    </div>
                    <div className="div-introduction-title">
                        <h2>1. Como crio uma conta Classwork?</h2>
                        <h3>Contas Classwork são criadas automáticamente ao fazer login com o github, você poderá configurar a
                        senha e seu email logo após efetuar sua primeira conexão. Caso acabe pulando essa etapa, algo que não remomendamos
                        pois as credenciais automáticas podem deixar sua conta vulnerável, recomendamos que mude o mais rápido possivel
                        acessando as configurações da conta.
                        </h3>
                    </div>
                </div>
            </div>
        );
}
