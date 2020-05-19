import React, { useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";

import HeaderAuth from '../../../../components/headerAuth';
import IconsLanguage from '../../../../components/iconsLanguage';

import axios from 'axios';

import checkIfIsAuthenticated from '../../../../utils/checkIfIsAuthenticated';


export default function Profile(){
    const history = useHistory();
    const location = useLocation();

    const [canTry, setCanTry] = useState(true);
    const [reposGitHub, setReposGitHub] = useState([]);
    const [loading, setLoading] = useState(false);

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

        return (<li key={item.id}><button className="shadow-theme-lit" onClick={() => {getCommits(item.commits_url)}}>
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
        const REPOS_NAME = url.split('/')[5];
        var ACTION_CHECK = sessionStorage.getItem('actions@'+REPOS_NAME);

        if(ACTION_CHECK == null){
            const TOKEN = sessionStorage.getItem('token');
            const ACTIONS = {
                shas: [],
                commits: [],
                rank: [],
            };

            url = url.replace('{/sha}','');

            await axios.get(url, {
                headers: {
                    'Authorization': 'token ' + TOKEN
                }
            }).then(async function(res){
                var rank_void = true;
                var rank_index = 0;
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
                            changes: FILES[x].changes
                        }
                    }

                    ACTIONS.commits[k] = {
                        author: Object.values(com.data)[6].login,
                        author_avatar: Object.values(com.data)[6].avatar_url,
                        stats: Object.values(com.data)[9],
                        message: Object.values(com.data)[2].message,
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
            }).catch(function(){
                history.push('/error');
            });
            sessionStorage.setItem('actions@'+REPOS_NAME, JSON.stringify(ACTIONS));
        }
        sessionStorage.setItem('action', REPOS_NAME);
        setLoading(false);
        history.push('/profile/git/repos/commits');
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
            {loading? <div className="box-alert shadow-theme">
                    <h3>Carregando dados... Por favor, aguarde. Esse evento pode demorar conforme o tamanho do seu repositório!</h3>
            </div>:null}
        </div>
    );
}