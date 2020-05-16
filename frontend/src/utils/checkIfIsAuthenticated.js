export default async function checkIfIsAuthenticated(session, history, location){
    var user = sessionStorage.getItem('user');
    if(user != null){
        if(location.pathname === "/"){
            history.push('/profile');
        }
    }else{
        if(location.pathname !== "/"){
            session.clear();
            history.push('/');
        }
    }
} 