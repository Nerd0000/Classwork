const connection = require('../database/connection');
const internalSecurity = require('../utils/internalSecurity');
const dateReturn = require('../utils/dateReturn');
const generateKey = require('../utils/generateKey');
const generateInvite = require('../utils/generateInvite');
const axios = require('axios');

module.exports = {
    async create(req, res) {
        const { name, description, teacher_id } = req.body;
        const key = generateKey(teacher_id);
        const invite = generateInvite(teacher_id, key);

        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            console.log(dateReturn() + `New class created!`);
            await connection('classes').insert({
                key,
                name,
                description,
                invite,
                teacher_id
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
        var queryKey = req.query.key;

        var classes = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            if(queryKey != null){
                classes = await connection('classes').select(['name','description', 'key', 'invite']).where("key", queryKey).first();

                if(classes == null){
                    console.log(dateReturn() + `Class [${queryKey}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                console.log(dateReturn() + `Class [${queryKey}] listed!`);
            }else{
                classes = await connection('classes').select(['name','description', 'key', 'invite']);
            }
            console.log(dateReturn() + `Classes listed!`);
            return res.status(202).json(classes);
        }else{
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    },
    async delete(req, res) {
        const queryKey = req.query.key;
        const queryTeacherId = req.query.teacher_id;

        var classes = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            if(queryKey != null){
                classes = await connection('classes').select(['name','description', 'key', 'invite']).where("key", queryKey).andWhere("teacher_id", queryTeacherId).first();
                if(classes == null){
                    console.log(dateReturn() + `Class [${queryKey},${queryTeacherId}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                await connection('classes').select(['name','description', 'key', 'invite']).where("key", queryKey).andWhere("teacher_id", queryTeacherId).first().delete();
                console.log(dateReturn() + `Class [${queryKey},${queryTeacherId}] deleted!`);
                return res.status(200).json(classes);
            }else{
                console.log(dateReturn() + `Class [${queryKey}] is not defined!`);
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
        const { name, description } = req.body;

        const queryKey = req.query.key;

        var classes = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            if(queryKey != null){
                classes = await connection('classes').select(['name','description', 'key', 'invite']).where("key", queryKey).first();
                if(classes == null){
                    console.log(dateReturn() + `Class [${queryKey}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                await connection('classes').select(['name','description', 'key', 'invite']).where("key", queryKey).update({
                    name,
                    description
                });

                console.log(dateReturn() + `Class [${queryKey}] updated!`);
                return res.status(200).json(classes);
            }else{
                console.log(dateReturn() + `Class [${queryKey}] is not defined!`);
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
    async addMembers(req, res) {
        var { git_id, id_auth, invite } = req.body;
        var classes = JSON.parse(req.body.classes);
        
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            if(invite != null){
                var _classes = await connection('classes').select(['name','description', 'key', 'invite', 'members', 'teacher_id']).where("invite", invite).first();
                if(_classes == null){
                    console.log(dateReturn() + `Class [${_classes}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }

                if(_classes.teacher_id == id_auth){
                    console.log(dateReturn() + `Member [${git_id}] is the teacher in Class [${_classes.key}]!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }

                if(_classes.members === null){
                    _classes.members = JSON.stringify([git_id]);
                    classes.push(_classes.key);
                }else{
                    _classes.members = JSON.parse(_classes.members);
                    for(var m in _classes.members){
                        if(_classes.members[m] === git_id){
                            console.log(dateReturn() + `Member [${git_id}] is already registered in Class [${_classes.key}]!`);
                            return res.status(404).json({
                                "message": "Operação inválida",
                                "origin": "Database",
                            });
                        }
                    }
                    _classes.members.push(git_id);
                    _classes.members = JSON.stringify(_classes.members);
                    classes.push(_classes.key);
                }

                var users = await axios.post(process.env.REACT_APP_URL_BACK + '/user/classes/add', {
                    git_id: git_id,
                    classes: classes,
                }, {
                    headers: {
                        "auth": process.env.REACT_APP_DB_IDENTITY
                    }
                });

                var members = _classes.members;

                await connection('classes').select(['name','description', 'key', 'invite']).where("key", _classes.key).update({
                    members
                });

                console.log(dateReturn() + `Class [${_classes.key}] have a new Member [${git_id}]!`);
                return res.status(200).json(users.data);
            }else{
                console.log(dateReturn() + `Class [Undefined] is not defined!`);
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
    async getMembers(req, res) {
        var queryKey = req.query.key;

        var classes = null;
        const { auth } = req.headers;

        if(internalSecurity.checkIsAuthorized(auth)){
            if(queryKey != null){
                classes = await connection('classes').select(['members']).where("key", queryKey).first();

                if(classes == null){
                    console.log(dateReturn() + `Class [${queryKey}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                classes.members = JSON.parse(classes.members);
                console.log(dateReturn() + `Class members [${queryKey}] listed!`);
            }else{
                console.log(dateReturn() + `Class [${queryKey}] is not defined!`);
                return res.status(404).json({
                    "message": "Operação inválida",
                    "origin": "Database",
                });
            }
            var _members = {
                data: []
            };
            for(var m in classes.members){
                await axios.get(process.env.REACT_APP_URL_BACK + `/users?git_id=${classes.members[m]}`, {
                    headers: {
                        "auth": process.env.REACT_APP_DB_IDENTITY
                    }
                }).then(function(res) {
                    _members.data[m] = {
                        id: res.data.id,
                        git_id: res.data.git_id,
                        real_name: res.data.real_name,
                        name: res.data.name,
                        avatar: res.data.avatar,
                        urls: res.data.urls
                    }
                }).catch(function(){

                });
            }

            return res.status(202).json(_members.data);
        }else{
            console.log(dateReturn() + `Unauthorized request has been blocked!`);
            return res.status(203).json({
                    "message": "Request não autorizado!",
                    "origin": "Internal security",
            });
        }
    },
    async removeMember(req, res) {

    },
    async createTeams(req, res) {

    },
    async getTeams(req, res) {

    },
    async destroyTeams(req, res) {

    },
    async addWarning(req, res) {

    },
    async getWarnings(req, res) {

    },
    async removeWarning(req, res) {

    },
}