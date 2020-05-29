const connection = require('../database/connection');
const internalSecurity = require('../utils/internalSecurity');
const dateReturn = require('../utils/dateReturn');
const generateKey = require('../utils/generateKey');

module.exports = {
    async create(req, res) {
        const { name, description, teacher_id } = req.body;
        const key = generateKey(teacher_id);
        const invite = generateKey(teacher_id);

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

    },
    async update(req, res) {

    },
    async addMember(req, res) {

    },
    async removeMember(req, res) {

    },
    async createTeams(req, res) {

    },
    async destroyTeams(req, res) {

    },
    async addWarning(req, res) {

    },
    async removeWarning(req, res) {

    },
}