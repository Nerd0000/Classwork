import React from 'react';
import { FaEnvelopeOpenText, FaUnlockAlt } from 'react-icons/fa';

import { Link } from 'react-router-dom';

function Logins(props){
    switch(props.option){
        case("cadastro"): return(
            <form className="login-box-container" action={process.env.REACT_APP_URL_BACK + "/user/updateCredentials"} method="post"> 
                <h1 className="login-box-title">Atualizar conta</h1>
                {(props.need_password === "true")? <h2 className="red-login-update-warning">
                    <strong>Dados gerados automáticamente:</strong>
                    <br/> [Email] {props.user.email} <br/> [Password] {props.user.password}</h2>:null}
                <div className="login-box">
                    <div className="login-box-input-label">
                        <FaEnvelopeOpenText size={25} color="rgb(77, 151, 211)"/>
                        <h2 className="login-box-subtitle">Email</h2>
                    </div>
                    <input type="email" className="shadow-theme" name="email" required/>
                    <div className="login-box-input-label">
                        <FaUnlockAlt size={24} color="rgb(77, 151, 211)"/>
                        <h2 className="login-box-subtitle">Senha</h2>
                    </div>
                    <input type="password" className="shadow-theme" name="password" required/>
                    <input name="id" defaultValue={props.user.git_id} hidden></input>
                    <input name="id_auth" defaultValue={props.user.id_auth} hidden></input>
                    <div className="login-box-button-container">
                        <div className="login-box-button shadow-theme">
                            <button type="submit"><h3>Enviar</h3></button>
                        </div>
                        <div className="login-box-button red-login shadow-theme-red">
                            <Link to="/profile"><h3>Manter os dados atuais</h3></Link>
                        </div>
                    </div>
                </div>
            </form>
        );

        default: return(
            <form className="login-box-container" action={process.env.REACT_APP_URL_BACK + "/login"} method="post"> 
                <h1 className="login-box-title">Entrar com Classwork</h1>
                <div className="login-box">
                    <div className="login-box-input-label">
                        <FaEnvelopeOpenText size={25} color="rgb(77, 151, 211)"/>
                        <h2 className="login-box-subtitle">Email</h2>
                    </div>
                    <input type="email" className="shadow-theme" name="email" required/>
                    <div className="login-box-input-label">
                        <FaUnlockAlt size={24} color="rgb(77, 151, 211)"/>
                        <h2 className="login-box-subtitle">Senha</h2>
                    </div>
                    <input type="password" className="shadow-theme" name="password" required/>
                    <div className="login-box-button-container">
                        <div className="login-box-button shadow-theme">
                            <button type="submit"><h3>Entrar</h3></button>
                        </div>
                        <div className="login-box-button shadow-theme">
                            <Link to="/help/register"><h3>Como crio uma conta?</h3></Link>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default Logins;