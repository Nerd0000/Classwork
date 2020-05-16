import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import GitRegister from './pages/Login/Git/Register';

import Profile from './pages/Profile';
import Repos from './pages/Profile/Git/Repos';

import HelpRegister from './pages/HelpRegister';
import ErrorStatus from './pages/ErrorStatus';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login}/>

                <Route path="/help/register" component={HelpRegister}/>
                <Route path="/error" component={ErrorStatus}/>

                <Route path="/git/register" component={GitRegister}/>

                <Route path="/profile" exact component={Profile}/>
                <Route path="/profile/git/repos" component={Repos}/>  
            </Switch>
        </BrowserRouter>
    );
}
