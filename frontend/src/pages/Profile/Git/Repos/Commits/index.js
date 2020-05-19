import React from 'react';
import { useHistory, useLocation } from "react-router-dom";

import HeaderAuth from '../../../../../components/headerAuth';

import checkIfIsAuthenticated from '../../../../../utils/checkIfIsAuthenticated';

export default function Commits(){
    const history = useHistory();
    const location = useLocation();

    checkIfIsAuthenticated(sessionStorage, history, location);

    var action = sessionStorage.getItem('action');
    var actionSplit = action.split('-');
    var title = '';

    for(var i in actionSplit){
        if(i >= actionSplit.length - 1){
            title += actionSplit[i];
        }else{
            title += actionSplit[i] + ' ';
        }
    }

    return(
        <div>
            <HeaderAuth title={title}/>
            <div className="div-global-page with-scroll header-is-auth">
                <div className="container-box-list">
                    <ul></ul>
                </div>
            </div>
        </div>
    );
}