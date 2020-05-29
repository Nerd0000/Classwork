const crypto = require('crypto');
module.exports = function generateUniqueKey(id_auth){
    return crypto.randomBytes(8).toString('HEX') + id_auth.toString().substr(0,3);
}