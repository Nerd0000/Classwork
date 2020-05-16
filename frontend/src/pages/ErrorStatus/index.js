import React from 'react';
import { FaHeartBroken } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import Header from '../../components/header';

export default function ErrorStatus(){
    return(
            <div>
                <Header/>
                <div className="div-global-page with-scroll">
                    <div className="div-introduction-title">
                        <h1>Tsc... Ocorreu um erro inesperado.</h1>
                        <h2>Por favor, se acontecer novamente siga essas etapas: </h2>
                    </div>
                    <div className="div-alt">
                        <div className="alt-login-container enter shadow-theme">
                            <Link to="/">
                                <FaHeartBroken size={35}/>
                                <h3>Ok, tudo bem</h3>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
}
