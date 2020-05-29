const connection = require('../database/connection');
const internalSecurity = require('../utils/internalSecurity');
const dateReturn = require('../utils/dateReturn');
const generateKey = require('../utils/generateKey');
const generateInvite = require('../utils/generateInvite');

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
                classes = await connection('classes').select(['name','description', 'key', 'invite','warnings']).where("key", queryKey).first();

                if(classes == null){
                    console.log(dateReturn() + `Class [${queryKey}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                classes.warnings = JSON.parse(classes.warnings);
                console.log(dateReturn() + `Class [${queryKey}] listed!`);
            }else{
                classes = await connection('classes').select(['name','description', 'key', 'invite','warnings']);
                for(var i in classes){
                    classes[i].warnings = JSON.parse(classes[i].warnings);
                }
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
                classes = await connection('classes').select(['name','description', 'key', 'invite','warnings']).where("key", queryKey).andWhere("teacher_id", queryTeacherId).first();
                if(classes == null){
                    console.log(dateReturn() + `Class [${queryKey},${queryTeacherId}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                await connection('classes').select(['name','description', 'key', 'invite','warnings']).where("key", queryKey).andWhere("teacher_id", queryTeacherId).first().delete();
                console.log(dateReturn() + `Class [${queryKey},${queryTeacherId}] deleted!`);
                classes.warnings = JSON.parse(classes.warnings);
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
                classes = await connection('classes').select(['name','description', 'key', 'invite','warnings']).where("key", queryKey).first();
                if(classes == null){
                    console.log(dateReturn() + `Class [${queryKey}] is not defined!`);
                    return res.status(404).json({
                        "message": "Operação inválida",
                        "origin": "Database",
                    });
                }
                await connection('classes').select(['name','description', 'key', 'invite','warnings']).where("key", queryKey).update({
                    name,
                    description
                });

                classes.warnings = JSON.parse(classes.warnings);
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
    async addMember(req, res) {

    },
    async getMembers(req, res) {

    },
    async removeMembers(req, res) {

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