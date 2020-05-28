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

    var listSessionAccount = gitHub.map(function(item){
        if(item.session === 'account'){
            return (<li key={item.id}><button 
            onClick={() => {openUrl(item.route)}}
            className="div-item-expansive-list-button">
            {item.name}<Icons name={item.icon} size={25} color="white"/></button>
            </li>);
        }else{
            return null;
        }
    })

    var listSessionClasswork = gitHub.map(function(item){
        if(item.session === 'classwork'){
            return (<li key={item.id}><button 
            onClick={() => {openUrl(item.route)}}
            className="div-item-expansive-list-button">
            {item.name}<Icons name={item.icon} size={25} color="white"/></button>
            </li>);
        }else{
            return null;
        }
    })

    var listSessionRepos = gitHub.map(function(item){
        if(item.session === 'repos'){
            return (<li key={item.id}><button 
            onClick={() => {openUrl(item.route)}}
            className="div-item-expansive-list-button">
            {item.name}<Icons name={item.icon} size={25} color="white"/></button>
            </li>);
        }else{
            return null;
        }
    })

    async function getGitHubUrls(){
        if(canTry){
            setCanTry(false);

            var _urls = [
                {
                    id: 1,
                    name: 'Perfil',
                    route: '/profile',
                    session: 'account',
                    url: user.urls[0],
                    icon: 'user-circle'
                },
                {
                    id: 2,
                    name: 'Notificações',
                    route: '/profile/notifications',
                    session: 'account',
                    url: user.urls[0],
                    icon: 'bell'
                },
                {
                    id: 3,
                    name: 'Configurações',
                    route: '/profile/config',
                    session: 'account',
                    url: user.urls[0],
                    icon: 'cog'
                },
                {
                    id: 1,
                    name: 'Turmas',
                    route: '/class',
                    session: 'classwork',
                    url: user.urls[0],
                    icon: 'chalkboard'
                },
                {
                    id: 2,
                    name: 'Equipes',
                    route: '/classes/teams',
                    session: 'classwork',
                    url: user.urls[0],
                    icon: 'users'
                },
                {
                    id: 3,
                    name: 'Ajuda',
                    route: '/help',
                    session: 'classwork',
                    url: user.urls[0],
                    icon: 'life-ring'
                },
                {
                    id: 1,
                    name: 'Públicos',
                    session: 'repos',
                    route: '/profile/git/repos',
                    url: user.urls[1],
                    icon: 'folder-open'
                },
            ]

            setGitHub(_urls);
        }
    }

    function openUrl(route){
        history.push(route);
    }

    function expand(){
        setExpanded(!expanded);
    }

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
                        <ul className="shadow-theme"><h3>Conta</h3> 
                            {listSessionAccount}
                            {/*<Link to="/profile/register" className="div-item-expansive-list-button">
                            Alterar Credenciais<Icons name="user-lock" size={25} color="white"/></Link>*/}
                        </ul>
                        <ul className="shadow-theme"><h3>Classwork</h3>
                            {listSessionClasswork}
                            <a to="/profile/register" className="div-item-expansive-list-button">
                            Discord<Icons name="discord" size={25} color="white"/></a>
                        </ul>
                        <ul className="shadow-theme"><h3>Repositórios</h3>{listSessionRepos}</ul>
                        <ul className="shadow-theme"><li>
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