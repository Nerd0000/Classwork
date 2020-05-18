import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import checkIfIsAuthenticated from '../../utils/checkIfIsAuthenticated';

import HeaderAuth from '../../components/headerAuth';

export default function ErrorStatus(){
    const history = useHistory();
    const location = useLocation();

    checkIfIsAuthenticated(sessionStorage, history, location);

    return(
            <div>
                <HeaderAuth title="Sucesso"/>
                <div className="div-global-page with-scroll header-is-auth">
                    <div className="div-introduction-title">
                        <h1>Oba!!! Deu certo!!!</h1>
                        <h2>Sua operação foi realizada com sucesso!!! </h2>
                    </div>
                    <div className="div-alt">
                        <div className="alt-login-container enter no-icon shadow-theme">
                            <Link to="/">
                                <h3>Obrigado</h3>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
}
