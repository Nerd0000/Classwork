const axios = require('axios');
const generateHex = require('../utils/generateHex');

module.exports = {
    async git(req, res) {
        var dateConsole = new Date();
        var dateReturn = `${dateConsole.getDay()}/${dateConsole.getMonth()}/${dateConsole.getFullYear()} [${dateConsole.getHours()}:${dateConsole.getMinutes()}] - `;

        const GITHUB_AUTH_TOKEN_URL = 'https://github.com/login/oauth/access_token';
        const GITHUB_USER_URL = 'https://api.github.com/user';
        const END_URL = process.env.REACT_APP_URL_FRONT;
        const CLIENT_ID = process.env.REACT_APP_GH_BASIC_CLIENT_ID;
        const SECRET_ID = process.env.REACT_APP_GH_BASIC_SECRET_ID;
        const STATE_APP = req.query.state;
        const CODE = req.query.code;
        const SCOPE = "repo, user";

        var TOKEN = '';
        var USER = '';
        var NEED_PASSWORD = true;
        var ERROR = false;
        var GOTOPROFILE = false;

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
        }).catch(function(){
            ERROR = true;
            console.log(dateReturn + 'Erro no recebimento do tokken');
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
            console.log(dateReturn + 'Erro no envio do token');
        });

        //Pegar todos os repositórios
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
            USER.repos = JSON.stringify(REPOS);
        }).catch(function(){
            console.log(dateReturn + 'Erro ao pedir repos do usuário do GIT');
        });

        //Checar se existe algum usuário no banco de dados com o msm git_id
        await axios({
            method: 'get',
            url: process.env.REACT_APP_URL_BACK + '/users?git_id=' + USER.id,
            headers: {
                'auth': process.env.REACT_APP_DB_IDENTITY,
            },
        }).then(async function(response){
            GOTOPROFILE = true;
            NEED_PASSWORD = false;
            var git_id = USER.id;
            var repos = REPOS;
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
                USER.urls = JSON.parse(USER.urls);
                USER.classes = JSON.parse(USER.classes);
                USER.teams = JSON.parse(USER.teams);
            }).catch(function(Err){
                ERROR = true;
                console.log(dateReturn + 'Erro ao atualziar repositórios do usuário');
            });
            
        }).catch(async function(response){
            console.log(dateReturn + 'Erro na checagem de usuários');

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
                const repos = USER.repos;
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
                    USER.repos = JSON.parse(USER.repos);
                }).catch(function(err){
                    ERROR = true;
                    console.log(dateReturn + 'Erro na criação do usuário');
                });
            }
        });
        res.status(200).redirect(END_URL+`/git/register?error=${ERROR}&need_password=${NEED_PASSWORD}&user=${JSON.stringify(USER)}&goToProfileCreate=${GOTOPROFILE}`);
    },

    async gitRepos(req, res) {
        var dateConsole = new Date();
        var dateReturn = `${dateConsole.getDay()}/${dateConsole.getMonth()}/${dateConsole.getFullYear()} [${dateConsole.getHours()}:${dateConsole.getMinutes()}] - `;
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
            console.log(dateReturn + 'Erro ao pedir repos do usuário do GIT');
        });

        res.status(200).json(USER);
    },
}