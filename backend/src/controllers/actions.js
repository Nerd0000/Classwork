const connection = require('../database/connection');
const internalSecurity = require('../utils/internalSecurity');
const dateReturn = require('../utils/dateReturn');
const axios = require('axios');

module.exports = {
    async create(req, res) {
        const {id_auth, id_rep} = req.body;
        var action = JSON.stringify(req.body.action);
        const {auth} = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            console.log(dateReturn() + `New action created!`);
            await connection('actions').insert({
                id_auth, 
                id_rep,
                action
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
        var queryIdAuth = req.query.id_auth;
        var id_rep = req.query.id_rep;
        var actions = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            if(queryIdAuth != null && id_rep != null){
                actions = await connection('actions').select(['id_rep','action','files']).where("id_auth", queryIdAuth).andWhere("id_rep", id_rep).first();

                if(actions == null){
                    console.log(dateReturn() + `Action [${queryIdAuth}, ${id_rep}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }

                actions.files = JSON.parse(actions.files);
                actions.action = JSON.parse(actions.action);
                console.log(dateReturn() + `Action [${queryIdAuth}, ${id_rep}] listed!`);
            }else{
                actions = await connection('actions').select(['id_rep','action','files']);
                for(var i in actions){
                    actions[i].files = JSON.parse(actions[i].files);
                    actions[i].action = JSON.parse(actions[i].action);
                }
            }
            console.log(dateReturn() + `Actions listed!`);
            return res.status(202).json(actions);
        }else{
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    },
    async isValidId(req, res) {
        var queryIdAuth = req.query.id_auth;
        var id_rep = req.query.id_rep;
        var actions = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            if(queryIdAuth != null && id_rep != null){
                actions = await connection('actions').select(['id_rep','action','files']).where("id_auth", queryIdAuth).andWhere("id_rep", id_rep).first();

                if(actions == null){
                    console.log(dateReturn() + `Action [${queryIdAuth}, ${id_rep}] is not valid!`);
                    return res.status(200).json({
                        isValid: false,
                    });
                }

                console.log(dateReturn() + `Action [${queryIdAuth}, ${id_rep}] is valid!`);
            }else{
                return res.status(200).json({
                    isValid: false,
                });
            }
            return res.status(202).json({
                isValid: true,
            });
        }else{
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    },
    async delete(req, res) {
        var queryIdAuth = req.query.id_auth;
        var id_rep = req.query.id_rep;
        var actions = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            if(queryIdAuth != null && id_rep != null){
                actions = await connection('actions').select(['id_rep','action','files']).where("id_auth", queryIdAuth).andWhere("id_rep", id_rep).first();
                if( actions == null){
                    console.log(dateReturn() + `Action [${queryIdAuth}, ${id_rep}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                await connection('actions').select(['id_rep','action','files']).where("id_auth", queryIdAuth).andWhere("id_rep", id_rep).first().delete();
                console.log(dateReturn() + `Action [${queryIdAuth}, ${id_rep}] deleted!`);
                actions.files = JSON.parse(actions.files);
                actions.action = JSON.parse(actions.action);
                return res.status(200).json(actions);
            }else{
                console.log(dateReturn() + `Action [${queryIdAuth}, ${id_rep}] is not defined!`);
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
        const {id_auth, id_rep} = req.body;
        var action = JSON.stringify(req.body.action);
        var files = JSON.stringify(req.body.files);
        const {auth} = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            if(id_auth != null && id_rep != null){
                actions = await connection('actions').select(['id_rep','action','files']).where("id_auth", id_auth).andWhere("id_rep", id_rep).first();
                if(actions == null){
                    console.log(dateReturn() + `Action [${id_auth}, ${id_rep}] is not defined!`);
                    return res.status(200).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }

                if(files != null){
                    action = await connection('actions').select(['id_rep','action','files']).where("id_auth", id_auth).andWhere("id_rep", id_rep).update({
                        id_auth, 
                        action,
                        files
                    });
                }else{
                    action = await connection('actions').select(['id_rep','action','files']).where("id_auth", id_auth).andWhere("id_rep", id_rep).update({
                        id_auth, 
                        action,
                    });
                }

                actions.files = JSON.parse(actions.files);
                actions.action = JSON.parse(actions.action);
                console.log(dateReturn() + `Action [${id_auth}, ${id_rep}] updated!`);
            
                return res.status(201).json(action);
            }else{
                console.log(dateReturn() + `Action [${id_auth}, ${id_rep}] is not defined!`);
                return res.status(200).json({
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
    async raw(req, res) {
        const raw_url = req.query.raw_url;
        const TOKEN = req.query.token;
        if(raw_url != null){
            var raw;
            await axios.get(raw_url, {
                headers: {
                    'Authorization': 'token ' + TOKEN
                },
            }).then(function(response){
                raw = response.data;
            }).catch(function(){});
            
            return res.status(200).json(raw);
        }else{
            console.log(dateReturn() + `Raw url is not defined!`);
            return res.status(404).json({
                "message": "Operação inválida",
                "origin": "Database",
            });
        }
    }
}