const crypto = require('crypto');
module.exports = function generateUniqueKey(id_auth, key){
    return key.toString().substr(2,4) + crypto.randomBytes(2).toString('HEX') + id_auth.toString().substr(0,2);
}