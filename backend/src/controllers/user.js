const connection = require('../database/connection');
const internalSecurity = require('../utils/internalSecurity');
const generateHex = require('../utils/generateHex');

module.exports = {
    async create(req, res) {
        var dateConsole = new Date();
        var dateReturn = `${dateConsole.getDay()}/${dateConsole.getMonth()}/${dateConsole.getFullYear()} [${dateConsole.getHours()}:${dateConsole.getMinutes()}] - `;

        const {git_id, name, real_name, type, avatar, password, id_auth, email } = req.body;
        var urls = JSON.stringify(req.body.urls);
        var classes = JSON.stringify(req.body.classes);
        var teams = JSON.stringify(req.body.teams);
        var repos = JSON.stringify(req.body.repos);
        const {auth} = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            console.log(dateReturn + `New user created!`);
            await connection('users').insert({
                email,
                id_auth,
                git_id,
                name,
                real_name,
                type,
                password,
                avatar,
                classes,
                teams,
                repos,
                urls
            });
            return res.status(201).json(req.body);
        }else{
            console.log(dateReturn + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                "message": "Request não autorizado!",
                "origin": "Internal security",
            });
        }
    },
    async list(req, res) {
        var dateConsole = new Date();
        var dateReturn = `${dateConsole.getDay()}/${dateConsole.getMonth()}/${dateConsole.getFullYear()} [${dateConsole.getHours()}:${dateConsole.getMinutes()}] - `;

        var queryId = req.query.id;
        var queryGitId = req.query.git_id;

        var users = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            if(queryId != null){
                users = await connection('users').select('*').where("id", queryId).first();

                if(users == null){
                    console.log(dateReturn + `User [${queryId}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                users.urls = JSON.parse(users.urls);
                users.classes = JSON.parse(users.classes);
                users.teams = JSON.parse(users.teams);
                console.log(dateReturn + `User [${queryId}] listed!`);
            }else if(queryGitId != null){
                users = await connection('users').select('*').where("git_id", queryGitId).first();

                if(users == null){
                    console.log(dateReturn + `User [${queryGitId}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                users.urls = JSON.parse(users.urls);
                users.classes = JSON.parse(users.classes);
                users.repos = JSON.parse(users.repos);
                users.teams = JSON.parse(users.teams);
                console.log(dateReturn + `Git user [${queryGitId}] listed!`);
            }else{
                users = await connection('users').select('*');
                for(var i in users){
                    users[i].repos = JSON.parse(users[i].repos);
                    users[i].urls = JSON.parse(users[i].urls);
                    users[i].classes = JSON.parse(users[i].classes);
                    users[i].teams = JSON.parse(users[i].teams);
                }
            }
            console.log(dateReturn + `Users listed!`);
            return res.status(202).json(users);
        }else{
            console.log(dateReturn + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    },
    async delete(req, res) {
        var dateConsole = new Date();
        var dateReturn = `${dateConsole.getDay()}/${dateConsole.getMonth()}/${dateConsole.getFullYear()} [${dateConsole.getHours()}:${dateConsole.getMinutes()}] - `;

        const queryId = req.query.id;
        const queryAuth = req.query.id_auth;

        var users = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            if(queryId != null){
                users = await connection('users').select('*').where("id", queryId).andWhere("id_auth", queryAuth).first();
                if(users == null){
                    console.log(dateReturn + `User [${queryId}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                await connection('users').select('*').where("id", queryId).first().delete();
                console.log(dateReturn + `User [${queryId}] deleted!`);
                users.urls = JSON.parse(users.urls);
                users.classes = JSON.parse(users.classes);
                users.teams = JSON.parse(users.teams);
                users.repos = JSON.parse(users.repos);
                return res.status(200).json(users);
            }else{
                console.log(dateReturn + `User [${queryId}] is not defined!`);
                return res.status(404).json({
                    "message": "Operação inválida",
                    "origin": "Database",
                });
            }
        }else{
            console.log(dateReturn + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    },
    async update(req, res) {
        var dateConsole = new Date();
        var dateReturn = `${dateConsole.getDay()}/${dateConsole.getMonth()}/${dateConsole.getFullYear()} [${dateConsole.getHours()}:${dateConsole.getMinutes()}] - `;
        
        const {git_id, name, real_name, type, avatar, password, email} = req.body;
        var urls = JSON.stringify(req.body.urls);
        var classes = JSON.stringify(req.body.classes);
        var teams = JSON.stringify(req.body.teams);
        var repos = JSON.stringify(req.body.repos);

        const queryId = req.query.id;

        var users = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            if(queryId != null){
                users = await connection('users').select('*').where("id", queryId).first();
                if(users == null){
                    console.log(dateReturn + `User [${queryId}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                await connection('users').select('*').where("id", queryId).update({
                    email,
                    git_id,
                    name,
                    real_name,
                    type,
                    password,
                    avatar,
                    classes,
                    teams,
                    repos,
                    urls
                });

                users.urls = JSON.parse(users.urls);
                users.classes = JSON.parse(users.classes);
                users.teams = JSON.parse(users.teams);
                users.repos = JSON.parse(users.repos);
                console.log(dateReturn + `User [${queryId}] updated!`);

                return res.status(200).redirect(process.env.REACT_APP_URL_FRONT+'/profile');
            }else{
                console.log(dateReturn + `User [${queryId}] is not defined!`);
                return res.status(404).json({
                    "message": "Operação inválida",
                    "origin": "Database",
                });
            }
        }else{
            console.log(dateReturn + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    },
    async updateCredentials(req, res) {
        const END_URL = process.env.REACT_APP_URL_FRONT;

        var dateConsole = new Date();
        var dateReturn = `${dateConsole.getDay()}/${dateConsole.getMonth()}/${dateConsole.getFullYear()} [${dateConsole.getHours()}:${dateConsole.getMinutes()}] - `;
        
        var { id, id_auth, email, password } = req.body;
        var users = null;

        if(id != null){
            users = await connection('users').select('*').where("git_id", id).andWhere("id_auth", id_auth).first();
            if(users == null){
                console.log(dateReturn + `User [${id}] is not defined!`);
                return res.status(404).redirect(END_URL+`/git/register?error=${true}&need_password=${false}`);
            }
            await connection('users').select('*').where("git_id", id).update({
                email,
                password,
            });

            users.urls = JSON.parse(users.urls);
            users.classes = JSON.parse(users.classes);
            users.teams = JSON.parse(users.teams);
            users.repos = JSON.parse(users.repos);
            console.log(dateReturn + `User [${id}] updated!`);

            return res.status(200).redirect(END_URL+`/git/register?error=${false}&need_password=${false}&goToProfile=true`);
        }else{
            console.log(dateReturn + `User [${id}] is not defined!`);
            return res.status(404).redirect(END_URL+`/git/register?error=${true}&need_password=${false}`);
        }
    },
    async updateRepos(req, res) {
        var dateConsole = new Date();
        var dateReturn = `${dateConsole.getDay()}/${dateConsole.getMonth()}/${dateConsole.getFullYear()} [${dateConsole.getHours()}:${dateConsole.getMinutes()}] - `;
        
        const { git_id } = req.body;
        var repos = JSON.stringify(req.body.repos);

        var users = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            if(git_id != null){
                users = await connection('users').select('*').where("git_id", git_id).first();
                if(users == null){
                    console.log(dateReturn + `User [${git_id}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                await connection('users').select('*').where("git_id", git_id).update({
                    repos,
                });

                users.repos = JSON.parse(repos);
                console.log(dateReturn + `User [${git_id}] updated!`);
                return res.status(200).json(users);
            }else{
                console.log(dateReturn + `User [${git_id}] is not defined!`);
                return res.status(404).json({
                    "message": "Operação inválida",
                    "origin": "Database",
                });
            }
        }else{
            console.log(dateReturn + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    },
}