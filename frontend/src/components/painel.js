import React from 'react';

import Icons from './icons';
import { useHistory } from 'react-router-dom';

function Painel(props){
    const history = useHistory();

    function handleBack(){
        history.goBack();
    }

    return(
        <div className="painel-div"> 
            <button className="shadow-theme" onClick={handleBack}>
                <Icons name="back" size={25} color="white"/>
                <h1>Voltar</h1>
            </button>
        </div>
    );
}

export default Painel;