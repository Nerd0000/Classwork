const connection = require('../database/connection');
const internalSecurity = require('../utils/internalSecurity');
const dateReturn = require('../utils/dateReturn');

module.exports = {
    async login(req, res) {
        const { email, password } = req.body;
        var user = null;

        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            user = await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes','teams','repos','urls']).where("email", email).andWhere("password", password).first();

            if(user == null){
                console.log(dateReturn() + `User credentials is not defined!`);
                return res.status(404).json({
                    "message": "Operação inválida",
                    "origin": "Database",
                });
            }

            user.urls = JSON.parse(user.urls);
            user.classes = JSON.parse(user.classes);
            user.teams = JSON.parse(user.teams);
            user.repos = JSON.parse(user.repos);

            console.log(dateReturn() + `User classwork connected!`);
            return res.status(200).json(user);
        }else{
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    },
    async create(req, res) {
        const {git_id, name, real_name, type, avatar, password, id_auth, email } = req.body;
        var urls = JSON.stringify(req.body.urls);
        var classes = JSON.stringify(req.body.classes);
        var teams = JSON.stringify(req.body.teams);
        var repos = JSON.stringify(req.body.repos);

        const {auth} = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            console.log(dateReturn() + `New user created!`);
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
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                "message": "Request não autorizado!",
                "origin": "Internal security",
            });
        }
    },
    async list(req, res) {
        var queryId = req.query.id;
        var queryGitId = req.query.git_id;

        var users = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            if(queryId != null){
                users = await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes','teams','repos','urls']).where("id", queryId).first();

                if(users == null){
                    console.log(dateReturn() + `User [${queryId}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                users.urls = JSON.parse(users.urls);
                users.classes = JSON.parse(users.classes);
                users.teams = JSON.parse(users.teams);
                users.repos = JSON.parse(users.repos);
                console.log(dateReturn() + `User [${queryId}] listed!`);
            }else if(queryGitId != null){
                users = await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes','teams','repos','urls']).where("git_id", queryGitId).first();

                if(users == null){
                    console.log(dateReturn() + `User [${queryGitId}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                users.urls = JSON.parse(users.urls);
                users.classes = JSON.parse(users.classes);
                users.teams = JSON.parse(users.teams);
                users.repos = JSON.parse(users.repos);
                console.log(dateReturn() + `Git user [${queryGitId}] listed!`);
            }else{
                users = await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes','teams','repos','urls']);
                for(var i in users){
                    users[i].urls = JSON.parse(users[i].urls);
                    users[i].classes = JSON.parse(users[i].classes);
                    users[i].teams = JSON.parse(users[i].teams);
                    users[i].repos = JSON.parse(users[i].repos);
                }
            }
            console.log(dateReturn() + `Users listed!`);
            return res.status(202).json(users);
        }else{
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    },
    async delete(req, res) {
        const queryId = req.query.id;
        const queryAuth = req.query.id_auth;

        var users = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            if(queryId != null){
                users = await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes','teams','repos','urls']).where("id", queryId).andWhere("id_auth", queryAuth).first();
                if(users == null){
                    console.log(dateReturn() + `User [${queryId}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes','teams','repos','urls']).where("id", queryId).first().delete();
                console.log(dateReturn() + `User [${queryId}] deleted!`);
                users.urls = JSON.parse(users.urls);
                users.classes = JSON.parse(users.classes);
                users.teams = JSON.parse(users.teams);
                users.repos = JSON.parse(users.repos);
                return res.status(200).json(users);
            }else{
                console.log(dateReturn() + `User [${queryId}] is not defined!`);
                return res.status(404).json({
                    "message": "Operação inválida",
                    "origin": "Database",
                });
            }
        }else{
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    },
    async update(req, res) {
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
                users = await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes','teams','repos','urls']).where("id", queryId).first();
                if(users == null){
                    console.log(dateReturn() + `User [${queryId}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes','teams','repos','urls']).where("id", queryId).update({
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
                console.log(dateReturn() + `User [${queryId}] updated!`);

                return res.status(200).redirect(process.env.REACT_APP_URL_FRONT+'/profile');
            }else{
                console.log(dateReturn() + `User [${queryId}] is not defined!`);
                return res.status(404).json({
                    "message": "Operação inválida",
                    "origin": "Database",
                });
            }
        }else{
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    },
    async updateCredentials(req, res) {
        var { id, id_auth, email, password } = req.body;
        
        var users = null;

        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            if(id != null){
                users = await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes','teams','repos','urls']).where("git_id", id).andWhere("id_auth", id_auth).first();
                if(users == null){
                    console.log(dateReturn() + `User [${id}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes','teams','repos','urls']).where("git_id", id).update({
                    email,
                    password,
                });

                users.urls = JSON.parse(users.urls);
                users.classes = JSON.parse(users.classes);
                users.teams = JSON.parse(users.teams);
                users.repos = JSON.parse(users.repos);

                console.log(dateReturn() + `User [${id}] updated!`);

                return res.status(200).json(users);
            }else{
                console.log(dateReturn() + `User [${id}] is not defined!`);
                return res.status(404).json({
                    "message": "Operação inválida",
                    "origin": "Database",
                });
            }
        }else{
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    },
    async updateRepos(req, res) {
        const { git_id } = req.body;
        var repos = JSON.stringify(req.body.repos);

        var users = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            if(git_id != null){
                users = await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes','teams','repos','urls']).where("git_id", git_id).first();
                if(users == null){
                    console.log(dateReturn() + `User [${git_id}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                
                await connection('users').select(['git_id','id_auth','type','real_name','name','avatar','classes','teams','repos','urls']).where("git_id", git_id).update({
                    repos,
                });

                users.urls = JSON.parse(users.urls);
                users.classes = JSON.parse(users.classes);
                users.teams = JSON.parse(users.teams);
                users.repos = JSON.parse(users.repos);

                console.log(dateReturn() + `User [${git_id}] updated!`);
                return res.status(200).json(users);
            }else{
                console.log(dateReturn() + `User [${git_id}] is not defined!`);
                return res.status(404).json({
                    "message": "Operação inválida",
                    "origin": "Database",
                });
            }
        }else{
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    },

}