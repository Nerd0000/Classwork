import React from 'react';
import { useHistory, useLocation } from "react-router-dom";

import HeaderAuth from '../../components/headerAuth';

import checkIfIsAuthenticated from '../../utils/checkIfIsAuthenticated';
import queryToStorage from '../../utils/queryToStorage';

export default function Profile(){
    const history = useHistory();
    const location = useLocation();

    queryToStorage(sessionStorage, history, location, 'user', 'token');
    checkIfIsAuthenticated(sessionStorage, history, location);

    return(
        <div>
            <HeaderAuth title='Perfil'/>
            <div className="div-global-page with-scroll header-is-auth">
                <div className="div-introduction-title">
                    <h1>Não sabe por onde começar seu dia?</h1>
                    <h2>Nem eu.</h2>
                </div>
            </div>
        </div>
    );
}