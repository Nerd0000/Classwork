import React, { useState } from 'react';
import { FaEnvelopeOpenText, FaUnlockAlt } from 'react-icons/fa';
import { Link, useHistory } from 'react-router-dom';

import api from '../services/api';

function Logins(props){
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alertError, setAlertError] = useState(false);

    async function handleUpdateCredentials(e){
        e.preventDefault();
        var id = props.user.git_id;
        var id_auth = props.user.id_auth;

        await api.post(process.env.REACT_APP_URL_BACK + "/user/updateCredentials", {
            email,
            password,
            id,
            id_auth
        },{
            headers: {
                'auth': process.env.REACT_APP_DB_IDENTITY,
            },
        }).then(function(res){
            sessionStorage.removeItem('user');
            sessionStorage.setItem('user', JSON.stringify(res.data));
            sessionStorage.removeItem('need_password');
            sessionStorage.removeItem('error');
            history.push('/sucess');
        }).catch(function(){
            history.push('/error');
        });; 
    }

    async function handleLogin(e){
        e.preventDefault();
        await api.post("/login", {
            email,
            password,
        },{
            headers: {
                'auth': process.env.REACT_APP_DB_IDENTITY,
            },
        }).then(function(res){
            sessionStorage.setItem('user', JSON.stringify(res.data));
            history.push('/profile');
        }).catch(function(){
            setAlertError(true);
        });; 
    }

    function handleChangeEmail(e){
        setEmail(e.target.value);   
    }

    function handleChangePassword(e){
        setPassword(e.target.value);
    }


    switch(props.option){
        case("cadastro"): return(
            <div className="login-box-container"> 
                <h1 className="login-box-title">Atualizar conta</h1>
                {(props.need_password === "true")? <h2 className="red-login-update-warning">
                    <strong>Dados gerados automáticamente:</strong>
                    <br/> [Email] {props.user.email} <br/> [Password] {props.user.password}</h2>:null}
                <form className="login-box" onSubmit={handleUpdateCredentials}>
                    <div className="login-box-input-label">
                        <FaEnvelopeOpenText size={25} color="rgb(77, 151, 211)"/>
                        <h2 className="login-box-subtitle">Email</h2>
                    </div>
                    <input type="email" className="shadow-theme" name="email" value={email} onChange={handleChangeEmail} required/>
                    <div className="login-box-input-label">
                        <FaUnlockAlt size={24} color="rgb(77, 151, 211)"/>
                        <h2 className="login-box-subtitle">Senha</h2>
                    </div>
                    <input type="password" className="shadow-theme" name="password" value={password} onChange={handleChangePassword} required/>
                    <div className="login-box-button-container">
                        <div className="login-box-button shadow-theme">
                            <button type="submit"><h3>Enviar</h3></button>
                        </div>
                        <div className="login-box-button red-login shadow-theme-red">
                            <Link to="/profile"><h3>Manter os dados atuais</h3></Link>
                        </div>
                    </div>
                </form>
            </div>
        );

        default: return(
            <div className="login-box-container"> 
                <h1 className="login-box-title">Entrar com Classwork</h1>
                <form className="login-box" onSubmit={handleLogin}>
                    <div className="login-box-input-label">
                        <FaEnvelopeOpenText size={25} color="rgb(77, 151, 211)"/>
                        <h2 className="login-box-subtitle">Email</h2>
                    </div>
                    <input type="email" className="shadow-theme" name="email" value={email} onChange={handleChangeEmail} required/>
                    <div className="login-box-input-label">
                        <FaUnlockAlt size={24} color="rgb(77, 151, 211)"/>
                        <h2 className="login-box-subtitle">Senha</h2>
                    </div>
                    <input type="password" className="shadow-theme" name="password" value={password} onChange={handleChangePassword} required/>
                    <div className="login-box-button-container">
                        <div className="login-box-button shadow-theme">
                            <button type="submit"><h3>Entrar</h3></button>
                        </div>
                        <div className="login-box-button shadow-theme">
                            <Link to="/help"><h3>Como crio uma conta?</h3></Link>
                        </div>
                    </div>
                </form>
                {alertError? <div className="box-alert box-alert-login shadow-theme-red">
                    <h3>Erro inesperado, por favor, cheque sua conexão e dados informados.</h3>
                    <button onClick={() => {
                        setAlertError(false);
                    }}>X</button>
                </div>:null}
            </div>
        );
    }
}

export default Logins;