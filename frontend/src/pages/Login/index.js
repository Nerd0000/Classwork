import React from 'react';
import { FaGithubAlt, FaUsers } from 'react-icons/fa';
import { useLocation, useHistory } from 'react-router-dom';

import Header from '../../components/header';
import Logins from '../../components/logins'

import queryToStorage from '../../utils/queryToStorage';
import checkIfIsAuthenticated from '../../utils/checkIfIsAuthenticated';


export default function Login(){
    const history = useHistory();
    const location = useLocation();
    const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
    const CLIENT_ID = process.env.REACT_APP_GH_BASIC_CLIENT_ID;
    const STATE_APP = process.env.REACT_APP_STATE;
    const URL = `${GITHUB_AUTH_URL}?client_id=${CLIENT_ID}&state=${STATE_APP}&redirect_uri=http://localhost:3333/git&scope=user%20repo`;

    queryToStorage(sessionStorage, history, location, 'user', 'error');

    if(sessionStorage.getItem('error') === "true"){
        sessionStorage.removeItem('user');
        alert("Dados incorretos!");
        sessionStorage.removeItem('error');
    }

    checkIfIsAuthenticated(sessionStorage, history, location);

    return( 
        <div>
            <Header/>
            <div className="div-global-page-dooble">
                <div className="div-global-page">
                    <div className="div-introduction-title">
                        <h1>Já possui conta no Github?</h1>
                        <h2>O que está esperando? Entre com uma agora mesmo e procure sua turma!</h2>
                    </div>
                    <div className="div-alt">
                        <div className="alt-login-container git shadow">
                            <a href={URL}>
                                <FaGithubAlt size={35}/>
                                <h3>Entrar com Github</h3>
                            </a>
                        </div>
                    </div>
                    <Logins/>
                </div>
                <div className="div-global-page-2">
                    <FaUsers size={350}/>
                </div>
            </div>
        </div>
    );
}