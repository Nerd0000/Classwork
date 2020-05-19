const axios = require('axios');
const generateHex = require('../utils/generateHex');
const dateReturn = require('../utils/dateReturn');

module.exports = {
    async git(req, res) {
        const GITHUB_AUTH_TOKEN_URL = 'https://github.com/login/oauth/access_token';
        const GITHUB_USER_URL = 'https://api.github.com/user';
        const END_URL = process.env.REACT_APP_URL_FRONT;
        const CLIENT_ID = process.env.REACT_APP_GH_BASIC_CLIENT_ID;
        const SECRET_ID = process.env.REACT_APP_GH_BASIC_SECRET_ID;
        const STATE_APP = req.query.state;
        const CODE = req.query.code;
        const SCOPE = "repo, user";

        var NEW = false;
        var TOKEN = '';
        var USER = '';
        var NEED_PASSWORD = true;
        var ERROR = false;

        //Pegar o token do Git
        await axios(
            {
                url: GITHUB_AUTH_TOKEN_URL,
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-OAuth-Scopes': SCOPE,
                },
                data: {
                    'client_id': CLIENT_ID,
                    'client_secret': SECRET_ID,
                    'state': STATE_APP,
                    'code': CODE,
                }
            }
        ).then(function(response){
            TOKEN = response.data.access_token;
            console.log(TOKEN); //I need :)
        }).catch(function(){
            ERROR = true;
            console.log(dateReturn() + 'Error in get code from token');
        });

        //Pedir dados do usuário para o git
        await axios(
            {   
                method: 'get',
                url: GITHUB_USER_URL,
                headers: {
                    'Authorization': 'token ' + TOKEN,
                    'X-OAuth-Scopes': SCOPE,
                },
            }
        ).then(function(response){
            USER = response.data;
        }).catch(function(){
            ERROR = true;
            console.log(dateReturn() + 'Error in send token');
        });

        //Pegar todos os repositórios
        var REPOS = {
            data: []
        };
        var REPOS_ALL = [];

        await axios(
            {   
                method: 'get',
                url: USER.repos_url,
                headers: {
                    'Authorization': 'token ' + TOKEN
                },
                data: {
                    type: 'all',
                }
            }
        ).then(function(response){
            for(var i in response.data){
                REPOS.data[i] = {
                    id: response.data[i].id,
                    name: response.data[i].name,
                    description: response.data[i].description,
                    language: response.data[i].language,
                    private: response.data[i].private,
                    commits_url: response.data[i].commits_url,
                    size: response.data[i].size
                }
            }
            REPOS_ALL = REPOS.data;
        }).catch(function(err){
            console.log(dateReturn() + 'Error in get repos');
        });

        //Checar se existe algum usuário no banco de dados com o msm git_id
        await axios({
            method: 'get',
            url: process.env.REACT_APP_URL_BACK + '/users?git_id=' + USER.id,
            headers: {
                'auth': process.env.REACT_APP_DB_IDENTITY,
            },
        }).then(async function(){
            NEED_PASSWORD = false;
            var git_id = USER.id;
            var repos = REPOS_ALL;
            await axios({
                method: 'post',
                url: process.env.REACT_APP_URL_BACK + '/user/updateRepos',
                data: {
                    git_id,
                    repos
                },
                headers: {
                    'auth': process.env.REACT_APP_DB_IDENTITY,
                },
            }).then(function(response){
                NEED_PASSWORD = true;
                USER = response.data;
            }).catch(function(err){
                ERROR = true;
                console.log(err);
                console.log(dateReturn() + 'Error in update repos');
            });
            
        }).catch(async function(){
            console.log(dateReturn() + 'Checking user');

            //Criar se não existir
            if(USER.id != null){
                const git_id = USER.id;
                const name = USER.login;
                const real_name = USER.name;
                const type = "User";
                const avatar = USER.avatar_url;
                const email =  USER.login + "@classwork.com";
                const password = "User@" + generateHex();
                const id_auth = generateHex();
                const repos = REPOS_ALL;
                const urls = [
                    {
                        id: 1,
                        name: 'Perfil',
                        route: '/profile',
                        url: USER.url,
                        icon: 'user-circle'
                    },
                    {
                        id: 2,
                        name: 'Repositórios',
                        route: '/profile/git/repos',
                        url: USER.repos_url,
                        icon: 'folder-open'
                    },
                ];

                await axios({
                    method: 'post',
                    url: process.env.REACT_APP_URL_BACK + '/user/create',
                    data: {
                        id_auth,
                        git_id, 
                        name, 
                        real_name, 
                        type, 
                        avatar, 
                        password,
                        email,
                        urls,
                        repos
                    },
                    headers: {
                        'auth': process.env.REACT_APP_DB_IDENTITY,
                    },
                }).then(function(response){
                    NEED_PASSWORD = true;
                    USER = response.data; 
                    NEW = true;
                }).catch(function(){
                    ERROR = true;
                    console.log(dateReturn() + 'Error in create user');
                });
            }
        });

        if(NEW){
            return res.status(200).redirect(END_URL+`/profile/register?token=${TOKEN}&error=${ERROR}&need_password=${NEED_PASSWORD}&user=${JSON.stringify(USER)}`);
        }else{
            return res.status(200).redirect(END_URL+`/profile?token=${TOKEN}&user=${JSON.stringify(USER)}`);
        }
    },

    async gitRepos(req, res) {
        var { USER } = req.body;

        var REPOS = [];
        await axios(
            {   
                method: 'get',
                url: USER.repos_url,
                headers: {
                    'Authorization': 'token ' + TOKEN
                },
                data: {
                    type: 'all',
                }
            }
        ).then(function(response){
            for(var i in response.data){
                REPOS[i] = {
                    id: response.data[i].id,
                    name: response.data[i].name,
                    description: response.data[i].description,
                    language: response.data[i].language,
                    private: response.data[i].private,
                    commits_url: response.data[i].commits_url,
                    size: response.data[i].size
                }
            }
            USER.repos = REPOS;
        }).catch(function(){
            console.log(dateReturn() + 'Error in update token');
        });

        res.status(200).json(USER);
    },
}