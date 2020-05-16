module.exports = {
    checkIsAuthorized(auth) {
        if(auth == process.env.REACT_APP_DB_IDENTITY){
            return true;
        }else{
            return false;
        }
    }
}