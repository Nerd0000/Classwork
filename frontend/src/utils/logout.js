import checkIfIsAuthenticated from './checkIfIsAuthenticated' 

import repos from '../json/gitInfo/repos';

export default function logoutGit(session, history, location) {
    repos.items = null;
    
    sessionStorage.removeItem('user');
    checkIfIsAuthenticated(session, history, location);
}