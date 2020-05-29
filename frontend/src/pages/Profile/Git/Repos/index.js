import React, { useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";

import HeaderAuth from '../../../../components/headerAuth';
import IconsLanguage from '../../../../components/iconsLanguage';

import axios from 'axios';
import api from '../../../../services/api';

import checkIfIsAuthenticated from '../../../../utils/checkIfIsAuthenticated';


export default function Profile(){
    const history = useHistory();
    const location = useLocation();

    const [canTry, setCanTry] = useState(true);
    const [reposGitHub, setReposGitHub] = useState([]);
    const [loading, setLoading] = useState(false);
    const [commitsMax, setCommitsMax] = useState("Carregando...");
    const [loadCount, setLoadCount] = useState(0);

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
            description = "Sem descrição";
        }

        return (<li key={item.id}><button className={(sessionStorage.getItem('token') != null)? "shadow-theme-lit":"shadow-theme-lit-red"} onClick={() => {
            if(sessionStorage.getItem('token') != null){getCommits(item.commits_url)}}
        }>
        <div>
            <h3 className={(sessionStorage.getItem('token') != null)? "repos-name":"repos-name-red"}>{name}</h3>
            <h4 className={(sessionStorage.getItem('token') != null)? "repos-description":"repos-description-red"}>{description}</h4>
        </div>
        <div className="repos-div-language">
            <IconsLanguage name={item.language} size={25}/>
            <h5 className="repos-language">{item.language}</h5>
        </div>
        </button>
        </li>);
    })

    async function getReposGitHub(){
        var reposUser = JSON.parse(sessionStorage.getItem('user')).repos;
        
        if(reposUser != null && canTry){
            setCanTry(false);
            setReposGitHub(reposUser);
        }else if(canTry) {
            setCanTry(false);
            setReposGitHub([]);
        }
    }

    async function getCommits(url){
        setLoading(true);
        var _loadCount = loadCount + 1; 
        setLoadCount(loadCount + 1);
        const REPOS_NAME = url.split('/')[5];
        var ACTION_CHECK = sessionStorage.getItem('actions@'+REPOS_NAME);
        if(ACTION_CHECK == null){
            const TOKEN = sessionStorage.getItem('token');

            var NEW = false;
            var url_id = url.replace('/commits{/sha}','');
            var id_rep = -1;
            await axios.get(url_id, {
                headers: {
                    'Authorization': 'token ' + TOKEN
                }
            }).then(function(res){
                id_rep = Number(res.data.id);
            }).catch(function(res){
                console.log("Erro inesperado...");
            });

            const ACTIONS = {
                shas: [],
                commits: [],
                rank: [],
            };

            await api({
                method: 'get',
                url: `/actions/isValidId?id_rep=${id_rep}&id_auth=${JSON.parse(sessionStorage.getItem('user')).id_auth}` ,
                headers: {
                    'auth': process.env.REACT_APP_DB_IDENTITY,
                },
            }).then(function(retu){
                NEW = !retu.data.isValid;
            }).catch(function(){});

            url = url.replace('{/sha}','');

            await axios.get(url, {
                headers: {
                    'Authorization': 'token ' + TOKEN
                }
            }).then(async function(res){
                var rank_void = true;
                var rank_index = 0;
                setCommitsMax(res.data.length);
                for(var k in res.data){
                    ACTIONS.shas[k] = res.data[k].sha;
                    
                    const com = await axios.get(url + '/' + ACTIONS.shas[k], {
                        headers: {
                            'Authorization': 'token ' + TOKEN
                        }
                    })
                    
                    var FILES = Object.values(com.data)[10];
                    
                    for(var x in FILES){
                        FILES[x] = {
                            filename: FILES[x].filename,
                            status:  FILES[x].status,
                            additions: FILES[x].additions,
                            deletions: FILES[x].deletions,
                            raw_url: FILES[x].raw_url,
                            changes: FILES[x].changes
                        }
                    }

                    ACTIONS.commits[k] = {
                        author: Object.values(com.data)[6].login,
                        author_avatar: Object.values(com.data)[6].avatar_url,
                        date: Object.values(com.data)[2].author.date,
                        stats: Object.values(com.data)[9],
                        message: Object.values(com.data)[2].message,
                        tree:  Object.values(com.data)[2].tree.url,
                        files: FILES
                    }

                    if(!rank_void){
                        for(var n in ACTIONS.rank){
                            if(ACTIONS.rank[n].name === Object.values(com.data)[6].login){
                                ACTIONS.rank[n].total += Object.values(com.data)[9].total;
                                ACTIONS.rank[n].additions += Object.values(com.data)[9].additions;
                                ACTIONS.rank[n].deletions += Object.values(com.data)[9].deletions;
                                rank_void = false;
                                break;
                            }else{
                                rank_void = true;
                            }   
                        }
                    }else{
                        rank_void = false;
                        ACTIONS.rank[rank_index] = { 
                            name: Object.values(com.data)[6].login,
                            avatar: Object.values(com.data)[6].avatar_url,
                            total: Object.values(com.data)[9].total,
                            additions: Object.values(com.data)[9].additions,
                            deletions: Object.values(com.data)[9].deletions,
                        };
                        rank_index++;
                    }
                }
                var id_auth = JSON.parse(sessionStorage.getItem('user')).id_auth;
                var action = ACTIONS;
                if(NEW){
                    await api({
                        method: 'post',
                        url: `/action/create`,
                        data: {
                            id_auth, 
                            id_rep,
                            action
                        },
                        headers: {
                            'auth': process.env.REACT_APP_DB_IDENTITY,
                        },
                    }).then(function(){}).catch(function(){});
                }else{
                    await api({
                        method: 'post',
                        url: `/action/update`,
                        data: {
                            id_auth, 
                            id_rep,
                            action
                        },
                        headers: {
                            'auth': process.env.REACT_APP_DB_IDENTITY,
                        },
                    }).then(function(){}).catch(function(){});
                }
                sessionStorage.setItem('actions@'+REPOS_NAME, JSON.stringify(ACTIONS));
            }).catch(function(){
                history.push('/error');
            });
        }

        if(location.pathname !== "/error"){
            sessionStorage.setItem('action', REPOS_NAME);
            setLoading(false);
            if(loadCount === _loadCount - 1){
                history.push('/profile/git/repos/commits');
            }
        }else{
            setLoading(false);
        }
    }

    return(
        <div>
            <HeaderAuth title='Repositório'/>
            <div className="div-global-page with-scroll header-is-auth">
                {(sessionStorage.getItem('token') != null)? null:<div className="warning-session-title">
                    <h1>Essa sessão só está disponível com a autenticação do Github</h1>
                </div>}
                <div className={(sessionStorage.getItem('token') != null)? "container-box-list":"container-box-list container-box-list-red"}>
                    <ul>{reposListGitHub}</ul>
                </div>
            </div>
            {loading? <div className="box-alert load-bar shadow-theme">
                    <h3>Carregando dados... Por favor, aguarde. Esse evento pode demorar conforme a quantidade de commits!</h3>
                    <div>
                        <h2>{`Commits: ${commitsMax}`}</h2>
                        <div/>
                    </div>
            </div>:null}
        </div>
    );
}