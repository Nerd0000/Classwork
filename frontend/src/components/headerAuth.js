import React, { useState } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { Link, useHistory, useLocation } from 'react-router-dom';

import Icons from './icons';

import logoutGit from '../utils/logout';

function HeaderAuth(props){
    const history = useHistory();
    const location = useLocation();

    const [expanded, setExpanded] = useState(false);
    const [gitHub, setGitHub] = useState([]);
    const [canTry, setCanTry] = useState(true);

    var user = JSON.parse(sessionStorage.getItem('user'));

    getGitHubUrls();

    var listGitHub = gitHub.map(function(item) {
        return (<li key={item.id}><button 
        onClick={() => {openUrl(item.route)}}
        className="div-item-expansive-list-button">
        {item.name}<Icons name={item.icon} size={25} color="white"/></button>
        </li>);
    })

    async function getGitHubUrls(){
        if(canTry){
            setCanTry(false);
            setGitHub(user.urls);
        }
    }

    function openUrl(route){
        history.push(route);
    }

    function expand(){
        setExpanded(!expanded);
    }

    //console.clear();

    return(
        <div> 
            <div className="div-header-container">
                <button onClick={() => {expand()}} className="second-div-header-container ajust-second-header button-expand">
                    {expanded? <FaChevronLeft size={25}/>:<FaChevronRight size={25}/>}
                </button>
                <div className="div-user-names">
                <h1 className="header-title">{props.title}</h1>
                </div>
            </div>
            <div className="div-header"></div>
            <div className="expansive-lateral" style={{left: expanded? '0':'-30vw'}}>
                <div className="expansive-box">
                    <Link to="/profile" className="expansive-box-perfil shadow-theme">
                        <img src={user.avatar} alt="Classwork Avatar"/>
                        <div className="expansive-box-perfil-div">
                            <h3 className="header-title user-real-name">{user.real_name}</h3>
                            <h5 className="header-title user-name">{user.name}</h5>
                        </div>
                    </Link>
                    <div className="div-item-expansive-list with-scroll expansive shadow-theme-scroll">
                        <ul className="shadow-theme"><h3>Classwork</h3></ul>
                        <ul className="shadow-theme"><h3>GitHub</h3>{listGitHub}</ul>

                        <ul className="shadow-theme"><h3>Opções</h3><li>

                        <Link to="/profile/register" className="div-item-expansive-list-button">
                            Alterar Credenciais<Icons name="user-lock" size={25} color="white"/></Link>

                            <button onClick={() => {
                                logoutGit(sessionStorage, history, location);
                            }} className="div-item-expansive-list-button red">
                            Sair<Icons name="exit" size={25} color="white"/></button>

                        </li></ul>
                    </div>
                </div>
                <button onClick={() => {expand()}} className="second-div-header-container ajust-second-header button-expand full">
                    {expanded? <FaChevronLeft size={25}/>:<FaChevronRight size={25}/>}
                </button>
            </div>
        </div>
    );
}

export default HeaderAuth;