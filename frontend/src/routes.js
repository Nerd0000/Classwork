import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/Login';

import Profile from './pages/Profile';
import Register from './pages/Profile/Register';
import Repos from './pages/Profile/Git/Repos';

import Help from './pages/Help';
import ErrorStatus from './pages/ErrorStatus';
import SucessStatus from './pages/SucessStatus';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login}/>

                <Route path="/help" component={Help}/>

                <Route path="/error" component={ErrorStatus}/>
                <Route path="/sucess" component={SucessStatus}/>

                <Route path="/profile" exact component={Profile}/>
                <Route path="/profile/register" component={Register}/>
                <Route path="/profile/git/repos" component={Repos}/>  
            </Switch>
        </BrowserRouter>
    );
}
