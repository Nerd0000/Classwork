import React, { useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";

import HeaderAuth from '../../../../components/headerAuth';
import IconsLanguage from '../../../../components/iconsLanguage';

import repos from '../../../../json/gitInfo/repos';
///import api from '../../../../services/api';
import checkIfIsAuthenticated from '../../../../utils/checkIfIsAuthenticated';


export default function Profile(){
    const history = useHistory();
    const location = useLocation();

    const [canTry, setCanTry] = useState(true);
    const [reposGitHub, setReposGitHub] = useState([]);

    getReposGitHub();
    checkIfIsAuthenticated(sessionStorage, history, location);

    var reposListGitHub = reposGitHub.map(function(item) {
        var namePart = item.name.split('-');

        var description = item.description;
        var name = '';

        for(var i in namePart){
            if(i >= namePart.length - 1){
                name += namePart[i];
            }else{
                name += namePart[i] + ' ';
            }
        }

        if(name.length > 24){
            name = name.substr(0, 24) + '...';
        }

        if(description === null || description === ""){
            description="Sem descrição"
        }

        return (<li key={item.id}><button className="shadow-theme-lit">
        <div>
            <h3 className="repos-name">{name}</h3>
            <h4 className="repos-description">{description}</h4>
        </div>
        <div className="repos-div-language">
            <IconsLanguage name={item.language} size={25}/>
            <h5 className="repos-language">{item.language}</h5>
        </div>
        </button>
        </li>);
    })

    async function getReposGitHub(){
        var oldData = repos.items;
        var reposUser = JSON.parse(sessionStorage.getItem('user')).repos;
        
        if(reposUser != null && canTry){
            repos.items = reposUser;

            setCanTry(false);
            setReposGitHub(reposUser);
        }else if(oldData != null && canTry) {
            setCanTry(false);
            setReposGitHub(oldData);
        }
    }

    //console.clear();

    return(
        <div>
            <HeaderAuth title='Repositório'/>
            <div className="div-global-page with-scroll header-is-auth">
                <div className="container-box-list">
                    <ul>{reposListGitHub}</ul>
                </div>
            </div>
        </div>
    );
}