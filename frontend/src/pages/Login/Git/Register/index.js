import React from 'react';

import { useLocation, useHistory } from 'react-router-dom';

import Header from '../../../../components/header';
import Logins from '../../../../components/logins';

import queryToStorage from '../../../../utils/queryToStorage';
import checkIfIsAuthenticated from '../../../../utils/checkIfIsAuthenticated';


export default function Login(){
    const history = useHistory();
    const location = useLocation();

    queryToStorage(sessionStorage, history, location, 'user', 'error', 'need_password', 'goToProfile', 'goToProfileCreate');
    checkIfIsAuthenticated(sessionStorage, history, location);

    var need_password = sessionStorage.getItem('need_password');
    var error = sessionStorage.getItem('error');
    var goToProfile = sessionStorage.getItem('goToProfile');
    var goToProfileCreate = sessionStorage.getItem('goToProfileCreate');

    if(error === true){
        history.push('/error');
    }else if(goToProfile === "true"){
        sessionStorage.removeItem('need_password');
        sessionStorage.removeItem('error');
        sessionStorage.removeItem('goToProfile');
        sessionStorage.removeItem('goToProfileCreate');

        history.push('/profile');
    }else if(goToProfileCreate === "true"){
        sessionStorage.removeItem('need_password');
        sessionStorage.removeItem('error');
        sessionStorage.removeItem('goToProfile');
        sessionStorage.removeItem('goToProfileCreate');

        history.push('/profile');
    }  

    return( 
        <div>
            <Header/>
            <div className="div-global-page">
                <div className="div-introduction-title">
                    <h1>Atualize sua conta facilmente!</h1>
                    <h2>Informe um email e uma senha para sua conta Classwork</h2>
                </div>
                <div className="div-alt">
                    <Logins option="cadastro" need_password={need_password} user={JSON.parse(sessionStorage.getItem('user'))}/>
                </div>
            </div>
        </div>
    );
}