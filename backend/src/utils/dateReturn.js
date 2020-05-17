module.exports = function dateReturn(){
    var dateConsole = new Date();
    var dateReturn = `${dateConsole.getDay()}/${dateConsole.getMonth()}/${dateConsole.getFullYear()} [${dateConsole.getHours()}:${dateConsole.getMinutes()}] - `;
    return dateReturn;
}